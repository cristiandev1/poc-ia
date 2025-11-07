---
description: Analisa o contexto e cria um plano técnico detalhado para implementação
---

# Execute Mode

Crie um plano técnico detalhado baseado no contexto.

## ⚠️ ECONOMIA DE TOKENS

**CRÍTICO**: Evite exploração desnecessária do codebase!
- Use `Read` com `offset/limit` em arquivos grandes (>200 linhas)
- Só use Task/Explore se REALMENTE necessário
- Faça perguntas ao usuário sobre arquitetura em vez de explorar

## 1. Verificar Branch

```bash
git branch  # Confirme que está em feature/*, fix/*, etc
```

## 2. Processo

**A. Leia contexto**: `.claude/context/current-task.md` (se não existir, informe)

**B. Exploração (OPCIONAL - só se necessário)**:
- Pergunte ao usuário sobre arquivos/padrões relevantes
- Se precisar explorar: seja focado, não varra todo o codebase
- Use Grep/Glob para buscas específicas em vez de Task/Explore

**C. Plano técnico**:
- Arquivos: criar/modificar/remover
- Componentes, funções, hooks
- Fluxo de dados
- Testes (se aplicável)
- Considerações (performance, segurança, a11y)

**D. TodoWrite**: Lista de tarefas em ordem lógica

**E. Apresentação**: Concisa mas completa

**F. AGUARDE CONFIRMAÇÃO**: NÃO implemente antes da aprovação

## 3. Formato de Apresentação

```
## Análise
[Decisões arquiteturais chave]

## Arquivos
**Criar**: arquivo1.ts - descrição
**Modificar**: arquivo2.ts:123 - o que muda
**Remover**: arquivo3.ts - por quê

## Abordagem
[Como será implementado]

## Plano (TodoWrite)
[Lista de tarefas]

---
Quer: 1) Começar 2) Ajustar 3) Alternativas?
```

## 4. Diretrizes

- Conciso mas completo
- Explique "porquê" das decisões
- Considere arquitetura existente
- Pergunte em vez de assumir
- **NUNCA implemente sem aprovação**

## 5. Pós-implementação

```bash
git add . && git commit -m "feat: descrição"
git push -u origin [branch-atual]
echo "" > .claude/context/current-task.md
git checkout main
```
