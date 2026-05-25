# LyaCode - Fix PATH e PowerShell Profile
# Execute como Administrador: .\fix-lyacode-path.ps1

$ErrorActionPreference = "SilentlyContinue"

Write-Host ""
Write-Host "  LyaCode PATH Fix" -ForegroundColor Green
Write-Host "  =================" -ForegroundColor DarkGray
Write-Host ""

# ── 1. Localizar o lyacode.exe ───────────────────────────────────────────────
$candidates = @(
    "C:\Program Files\LyaCode\lyacode.exe",
    "C:\Program Files (x86)\LyaCode\lyacode.exe",
    "$env:LOCALAPPDATA\LyaCode\lyacode.exe"
)

$lyacodeExe = $null
foreach ($c in $candidates) {
    if (Test-Path $c) { $lyacodeExe = $c; break }
}

if (-not $lyacodeExe) {
    # Busca mais abrangente
    Write-Host "Procurando lyacode.exe..." -ForegroundColor Yellow
    $found = Get-ChildItem "C:\Program Files", "C:\Program Files (x86)" `
        -Filter "lyacode.exe" -Recurse -ErrorAction SilentlyContinue |
        Select-Object -First 1
    if ($found) { $lyacodeExe = $found.FullName }
}

if (-not $lyacodeExe) {
    Write-Host "ERRO: lyacode.exe nao encontrado." -ForegroundColor Red
    Write-Host "Instale o LyaCode_0.1.0_x64-setup.exe primeiro." -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

$installDir = Split-Path $lyacodeExe -Parent
Write-Host "  Encontrado: $lyacodeExe" -ForegroundColor Cyan

# ── 2. Adicionar ao System PATH (HKLM) ──────────────────────────────────────
$syspath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
if ($syspath -notlike "*$installDir*") {
    [System.Environment]::SetEnvironmentVariable("Path", "$syspath;$installDir", "Machine")
    Write-Host "  PATH do sistema atualizado." -ForegroundColor Green
} else {
    Write-Host "  PATH do sistema: ja configurado." -ForegroundColor Yellow
}

# Atualizar PATH da sessao atual imediatamente
$env:PATH = "$env:PATH;$installDir"

# ── 3. Bloco de funcoes para os profiles ────────────────────────────────────
$block = @"

# LyaCode Studio — adicionado automaticamente
function lyacode { Start-Process '$lyacodeExe' }
function lya     { Start-Process '$lyacodeExe' }
function lcode   { Start-Process '$lyacodeExe' }
"@

$profiles = @(
    # PS5 64-bit (padrao no Windows)
    "$env:WINDIR\System32\WindowsPowerShell\v1.0\profile.ps1",
    # PS5 32-bit (x86 — o que voce esta usando agora)
    "$env:WINDIR\SysWOW64\WindowsPowerShell\v1.0\profile.ps1",
    # PS7 64-bit (se instalado)
    "$env:ProgramFiles\PowerShell\7\profile.ps1",
    # PS7 32-bit
    "${env:ProgramFiles(x86)}\PowerShell\7\profile.ps1"
)

foreach ($prof in $profiles) {
    $dir = Split-Path $prof -Parent
    if (-not (Test-Path $dir)) { continue }

    # Evitar duplicar
    if ((Test-Path $prof) -and ((Get-Content $prof -Raw) -like "*LyaCode Studio*")) {
        Write-Host "  $prof : ja configurado." -ForegroundColor Yellow
        continue
    }

    # Criar o arquivo se nao existir
    if (-not (Test-Path $prof)) {
        New-Item -ItemType File -Path $prof -Force | Out-Null
    }

    Add-Content -Path $prof -Value $block
    Write-Host "  $prof : configurado." -ForegroundColor Green
}

# ── 4. Carregar na sessao atual imediatamente ────────────────────────────────
function lyacode { Start-Process $lyacodeExe }
function lya     { Start-Process $lyacodeExe }
function lcode   { Start-Process $lyacodeExe }

Write-Host ""
Write-Host "  Pronto! Comandos disponiveis AGORA nesta sessao:" -ForegroundColor Green
Write-Host "    lyacode   lya   lcode" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Teste: lyacode" -ForegroundColor DarkGray
Write-Host ""
