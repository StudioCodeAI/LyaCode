# release-v1.0.0.ps1
# Script completo de release: build + git + tag + push
# Studio CodeAI · Luis Cardozo · Lya Code v1.0.0
#
# Uso: .\release-v1.0.0.ps1
# Ou em uma linha: powershell -ExecutionPolicy Bypass -File .\release-v1.0.0.ps1

$ErrorActionPreference = "Stop"

function Step($n, $msg) {
    Write-Host ""
    Write-Host "===========================================" -ForegroundColor Cyan
    Write-Host "  [$n] $msg" -ForegroundColor Yellow
    Write-Host "===========================================" -ForegroundColor Cyan
}

function Check($cmd, $name) {
    try {
        & $cmd --version | Out-Null
        Write-Host "  [OK] $name encontrado" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "  [ERRO] $name nao encontrado no PATH" -ForegroundColor Red
        return $false
    }
}

# Pré-requisitos
Step "0" "Verificando pre-requisitos"
$ok = $true
if (-not (Check "bun" "Bun")) { $ok = $false }
if (-not (Check "node" "Node.js")) { $ok = $false }
if (-not (Check "git" "Git")) { $ok = $false }
if (-not $ok) {
    Write-Host ""
    Write-Host "Instale o que faltar antes de continuar." -ForegroundColor Red
    exit 1
}

# Diretório do projeto
Set-Location "E:\GitHub\lyacode-main"
Write-Host "  CWD: $(Get-Location)" -ForegroundColor Gray

# 1. Install
Step "1/6" "bun install (instalando dependencias)"
bun install
if ($LASTEXITCODE -ne 0) { Write-Host "FALHOU em bun install" -ForegroundColor Red; exit 1 }

# 2. Build
Step "2/6" "bun run build (buildando CLI)"
bun run build
if ($LASTEXITCODE -ne 0) { Write-Host "FALHOU em bun run build" -ForegroundColor Red; exit 1 }

# 3. Smoke test
Step "3/6" "bun run smoke (sanity check)"
bun run smoke
if ($LASTEXITCODE -ne 0) {
    Write-Host "AVISO: smoke test falhou. Continuar? (S/N)" -ForegroundColor Yellow
    $resp = Read-Host
    if ($resp -ne "S" -and $resp -ne "s") { exit 1 }
}

# 4. Build do .exe Windows
Step "4/6" "bun run build:installer:windows (.exe + .tgz)"
bun run build:installer:windows
if ($LASTEXITCODE -ne 0) {
    Write-Host "AVISO: installer falhou. Continuar com git? (S/N)" -ForegroundColor Yellow
    $resp = Read-Host
    if ($resp -ne "S" -and $resp -ne "s") { exit 1 }
}

# 5. Git commit + tag
Step "5/6" "Git: commit + tag v1.0.0"

# Verificar se tem mudanças
$status = git status --porcelain
if ([string]::IsNullOrEmpty($status)) {
    Write-Host "  Nenhuma mudanca pra commitar. Pulando commit." -ForegroundColor Gray
} else {
    git add -A
    git commit -m "release: v1.0.0 - producao estavel

- Wordmark blocky 10-line (Lya Code)
- Provider list reordenada (Ollama Local 1o, Auto ultimo)
- Versao 0.1.0 -> 1.0.0 (producao)
- README polido com instalacao via GitHub Releases
- Workflow .github/workflows/release.yml (build automatico)

Refs: Studio CodeAI · Luis Cardozo"
    if ($LASTEXITCODE -ne 0) { Write-Host "FALHOU em git commit" -ForegroundColor Red; exit 1 }
}

# Verificar se a tag ja existe
$tagExists = git tag -l "v1.0.0"
if ($tagExists) {
    Write-Host "  Tag v1.0.0 ja existe. Apagando para recriar..." -ForegroundColor Yellow
    git tag -d v1.0.0 | Out-Null
}
git tag -a v1.0.0 -m "Lya Code v1.0.0 - producao estavel"
if ($LASTEXITCODE -ne 0) { Write-Host "FALHOU em git tag" -ForegroundColor Red; exit 1 }

# 6. Push
Step "6/6" "Git push (main + tag v1.0.0)"
Write-Host "  Vai fazer push para origin/main + tag v1.0.0" -ForegroundColor Yellow
Write-Host "  Isso dispara o GitHub Actions e gera o release publico." -ForegroundColor Yellow
Write-Host "  Continuar? (S/N)" -ForegroundColor Yellow
$resp = Read-Host
if ($resp -ne "S" -and $resp -ne "s") {
    Write-Host "  Push cancelado. Build local OK em dist/installer/" -ForegroundColor Gray
    exit 0
}

git push origin main
if ($LASTEXITCODE -ne 0) { Write-Host "FALHOU em git push main" -ForegroundColor Red; exit 1 }

git push origin v1.0.0
if ($LASTEXITCODE -ne 0) { Write-Host "FALHOU em git push tag" -ForegroundColor Red; exit 1 }

# Sucesso
Write-Host ""
Write-Host "===========================================" -ForegroundColor Green
Write-Host "  LYA CLOUD v1.0.0 - RELEASE COMPLETO" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Acompanhe o build em:" -ForegroundColor Cyan
Write-Host "  https://github.com/StudioCodeAI/lyacode/actions" -ForegroundColor White
Write-Host ""
Write-Host "  Release final aparecera em:" -ForegroundColor Cyan
Write-Host "  https://github.com/StudioCodeAI/lyacode/releases/tag/v1.0.0" -ForegroundColor White
Write-Host ""
Write-Host "  Artefatos locais em: dist/installer/" -ForegroundColor Cyan
Get-ChildItem -Path "dist/installer" -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "    - $($_.Name)" -ForegroundColor Gray
}
Write-Host ""
