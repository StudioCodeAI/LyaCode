# LyaCodex II — visão de parceria e execução

> Este documento define como o LyaCode pode evoluir para o **LyaCodex II**: uma base mais limpa, sólida, moderna, local-first, multi-modelo e preparada para engenharia assistida por IA.

---

## 1. Princípio da parceria

O objetivo não é deixar várias IAs alterarem o projeto ao mesmo tempo, cada uma puxando para sua própria arquitetura.

O fluxo correto deve ser:

```text
Planejar → Documentar → Alterar pouco → Testar → Revisar → Evoluir
```

A IA deve atuar como arquiteta, revisora e implementadora controlada. O projeto deve ter uma fonte única de verdade:

- `docs/ARCHITECTURE.md`
- `docs/AI_RULES.md`
- `rota-LyaCode.md`
- `docs/LYACODEX-II.md`

Nenhuma alteração grande deve acontecer sem respeitar esses documentos.

---

## 2. Missão do LyaCodex II

Criar um terminal de engenharia com IA que seja:

- **liso:** sem travamentos, sem atalhos quebrando o terminal, sem estado confuso;
- **seguro:** chaves protegidas, comandos perigosos com aprovação, logs sem vazamento;
- **moderno:** Tauri 2, Rust, React, TypeScript, xterm e providers atuais;
- **local-first:** Ollama, LM Studio, vLLM e motores locais como cidadãos de primeira classe;
- **multi-modelo:** OpenRouter, OpenAI, Gemini, Anthropic, Groq e APIs compatíveis;
- **orientado por skills:** skills com manifesto, permissões, ranking e ativação inteligente;
- **útil para código real:** entende workspace, Git, build, testes, diffs e patches;
- **com identidade própria:** LYA como engenheira, não apenas um chat genérico.

---

## 3. O que eu faria pegando o projeto atual

### Etapa 1 — Congelar a bagunça

Antes de criar qualquer feature nova:

- parar reescritas grandes;
- mapear arquivos atuais;
- separar responsabilidades;
- criar regras para qualquer IA contribuinte;
- transformar promessas em roadmap claro.

### Etapa 2 — Endurecer a base

Corrigir primeiro o que pode quebrar confiança:

- remover chaves reais do frontend/localStorage;
- criar Lya Keychain;
- mover chamadas LLM para Rust;
- padronizar providers;
- implementar timeout, cancelamento e erros amigáveis;
- impedir vazamento de secrets em logs e prompts.

### Etapa 3 — Terminal impecável

O terminal precisa ser sagrado.

- nenhum atalho deve quebrar digitação;
- resize deve ser confiável;
- shell padrão configurável;
- suporte a PowerShell 7, Windows PowerShell, CMD, Git Bash e WSL;
- logs reais de PTY;
- recuperação de erro quando shell fecha.

### Etapa 4 — Workspace real

O LyaCode precisa abrir e entender projetos.

- abrir pasta;
- indexar árvore;
- buscar arquivos;
- ler arquivos com limite seguro;
- consultar Git status/diff;
- rodar build/testes com aprovação;
- mostrar diff antes de aplicar patch.

### Etapa 5 — Agente seguro

A IA não deve executar direto.

Fluxo obrigatório:

```text
Pedido → Plano → Ações propostas → Aprovação → Execução → Verificação → Memória
```

### Etapa 6 — Skills de verdade

Skills não devem ser apenas textos soltos.

Cada skill precisa de:

- `skill.yml`;
- descrição;
- categoria;
- permissões;
- gatilhos;
- prompt;
- exemplos;
- testes opcionais.

Primeiro 30 skills excelentes. Depois 1000+ com indexação e ranking.

### Etapa 7 — Memória local

Criar memória simples e controlada:

- decisões do projeto;
- preferências do usuário;
- resumos de sessão;
- comandos úteis;
- erros recorrentes;
- uso de modelos.

SQLite primeiro. Embeddings depois.

---

## 4. Como ficaria a arquitetura LyaCodex II

