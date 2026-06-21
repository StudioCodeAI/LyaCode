# Lya Code — Quick Install (PowerShell)
# Studio CodeAI | studiocoder.ai@gmail.com
#
# Uso:
#   irm https://raw.githubusercontent.com/StudioCodeAI/LyaCode-installers/main/quick-install.ps1 | iex
#
# Requer Node.js >= 22: https://nodejs.org/dist/latest-v22.x/

$ErrorActionPreference = 'Stop'
$pkg = '@studiocodeai/lyacode'

Write-Host ""
Write-Host "  Lya Code — Studio CodeAI" -ForegroundColor DarkYellow
Write-Host ""

# Verificar Node.js >= 22
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Host "  ERRO: Node.js nao encontrado no PATH." -ForegroundColor Red
    Write-Host "  Baixe em: https://nodejs.org/dist/latest-v22.x/" -ForegroundColor Yellow
    exit 1
}
$nodeVer = (& node --version 2>$null).TrimStart('v')
$nodeMajor = [int]($nodeVer.Split('.')[0])
if ($nodeMajor -lt 22) {
    Write-Host "  ERRO: Node.js $nodeVer encontrado, mas requer >= 22." -ForegroundColor Red
    Write-Host "  Baixe em: https://nodejs.org/dist/latest-v22.x/" -ForegroundColor Yellow
    exit 1
}
Write-Host "  Node.js $nodeVer OK" -ForegroundColor Green

# Instalar
Write-Host "  Instalando $pkg ..." -ForegroundColor Cyan
& npm install -g $pkg@latest
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERRO: npm install falhou (exit $LASTEXITCODE)." -ForegroundColor Red
    exit 1
}

# Verificar
$ver = (& lyacode --version 2>$null)
if ($LASTEXITCODE -ne 0) {
    Write-Host "  AVISO: lyacode instalado mas nao encontrado no PATH." -ForegroundColor Yellow
    Write-Host "  Rode: npm config get prefix  — e adicione o diretorio bin ao PATH." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "  $ver instalado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "  Como usar:" -ForegroundColor White
Write-Host "    lya              # iniciar o agente" -ForegroundColor DarkCyan
Write-Host "    lya /lya         # ativar persona Lya" -ForegroundColor DarkCyan
Write-Host "    lya /provider    # configurar provedor de IA" -ForegroundColor DarkCyan
Write-Host "    lya /help        # ver todos os comandos" -ForegroundColor DarkCyan
Write-Host ""
Write-Host "  Desinstalar:" -ForegroundColor White
Write-Host "    npm uninstall -g @studiocodeai/lyacode" -ForegroundColor DarkRed
Write-Host ""
