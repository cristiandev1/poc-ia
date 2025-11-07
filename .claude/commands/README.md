# Comandos Disponíveis

Este projeto utiliza comandos customizados do Claude Code para gerenciar o workflow de desenvolvimento seguindo as melhores práticas do Git.

## 📋 Comandos Disponíveis

### `/feature` - Criar Nova Feature
Inicia o processo de descoberta para criar uma nova funcionalidade.

**Workflow:**
1. Cria branch: `feature/[nome-descritivo]`
2. Documenta requisitos em `.claude/context/current-task.md`
3. Execute `/execute` para plano técnico
4. Implemente as mudanças
5. Commit e push
6. Limpa o `current-task.md`

**Exemplo de branch:** `feature/user-authentication`, `feature/payment-integration`

---

### `/fix` - Corrigir Bug
Inicia o processo de descoberta para corrigir um bug ou problema.

**Workflow:**
1. Cria branch: `fix/[nome-descritivo]`
2. Documenta o problema em `.claude/context/current-task.md`
3. Execute `/execute` para plano técnico
4. Implemente a correção
5. Commit e push
6. Limpa o `current-task.md`

**Exemplo de branch:** `fix/login-validation`, `fix/payment-error`

---

### `/remove` - Remover Código/Funcionalidade
Inicia o processo de descoberta para remover código ou funcionalidade.

**Workflow:**
1. Cria branch: `remove/[nome-descritivo]`
2. Documenta o que será removido em `.claude/context/current-task.md`
3. Execute `/execute` para plano técnico
4. Implemente a remoção
5. Commit e push
6. Limpa o `current-task.md`

**Exemplo de branch:** `remove/old-api`, `remove/deprecated-feature`

---

### `/analyze` - Análise Técnica
Inicia o processo de análise técnica profunda do codebase.

**Workflow:**
1. Cria branch: `analyze/[nome-descritivo]`
2. Documenta a análise em `.claude/context/current-task.md`
3. Execute `/execute` se quiser implementar melhorias
4. Commit e push (se houver mudanças)
5. Limpa o `current-task.md`

**Exemplo de branch:** `analyze/performance`, `analyze/security-audit`

---

### `/execute` - Plano Técnico e Implementação
Analisa o contexto documentado e cria um plano técnico detalhado para implementação.

**Workflow:**
1. Verifica se está em branch correta
2. Lê `.claude/context/current-task.md`
3. Explora o codebase
4. Cria plano técnico detalhado
5. Aguarda aprovação do usuário
6. Implementa após confirmação

---

## 🌿 Padrões de Branch

Todos os comandos seguem a convenção:

```
<tipo>/<nome-descritivo-em-kebab-case>
```

**Tipos:**
- `feature/` - Novas funcionalidades
- `fix/` - Correções de bugs
- `remove/` - Remoção de código/features
- `analyze/` - Análises técnicas

**Exemplos:**
- `feature/responsive-mobile`
- `fix/header-overflow`
- `remove/deprecated-api`
- `analyze/performance-bottlenecks`

---

## 🔄 Fluxo Completo

### 1. Iniciar Tarefa
```bash
# Escolha o comando apropriado
/feature    # para nova funcionalidade
/fix        # para corrigir bug
/remove     # para remover código
/analyze    # para análise técnica
```

### 2. Documentar Contexto
O comando criará automaticamente:
- Branch apropriada
- Arquivo `.claude/context/current-task.md` com template

### 3. Criar Plano Técnico
```bash
/execute
```

### 4. Implementar
Após aprovação do plano, implemente as mudanças.

### 5. Finalizar
```bash
# Commit
git add .
git commit -m "feat: sua mensagem descritiva"

# Push
git push -u origin [nome-da-branch]

# Limpar contexto
echo "" > .claude/context/current-task.md

# Voltar para main (opcional)
git checkout main
```

---

## 📝 Arquivo `current-task.md`

O arquivo `.claude/context/current-task.md` serve como **documentação viva** da tarefa atual:

- ✅ Criado automaticamente pelos comandos
- ✅ Contém requisitos, contexto e plano técnico
- ✅ **DEVE ser limpo após o push**
- ✅ Facilita o handoff entre sessões

**Importante:** Sempre limpe o `current-task.md` após finalizar uma tarefa para evitar confusão em tarefas futuras.

---

## 🎯 Boas Práticas

1. **Uma branch por tarefa**: Não misture diferentes tipos de mudanças
2. **Nomes descritivos**: Use nomes claros em kebab-case
3. **Commits semânticos**: `feat:`, `fix:`, `refactor:`, etc.
4. **Limpar contexto**: Sempre limpe o `current-task.md` após push
5. **Pull Requests**: Crie PRs das branches para main
6. **Code Review**: Peça revisão antes de fazer merge

---

## 🚀 Exemplo Prático

```bash
# 1. Iniciar nova feature
/feature
> "Quero adicionar autenticação com Google"

# 2. Criar plano
/execute
> "Aprovar o plano"

# 3. Implementar...
# (código sendo desenvolvido)

# 4. Finalizar
git add .
git commit -m "feat: add Google OAuth authentication"
git push -u origin feature/google-oauth
echo "" > .claude/context/current-task.md
git checkout main

# 5. Criar PR no GitHub
gh pr create --title "feat: Google OAuth" --body "..."
```

---

## ❓ Troubleshooting

**Esqueci de criar a branch?**
```bash
git checkout -b feature/nome-descritivo
```

**Estou na branch errada?**
```bash
git checkout -b feature/nome-correto
git branch -d nome-errado
```

**current-task.md não foi limpo?**
```bash
echo "" > .claude/context/current-task.md
```

---

## 📚 Recursos

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [Claude Code Docs](https://docs.claude.com/en/docs/claude-code)
