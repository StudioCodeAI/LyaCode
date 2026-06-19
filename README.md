# Lya Cloud

**CLI agentic terminal by Studio CodeAI.**

![Lya Cloud brand preview](docs/assets/lyacloud-readme-hero.png)

Lya Cloud is a local-first agentic terminal for software development. It connects cloud and local AI providers to a real project workspace, giving developers a terminal-native assistant that can inspect code, edit files, run commands, use tools, work with MCP servers, and help move a project from idea to implementation.

Lya Cloud is part of the **Studio CodeAI** family.

## Why Lya Cloud

Most AI coding tools are either locked to one provider or shaped around a single hosted experience. Lya Cloud is designed as a provider-flexible CLI: local when you want sovereignty, cloud when you want scale, and extensible when your workflow needs tools, memory, tasks, or agents.

The goal is simple: open a project, start `lyacloud`, and work with an AI engineering partner inside the terminal.

## What It Does

- Interactive React/Ink terminal UI.
- File read, write, edit, grep, glob, and project inspection tools.
- Shell and PowerShell execution with permission flow.
- Provider profiles for local and cloud models.
- OpenAI-compatible APIs, Ollama, Gemini, Codex, Anthropic-family routes, and additional provider integrations.
- MCP support for external tools and services.
- Agent, task, memory, workflow, and session primitives.
- VS Code companion extension source.
- Documentation website source in `web/`.

## Current Status

Lya Cloud is in the **foundation phase**.

The current work focuses on:

- product identity;
- clean Git foundation;
- provider configuration;
- terminal startup experience;
- documentation;
- website and partner/provider pages;
- Studio CodeAI release path.

## Requirements

- Node.js `>=22.0.0`
- Bun `>=1.3.13`
- Git
- ripgrep recommended for best project search behavior

## Quick Start

Install dependencies:

```bash
bun install
```

Build the CLI:

```bash
bun run build
```

Run Lya Cloud:

```bash
node bin/lyacloud
```

Check the version:

```bash
node bin/lyacloud --version
```

Expected result:

```text
0.1.0 (Lya Cloud)
```

## Development Commands

```bash
bun run build
bun run smoke
bun run typecheck
bun test
```

For the website:

```bash
bun run web:dev
bun run web:build
bun run web:typecheck
```

For the VS Code extension:

```bash
cd vscode-extension/lyacloud-vscode
bun test src
```

## Provider Setup

Inside the CLI, run:

```text
/provider
```

Local Ollama can be used through the OpenAI-compatible route:

```powershell
$env:CLAUDE_CODE_USE_OPENAI="1"
$env:OPENAI_BASE_URL="http://localhost:11434/v1"
$env:OPENAI_MODEL="qwen2.5-coder:7b"
$env:OPENAI_API_KEY="local"
node bin/lyacloud
```

`CLAUDE_CODE_*` variables may remain when they are technical compatibility switches. They are not the Lya Cloud product identity.

## Windows Helpers

PowerShell aliases are available in:

```text
scripts/windows/lyacloud-aliases.ps1
```

Documented aliases:

- `lc`
- `lya`
- `lyacloud-local`
- `lyacloud-provider`
- `lyacloud-help`

See:

```text
docs/windows-aliases-and-launchers.md
```

## Project Structure

```text
bin/                 CLI launcher
src/                 TypeScript source
scripts/             Build, validation, provider, and helper scripts
docs/                Product and technical documentation
web/                 Documentation/product website
vscode-extension/    VS Code companion extension
tests/               SDK and build tests
python/              Legacy/local provider helpers
```

## Git Hygiene

This repository should not commit:

- `node_modules/`
- `dist/`
- `.env`
- local credentials
- provider secrets
- `.lyacloud/`
- local profile files
- local agent/Codex runtime folders

The `.gitignore` is prepared for those rules.

## Product Identity

Product name:

```text
Lya Cloud
```

Package and CLI:

```text
@studiocodeai/lyacloud
lyacloud
```

Configuration direction:

```text
.lyacloud
LYACLOUD_*
```

Code identifier convention:

```text
lyaCloud
LyaCloud
```

## Roadmap

See:

```text
docs/LYA_CLOUD_ROADMAP.md
docs/LYA_IDENTITY.md
```

Near-term priorities:

- finish provider onboarding;
- create product website pages;
- create provider/partner program pages;
- prepare GitHub repository metadata;
- define first public release package;
- validate local and cloud model paths.

## Partner Direction

Lya Cloud is designed to work with partner providers. Good first targets include:

- Atlas Cloud;
- Groq;
- Together AI;
- Fireworks AI;
- Google Cloud AI;
- MongoDB Atlas and Voyage AI.

The ideal partnership model is simple: provider visibility inside Lya Cloud, docs and onboarding support, and starter credits or coupons for Studio CodeAI users.

## License

License review is part of the foundation phase because this project starts from a derived open-source coding-agent base.

Do not publish secrets, private partner terms, or credentials in this repository.
