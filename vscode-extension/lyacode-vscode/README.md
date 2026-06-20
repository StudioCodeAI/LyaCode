# Lya Code VS Code Extension

A practical VS Code companion for Lya Code with a project-aware **Control Center**, predictable terminal launch behavior, and quick access to useful Lya Code workflows.

## Features

- **Real Control Center status** in the Activity Bar:
  - whether the configured `lyacode` command is installed
  - the launch command being used
  - whether the launch shim injects `CLAUDE_CODE_USE_OPENAI=1`
  - the current workspace folder
  - the launch cwd that will be used for terminal sessions
  - whether `.lyacode-profile.json` exists in the current workspace root
  - a conservative provider summary derived from the workspace profile or known environment flags
- **Project-aware launch behavior**:
  - `Launch Lya Code` launches from the active editor's workspace when possible
  - falls back to the first workspace folder when needed
  - avoids launching from an arbitrary default cwd when a project is open
- **Practical sidebar actions**:
  - Launch Lya Code
  - Launch in Workspace Root
  - Open Workspace Profile
  - Open Repository
  - Open Setup Guide
  - Open Command Palette
- **Built-in dark theme**: `Lya Code Terminal Black`
- **Microsoft Foundry / Azure OpenAI**: optional wizard and settings store endpoint, API version, deployment name, and API key (Secret Storage); launch injects `OPENAI_*` and `AZURE_OPENAI_API_VERSION` into the Lya Code terminal (see `docs/advanced-setup.md` on the repo).

## Requirements

- VS Code `1.95+`
- `lyacode` available in your terminal PATH (`npm install -g @studiocodeai/lyacode@latest`)

## Commands

- `Lya Code: Open Control Center`
- `Lya Code: Launch in Terminal`
- `Lya Code: Launch in Workspace Root`
- `Lya Code: Open Repository`
- `Lya Code: Open Setup Guide`
- `Lya Code: Open Workspace Profile`
- `Lya Code: New Chat` / `Lya Code: Open Chat Panel` / `Lya Code: Resume Session` / `Lya Code: Abort Generation`
- `Lya Code: Configure Azure / Foundry Chat (wizard)`
- `Lya Code: Set Azure / Foundry API Key (Secret Storage)`
- `Lya Code: Clear Azure / Foundry API Key`
- `Lya Code: Open Azure / Foundry Settings`

## Microsoft Foundry / Azure OpenAI (terminal chat)

1. Command Palette → **Lya Code: Configure Azure / Foundry Chat (wizard)** and enter endpoint, API version, deployment name, and API key; or set `lyacode.azure.*` in Settings and use **Lya Code: Set Azure / Foundry API Key**.
2. Enable **Lya Code: Azure: Enabled** (the wizard turns this on).
3. **Lya Code: Launch in Terminal** — the extension merges env vars the OpenAI shim expects (`CLAUDE_CODE_USE_OPENAI`, `OPENAI_BASE_URL`, `OPENAI_API_KEY`, `OPENAI_MODEL`, `AZURE_OPENAI_API_VERSION`, and `OPENAI_AZURE_STYLE` when forced).

If you use `.lyacode-profile.json` for the same workspace, leave Azure injection off to avoid conflicting provider configuration.

## Settings

- `lyacode.launchCommand` (default: `lyacode`)
- `lyacode.terminalName` (default: `Lya Code`)
- `lyacode.useOpenAIShim` (default: `false`)
- `lyacode.azure.*` — Foundry / Azure OpenAI terminal injection (see Settings UI)
- `lyacode.permissionMode` — chat permission mode

`lyacode.useOpenAIShim` only injects `CLAUDE_CODE_USE_OPENAI=1` when Azure injection did not already set it. It does not configure endpoints or keys by itself.

## Notes on Status Detection

- Provider status prefers the real workspace `.lyacode-profile.json` file when present.
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

