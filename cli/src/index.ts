#!/usr/bin/env node

import { Command } from 'commander';
import { analyzeCommand } from './commands/analyze';
import { trackCommand } from './commands/track';
import { syncJiraCommand } from './commands/sync-jira';
import chalk from 'chalk';

const program = new Command();

program
  .name('ai-metrics')
  .description('CLI para análise de impacto da IA na produtividade')
  .version('1.0.0');

program
  .command('analyze')
  .description('Analisa commits do repositório git')
  .option('-s, --since <date>', 'Data inicial (ex: "7 days ago", "2024-01-01")')
  .option('-a, --author <email>', 'Filtrar por autor (email)')
  .option('-b, --branch <name>', 'Branch específica')
  .action(analyzeCommand);

program
  .command('track')
  .description('Registra atividade manual (não-código)')
  .action(trackCommand);

program
  .command('sync-jira')
  .description('Sincroniza dados das tasks do Jira')
  .action(syncJiraCommand);

program
  .command('init')
  .description('Inicializa configuração do projeto')
  .action(() => {
    console.log(chalk.bold('\n🚀 Configuração inicial\n'));
    console.log('1. Crie um arquivo .env na raiz do projeto');
    console.log('2. Adicione as seguintes variáveis:\n');
    console.log(chalk.cyan('   JIRA_URL=https://your-domain.atlassian.net'));
    console.log(chalk.cyan('   JIRA_EMAIL=seu-email@example.com'));
    console.log(chalk.cyan('   JIRA_API_TOKEN=seu-token-aqui\n'));
    console.log('3. Configure padrão de commits: [tipo/ID-JIRA][copilot|devin|no-ai] - descrição');
    console.log(chalk.dim('   Exemplo: [feat/BANK-123][copilot] - implementa validação\n'));
  });

program.parse();
