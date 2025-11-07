# AI Impact Metrics Dashboard

POC para medir e visualizar o impacto da IA (Copilot/Devin) na produtividade do time de desenvolvimento.

## Funcionalidades

- Análise automatizada de commits git com padrão específico
- Tracking manual de atividades não-código (pesquisa, debug, reuniões)
- Integração com Jira API para comparação de estimativas vs tempo real
- Dashboard web local com visualizações comparativas
- Métricas por desenvolvedor e por ferramenta de IA
- Segurança: dados armazenados localmente em SQLite

## Estrutura do Projeto

```
ai-impact-metrics/
├── cli/                    # CLI para coleta de dados
│   ├── src/
│   │   ├── commands/       # analyze, track, sync-jira
│   │   ├── parsers/        # Parser de commits
│   │   └── database/       # SQLite setup
│   └── package.json
├── dashboard/              # Dashboard Next.js
│   ├── src/
│   │   ├── app/           # Páginas Next.js
│   │   ├── components/    # Gráficos e visualizações
│   │   └── lib/           # Database queries
│   └── package.json
└── .ai-metrics.db         # Database local (criado automaticamente)
```

## Instalação

1. **Clone o repositório e instale dependências:**

```bash
npm install
```

2. **Configure as variáveis de ambiente (opcional para Jira):**

```bash
cp .env.example .env
# Edite .env com suas credenciais do Jira
```

## Uso

### 1. Padrão de Commits

Configure seu time para usar o seguinte padrão nos commits:

```
[tipo/ID-JIRA][copilot|devin|no-ai] - descrição

Exemplos:
[feat/BANK-123][copilot] - implementa validação de transferência
[fix/BANK-456][devin] - corrige bug no cálculo de juros
[refactor/BANK-789][no-ai] - refatora módulo de autenticação
```

### 2. Atualizar Métricas (Recomendado)

**Comando único que roda tudo:**

```bash
# Atualiza análise de commits + sincroniza Jira
npm run update-metrics

# Ou usando o script com filtros
./update-metrics.sh --since "7 days ago"
./update-metrics.sh --author "dev@example.com"
```

Este comando executa automaticamente:
1. Análise de commits (`npm run analyze`)
2. Sincronização com Jira (`npm run sync-jira`)

### 3. Comandos Individuais

Se preferir rodar separadamente:

#### Análise de Commits

Analisa o histórico de commits do repositório:

```bash
npm run analyze

# Com filtros
npm run analyze -- --since "7 days ago"
npm run analyze -- --author "dev@example.com"
```

O comando irá:
- Processar todos os commits que seguem o padrão
- Calcular tempo entre commits
- Detectar gaps >2h e solicitar registro de atividade manual
- Salvar tudo no banco SQLite local

#### Tracking Manual

Registra atividades que não geram commits (debug, pesquisa, reuniões):

```bash
npm run track
```

Você será guiado por prompts interativos para registrar:
- Email
- Ferramenta de IA usada
- Tipo de atividade
- Descrição
- Duração
- Links relevantes (opcional)

#### Sincronização com Jira

Busca dados das tasks no Jira (estimativas, tempo logado, status):

```bash
npm run sync-jira
```

Requer configuração do `.env` com:
- JIRA_URL
- JIRA_EMAIL
- JIRA_API_TOKEN

### 4. Dashboard

Visualize as métricas em um dashboard interativo:

```bash
npm run dashboard
```

Acesse: `http://localhost:3000`

#### Recursos do Dashboard:
- **Filtro por Desenvolvedor**: Dropdown no topo para filtrar todos os dados
- **Overview**: Cards com totais (commits, atividades, devs, tempo médio)
- **Comparativo**: Gráfico de pizza comparando ferramentas de IA
- **Timeline**: Evolução dos commits ao longo do tempo
- **Tasks do Jira**: Cards clicáveis com links diretos e análise de variação
- **Commits Recentes**: Lista com links para Jira (clique para copiar hash)
- **Métricas Detalhadas**: Gráficos de barras com commits, atividades e tempo médio
- **Estatísticas por Dev**: Tabela interativa (clique para filtrar)

## Fluxo Recomendado

### Setup Inicial
```bash
npm install
cp .env.example .env
# Configure .env com credenciais Jira
```

### Durante o Desenvolvimento
```bash
# Devs fazem commits com o padrão
git commit -m "[feat/SCRUM-1][copilot] - implementa feature"

# Se passar 2h+ sem commit (debug, pesquisa)
npm run track
```

### Fim do Dia/Semana
```bash
# Opção 1: Comando único (RECOMENDADO)
npm run update-metrics

# Opção 2: Com filtros específicos
./update-metrics.sh --since "7 days ago"

# Visualizar dashboard
npm run dashboard  # http://localhost:3000
```

### Apresentação para Stakeholders
1. Acesse o dashboard (http://localhost:3000)
2. Use o filtro por desenvolvedor para análises específicas
3. Clique em "Exportar Relatório JSON" se necessário
4. Tire screenshots ou compartilhe a tela

## Grupos de Teste

Configure 3 grupos de desenvolvedores:

1. **Copilot**: Desenvolvedores usando GitHub Copilot
2. **Devin**: Desenvolvedores usando Devin
3. **No-AI**: Desenvolvedores sem uso de IA (baseline)

Cada desenvolvedor deve marcar seus commits com a ferramenta correspondente.

## Métricas Coletadas

### Por Ferramenta de IA
- Total de commits
- Tempo médio por commit
- Total de atividades registradas
- Tempo total investido

### Por Desenvolvedor
- Commits totais
- Atividades totais
- Tempo médio por commit
- Horas totais trabalhadas

### Comparação com Jira
- Estimativa vs tempo real
- Variância por task
- Status das tasks

## Segurança e Compliance

- Todos os dados ficam armazenados **localmente** em SQLite
- Não há envio de dados para servidores externos
- Acesso ao Jira via API oficial com tokens individuais
- Adequado para ambientes bancários com restrições de segurança

## Troubleshooting

### Erro: "Not a git repository"
- Execute os comandos na raiz de um repositório git
- Ou especifique o caminho: `cd /path/to/repo && npm run analyze`

### Erro: "Jira configuration not found"
- Certifique-se de ter criado o arquivo `.env`
- Verifique se as credenciais estão corretas
- Teste no navegador: `https://your-domain.atlassian.net`

### Database locked
- Feche o dashboard antes de executar comandos CLI
- Ou use `rm .ai-metrics.db` para resetar (perde dados)

## Próximos Passos (Pós-POC)

- [ ] Export de relatórios em PDF/PNG
- [ ] Autenticação no dashboard
- [ ] Filtros avançados no dashboard
- [ ] Comparação com sprints históricos
- [ ] Integração com Slack para notificações
- [ ] CI/CD para rodar análise automaticamente

## Licença

MIT
