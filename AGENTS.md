# LyaCode — Documento de Controle de Agentes

**LEIA ESTE ARQUIVO INTEIRO ANTES DE QUALQUER AÇÃO.**
Este documento é a fonte de verdade do projeto. Ele define o que está pronto, o que fazer, e o que é PROIBIDO alterar.

---

## 1. O QUE É O LYACODE

LyaCode é um agente de terminal para programadores — similar ao Claude Code e ao OpenCode — distribuído como binário nativo via Tauri 2 (Rust + React/TypeScript). O usuário instala e digita `lyacode` no terminal do VS Code ou em qualquer terminal e a IA aparece para ajudar a escrever código.

**Slogan (imutável):** "Se você pensa, você executa. Se você executa, você indexa. Se você indexa, você evolui."
**Identidade visual:** fundo preto `#0d0d0f`, verde terminal `#22c55e`, logo ASCII pixelado, nome "LyaCode" piscando suave (breathing).
**Autoria:** visão arquitetural de Luis Cardozo, código produzido no Antigravity IDE.

---

## 2. STACK TÉCNICA (NÃO ALTERAR)

| Camada | Tecnologia | Motivo |
|--------|-----------|--------|
| Core | Rust + Tauri 2 | Baixo nível, binário único, sem Electron |
| Frontend | React 19 + TypeScript + Vite | Componentes reativos |
| Estado | Zustand + persist | Simples, eficiente |
| Terminal | xterm.js + portable-pty | PTY real via Rust |
| Estilos | CSS puro (index.css, aichat.css, palette.css) | Sem Tailwind, não adicionar |

---

## 3. ESTADO ATUAL — O QUE ESTÁ PRONTO ✅

### Rust (src-tauri/src/)
- `pty_manager.rs` — PTY real com PowerShell. Comando `lyacode`/`lya` registrado no shell dispara `[[LYA_UI_TRIGGER]]`. **NÃO MODIFICAR.**
- `vault_manager.rs` — salva/lê chaves de API em `%APPDATA%\lyacode\vault.json`. **NÃO MODIFICAR.**
- `skills_manager.rs` — clona `sickn33/antigravity-awesome-skills` via git e lê frontmatter YAML de cada `SKILL.md`. **NÃO MODIFICAR a lógica de parsing.**
- `lib.rs` — registra todos os handlers Tauri. Se adicionar comando novo, registrar aqui.
- `main.rs` — CLI com clap (flags: `--debug`, `--cwd`, `--prompt`, `--output-format`, `--quiet`). Modo headless está simulado — ver PRÓXIMOS PASSOS.

### Frontend (src/)
- `App.tsx` — layout principal, slogan rotativo a cada 8s com fade, sidebar, header com breathing effect, atalhos de teclado Ctrl+K/L/O/Esc.
- `components/terminal/Terminal.tsx` — xterm.js conectado ao PTY Rust, detecta `[[LYA_UI_TRIGGER]]`.
- `components/terminal/AIChatOverlay.tsx` — chat com IA, splash screen com ASCII logo, suporte a múltiplos providers.
- `components/terminal/CommandPalette.tsx` — palette com `/agents`, `/skills`, `/connect`, `/models`, `/compact`, `/clear`, `/exit`.
- `store/configStore.ts` — providers: webllm, openrouter, google, anthropic, openai, groq, ollama, lmstudio.
- `core/prompt.ts` — `LYA_CORE_PROMPT` com identidade da Lya (Eya + Lua). **NÃO ALTERAR a identidade.**

### Providers configurados
- WebLLM (embutido, offline)
- OpenRouter (gratuito com `google/gemma-2-9b-it:free`)
- Google Gemini
- Anthropic Claude
- OpenAI
- Groq
- Ollama (local, `http://localhost:11434`)
- LM Studio (local, `http://localhost:1234`)

---

## 4. PROBLEMAS CONHECIDOS A CORRIGIR 🔧

### PRIORIDADE 1 — Permissão IPC no Windows (.exe em produção)
- **Arquivo:** `src-tauri/capabilities/default.json`
- **Problema:** em modo release, o PTY não consegue emitir eventos para o frontend por falta de permissão explícita.
- **Fix:** adicionar `"core:window:default"` e `"core:event:allow-listen"` nas permissions.
- **Testar:** compilar com `npm run tauri build` e verificar se o terminal abre no .exe.

