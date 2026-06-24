<#
  Lya Code — Full Windows Installer Builder
  Gera: .exe (IExpress) + .msi (WiX) + .msix (makeappx)
  Luis Cardozo — Studio CodeAI
#>

$ErrorActionPreference = "Stop"

$VERSION       = "1.2.0"
$REPO_ROOT     = Resolve-Path "$PSScriptRoot\..\.."
$OUT_DIR       = "$REPO_ROOT\dist\installer"
$WIN_DIR       = "$PSScriptRoot\windows"
$MSIX_DIR      = "$PSScriptRoot\msix"
$WIX_BIN       = "C:\Users\LuisCard\tools\wix3"
$MAKEAPPX      = "C:\Program Files (x86)\Windows Kits\10\bin\10.0.26100.0\x64\makeappx.exe"
$PORTABLE_DIR  = "$OUT_DIR\lyacode-portable-$VERSION"
$TARBALL       = "$REPO_ROOT\studiocodeai-lyacode-$VERSION.tgz"

function Step { param($n, $msg) Write-Host "`n[$n] $msg..." -ForegroundColor Cyan }
function OK   { param($msg)     Write-Host "  OK: $msg" -ForegroundColor Green }
function WARN { param($msg)     Write-Host "  WARN: $msg" -ForegroundColor Yellow }
function FAIL { param($msg)     Write-Host "  FAIL: $msg" -ForegroundColor Red; exit 1 }

Write-Host "=== Lya Code Full Windows Installer Builder ===" -ForegroundColor Magenta
Write-Host "Version : $VERSION"
Write-Host "Repo    : $REPO_ROOT"
Write-Host "Output  : $OUT_DIR"

New-Item -ItemType Directory -Force -Path $OUT_DIR | Out-Null

# ---------------------------------------------------------------------------
# 0. Validate prerequisites
# ---------------------------------------------------------------------------
Step "0/4" "Validating prerequisites"
if (-not (Test-Path $TARBALL))     { FAIL "Tarball not found: $TARBALL — run: npm pack" }
if (-not (Test-Path $PORTABLE_DIR)){ FAIL "Portable dir not found: $PORTABLE_DIR — run: bun run build:installer:windows" }
if (-not (Test-Path "$WIX_BIN\candle.exe")) { FAIL "WiX candle.exe not found at $WIX_BIN" }
if (-not (Test-Path $MAKEAPPX))    { FAIL "makeappx.exe not found at $MAKEAPPX" }
OK "All prerequisites present"

# ---------------------------------------------------------------------------
# 1. Build .exe (IExpress)
# ---------------------------------------------------------------------------
Step "1/4" "Building .exe (IExpress)"

$exeOut = "$OUT_DIR\lyacode-setup-x64-$VERSION.exe"

# Generate SED with absolute paths at runtime
$sedContent = @"
[Version]
Class=IEXPRESS
SEDVersion=3
[Options]
PackagePurpose=InstallApp
ShowInstallProgramWindow=1
HideExtractAnimation=0
UseLongFileName=1
InsideCompressed=2
CAB_FixedSize=0
CAB_ReserveCode=0
RebootMode=N
InstallPrompt=Instalar Lya Code — Studio CodeAI
DisplayLicense=$WIN_DIR\LICENSE.rtf
FinishMessage=Lya Code instalado com sucesso!
TargetName=$exeOut
FriendlyName=Lya Code Setup $VERSION
AppLaunched=cmd.exe /c powershell.exe -NoProfile -ExecutionPolicy Bypass -File install.ps1
PostInstallCmd=<None>
[SourceFiles]
SourceFilesPath=$PORTABLE_DIR\
SourceFiles0=install.ps1
SourceFiles1=install.cmd
SourceFiles2=LICENSE.rtf
SourceFiles3=studiocodeai-lyacode-$VERSION.tgz
"@

$sedPath = "$OUT_DIR\lyacode-setup-x64-$VERSION.sed"
$sedContent | Set-Content -Path $sedPath -Encoding ASCII

