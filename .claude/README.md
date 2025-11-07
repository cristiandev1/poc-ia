# Claude Code - Comandos Personalizados

Este diretório contém comandos personalizados para um fluxo de desenvolvimento estruturado.

## Fluxo de Trabalho

### 1. Fase de Descoberta (Discovery)

Use um destes comandos para iniciar o processo de descoberta:

- **`/feature`** - Para criar novas funcionalidades
- **`/fix`** - Para corrigir bugs ou problemas
- **`/remove`** - Para remover código/funcionalidades

O Claude vai fazer perguntas sobre o produto até entender completamente o contexto, SEM explorar código ainda. Após entender, ele documenta tudo em `.claude/context/current-task.md`.

### 2. Fase de Planejamento Técnico

- **`/execute`** - Lê o contexto documentado e cria um plano técnico detalhado

O Claude vai:
1. Ler o arquivo de contexto
2. Explorar o codebase
3. Criar um plano técnico com arquivos, componentes e fluxos
4. Criar uma lista de tarefas (TodoWrite)
5. **AGUARDAR sua aprovação antes de implementar**

### 3. Fase de Implementação

Após aprovar o plano com `/execute`, confirme e o Claude começará a implementar seguindo o plano.

## Exemplo de Uso

```
Você: /feature quero adicionar um botão de exportar relatório em PDF

Claude: [faz perguntas sobre o botão, onde fica, o que exporta, etc.]

Você: [responde as perguntas]

Claude: ✓ Contexto documentado em .claude/context/current-task.md.
        Execute /execute quando estiver pronto.

Você: /execute

Claude: [analisa o código, cria plano técnico detalhado]
        O plano está pronto. Você quer:
        1. Começar a implementação
        2. Ajustar alguma parte do plano
        3. Discutir alternativas técnicas

Você: Começar

Claude: [implementa seguindo o plano]
```

## Estrutura de Diretórios

```
.claude/
├── commands/          # Slash commands personalizados
│   ├── feature.md
│   ├── fix.md
│   ├── remove.md
│   └── execute.md
├── context/           # Contexto temporário (não versionado)
│   └── current-task.md
└── README.md          # Este arquivo
```

## Benefícios

- **Clareza**: Entende requisitos antes de codificar
- **Planejamento**: Plano técnico detalhado antes da implementação
- **Controle**: Você aprova o plano antes de começar
- **Documentação**: Contexto registrado para referência
- **Qualidade**: Decisões técnicas pensadas e explicadas
