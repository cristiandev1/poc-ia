#!/bin/bash

# Script para atualizar todas as métricas de uma vez
# Uso: ./update-metrics.sh [--since "7 days ago"] [--author "email@example.com"]

set -e

echo "🚀 Atualizando métricas de IA..."
echo ""

# Parse arguments
ANALYZE_ARGS=""
while [[ $# -gt 0 ]]; do
  case $1 in
    --since)
      ANALYZE_ARGS="$ANALYZE_ARGS --since \"$2\""
      shift 2
      ;;
    --author)
      ANALYZE_ARGS="$ANALYZE_ARGS --author \"$2\""
      shift 2
      ;;
    *)
      echo "❌ Argumento desconhecido: $1"
      echo "Uso: ./update-metrics.sh [--since \"7 days ago\"] [--author \"email@example.com\"]"
      exit 1
      ;;
  esac
done

# Step 1: Analyze commits
echo "📊 [1/2] Analisando commits do git..."
if [ -z "$ANALYZE_ARGS" ]; then
  npm run analyze
else
  npm run analyze -- $ANALYZE_ARGS
fi
echo ""

# Step 2: Sync Jira
echo "🔄 [2/2] Sincronizando com Jira..."
npm run sync-jira
echo ""

# Success
echo "✅ Métricas atualizadas com sucesso!"
echo ""
echo "Para visualizar o dashboard, execute:"
echo "  npm run dashboard"
echo ""
echo "Depois acesse: http://localhost:3000"
