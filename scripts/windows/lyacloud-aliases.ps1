function Test-LyaCloudCommand {
  param([string]$Name)

  $cmd = Get-Command $Name -ErrorAction SilentlyContinue
  return $null -ne $cmd
}

function Assert-LyaCloudCommand {
  param(
    [string]$Name,
    [string]$InstallHint
  )

  if (-not (Test-LyaCloudCommand -Name $Name)) {
    throw "$Name was not found on PATH. $InstallHint"
  }
}

function Invoke-LyaCloud {
  param([Parameter(ValueFromRemainingArguments = $true)][string[]]$LyaCloudArgs)

  Assert-LyaCloudCommand -Name "lyacloud" -InstallHint "Install with: npm install -g @studiocodeai/lyacloud"
  & lyacloud @LyaCloudArgs
  if ($LASTEXITCODE -ne 0) {
    throw "lyacloud failed with exit code $LASTEXITCODE."
  }
}

function Invoke-LyaCloudWithEnvironment {
  param(
    [hashtable]$Environment,
    [Parameter(ValueFromRemainingArguments = $true)][string[]]$LyaCloudArgs
  )

  $oldValues = @{}
  foreach ($key in $Environment.Keys) {
    $oldValues[$key] = [Environment]::GetEnvironmentVariable($key, "Process")
    [Environment]::SetEnvironmentVariable($key, [string]$Environment[$key], "Process")
  }

  try {
    Invoke-LyaCloud @LyaCloudArgs
  } finally {
    foreach ($key in $Environment.Keys) {
      [Environment]::SetEnvironmentVariable($key, $oldValues[$key], "Process")
    }
  }
}

function Get-LyaCloudQuickHelp {
  @(
    "Lya Cloud quick commands:",
    "  lc [args...]              -> launch Lya Cloud",
    "  lya [args...]             -> launch Lya Cloud",
    "  lyacloud-local [args...]  -> launch with local Ollama hints",
    "  lyacloud-provider         -> open the provider manager"
  ) -join [Environment]::NewLine
}

function lc {
  param([Parameter(ValueFromRemainingArguments = $true)][string[]]$LyaCloudArgs)
  Invoke-LyaCloud @LyaCloudArgs
}

function lya {
  param([Parameter(ValueFromRemainingArguments = $true)][string[]]$LyaCloudArgs)
  Invoke-LyaCloud @LyaCloudArgs
}

function lyacloud-local {
  param([Parameter(ValueFromRemainingArguments = $true)][string[]]$LyaCloudArgs)
  Invoke-LyaCloudWithEnvironment `
    -Environment @{
      CLAUDE_CODE_USE_OPENAI = "1"
      OPENAI_BASE_URL = "http://localhost:11434/v1"
      OPENAI_MODEL = "qwen2.5-coder:7b"
      OPENAI_API_KEY = "local"
    } `
    @LyaCloudArgs
}

function lyacloud-provider {
  Invoke-LyaCloud "/provider"
}

function lyacloud-help {
  Get-LyaCloudQuickHelp
}
