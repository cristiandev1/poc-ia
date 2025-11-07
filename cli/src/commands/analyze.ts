import simpleGit, { SimpleGit, LogResult } from 'simple-git';
import { getDatabase, Commit } from '../database/db';
import { parseCommitMessage } from '../parsers/commit-parser';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';

interface AnalyzeOptions {
  since?: string; // Date range: '7 days ago', '2024-01-01'
  author?: string; // Filter by author email
  branch?: string; // Specific branch
}

export async function analyzeCommand(options: AnalyzeOptions = {}) {
  const spinner = ora('Analisando commits do repositório...').start();
  const git: SimpleGit = simpleGit();
  const db = getDatabase();

  try {
    // Check if it's a git repo
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      spinner.fail('Diretório atual não é um repositório git!');
      return;
    }

    // Get commits
    const logOptions: any = {
      '--all': null,
    };

    if (options.since) {
      logOptions['--since'] = options.since;
    }
    if (options.author) {
      logOptions['--author'] = options.author;
    }

    const log: LogResult = await git.log(logOptions);
    spinner.text = `Encontrados ${log.all.length} commits. Processando...`;

    let validCount = 0;
    let invalidCount = 0;
    const commits: Commit[] = [];

    // Process each commit
    for (let i = 0; i < log.all.length; i++) {
      const commit = log.all[i];
      const parsed = parseCommitMessage(commit.message);

      if (parsed.isValid) {
        validCount++;

        // Calculate time spent (difference from previous commit by same author)
        let timeSpent: number | undefined;
        const prevCommit = log.all
          .slice(i + 1)
          .find((c) => c.author_email === commit.author_email);

        if (prevCommit) {
          const currentTime = new Date(commit.date).getTime();
          const prevTime = new Date(prevCommit.date).getTime();
          const diffMs = currentTime - prevTime;
          const diffMinutes = Math.floor(diffMs / 1000 / 60);

          // Cap time at 8 hours (480 min) to avoid overnight gaps
          timeSpent = diffMinutes > 480 ? undefined : diffMinutes;

          // If gap is > 2 hours, prompt user
          if (diffMinutes > 120 && diffMinutes <= 480) {
            spinner.stop();
            const { hasActivity } = await inquirer.prompt([
              {
                type: 'confirm',
                name: 'hasActivity',
                message: `Gap de ${Math.floor(diffMinutes / 60)}h detectado entre commits de ${commit.author_name}. Registrar atividade manual?`,
                default: false,
              },
            ]);

            if (hasActivity) {
              await promptManualActivity(
                commit.author_email!,
                new Date(prevCommit.date),
                new Date(commit.date),
                parsed.aiTool || 'no-ai'
              );
            }
            spinner.start();
          }
        }

        commits.push({
          hash: commit.hash,
          author_email: commit.author_email!,
          message: commit.message,
          timestamp: commit.date,
          commit_type: parsed.commitType,
          jira_id: parsed.jiraId,
          ai_tool: parsed.aiTool || 'no-ai',
          time_spent_minutes: timeSpent,
        });
      } else {
        invalidCount++;
      }
    }

    // Save to database
    const insert = db.prepare(`
      INSERT OR REPLACE INTO commits
      (hash, author_email, message, timestamp, commit_type, jira_id, ai_tool, time_spent_minutes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((commits: Commit[]) => {
      for (const commit of commits) {
        insert.run(
          commit.hash,
          commit.author_email,
          commit.message,
          commit.timestamp,
          commit.commit_type,
          commit.jira_id,
          commit.ai_tool,
          commit.time_spent_minutes
        );
      }
    });

    insertMany(commits);

    spinner.succeed(
      chalk.green(
        `✓ Análise completa! ${validCount} commits válidos, ${invalidCount} inválidos`
      )
    );

    if (invalidCount > 0) {
      console.log(
        chalk.yellow(
          `\n⚠️  ${invalidCount} commits não seguem o padrão [tipo/ID][ai-tool] - descrição`
        )
      );
      console.log(
        chalk.dim('   Exemplo: [feat/BANK-123][copilot] - implementa validação')
      );
    }

    // Summary by AI tool
    const summary = db
      .prepare(
        `
      SELECT
        ai_tool,
        COUNT(*) as count,
        AVG(time_spent_minutes) as avg_time
      FROM commits
      WHERE ai_tool IS NOT NULL
      GROUP BY ai_tool
    `
      )
      .all() as any[];

    console.log(chalk.bold('\n📊 Resumo por ferramenta de IA:'));
    summary.forEach((row) => {
      const avgTime = row.avg_time ? `${Math.round(row.avg_time)}min média` : 'N/A';
      console.log(
        `   ${row.ai_tool.padEnd(10)} → ${row.count} commits (${avgTime})`
      );
    });
  } catch (error) {
    spinner.fail('Erro ao analisar commits');
    console.error(chalk.red(error));
  }
}

async function promptManualActivity(
  authorEmail: string,
  startTime: Date,
  endTime: Date,
  aiTool: 'copilot' | 'devin' | 'no-ai'
) {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'description',
      message: 'O que você estava fazendo nesse período?',
      validate: (input) => input.trim().length > 0 || 'Descrição obrigatória',
    },
    {
      type: 'input',
      name: 'links',
      message: 'Links de pesquisa (separados por vírgula, opcional):',
    },
  ]);

  const db = getDatabase();
  const durationMinutes = Math.floor(
    (endTime.getTime() - startTime.getTime()) / 1000 / 60
  );

  db.prepare(`
    INSERT INTO activities
    (author_email, description, research_links, timestamp, ai_tool, duration_minutes, activity_type)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    authorEmail,
    answers.description,
    answers.links ? JSON.stringify(answers.links.split(',').map((l: string) => l.trim())) : null,
    startTime.toISOString(),
    aiTool,
    durationMinutes,
    'research'
  );

  console.log(chalk.green('✓ Atividade registrada!'));
}
