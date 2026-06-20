# Lya Cloud Windows Installer (PowerShell)
# Luis Cardozo - studiocoder.ai@gmail.com - Studio CodeAI

[CmdletBinding()]
param(
    [string]$Tarball,
    [switch]$NoShortcuts,
    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'

$ProductName = 'Lya Cloud'
$ProductBin = 'lyacloud'
$ProductVersion = '0.1.0'
$LogDir = Join-Path $env:LOCALAPPDATA 'lyacloud'
$LogFile = Join-Path $LogDir ("lyacloud-setup-{0:yyyyMMdd-HHmmss}.log" -f (Get-Date))
$StartMenuDir = Join-Path $env:APPDATA 'Microsoft\Windows\Start Menu\Programs\Lya Cloud'

New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

function Write-Log {
    param([string]$Message, [ValidateSet('INFO','WARN','ERR')]$Level = 'INFO')
    $line = "[{0:HH:mm:ss}] [{1}] {2}" -f (Get-Date), $Level, $Message
    Write-Host $line
    Add-Content -LiteralPath $LogFile -Value $line
}

trap {
    Write-Log ("ERRO INESPERADO: $_") -Level ERR
    exit 99
}

Write-Log "=== $ProductName v$ProductVersion installer (Windows) ==="
Write-Log "Log: $LogFile"

function Get-NodeVersion {
    $node = Get-Command node -ErrorAction SilentlyContinue
    if (-not $node) { return $null }
    $raw = & node --version 2>$null
    if ($LASTEXITCODE -ne 0) { return $null }
    return $raw.TrimStart('v').Trim()
}

function Test-NodeMin {
    param([string]$MinMajor = '22')
    $v = Get-NodeVersion
    if (-not $v) { return $false }
    $major = ([version]$v).Major
    return ($major -ge [int]$MinMajor)
}

Write-Log "Verificando Node.js >= 22..."
$nodeOk = Test-NodeMin -MinMajor '22'
if (-not $nodeOk) {
    $installed = Get-NodeVersion
    if ($installed) {
        Write-Log "Node.js $installed encontrado, mas < 22. Atualize para 22+." -Level ERR
    } else {
        Write-Log "Node.js nao encontrado no PATH." -Level ERR
    }
    Write-Log "Baixe Node.js 22 LTS: https://nodejs.org/dist/latest-v22.x/" -Level INFO
    Write-Log "Apos instalar, reexecute este instalador." -Level INFO
    exit 10
}
Write-Log "Node.js $(Get-NodeVersion) OK"

if (-not $Tarball) {
    $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    $candidate = Join-Path $scriptDir 'studiocodeai-lyacloud-0.1.0.tgz'
    if (Test-Path -LiteralPath $candidate) {
        $Tarball = $candidate
    }
}

if (-not $Tarball -or -not (Test-Path -LiteralPath $Tarball)) {
    Write-Log "Tarball nao encontrado. Gere com: npm pack" -Level ERR
    Write-Log "Ou passe -Tarball <caminho\studiocodeai-lyacloud-0.1.0.tgz>" -Level INFO
    exit 20
}
Write-Log "Tarball: $Tarball"

Write-Log "Instalando $ProductName globalmente (npm install -g)..."
if ($DryRun) {
    Write-Log "DRY RUN: npm install -g --silent $Tarball" -Level WARN
} else {
    $installOutput = & npm install -g --silent $Tarball 2>&1
    $installExit = $LASTEXITCODE
    if ($installExit -ne 0) {
        Write-Log "npm install falhou (exit=$installExit):" -Level ERR
        $installOutput | ForEach-Object { Write-Log "  $_" -Level ERR }
        exit 30
    }
    Write-Log "npm install OK"
}

Write-Log "Verificando $ProductBin no PATH..."
$whichLyacloud = Get-Command $ProductBin -ErrorAction SilentlyContinue
if (-not $whichLyacloud) {
    Write-Log "$ProductBin nao encontrado no PATH apos install." -Level ERR
    Write-Log "Possivel causa: NPM global prefix nao esta no PATH." -Level ERR
    Write-Log "Solucao: rode 'npm config get prefix' e adicione o diretorio bin ao PATH." -Level ERR
    exit 40
}
Write-Log "$ProductBin encontrado: $($whichLyacloud.Source)"

Write-Log "Validando instalacao..."
$failed = $false
$npmGlobalPrefix = (& npm config get prefix 2>$null).Trim().TrimEnd('\','/')
foreach ($alias in @('lyacloud','lscloud','lya','lyacode','lscode')) {
    # Em PowerShell 5.1, 'lya' pode colidir com outros binarios no PATH.
    # Considera apenas binarios dentro do npm global prefix (npm install -g target).
    $cmd = Get-Command $alias -CommandType Application -ErrorAction SilentlyContinue
    if (-not $cmd) {
        if ($DryRun) {
            Write-Log "  SKIP (dry-run): $alias nao encontrado - sera criado pelo npm install" -Level WARN
        } else {
            Write-Log "  FAIL: $alias nao encontrado no PATH como Application" -Level ERR
            $failed = $true
        }
        continue
    }
    # Filtra apenas binarios dentro do npm global prefix (evita colisao com
    # outros binarios 'lya' / 'lyacode' que existam no PATH por outros motivos).
    $matchingCmd = $cmd | Where-Object {
        $_.Source -like "$npmGlobalPrefix*" -and $_.Source -notmatch 'lyacloud-help\.cmd$'
    } | Select-Object -First 1
    if (-not $matchingCmd) {
        if ($DryRun) {
            Write-Log "  SKIP (dry-run): $alias nao esta em $npmGlobalPrefix ainda" -Level WARN
        } else {
            Write-Log "  FAIL: $alias resolve para path fora de npm prefix (colide com outro binario)" -Level ERR
            $failed = $true
        }
        continue
    }
    $exePath = $matchingCmd.Source
    $line = & $exePath --version 2>$null
    if ($LASTEXITCODE -ne 0 -or $line -notlike "$ProductVersion*") {
        Write-Log "  FAIL: $alias ($exePath) nao respondeu corretamente: '$line'" -Level ERR
        $failed = $true
    } else {
        Write-Log "  OK: $alias -> $line"
    }
}
if ($failed -and -not $DryRun) { exit 50 }

if (-not $NoShortcuts) {
    Write-Log "Criando atalhos no Menu Iniciar..."
    New-Item -ItemType Directory -Force -Path $StartMenuDir | Out-Null

    $launcherPs1 = Join-Path $StartMenuDir 'lyacloud.cmd'
    $launcherLines = New-Object System.Collections.Generic.List[string]
    $null = $launcherLines.Add('@echo off')
    $null = $launcherLines.Add('title Lya Cloud')
    $null = $launcherLines.Add('cd /d %USERPROFILE%')
    $null = $launcherLines.Add($ProductBin)
    $null = $launcherLines.Add('pause')
    $lyacmdBody = [string]::Join([Environment]::NewLine, $launcherLines.ToArray()) + [Environment]::NewLine
    Set-Content -LiteralPath $launcherPs1 -Value $lyacmdBody -Encoding ASCII

    $helpCmd = Join-Path $StartMenuDir 'lyacloud-help.cmd'
    $helpLines = New-Object System.Collections.Generic.List[string]
    $null = $helpLines.Add('@echo off')
    $null = $helpLines.Add('title Lya Cloud Ajuda')
    $null = $helpLines.Add(($ProductBin + ' --help'))
    $null = $helpLines.Add('pause')
    $lyahelpBody = [string]::Join([Environment]::NewLine, $helpLines.ToArray()) + [Environment]::NewLine
    Set-Content -LiteralPath $helpCmd -Value $lyahelpBody -Encoding ASCII

    Write-Log "Atalhos criados em: $StartMenuDir"
    Write-Log "  - $launcherPs1"
    Write-Log "  - $helpCmd"
} else {
    Write-Log "Atalhos suprimidos (-NoShortcuts)." -Level WARN
}

Write-Log ""
Write-Log "=== Instalacao concluida com sucesso ==="
Write-Log ""
Write-Log "Aliases disponiveis em qualquer terminal:"
Write-Log "  lyacloud, lscloud, lya, lyacode, lscode"
Write-Log ""
Write-Log "Para comecar:"
Write-Log "  lyacloud                # inicia o agente Lya"
Write-Log "  /lya                    # dentro do CLI, invoca a persona Lya"
Write-Log ""
Write-Log "Desinstalar:"
Write-Log "  npm uninstall -g @studiocodeai/lyacloud"
Write-Log ""
Write-Log "Log completo: $LogFile"

exit 0
