<#
  LyaCode — teste de sideload do MSIX (validar lançamento antes da Store)
  Reproduz o que o certificador faz: instala o pacote e abre pelo tile.
  Requer: rodar como ADMINISTRADOR (instalar cert no Trusted Root).

  Uso:
    powershell -ExecutionPolicy Bypass -File test-sideload.ps1
#>

$ErrorActionPreference = "Stop"
$MSIX     = "E:\GitHub\LyaCode\dist\installer\lyacode-1.2.0.msix"
$PUB      = "CN=01417B77-C5A9-404C-9F0B-FA0F17FBC808"   # = Publisher do AppxManifest
$CERT_PFX = "$env:TEMP\lyacode-test.pfx"
$certPw      = ConvertTo-SecureString "lyatest" -AsPlainText -Force

if (-not (Test-Path $MSIX)) { throw "MSIX nao encontrado: $MSIX" }

Write-Host "[1] Criando certificado de teste (subject = Publisher do manifesto)..."
$cert = New-SelfSignedCertificate -Type Custom -Subject $PUB `
  -KeyUsage DigitalSignature -FriendlyName "LyaCode Test" `
  -CertStoreLocation "Cert:\CurrentUser\My" `
  -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.3", "2.5.29.19={text}")
Export-PfxCertificate -Cert $cert -FilePath $CERT_PFX -Password $certPw | Out-Null

Write-Host "[2] Confiando no certificado (Trusted Root + Trusted People)..."
Import-PfxCertificate -FilePath $CERT_PFX -Password $certPw -CertStoreLocation "Cert:\LocalMachine\Root"           | Out-Null
Import-PfxCertificate -FilePath $CERT_PFX -Password $certPw -CertStoreLocation "Cert:\LocalMachine\TrustedPeople"   | Out-Null

Write-Host "[3] Assinando o MSIX..."
$signtool = (Get-ChildItem "C:\Program Files (x86)\Windows Kits\10\bin\*\x64\signtool.exe" |
             Sort-Object FullName -Descending | Select-Object -First 1).FullName
& $signtool sign /fd SHA256 /a /f $CERT_PFX /p "lyatest" $MSIX
if ($LASTEXITCODE -ne 0) { throw "signtool falhou" }

Write-Host "[4] Instalando o pacote..."
try { Remove-AppxPackage -Package (Get-AppxPackage -Name "StudioCodeAI.LyaCode").PackageFullName -ErrorAction Stop } catch {}
Add-AppxPackage -Path $MSIX

$pkg = Get-AppxPackage -Name "StudioCodeAI.LyaCode"
Write-Host "  Instalado: $($pkg.PackageFullName)"

Write-Host "[5] Abrindo pelo tile (como o certificador faz)..."
$appId = (Get-AppxPackageManifest $pkg).Package.Applications.Application.Id
Start-Process "shell:AppsFolder\$($pkg.PackageFamilyName)!$appId"

Write-Host ""
Write-Host "==> Uma janela de terminal do LyaCode deve abrir e PERMANECER aberta."
Write-Host "    Se abrir e ficar viva  = certificacao 10.1.2.10 resolvida."
Write-Host "    Se piscar/fechar/travar = capturar erro em: Visualizador de Eventos > Aplicativo"
Write-Host ""
Write-Host "Para desinstalar depois:"
Write-Host "  Remove-AppxPackage $($pkg.PackageFullName)"