```text
LyaCodex II
├── UI Desktop
│   ├── Terminal
│   ├── AI Overlay
│   ├── Command Palette
│   ├── Workspace Explorer
│   ├── Diff Viewer
│   ├── Skill Browser
│   ├── Model Manager
│   ├── Memory Panel
│   └── Settings
│
├── Rust Backend
│   ├── pty_manager
│   ├── keychain
│   ├── llm_gateway
│   ├── model_router
│   ├── workspace_engine
│   ├── skill_engine
│   ├── agent_engine
│   ├── memory_engine
│   ├── command_guard
│   └── logger
│
├── Skills
│   ├── official
│   ├── community
│   └── local
│
└── Docs
    ├── ARCHITECTURE.md
    ├── AI_RULES.md
    ├── SKILL_SPEC.md
    ├── SECURITY.md
    └── ROADMAP.md
```

---

## 5. O que mudaria no projeto atual

### Frontend

- `configStore` não deve guardar `apiKey`, apenas `keyRef`.
- `fetchLLMResponse` deve sair do frontend.
- Settings deve substituir alert temporário.
- CommandPalette deve virar roteador visual de comandos, não concentrar regra de negócio.
- Chat deve suportar streaming.
- Chat deve ter modos: Ask, Plan, Edit, Debug e Agent.

### Backend Rust

Adicionar módulos:

```text
keychain.rs
llm_gateway.rs
providers/
model_router.rs
workspace.rs
skills.rs
agent.rs
security.rs
logger.rs
```

### Skills

Criar especificação oficial:

```text
skills/<categoria>/<skill-id>/skill.yml
skills/<categoria>/<skill-id>/prompt.md
skills/<categoria>/<skill-id>/examples.md
```

### Segurança

- `Safe`: ler e explicar.
- `Ask`: escrever, rodar comando, instalar pacote.
- `Danger`: deletar, PATH, admin, rede remota, secrets.

---

## 6. Ferramentas modernas recomendadas

### Desktop

- Tauri 2
- React + TypeScript
- xterm.js
- Zustand apenas para estado de UI/config não sensível

### Rust

- `keyring` para segredos no sistema operacional
- `reqwest` para chamadas HTTP
- `tokio` para async
- `serde`/`serde_json` para config
- `tracing` para logs
- `portable-pty` para terminal
- `rusqlite` ou `sqlx` para SQLite local

### IA local

- Ollama
- LM Studio
- vLLM
- llama.cpp server
- APIs OpenAI-compatible locais

### IA online

- OpenRouter
- OpenAI
- Anthropic
- Google Gemini
- Groq
- Together
- DeepInfra
- Mistral

---

## 7. O que seria superior a cada dia

O LyaCodex II deve evoluir por qualidade, não por pressa.

Critérios de evolução:

- menos bugs por versão;
- terminal mais estável;
- startup mais rápida;
- menos exposição de segredo;
- mais tarefas resolvidas com aprovação;
- skills mais precisas;
- modelos escolhidos automaticamente com melhor custo/benefício;
- memória mais útil e menos invasiva;
- experiência mais clara para usuário final.

---

## 8. Regra de ouro

> O LyaCodex II não deve ser uma guerra de IAs. Deve ser um projeto governado por arquitetura.

A IA pode sugerir, revisar, implementar e testar. Mas a arquitetura deve permanecer estável, documentada e respeitada.

---

## 9. Primeiro pacote de execução recomendado

A primeira entrega real deveria conter:

1. `docs/ARCHITECTURE.md`
2. `docs/AI_RULES.md`
3. `docs/SECURITY.md`
4. Lya Keychain básico
5. `keyRef` no frontend
6. LLM Gateway no Rust
7. Provider OpenRouter funcionando pelo backend
8. Provider Ollama funcionando pelo backend
9. Settings real para chaves/modelos
10. README atualizado

Depois disso, seguir para workspace, diffs, agent e skills.

---

## 10. Nome e direção

**LyaCode** pode ser o produto atual.

**LyaCodex II** pode ser o codinome da evolução arquitetural.

Quando amadurecer, o usuário final pode continuar vendo apenas:

```text
LyaCode Studio
```

Mas internamente o projeto segue a visão:

```text
LyaCodex II Core
```

---

**Conclusão:**

Se a missão é tornar o projeto liso, sólido e poderoso, a resposta não é adicionar mais features agora. A resposta é criar uma fundação segura, modular e governada. Depois disso, cada nova skill, modelo ou agente entra como peça organizada, não como remendo.
