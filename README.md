# Lya Cloud

CLI agentic terminal by Studio CodeAI.

Lya Cloud connects local and cloud AI models to your development workspace. It starts from a mature terminal-first agentic CLI base and evolves it into a Studio CodeAI product with its own identity, commands, configuration, memory, provider setup, and coding workflows.

## Current Status

This repository is in the foundation phase.

What already exists in the base:

- Interactive terminal UI.
- File read, write, edit, grep and glob tools.
- Shell and PowerShell execution tools with permission flow.
- Provider profiles for cloud and local models.
- Ollama, OpenAI-compatible, Gemini, Codex, Anthropic-family and other provider routes.
- MCP support.
- Agents, tasks, memory and workflow primitives.
- VS Code extension source.
- Documentation site source.

What is being changed now:

- Product identity from the inherited upstream base to Lya Cloud.
- CLI command standardized as `lyacloud`.
- User config path standardized as `.lyacloud`.
- Studio CodeAI branding in startup, docs and release surfaces.

## Requirements

- Node.js `>=22.0.0`
- Bun `>=1.3.13`

## Development

Install dependencies:

```bash
bun install
```

Build:

```bash
bun run build
```

Run:

```bash
node bin/lyacloud
```

Smoke test:

```bash
bun run smoke
```

## Provider Setup

Inside Lya Cloud, use:

```text
/provider
```

Local Ollama can be launched with OpenAI-compatible environment hints:

```powershell
$env:CLAUDE_CODE_USE_OPENAI="1"
$env:OPENAI_BASE_URL="http://localhost:11434/v1"
$env:OPENAI_MODEL="qwen2.5-coder:7b"
$env:OPENAI_API_KEY="local"
node bin/lyacloud
```

`CLAUDE_CODE_*` variables are kept where they mean provider compatibility. They are not the product identity.

## Roadmap

See [docs/LYA_CLOUD_ROADMAP.md](docs/LYA_CLOUD_ROADMAP.md).

## Identity Rule

Lya Cloud is the product identity. It belongs to the Studio CodeAI family and should be visible in user-facing product surfaces.

Claude Code references may remain only when they mean provider support, model compatibility, API behavior or inherited technical integration.

## License

License review is part of the foundation phase because this project starts from a derived open-source coding-agent base.