### PRIORIDADE 2 — Skills não injetadas no contexto da IA
- **Arquivo:** `src/components/terminal/AIChatOverlay.tsx` + `src/core/llm/api.ts`
- **Problema:** o usuário ativa skills na palette mas elas não chegam no prompt enviado para a IA.
- **Fix:** quando skills estiverem ativas no `configStore`, concatenar o conteúdo do `SKILL.md` ao system prompt antes de chamar `fetchLLMResponse`.
- **Não criar novo store** — adicionar `activeSkills: string[]` no `configStore.ts` existente.

### PRIORIDADE 3 — Modo headless real
- **Arquivo:** `src-tauri/src/main.rs`
- **Problema:** `--prompt "texto"` retorna string simulada, não chama IA real.
- **Fix:** integrar chamada HTTP ao provider ativo (ler vault, chamar API) diretamente no Rust ou via processo filho Node.
- **Só fazer depois que PRIORIDADE 1 e 2 estiverem resolvidas.**

### PRIORIDADE 4 — Metadata do Cargo.toml
- **Arquivo:** `src-tauri/Cargo.toml`
- **Campos a corrigir:**
  - `description = "LyaCode — Agente de terminal com IA para programadores"`
  - `authors = ["Luis Cardozo"]`
  - `homepage = "https://github.com/luiscard/lyacode"` (quando existir)

---

## 5. O QUE É PROIBIDO ALTERAR ❌

- A identidade e o slogan da Lya em `src/core/prompt.ts`
- O sistema de cores e o design visual — fundo `#0d0d0f`, verde `#22c55e`
- A lógica do `[[LYA_UI_TRIGGER]]` no `pty_manager.rs`
- A estrutura de providers no `configStore.ts` — só adicionar, nunca remover
- O `skills_manager.rs` — a lógica de git clone e parsing está correta
- Os arquivos CSS existentes sem motivo — só modificar se houver bug visual específico
- A lista de agentes built-in em `CommandPalette.tsx` — só adicionar novos

---

## 6. COMO ADICIONAR FUNCIONALIDADE NOVA

1. Leia este arquivo primeiro.
2. Identifique qual arquivo existente é o ponto de entrada correto.
3. Faça a menor mudança possível — não reescreva o que funciona.
4. Se adicionar comando Tauri novo no Rust, registre em `lib.rs`.
5. Se adicionar provider novo, adicione em `configStore.ts` e em `src/core/llm/api.ts`.
6. Teste compilando com `npm run tauri dev` antes de declarar pronto.

---

## 7. COMANDOS DE DESENVOLVIMENTO

```powershell
# Instalar dependências
cd E:\GitHub\LyaCode
npm install

# Desenvolvimento (hot reload)
npm run tauri dev

# Build produção (gera .exe e .msi)
npm run tauri build

# Só o frontend
npm run dev
```

---

## 8. ESTRUTURA DE ARQUIVOS

```
E:\GitHub\LyaCode\
├── src\                          # Frontend React
│   ├── App.tsx                   # Componente raiz — slogan, layout, atalhos
│   ├── index.css                 # Estilos globais — NÃO adicionar Tailwind
│   ├── core\
│   │   ├── prompt.ts             # LYA_CORE_PROMPT — identidade da Lya
│   │   └── llm\
│   │       ├── api.ts            # fetchLLMResponse — chamadas para providers
│   │       └── models.ts         # fetchProviderModels — lista modelos disponíveis
│   ├── components\terminal\
│   │   ├── Terminal.tsx          # xterm.js + PTY Rust
│   │   ├── AIChatOverlay.tsx     # Chat principal com IA
│   │   ├── CommandPalette.tsx    # Palette de comandos /
│   │   ├── aichat.css
│   │   └── palette.css
│   └── store\
│       └── configStore.ts        # Estado global — providers, modelos, vault
├── src-tauri\
│   ├── src\
│   │   ├── main.rs               # CLI entry point — flags clap
│   │   ├── lib.rs                # Tauri builder — registra handlers
│   │   ├── pty_manager.rs        # PTY PowerShell — terminal real
│   │   ├── skills_manager.rs     # Git clone + parse SKILL.md
│   │   └── vault_manager.rs      # Salva API keys em %APPDATA%
│   ├── capabilities\
│   │   └── default.json          # Permissões Tauri — PRIORIDADE 1
│   ├── Cargo.toml                # Dependências Rust
│   └── tauri.conf.json           # Config app — identifier: com.luiscard.lyacode
├── AGENTS.md                     # ESTE ARQUIVO — leia primeiro
└── package.json
```

---

*Última atualização: gerado por Claude Sonnet 4.6 após leitura completa de todos os arquivos do projeto.*
*Próxima IA que abrir este projeto: leia este arquivo antes de qualquer edição.*
