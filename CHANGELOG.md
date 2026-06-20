# Changelog

All notable Lya Code changes will be documented here.

## v1.0.1 — 2026-06-20 (patch)

### Fixed

- **Bitmap `a` minúsculo** — 3 linhas com 11 chars corrigidas para 10: elimina
  desalinhamento visual no wordmark "Lya Code" que aparecia no startup screen.
- **Bitmap `D` maiúsculo** — normalizado para 10 chars por linha (era mistura de 9 e 10).

### Changed

- **Ordem de providers** em `/provider`: `Ollama Local` promovido para a posição 1
  (local-first); `Gitlawb Opengateway` movido para a última posição.
- **Releases e instaladores** agora publicados no repo público
  [`StudioCodeAI/lyacode-installers`](https://github.com/StudioCodeAI/lyacode-installers)
  — código-fonte permanece no repo privado.
- **Workflow de release** (`.github/workflows/release.yml`) atualizado para usar
  `INSTALLERS_REPO_TOKEN` e publicar artefatos no repo público.
- **README** atualizado com versão 1.0.1, link para installers públicos e tabela de
  providers corrigida.

## 0.1.0 - Foundation

Initial Studio CodeAI foundation release.

### Added

- Lya Code product identity.
- `lyacode` CLI launcher (aliases: `lscloud`, `lya`, `lyacode`, `lscode`).
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
