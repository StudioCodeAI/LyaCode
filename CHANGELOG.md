# Changelog

All notable Lya Code changes will be documented here.

## v1.1.0 — 2026-06-20

### Added

- **Notificação de atualização interativa** — ao iniciar, a CLI verifica o npm registry
  (cache 24h) e exibe um prompt `[s/N]` se houver versão mais nova. Respondendo "s",
  roda `npm install -g @studiocodeai/lyacode@<versão>` e sai para reinicialização.
- **Wordmark ANSI Shadow** — `LYA CODE` em uma linha, 6 rows de altura, estilo FigFont
  com box-drawing characters (`╔═╗║╚╝`) + blocos `█`. Visual bold e uppercase equivalente
  ao padrão do ecossistema. Substituiu o wordmark bitmap 5-row anterior.
- **README wordmark** — bloco de código com o wordmark ANSI Shadow no topo do README
  (visível no GitHub sem dependência de ANSI/cores).
- **`quick-install.ps1`** — script PowerShell publicado em `LyaCode-installers` para
  o one-liner `irm ... | iex`. Verifica Node >= 22, instala, valida e exibe primeiros passos.

### Changed

- README: secao "O que e o Lya Code?", tabela de provedores, sessoes em background,
  irm one-liner, secao "Desinstalar" com comando npm uninstall.

## v1.0.9 — 2026-06-20

### Added

- **Lya agent completo** — 8 sub-agentes built-in registrados e disponíveis via `/agents`:
  `lya`, `lya-architect`, `lya-explorer`, `lya-reviewer`, `lya-tester`, `lya-recorder`,
  `lya-memory`, `lya-provider`.
- **`lya-memory`** — novo sub-agente para memória persistente de sessão: lê/escreve
  `.lya_tracker.md`, gera handoffs de sessão, mantém CLAUDE.md sincronizado.
- **`lya-provider`** — novo sub-agente para diagnóstico e configuração de provedores de IA:
  triage de perfil ativo, recomendação por objetivo, documentação de tradeoffs.
- **CLAUDE.md** — documentação completa do projeto para Claude Code adicionada ao repo.

### Changed

- **Logo de startup** — wordmark "Lya Code" em 5 linhas ANSI Shadow com gradiente
  orange Studio CodeAI; tagline "Um produto Studio CodeAI" sob o wordmark.
- **Ink UI logo** (`LogoV2`) — wordmark em 2 linhas com meio-bloco Unicode, cores
  `brandShimmer` (Lya) + `brand` (Code); borderTitle "Lya Code vX.Y.Z".
- **`brand.ts`** — `BRAND_TAGLINE = 'Um produto Studio CodeAI'`; `BRAND_ACCENT_RGB`
  em verde Studio CodeAI; `WORDMARK_LYA` + `WORDMARK_CODE` finalizados.
- **`LYA_VERSION_LINE`** — usa `process.env.LYACODE_VERSION` → `npm_package_version`
  como fallback (elimina hardcoded `'0.1.0'`).
- **`scripts/build.ts`** — feature flags ajustados para o build Studio CodeAI.
- **`scripts/installer/`** — scripts de instalador Windows atualizados para Lya Code.
- **Release workflow** — `.github/workflows/release.yml` aponta para
  `StudioCodeAI/LyaCode-installers` com `INSTALLERS_REPO_TOKEN`.

### Fixed

- Bitmap `a` minúsculo e `D` maiúsculo no wordmark normalizados para 10 chars/linha.
- Ordem de providers em `/provider`: Ollama Local → posição 1 (local-first).

## v1.0.1 — 2026-06-20 (patch)

### Fixed

- **Bitmap `a` minúsculo** — 3 linhas com 11 chars corrigidas para 10: elimina
  desalinhamento visual no wordmark "Lya Code" que aparecia no startup screen.
- **Bitmap `D` maiúsculo** — normalizado para 10 chars por linha (era mistura de 9 e 10).

### Changed

- **Ordem de providers** em `/provider`: `Ollama Local` promovido para a posição 1
  (local-first); `Gitlawb Opengateway` movido para a última posição.
- **Releases e instaladores** agora publicados no repo público
  [`StudioCodeAI/LyaCode-installers`](https://github.com/StudioCodeAI/LyaCode-installers)
  — código-fonte permanece no repo privado.
- **Workflow de release** (`.github/workflows/release.yml`) atualizado para usar
  `INSTALLERS_REPO_TOKEN` e publicar artefatos no repo público.
- **README** atualizado com versão 1.0.1, link para installers públicos e tabela de
  providers corrigida.

## 0.1.0 - Foundation

Initial Studio CodeAI foundation release.

### Added

- Lya Code product identity.
- `lyacode` CLI launcher (aliases: `lya`, `lscode`).
- **Lya persona + 6 sub-agents** (`lya`, `lya-architect`, `lya-explorer`,
  `lya-reviewer`, `lya-tester`, `lya-recorder`) registered as built-in
  agents. Profile, voice, boundaries and operating principles in
  `src/agents/lya/profile.ts`.
- `/lya` slash command — explicit invocation that loads Lya's system
  prompt base into the current session.
- Co-author email `lyacode@studiocoder.ai` for commit attribution
  (was `lyacode@studiocodeai.com`).
- Studio CodeAI README, roadmap, identity document, and Windows aliases.
- `.lyacode` user configuration direction.
- VS Code extension source under the Lya Code identity.
- Documentation website source under `web/`.

### Changed

- Reworked the inherited coding-agent CLI base into the Lya Code foundation.
- Replaced inherited product identity references with Lya Code.
- Standardized environment variables on `LYACODE_*` where they belong to this product.
- `getDisplayPath(path, overrideHomeDir?)`,
  `redactPathForStatus(path, overrideHomeDir?)`,
  `getClaudeConfigHomeDir(overrideHomeDir?)` now accept an explicit
  home directory so test suites can pin paths without mocking
  `os.homedir()` (which leaked state across suites).
- `resolveConfigDirEnv` warns and prefers `LYACODE_CONFIG_DIR` over
  legacy `CLAUDE_CONFIG_DIR`.
- Default PR attribution string carries the 🤖 prefix and Studio CodeAI
  Lya Code wordmark.

### Fixed

- 16 failing tests (rebranding residue: CLAUDE D-shape logo,
  `gitlawb.com` email, env conflict warning, path redactor, locale
  separators, hook description, Ant-employee gates).
- Mock leak in `os.homedir()` between test suites (`restoreOsMock`
  helper + `require('os').homedir()` in `hookSourceDescriptionDisplayString`).

### Notes

- Claude model, Claude API, Claude Desktop, Claude Code compatibility, and `CLAUDE_CODE_*` references may remain when they represent provider compatibility or technical integration rather than product identity.
- `v0.x.y` = versão de teste (pode quebrar). `v1.0.0+` = produção estável.
- 4607/4607 tests passing. `bun run typecheck` and `bun run smoke` green.
