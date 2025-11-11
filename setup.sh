#!/bin/bash

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   AI Impact Metrics - Setup Script   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado. Por favor, instale Node.js primeiro.${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Node.js $(node --version) detectado"
echo ""

# Install dependencies
echo -e "${BLUE}📦 Instalando dependências...${NC}"
npm install

echo ""
echo -e "${GREEN}✓${NC} Dependências instaladas"
echo ""

# Build CLI
echo -e "${BLUE}🔨 Building CLI...${NC}"
cd cli
npm run build

echo ""
echo -e "${GREEN}✓${NC} CLI compilada com sucesso"
echo ""

# Link CLI globally
echo -e "${BLUE}🔗 Linkando CLI globalmente...${NC}"
npm link

cd ..

echo ""
echo -e "${GREEN}✓${NC} CLI linkada globalmente"
echo ""

# Test CLI
echo -e "${BLUE}🧪 Testando instalação...${NC}"
AI_METRICS_VERSION=$(ai-metrics --version 2>&1)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} CLI instalada com sucesso!"
    echo -e "   Versão: ${YELLOW}${AI_METRICS_VERSION}${NC}"
else
    echo -e "${RED}❌ Erro ao testar CLI${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          Setup Completo! 🎉           ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "Comandos disponíveis:"
echo -e "  ${YELLOW}ai-metrics analyze${NC}   - Analisa commits do git"
echo -e "  ${YELLOW}ai-metrics track${NC}     - Registra atividades manuais"
echo -e "  ${YELLOW}ai-metrics sync-jira${NC} - Sincroniza dados do Jira"
echo -e "  ${YELLOW}ai-metrics init${NC}      - Mostra instruções de setup"
echo ""
echo -e "Dashboard:"
echo -e "  ${YELLOW}npm run dashboard${NC}    - Inicia o dashboard na porta 3001"
echo ""
echo -e "${BLUE}💡 Dica:${NC} Configure o arquivo ${YELLOW}.env${NC} com suas credenciais do Jira"
echo ""