if (Test-Path $exeOut) { Remove-Item $exeOut -Force }
$result = Start-Process "iexpress.exe" -ArgumentList "/Q /N `"$sedPath`"" -Wait -PassThru -NoNewWindow
if ($result.ExitCode -eq 0 -and (Test-Path $exeOut)) {
  $size = [math]::Round((Get-Item $exeOut).Length / 1MB, 1)
  OK "lyacode-setup-x64-$VERSION.exe ($size MB)"
} else {
  WARN "iexpress failed (exit=$($result.ExitCode)). Skipping .exe."
}

# ---------------------------------------------------------------------------
# 2. Build .msi (WiX)
# ---------------------------------------------------------------------------
Step "2/4" "Building .msi (WiX v3)"

$wxsPath    = "$WIN_DIR\lyacode.wxs"
$wixobjPath = "$OUT_DIR\lyacode.wixobj"
$msiOut     = "$OUT_DIR\lyacode-setup-x64-$VERSION.msi"
$wixExtPath = "$WIX_BIN\WixUIExtension.dll"

# Candle: compile .wxs → .wixobj
$candleArgs = @(
  "`"$wxsPath`""
  "-out", "`"$wixobjPath`""
  "-arch", "x64"
  "-dVERSION=$VERSION"
)
$candle = Start-Process "$WIX_BIN\candle.exe" -ArgumentList $candleArgs -Wait -PassThru -NoNewWindow
if ($candle.ExitCode -ne 0) { FAIL "candle.exe failed (exit=$($candle.ExitCode))" }
OK "candle.exe compiled wxs → wixobj"

# Light: link .wixobj → .msi
if (Test-Path $msiOut) { Remove-Item $msiOut -Force }
$lightArgs = @(
  "`"$wixobjPath`""
  "-ext", "`"$wixExtPath`""
  "-out", "`"$msiOut`""
  "-b", "`"$WIN_DIR`""
  "-b", "`"$PORTABLE_DIR`""
  "-sice:ICE91"
  "-spdb"
)
$light = Start-Process "$WIX_BIN\light.exe" -ArgumentList $lightArgs -Wait -PassThru -NoNewWindow
if ($light.ExitCode -eq 0 -and (Test-Path $msiOut)) {
  $size = [math]::Round((Get-Item $msiOut).Length / 1MB, 1)
  OK "lyacode-setup-x64-$VERSION.msi ($size MB)"
} else {
  FAIL "light.exe failed (exit=$($light.ExitCode))"
}

# ---------------------------------------------------------------------------
# 3. Build .msix (makeappx) — self-contained: node.exe + cli.mjs bundled
# ---------------------------------------------------------------------------
Step "3/4" "Building .msix (makeappx — self-contained)"

$msixStaging  = "$OUT_DIR\msix-staging"
$msixOut      = "$OUT_DIR\lyacode-$VERSION.msix"
$launcherSrc  = "$MSIX_DIR\launcher.cs"
$launcherExe  = "$MSIX_DIR\lyacode-setup.exe"
$csc          = "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
$nodeExeSrc   = "C:\Program Files\nodejs\node.exe"
$cliMjsSrc    = "$REPO_ROOT\dist\cli.mjs"

# Validate prerequisites for MSIX build
if (-not (Test-Path $csc))        { FAIL "csc.exe nao encontrado: $csc" }
if (-not (Test-Path $nodeExeSrc)) { FAIL "node.exe nao encontrado: $nodeExeSrc" }
if (-not (Test-Path $cliMjsSrc))  { FAIL "cli.mjs nao encontrado: $cliMjsSrc — rode: bun run build" }

# Compile launcher.cs -> lyacode-setup.exe (launcher limpo, sem bootstrap externo)
Write-Host "  Compilando launcher.cs..." -ForegroundColor Gray
$cscResult = Start-Process $csc -ArgumentList @(
  "/nologo", "/optimize+", "/target:winexe",
  "/out:`"$launcherExe`"",
  "`"$launcherSrc`""
) -Wait -PassThru -NoNewWindow
if ($cscResult.ExitCode -ne 0) { FAIL "csc.exe falhou (exit=$($cscResult.ExitCode))" }
OK "launcher.cs compilado -> lyacode-setup.exe"

# Prepare staging folder
if (Test-Path $msixStaging) { Remove-Item $msixStaging -Recurse -Force }
New-Item -ItemType Directory -Force -Path $msixStaging | Out-Null

# Copy manifest and assets
Copy-Item "$MSIX_DIR\AppxManifest.xml"   "$msixStaging\"
Copy-Item "$MSIX_DIR\Assets"             "$msixStaging\Assets" -Recurse

