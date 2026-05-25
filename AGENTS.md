# AGENTS.md — LyaCode Studio Governance

> **Este arquivo é a única fonte de verdade para qualquer IA que trabalhe neste projeto.**
> Leia antes de modificar qualquer arquivo. Violar estas regras causa regressão.

---

## Estado do Projeto

**Versão:** `v0.1.0-preview`  
**Stack:** Tauri 2 + Rust (backend) · React 18 + TypeScript (frontend) · Vite (bundler)  
**Localização:** `E:\GitHub\LyaCode`

### O que FUNCIONA (não toque sem razão)

| Módulo | Arquivo(s) | Status |
|---|---|---|
| Terminal PTY real | `src-tauri/src/pty_manager.rs` | ✅ Funciona |
| Vault de API Keys (Rust) | `src-tauri/src/vault_manager.rs` | ✅ Funciona |
| Registro de comandos Tauri | `src-tauri/src/lib.rs` | ✅ Funciona |
| Store de configuração | `src/store/configStore.ts` | ✅ Funciona |
| CommandPalette (UI) | `src/components/terminal/CommandPalette.tsx` | ✅ Funciona |
| Chat overlay (AIChatOverlay) | `src/components/terminal/AIChatOverlay.tsx` | ✅ Funciona |
| Roteamento de providers | `src/core/llm/api.ts` | ✅ Funciona |
| Skills manager (Rust) | `src-tauri/src/skills_manager.rs` | ✅ Funciona |
| App principal | `src/App.tsx` | ✅ Funciona |

---

## Regras de Modificação

### NUNCA faça sem aprovação explícita do usuário:
- Reescrever `lib.rs` inteiro (adicione apenas — não substitua)
- Reescrever `configStore.ts` inteiro (edite funções específicas)
- Alterar a estrutura do `vault_manager.rs` (tipos `ProviderKeys`, funções `save_vault_keys`/`load_vault_keys`)
- Mudar o sistema de persistência (localStorage + Rust vault é intencional — dupla camada)
- Alterar o CSS global (`src/index.css`) sem motivo de layout

### Pode modificar livremente:
- Adicionar novos comandos em `lib.rs` via `invoke_handler`
- Adicionar novos providers em `configStore.ts` na lista `providers`
- Adicionar novas slash commands em `CommandPalette.tsx`
- Adicionar agentes em `BUILT_IN_AGENTS`
- Criar novos arquivos `.rs` em `src-tauri/src/` (registrar em `lib.rs`)
- Criar novos componentes em `src/components/`

---

## Arquitetura de Dados

### Fluxo de API Keys
```
Usuário digita chave
  → CommandPalette.tsx: executeSelection()
    → config.setApiKey(provider, query)        [configStore.ts]
      → Zustand state update                   [localStorage via persist]
      → saveToVault(nextProviders)             [invoke Rust vault_manager]
        → %APPDATA%/lyacode/vault.json
```

### Fluxo de carga ao iniciar
```
App.tsx: useEffect → loadFromVault()
  → invoke('load_vault_keys')                  [Rust vault_manager]
    → vault.json → HashMap<String, ProviderKeys>
      → configStore.ts: set({ providers: updatedProviders })
```

### Hierarquia de providers
O campo `activeProvider` em `configStore.ts` define qual provider o `api.ts` usa.  
O `api.ts` detecta o tipo de provider via heurísticas:
- `apiKey === 'local'` ou `baseUrl` com porta 11434 → Ollama
- `apiKey.startsWith('AIza')` → Google Gemini direto
- `apiKey.startsWith('gsk_')` → Groq
- Fallback → OpenRouter (com headers `HTTP-Referer` e `X-Title`)

---

## Próximos Passos Aprovados

Somente trabalhe nestas tarefas — na ordem listada:

1. **[ ] Gerar o build de produção** — `npm run tauri build` (precisa de aprovação do usuário pois demora ~10 min)
2. **[ ] Conversação com histórico** — Adicionar array de `messages` ao `AIChatOverlay` passado ao `api.ts` para contexto real de múltiplas mensagens
3. **[ ] Markdown rendering** — Renderizar respostas do AI com `react-markdown` + `remark-gfm`
4. **[ ] Code blocks com syntax highlight** — `rehype-highlight` dentro do markdown renderer
5. **[ ] Settings overlay** — Substituir o `alert('Settings overlay coming soon!')` por um painel real
6. **[ ] Push para GitHub** — `git add . && git commit -m "feat: vault persistence + UI fixes v0.1.0" && git push`

---

## Regras para IAs (OBRIGATÓRIO)

1. **Leia este arquivo primeiro.** Se você chegou aqui sem ler, pare e leia do início.
2. **Não reescreva arquivos que funcionam.** Use edições cirúrgicas com `replace_file_content`.
3. **Compile antes de declarar sucesso.** Rode `cargo check` e `npx tsc --noEmit` e confirme saída limpa.
4. **Documente o que mudou** — atualize a tabela "O que FUNCIONA" acima se adicionar módulos.
5. **Um problema por vez.** Não misture features numa mesma sessão.
6. **Não invente tarefas.** Se o usuário não pediu, não faça.
