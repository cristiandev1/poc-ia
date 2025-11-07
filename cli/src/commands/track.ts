import inquirer from 'inquirer';
import { getDatabase } from '../database/db';
import chalk from 'chalk';
import ora from 'ora';

export async function trackCommand() {
  console.log(chalk.bold('📝 Registrar atividade manual\n'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'email',
      message: 'Seu email:',
      validate: (input) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input) || 'Email inválido',
    },
    {
      type: 'list',
      name: 'aiTool',
      message: 'Qual ferramenta de IA você usou?',
      choices: [
        { name: 'Copilot', value: 'copilot' },
        { name: 'Devin', value: 'devin' },
        { name: 'Sem IA', value: 'no-ai' },
      ],
    },
    {
      type: 'list',
      name: 'activityType',
      message: 'Tipo de atividade:',
      choices: [
        { name: 'Pesquisa/Debug', value: 'research' },
        { name: 'Reunião', value: 'meeting' },
        { name: 'Revisão de código', value: 'code-review' },
        { name: 'Documentação', value: 'documentation' },
        { name: 'Planejamento', value: 'planning' },
        { name: 'Outro', value: 'other' },
      ],
    },
    {
      type: 'input',
      name: 'description',
      message: 'Descrição do que você fez:',
      validate: (input) => input.trim().length > 0 || 'Descrição obrigatória',
    },
    {
      type: 'input',
      name: 'duration',
      message: 'Duração em minutos:',
      validate: (input) => {
        const num = parseInt(input);
        return !isNaN(num) && num > 0 || 'Digite um número válido';
      },
      filter: (input) => parseInt(input),
    },
    {
      type: 'input',
      name: 'links',
      message: 'Links relevantes (separados por vírgula, opcional):',
    },
  ]);

  const spinner = ora('Salvando atividade...').start();

  try {
    const db = getDatabase();

    const links = answers.links
      ? JSON.stringify(answers.links.split(',').map((l: string) => l.trim()).filter(Boolean))
      : null;

    db.prepare(`
      INSERT INTO activities
      (author_email, description, research_links, timestamp, ai_tool, duration_minutes, activity_type)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      answers.email,
      answers.description,
      links,
      new Date().toISOString(),
      answers.aiTool,
      answers.duration,
      answers.activityType
    );

    spinner.succeed(chalk.green('✓ Atividade registrada com sucesso!'));

    // Show summary
    const summary = db
      .prepare(
        `
      SELECT
        COUNT(*) as total,
        SUM(duration_minutes) as total_minutes
      FROM activities
      WHERE author_email = ?
        AND DATE(timestamp) = DATE('now')
    `
      )
      .get(answers.email) as any;

    console.log(
      chalk.dim(
        `\n📊 Hoje você registrou ${summary.total} atividade(s) totalizando ${summary.total_minutes} minutos`
      )
    );
  } catch (error) {
    spinner.fail('Erro ao salvar atividade');
    console.error(chalk.red(error));
  }
}