# Payload: launcher + runtime (node.exe + cli.mjs) + license
# Nao copia install.ps1 / install.cmd / .tgz — nao sao mais necessarios no MSIX
Copy-Item "$launcherExe"  "$msixStaging\lyacode-setup.exe"
Copy-Item "$nodeExeSrc"   "$msixStaging\node.exe"
Copy-Item "$cliMjsSrc"    "$msixStaging\cli.mjs"
Copy-Item "$WIN_DIR\LICENSE.rtf" "$msixStaging\"

# CRITICO: cli.mjs externaliza pacotes (ver scripts/externals.ts COMMON_EXTERNALS)
# que NAO sao embutidos no bundle. Sem eles no pacote, o cli.mjs crasha no boot
# com ERR_MODULE_NOT_FOUND (ex: @orama/orama) => Store reprova em 10.1.2.10.
# Monta o closure de node_modules dos externals e o coloca ao lado do cli.mjs.
Write-Host "  Montando node_modules dos externals (COMMON_EXTERNALS)..." -ForegroundColor Gray
$externals = @(
  "@orama/orama@3.1.18", "@orama/plugin-data-persistence@3.1.18",
  "@vscode/ripgrep@1.18.0", "sharp@0.34.5", "google-auth-library@9.15.1",
  "@aws-sdk/client-bedrock@3.1047.0", "@aws-sdk/client-bedrock-runtime@3.1047.0",
  "@aws-sdk/client-sts@3.1047.0", "@aws-sdk/credential-providers@3.1047.0",
  "@azure/identity@latest"
)
$extDir = "$OUT_DIR\msix-externals"
if (Test-Path $extDir) { Remove-Item $extDir -Recurse -Force }
New-Item -ItemType Directory -Force -Path $extDir | Out-Null
Set-Content "$extDir\package.json" '{ "name":"lya-externals","version":"1.0.0","private":true }'
Push-Location $extDir
& npm install --omit=dev --no-audit --no-fund @externals 2>&1 | Out-Null
Pop-Location
# @vscode/ripgrep nao baixa o binario via postinstall offline; traz do repo
$rgRepo = "$REPO_ROOT\node_modules\@vscode\ripgrep-win32-x64"
if (Test-Path $rgRepo) {
  Copy-Item $rgRepo "$extDir\node_modules\@vscode\ripgrep-win32-x64" -Recurse -Force
}
if (-not (Test-Path "$extDir\node_modules\@vscode\ripgrep-win32-x64\bin\rg.exe")) {
  FAIL "rg.exe ausente no closure — ripgrep nao resolveria no pacote"
}
Copy-Item "$extDir\node_modules" "$msixStaging\node_modules" -Recurse -Force

$stagedFiles = (Get-ChildItem $msixStaging -Recurse -File).Count
OK "Staging folder: $msixStaging ($stagedFiles arquivos, com node_modules dos externals)"

# Run makeappx
if (Test-Path $msixOut) { Remove-Item $msixOut -Force }
$makeArgs = @("pack", "/d", "`"$msixStaging`"", "/p", "`"$msixOut`"", "/nv", "/o")
$makeappxProc = Start-Process $MAKEAPPX -ArgumentList $makeArgs -Wait -PassThru -NoNewWindow
if ($makeappxProc.ExitCode -eq 0 -and (Test-Path $msixOut)) {
  $size = [math]::Round((Get-Item $msixOut).Length / 1MB, 1)
  OK "lyacode-$VERSION.msix ($size MB) — self-contained (node.exe + cli.mjs bundled)"
  WARN "MSIX nao assinado. Use signtool antes de submeter a Store."
} else {
  FAIL "makeappx falhou (exit=$($makeappxProc.ExitCode))"
}

# ---------------------------------------------------------------------------
# 4. Summary
# ---------------------------------------------------------------------------
Step "4/4" "Output summary"
Write-Host ""
Get-ChildItem $OUT_DIR -File | Where-Object { $_.Name -match "$VERSION" } |
  Sort-Object Extension |
  ForEach-Object { Write-Host ("  {0,-50} {1,8:N1} MB" -f $_.Name, ($_.Length/1MB)) }

Write-Host "`n=== Done ===" -ForegroundColor Magenta
Write-Host "NOTE: .msix requires code signing before Microsoft Store submission." -ForegroundColor Yellow
