# Lya Cloud VS Code Extension

A practical VS Code companion for Lya Cloud with a project-aware **Control Center**, predictable terminal launch behavior, and quick access to useful Lya Cloud workflows.

## Features

- **Real Control Center status** in the Activity Bar:
  - whether the configured `lyacloud` command is installed
  - the launch command being used
  - whether the launch shim injects `CLAUDE_CODE_USE_OPENAI=1`
  - the current workspace folder
  - the launch cwd that will be used for terminal sessions
  - whether `.lyacloud-profile.json` exists in the current workspace root
  - a conservative provider summary derived from the workspace profile or known environment flags
- **Project-aware launch behavior**:
  - `Launch Lya Cloud` launches from the active editor's workspace when possible
  - falls back to the first workspace folder when needed
  - avoids launching from an arbitrary default cwd when a project is open
- **Practical sidebar actions**:
  - Launch Lya Cloud
  - Launch in Workspace Root
  - Open Workspace Profile
  - Open Repository
  - Open Setup Guide
  - Open Command Palette
- **Built-in dark theme**: `Lya Cloud Terminal Black`
- **Microsoft Foundry / Azure OpenAI**: optional wizard and settings store endpoint, API version, deployment name, and API key (Secret Storage); launch injects `OPENAI_*` and `AZURE_OPENAI_API_VERSION` into the Lya Cloud terminal (see `docs/advanced-setup.md` on the repo).

## Requirements

- VS Code `1.95+`
- `lyacloud` available in your terminal PATH (`npm install -g @studiocodeai/lyacloud@latest`)

## Commands

- `Lya Cloud: Open Control Center`
- `Lya Cloud: Launch in Terminal`
- `Lya Cloud: Launch in Workspace Root`
- `Lya Cloud: Open Repository`
- `Lya Cloud: Open Setup Guide`
- `Lya Cloud: Open Workspace Profile`
- `Lya Cloud: New Chat` / `Lya Cloud: Open Chat Panel` / `Lya Cloud: Resume Session` / `Lya Cloud: Abort Generation`
- `Lya Cloud: Configure Azure / Foundry Chat (wizard)`
- `Lya Cloud: Set Azure / Foundry API Key (Secret Storage)`
- `Lya Cloud: Clear Azure / Foundry API Key`
- `Lya Cloud: Open Azure / Foundry Settings`

## Microsoft Foundry / Azure OpenAI (terminal chat)

1. Command Palette → **Lya Cloud: Configure Azure / Foundry Chat (wizard)** and enter endpoint, API version, deployment name, and API key; or set `lyacloud.azure.*` in Settings and use **Lya Cloud: Set Azure / Foundry API Key**.
2. Enable **Lya Cloud: Azure: Enabled** (the wizard turns this on).
3. **Lya Cloud: Launch in Terminal** — the extension merges env vars the OpenAI shim expects (`CLAUDE_CODE_USE_OPENAI`, `OPENAI_BASE_URL`, `OPENAI_API_KEY`, `OPENAI_MODEL`, `AZURE_OPENAI_API_VERSION`, and `OPENAI_AZURE_STYLE` when forced).

If you use `.lyacloud-profile.json` for the same workspace, leave Azure injection off to avoid conflicting provider configuration.

## Settings

- `lyacloud.launchCommand` (default: `lyacloud`)
- `lyacloud.terminalName` (default: `Lya Cloud`)
- `lyacloud.useOpenAIShim` (default: `false`)
- `lyacloud.azure.*` — Foundry / Azure OpenAI terminal injection (see Settings UI)
- `lyacloud.permissionMode` — chat permission mode

`lyacloud.useOpenAIShim` only injects `CLAUDE_CODE_USE_OPENAI=1` when Azure injection did not already set it. It does not configure endpoints or keys by itself.

## Notes on Status Detection

- Provider status prefers the real workspace `.lyacloud-profile.json` file when present.
- If no saved profile exists, the extension falls back to known environment flags available to the VS Code extension host.
- If the source of truth is unclear, the extension shows `unknown` instead of guessing.

## Development

From this folder:

```bash
npm run test
npm run lint
```

To package (optional):

```bash
npm run package
```

