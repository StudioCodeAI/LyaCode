# fix-and-rerelease.ps1
# Limpa lixo, commita correcoes, recria tag v1.0.0 e re-dispara o GitHub Actions
# Studio CodeAI · Luis Cardozo · Lya Code v1.0.0

$ErrorActionPreference = "Stop"

function Step($n, $msg) {
    Write-Host ""
    Write-Host "===========================================" -ForegroundColor Cyan
    Write-Host "  [$n] $msg" -ForegroundColor Yellow
    Write-Host "===========================================" -ForegroundColor Cyan
}

Set-Location "E:\GitHub\lyacode-main"
Write-Host "  CWD: $(Get-Location)" -ForegroundColor Gray

# 1. Limpar lixo da v0.1.0
Step "1/7" "Limpando lixo da v0.1.0"

# Remover tarball antigo da raiz
if (Test-Path ".\studiocodeai-lyacode-0.1.0.tgz") {
    Remove-Item -Force ".\studiocodeai-lyacode-0.1.0.tgz"
    Write-Host "  Removido: studiocodeai-lyacode-0.1.0.tgz" -ForegroundColor Green
}

# Remover tarball novo da raiz (gerado pelo build, nao precisa estar no git)
if (Test-Path ".\studiocodeai-lyacode-1.0.0.tgz") {
    Remove-Item -Force ".\studiocodeai-lyacode-1.0.0.tgz"
    Write-Host "  Removido: studiocodeai-lyacode-1.0.0.tgz (sera regenerado)" -ForegroundColor Green
}

# Remover pasta portable antiga
if (Test-Path ".\dist\installer\lyacode-portable-0.1.0") {
    Remove-Item -Force -Recurse ".\dist\installer\lyacode-portable-0.1.0"
    Write-Host "  Removida pasta: dist/installer/lyacode-portable-0.1.0" -ForegroundColor Green
}

# Remover do git tracking (caso ja tenham sido commitados antes)
git rm --cached studiocodeai-lyacode-0.1.0.tgz 2>$null | Out-Null
git rm --cached studiocodeai-lyacode-1.0.0.tgz 2>$null | Out-Null
Write-Host "  Limpeza do git tracking (se aplicavel)" -ForegroundColor Green

# 2. Rebuild
Step "2/7" "Rebuild (com correcoes do .sed, install.ps1, install.cmd, build-windows.ts)"
bun run build
if ($LASTEXITCODE -ne 0) { Write-Host "FALHOU em build" -ForegroundColor Red; exit 1 }

# 3. Rebuild installer (agora gera .zip alem do tentar .exe)
Step "3/7" "Rebuild do installer (.tgz + .zip + tentativa .exe)"
bun run build:installer:windows
if ($LASTEXITCODE -ne 0) {
    Write-Host "AVISO: installer falhou parcialmente, mas .zip e .tgz podem ter sido gerados" -ForegroundColor Yellow
}

# 4. Status do git
Step "4/7" "Status do git"
$status = git status --porcelain
if ([string]::IsNullOrEmpty($status)) {
    Write-Host "  Nenhuma mudanca pra commitar." -ForegroundColor Gray
} else {
    Write-Host "  Mudancas detectadas:" -ForegroundColor Yellow
    git status --short
}

# 5. Commit
Step "5/7" "Commit das correcoes"

if (-not [string]::IsNullOrEmpty($status)) {
    git add -A
    git commit -m "fix: corrige referencias v0.1.0 -> v1.0.0 no installer

- scripts/installer/windows/lyacode-setup-x64.sed (paths do tarball)
- scripts/installer/windows/install.ps1 (versao + nome do tarball)
- scripts/installer/windows/install.cmd (versao + nome do tarball)
- scripts/installer/build-windows.ts (gera .zip do portable)
- .github/workflows/release.yml (fail_on_unmatched_files + instalacao tarball)
- .gitignore (ignora *.tgz)

Refs: Studio CodeAI · Luis Cardozo · v1.0.0 release fix"
    if ($LASTEXITCODE -ne 0) { Write-Host "FALHOU em git commit" -ForegroundColor Red; exit 1 }
}

# 6. Deletar tag v1.0.0 antiga (local + remota) e recriar
Step "6/7" "Recriar tag v1.0.0 (vai re-disparar o GitHub Actions)"

Write-Host "  Apagando tag v1.0.0 local..." -ForegroundColor Yellow
git tag -d v1.0.0 2>$null | Out-Null

Write-Host "  Apagando tag v1.0.0 remota..." -ForegroundColor Yellow
git push --delete origin v1.0.0 2>$null
# Mesmo se a tag remota nao existir mais, prosseguimos

Write-Host "  Apagando release v1.0.0 no GitHub (se existir)..." -ForegroundColor Yellow
Write-Host "  ATENCAO: voce pode precisar deletar manualmente em:" -ForegroundColor Yellow
Write-Host "  https://github.com/StudioCodeAI/lyacode/releases/tag/v1.0.0" -ForegroundColor White

Write-Host ""
Write-Host "  Quer continuar e recriar a tag? (S/N)" -ForegroundColor Yellow
$resp = Read-Host
if ($resp -ne "S" -and $resp -ne "s") {
    Write-Host "  Cancelado pelo usuario. Commit local foi feito mas nao foi pushado." -ForegroundColor Gray
    exit 0
}

# Push das mudancas
git push origin main
if ($LASTEXITCODE -ne 0) { Write-Host "FALHOU em git push main" -ForegroundColor Red; exit 1 }

# Recriar a tag
git tag -a v1.0.0 -m "Lya Code v1.0.0 - producao estavel"
git push origin v1.0.0
if ($LASTEXITCODE -ne 0) { Write-Host "FALHOU em git push tag" -ForegroundColor Red; exit 1 }

# 7. Sucesso
Step "7/7" "RELEASE v1.0.0 RE-DISPARADO"

Write-Host ""
Write-Host "===========================================" -ForegroundColor Green
Write-Host "  LYA CLOUD v1.0.0 - RE-RELEASE COMPLETO" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Acompanhe o build (deve levar ~5-10 min):" -ForegroundColor Cyan
Write-Host "  https://github.com/StudioCodeAI/lyacode/actions" -ForegroundColor White
Write-Host ""
Write-Host "  Release final aparecera em:" -ForegroundColor Cyan
Write-Host "  https://github.com/StudioCodeAI/lyacode/releases/tag/v1.0.0" -ForegroundColor White
Write-Host ""
Write-Host "  ENQUANTO ESPERA, voce pode testar a versao local:" -ForegroundColor Cyan
Write-Host "    npm install -g .\studiocodeai-lyacode-1.0.0.tgz" -ForegroundColor White
Write-Host "    lya --version" -ForegroundColor White
Write-Host ""
Write-Host "  COMANDO DE INSTALACAO publico (apos o release ficar pronto):" -ForegroundColor Cyan
Write-Host "    npm install -g https://github.com/StudioCodeAI/lyacode/releases/download/v1.0.0/studiocodeai-lyacode-1.0.0.tgz" -ForegroundColor White
Write-Host ""
