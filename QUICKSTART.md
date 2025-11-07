# Quick Start Guide - AI Impact Metrics

Guia rápido para começar a usar a POC em 5 minutos.

## 1. Instalação (2 min)

```bash
cd ai-impact-metrics
npm install
```

## 2. Configuração Jira (1 min - opcional)

```bash
cp .env.example .env
```

Edite `.env`:
```
JIRA_URL=https://seu-dominio.atlassian.net
JIRA_EMAIL=seu-email@banco.com
JIRA_API_TOKEN=gere-em-id.atlassian.com
```

## 3. Primeiro Uso (2 min)

### Opção A: Testar com repo existente

```bash
# Entre em um repo git com commits
cd /caminho/do/seu/projeto

# Volte para a pasta do ai-impact-metrics
cd /caminho/do/ai-impact-metrics

# Analise commits do último mês
npm run analyze -- --since "30 days ago"

# Visualize
npm run dashboard
# Acesse: http://localhost:3000
```

### Opção B: Começar do zero

```bash
# 1. Registre uma atividade manual
npm run track
# Responda as perguntas interativas

# 2. Veja o dashboard
npm run dashboard
# Acesse: http://localhost:3000
```

## 4. Padrão de Commits

Configure seu time para usar:

```
[tipo/ID][ai-tool] - descrição

Exemplos:
[feat/BANK-123][copilot] - implementa validação
[fix/BANK-456][devin] - corrige bug no login
[refactor/BANK-789][no-ai] - refatora autenticação
```

## 5. Fluxo Semanal

```bash
# Segunda-feira: análise da semana anterior
npm run analyze -- --since "7 days ago"

# Durante a semana: track atividades não-código
npm run track

# Sexta-feira: sincronize Jira e gere dashboard
npm run sync-jira
npm run dashboard
```

## Comandos Úteis

```bash
# Análise filtrada
npm run analyze -- --author "dev@banco.com"
npm run analyze -- --since "2024-01-01"

# Tracking
npm run track

# Sincronização Jira
npm run sync-jira

# Dashboard
npm run dashboard

# Inicialização
npm run init  # Ver instruções de setup
```

## Troubleshooting Rápido

**Erro git repository:** Execute na pasta do repo git
**Erro Jira:** Verifique `.env` com credenciais corretas
**Dashboard vazio:** Execute `npm run analyze` primeiro

## Próximos Passos

1. Configure o padrão de commits no time
2. Defina os 3 grupos: Copilot, Devin, No-AI
3. Execute análise semanal
4. Apresente para stakeholders com dashboard
5. Ajuste e itere conforme feedback

## Suporte

Veja README.md completo para documentação detalhada.
