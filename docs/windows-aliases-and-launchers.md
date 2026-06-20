# Windows aliases and launchers

This page documents optional PowerShell helper functions for launching Lya Code on Windows after a global npm install.

## One-time setup

Run this once in PowerShell:

~~~powershell
$packageRoot = Join-Path (npm root -g) "@studiocodeai/lyacode"
$aliases = Join-Path $packageRoot "scripts\windows\lyacode-aliases.ps1"

if (-not (Test-Path $aliases)) {
  throw "Alias script not found at $aliases. Update or reinstall @studiocodeai/lyacode."
}

if (-not (Test-Path $PROFILE)) {
  New-Item -ItemType File -Path $PROFILE -Force | Out-Null
}

$profileLine = ". `"$aliases`""

if (-not (Select-String -Path $PROFILE -Pattern ([regex]::Escape($profileLine)) -Quiet)) {
  Add-Content -Path $PROFILE -Value "`n$profileLine"
}

. $aliases
lyacode-help
~~~

Open a new PowerShell window after setup, or dot-source the profile:

~~~powershell
. $PROFILE
~~~

## Daily commands

### Launch Lya Code

~~~powershell
lc
~~~

You can also use:

~~~powershell
lya
~~~

Both aliases pass arguments through to `lyacode`:

~~~powershell
lc --version
lya --help
~~~

### Launch with local Ollama hints

~~~powershell
lyacode-local
~~~

This launches one Lya Code session with local OpenAI-compatible Ollama environment variables:

~~~text
CLAUDE_CODE_USE_OPENAI=1
OPENAI_BASE_URL=http://localhost:11434/v1
OPENAI_MODEL=qwen2.5-coder:7b
OPENAI_API_KEY=local
~~~

The environment overrides are scoped to that single invocation.

### Open the provider manager

~~~powershell
lyacode-provider
~~~

### Show quick help

~~~powershell
lyacode-help
~~~

## Command summary

| Command | Purpose |
| --- | --- |
| `lc` | Launch Lya Code using the installed CLI |
| `lya` | Launch Lya Code using the installed CLI |
| `lyacode-local` | Launch once with local Ollama/OpenAI-compatible environment hints |
| `lyacode-provider` | Open the provider manager |
| `lyacode-help` | Show quick command help |
