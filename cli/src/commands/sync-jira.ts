import axios from 'axios';
import { getDatabase } from '../database/db';
import chalk from 'chalk';
import ora from 'ora';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(process.cwd(), '.env') });

interface JiraIssue {
  key: string;
  fields: {
    summary: string;
    status: { name: string };
    assignee?: { emailAddress: string };
    created: string;
    resolutiondate?: string;
    timeoriginalestimate?: number; // seconds
    timespent?: number; // seconds
    customfield_10016?: number; // Sprint (varies by Jira config)
  };
}

export async function syncJiraCommand() {
  const spinner = ora('Sincronizando com Jira...').start();

  const jiraUrl = process.env.JIRA_URL;
  const jiraEmail = process.env.JIRA_EMAIL;
  const jiraToken = process.env.JIRA_API_TOKEN;

  if (!jiraUrl || !jiraEmail || !jiraToken) {
    spinner.fail('Configuração do Jira não encontrada!');
    console.log(
      chalk.yellow(
        '\nConfigure as variáveis de ambiente no arquivo .env:\n' +
          '  JIRA_URL=https://your-domain.atlassian.net\n' +
          '  JIRA_EMAIL=seu-email@example.com\n' +
          '  JIRA_API_TOKEN=seu-token-aqui\n'
      )
    );
    return;
  }

  try {
    const db = getDatabase();

    // Get unique Jira IDs from commits
    const jiraIds = db
      .prepare('SELECT DISTINCT jira_id FROM commits WHERE jira_id IS NOT NULL')
      .all() as any[];

    if (jiraIds.length === 0) {
      spinner.warn('Nenhuma task do Jira encontrada nos commits');
      return;
    }

    spinner.text = `Buscando ${jiraIds.length} tasks no Jira...`;

    const auth = Buffer.from(`${jiraEmail}:${jiraToken}`).toString('base64');
    const headers = {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    };

    let successCount = 0;
    let errorCount = 0;

    for (const { jira_id } of jiraIds) {
      try {
        const response = await axios.get<JiraIssue>(
          `${jiraUrl}/rest/api/3/issue/${jira_id}`,
          { headers }
        );

        const issue = response.data;

        // Convert seconds to hours
        const estimateHours = issue.fields.timeoriginalestimate
          ? issue.fields.timeoriginalestimate / 3600
          : null;
        const timeLoggedHours = issue.fields.timespent
          ? issue.fields.timespent / 3600
          : null;

        db.prepare(`
          INSERT OR REPLACE INTO jira_tasks
          (key, title, estimate_hours, time_logged_hours, status, assignee_email, created_date, completed_date)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          issue.key,
          issue.fields.summary,
          estimateHours,
          timeLoggedHours,
          issue.fields.status.name,
          issue.fields.assignee?.emailAddress || null,
          issue.fields.created,
          issue.fields.resolutiondate || null
        );

        successCount++;
      } catch (error: any) {
        errorCount++;
        if (error.response?.status === 404) {
          console.log(chalk.yellow(`\n⚠️  Task ${jira_id} não encontrada`));
        } else {
          console.log(chalk.red(`\n✗ Erro ao buscar ${jira_id}: ${error.message}`));
        }
      }
    }

    spinner.succeed(
      chalk.green(
        `✓ Sincronização completa! ${successCount} tasks atualizadas, ${errorCount} erros`
      )
    );

    // Show summary
    const summary = db
      .prepare(
        `
      SELECT
        status,
        COUNT(*) as count,
        AVG(estimate_hours) as avg_estimate,
        AVG(time_logged_hours) as avg_logged
      FROM jira_tasks
      GROUP BY status
    `
      )
      .all() as any[];

    console.log(chalk.bold('\n📊 Resumo das tasks:'));
    summary.forEach((row) => {
      const avgEst = row.avg_estimate ? `${row.avg_estimate.toFixed(1)}h` : 'N/A';
      const avgLog = row.avg_logged ? `${row.avg_logged.toFixed(1)}h` : 'N/A';
      console.log(
        `   ${row.status.padEnd(15)} → ${row.count} tasks (Est: ${avgEst}, Real: ${avgLog})`
      );
    });
  } catch (error) {
    spinner.fail('Erro ao sincronizar com Jira');
    console.error(chalk.red(error));
  }
}
