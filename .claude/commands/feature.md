---
description: Inicia o processo de descoberta para criar uma nova feature
---

# Feature Discovery Mode

Entenda o que precisa ser desenvolvido ANTES de implementar.

## 1. Perguntas Essenciais

**Objetivo**: Propósito? Problema resolvido? Usuário?
**Funcional**: Como funciona? Fluxos? Edge cases?
**UI/UX**: Interface? Experiência?
**Integrações**: APIs? Endpoints? Outras features?

## 2. Diretrizes

- Perguntas diretas e focadas
- Use AskUserQuestion quando útil
- NÃO explore código - foque no produto
- Confirme entendimento antes de documentar

## 3. Criação de Branch
```bash
git checkout -b feature/[nome-descritivo-baseado-no-entendimento]
```

## 4. Documentação

Crie `.claude/context/current-task.md` (compacto):

```markdown
# [Título]
**Tipo:** Feature | **Data:** [hoje]

## Objetivo
[O que resolve e por quê]

## Requisitos
- Funcionalidade 1, 2, 3...
- Edge cases relevantes
- Validações necessárias

## Fluxos
1. Fluxo principal simplificado

## Tech
- Integrações/APIs se houver
- Pontos técnicos importantes
```

✓ Informe: "Contexto documentado. Execute `/execute` para o plano técnico."

## 5. Finalização (após commit)

```bash
git push -u origin feature/[nome]
echo "" > .claude/context/current-task.md
git checkout main
```
