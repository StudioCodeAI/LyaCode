<#  LyaCode — sideload + launch test (roda ELEVADO). Loga tudo em dist/installer/sideload-test.log  #>
$ErrorActionPreference = 'Stop'
$log = 'E:\GitHub\LyaCode\dist\installer\sideload-test.log'
function Log($m){ $line = "[{0}] {1}" -f (Get-Date -Format HH:mm:ss), $m; Add-Content -Path $log -Value $line }
Set-Content -Path $log -Value "=== LyaCode sideload test $(Get-Date) ==="

try {
  $src  = 'E:\GitHub\LyaCode\dist\installer\lyacode-1.2.0.msix'
  $test = 'E:\GitHub\LyaCode\dist\installer\lyacode-1.2.0-test-signed.msix'
  $pub  = 'CN=01417B77-C5A9-404C-9F0B-FA0F17FBC808'   # == Publisher do AppxManifest
  $pfx  = "$env:TEMP\lyacode-test.pfx"
  $pw   = ConvertTo-SecureString 'lyatest' -AsPlainText -Force

  Copy-Item $src $test -Force
  Log "copia de teste criada: $test"

  Log "criando cert self-signed (subject=$pub)..."
  $cert = New-SelfSignedCertificate -Type CodeSigningCert -Subject $pub `
            -CertStoreLocation Cert:\CurrentUser\My -KeyUsage DigitalSignature `
            -FriendlyName 'LyaCode Test Cert' -NotAfter (Get-Date).AddYears(1)
  Export-PfxCertificate -Cert $cert -FilePath $pfx -Password $pw | Out-Null
  Import-PfxCertificate -FilePath $pfx -Password $pw -CertStoreLocation Cert:\LocalMachine\Root         | Out-Null
  Import-PfxCertificate -FilePath $pfx -Password $pw -CertStoreLocation Cert:\LocalMachine\TrustedPeople | Out-Null
  Log "cert confiado em Root + TrustedPeople"

  $signtool = (Get-ChildItem 'C:\Program Files (x86)\Windows Kits\10\bin\*\x64\signtool.exe' -ErrorAction SilentlyContinue |
               Sort-Object FullName -Descending | Select-Object -First 1).FullName
  if (-not $signtool) { throw "signtool.exe nao encontrado" }
  Log "signtool: $signtool"
  $out = & $signtool sign /fd SHA256 /a /f $pfx /p 'lyatest' $test 2>&1
  $out | ForEach-Object { Log "  signtool> $_" }
  if ($LASTEXITCODE -ne 0) { throw "signtool falhou (exit=$LASTEXITCODE)" }
  Log "MSIX de teste assinado OK"

  $existing = Get-AppxPackage -Name StudioCodeAI.LyaCode -ErrorAction SilentlyContinue
  if ($existing) { Remove-AppxPackage $existing.PackageFullName; Log "pacote anterior removido" }
  Add-AppxPackage -Path $test
  $pkg = Get-AppxPackage -Name StudioCodeAI.LyaCode
  if (-not $pkg) { throw "Add-AppxPackage nao instalou" }
  Log "INSTALADO: $($pkg.PackageFullName)"

  $appId = (Get-AppxPackageManifest $pkg).Package.Applications.Application.Id
  $aumid = "$($pkg.PackageFamilyName)!$appId"
  Log "lancando pelo tile: shell:AppsFolder\$aumid"
  Start-Process "shell:AppsFolder\$aumid"

  Start-Sleep -Seconds 12
  $node  = Get-Process node          -ErrorAction SilentlyContinue | Where-Object { $_.Path -like '*WindowsApps*LyaCode*' }
  $setup = Get-Process lyacode-setup -ErrorAction SilentlyContinue | Where-Object { $_.Path -like '*WindowsApps*LyaCode*' }
  Log ("apos 12s -> launcher_vivo={0}  node_vivo={1}" -f [bool]$setup, [bool]$node)

  if ($node) {
    Log "RESULTADO: PASS  — node vivo (PID $($node.Id), CPU $([math]::Round($node.CPU,2))s). Sessao interativa OK, NAO trava no lancamento."
  } else {
    Log "RESULTADO: FAIL  — node nao esta vivo. Coletando eventos de erro..."
    Get-WinEvent -LogName Application -MaxEvents 40 -ErrorAction SilentlyContinue |
      Where-Object { $_.TimeCreated -gt (Get-Date).AddMinutes(-3) -and
                     ($_.Message -match 'LyaCode|lyacode|node\.exe|\.NET Runtime|Application Error|AppModel') } |
      Select-Object -First 6 | ForEach-Object { Log ("  EVT[{0}/{1}] {2}" -f $_.Id, $_.ProviderName, ($_.Message -replace '\s+',' ').Substring(0,[math]::Min(300,$_.Message.Length))) }
  }
  Log "DONE"
} catch {
  Log "ERRO: $($_.Exception.Message)"
  Log "DONE"
}
