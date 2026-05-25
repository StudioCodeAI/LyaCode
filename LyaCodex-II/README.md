# LyaCodex II

> **LyaCodex II** é a fundação técnica da próxima geração do LyaCode Studio.

Esta pasta nasce para organizar a evolução do projeto com arquitetura sólida, segurança, IA local/online, skills modulares, memória controlada e execução assistida por aprovação.

---

## Missão

Transformar o LyaCode em um terminal de engenharia com IA que seja:

- **liso**: rápido, estável, sem travar input ou quebrar fluxo de terminal;
- **seguro**: chaves protegidas, ações perigosas com aprovação, logs sem segredos;
- **local-first**: capaz de usar Ollama, LM Studio, vLLM e outros motores locais;
- **multi-modelo**: compatível com OpenRouter, OpenAI, Gemini, Anthropic, Groq e endpoints OpenAI-compatible;
- **orientado por skills**: skills com manifesto, permissões, prompts e ativação por relevância;
- **útil para código real**: abrir projetos, ler arquivos, revisar diffs, rodar testes e propor patches;
- **controlado pelo usuário**: a IA propõe, o LyaCode executa somente com permissão.

---

## Princípio central

> **A IA pensa e propõe. O LyaCode controla, executa, audita e protege.**

---

## Como esta pasta deve ser usada

Esta pasta será o centro de planejamento e implementação gradual do novo motor.

Ela não deve virar um segundo projeto bagunçado. Toda mudança deve seguir:

1. plano claro;
2. arquivo certo;
3. implementação pequena;
4. teste possível;
5. rollback simples;
6. documentação atualizada.

---

## Estrutura inicial

```text
LyaCodex-II/
├── README.md
├── docs/
│   ├── ARCHITECTURE.md
│   ├── AI_RULES.md
│   ├── ROADMAP.md
│   ├── SECURITY.md
│   └── SKILL_SPEC.md
├── engine/
│   ├── README.md
│   ├── keychain/
│   ├── models/
│   ├── workspace/
│   ├── skills/
│   ├── agent/
│   └── memory/
└── examples/
    ├── skills/
    └── prompts/
```

---

## Primeiras metas

### Fase 1 — Constituição

- Definir arquitetura.
- Definir regras para contribuição de IA.
- Definir segurança.
- Definir formato oficial de skill.
- Definir roadmap técnico.

### Fase 2 — Núcleo seguro

- Criar Lya Keychain.
- Trocar `apiKey` por `keyRef`.
- Mover chamadas de LLM para Rust.
- Criar Model Gateway.
- Criar streaming.

### Fase 3 — Workspace e agente

- Abrir pasta de projeto.
- Indexar arquivos.
- Ler arquivos com segurança.
- Mostrar diff.
- Aplicar patch com aprovação.
- Rodar comandos com confirmação.

---

## Identidade

O LyaCodex II não é apenas uma refatoração.

Ele é o motor que deve fazer o LyaCode Studio evoluir de terminal com chat para um **ambiente de engenharia assistido por IA**.

**Se você pensa, você executa. Se você executa, você indexa. Se você indexa, você evolui.**
