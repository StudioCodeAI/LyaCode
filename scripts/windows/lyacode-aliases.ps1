function Test-LyaCodeCommand {
  param([string]$Name)

  $cmd = Get-Command $Name -ErrorAction SilentlyContinue
  return $null -ne $cmd
}

function Assert-LyaCodeCommand {
  param(
    [string]$Name,
    [string]$InstallHint
  )

  if (-not (Test-LyaCodeCommand -Name $Name)) {
    throw "$Name was not found on PATH. $InstallHint"
  }
}

function Invoke-LyaCode {
  param([Parameter(ValueFromRemainingArguments = $true)][string[]]$LyaCodeArgs)

  Assert-LyaCodeCommand -Name "lyacode" -InstallHint "Install with: npm install -g @studiocodeai/lyacode"
  & lyacode @LyaCodeArgs
  if ($LASTEXITCODE -ne 0) {
    throw "lyacode failed with exit code $LASTEXITCODE."
  }
}

function Invoke-LyaCodeWithEnvironment {
  param(
    [hashtable]$Environment,
    [Parameter(ValueFromRemainingArguments = $true)][string[]]$LyaCodeArgs
  )

  $oldValues = @{}
  foreach ($key in $Environment.Keys) {
    $oldValues[$key] = [Environment]::GetEnvironmentVariable($key, "Process")
    [Environment]::SetEnvironmentVariable($key, [string]$Environment[$key], "Process")
  }

  try {
    Invoke-LyaCode @LyaCodeArgs
  } finally {
    foreach ($key in $Environment.Keys) {
      [Environment]::SetEnvironmentVariable($key, $oldValues[$key], "Process")
    }
  }
}

function Get-LyaCodeQuickHelp {
  @(
    "Lya Code quick commands:",
    "  lc [args...]              -> launch Lya Code",
    "  lya [args...]             -> launch Lya Code",
    "  lyacode-local [args...]  -> launch with local Ollama hints",
    "  lyacode-provider         -> open the provider manager"
  ) -join [Environment]::NewLine
}

function lc {
  param([Parameter(ValueFromRemainingArguments = $true)][string[]]$LyaCodeArgs)
  Invoke-LyaCode @LyaCodeArgs
}

function lya {
  param([Parameter(ValueFromRemainingArguments = $true)][string[]]$LyaCodeArgs)
  Invoke-LyaCode @LyaCodeArgs
}

function lyacode-local {
  param([Parameter(ValueFromRemainingArguments = $true)][string[]]$LyaCodeArgs)
  Invoke-LyaCodeWithEnvironment `
    -Environment @{
      CLAUDE_CODE_USE_OPENAI = "1"
      OPENAI_BASE_URL = "http://localhost:11434/v1"
      OPENAI_MODEL = "qwen2.5-coder:7b"
      OPENAI_API_KEY = "local"
    } `
    @LyaCodeArgs
}

function lyacode-provider {
  Invoke-LyaCode "/provider"
}

function lyacode-help {
  Get-LyaCodeQuickHelp
}
