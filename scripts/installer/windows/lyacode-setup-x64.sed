; IExpress SED file for Lya Code Windows Installer
; Luis Cardozo Ã‚Â· studiocoder.ai@gmail.com Ã‚Â· Studio CodeAI
;
; Build:
;   iexpress /N:scripts\installer\windows\lyacode-setup-x64.sed /O:dist\installer\lyacode-setup-x64-1.0.6.exe
;
; Result: single self-extracting .exe that drops install.ps1 + tarball
; into a temp dir and runs install.ps1. No admin required.

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
InstallPrompt=Instalar Lya Code Ã¢â‚¬â€ CLI agentic da familia Studio CodeAI
DisplayLicense=scripts\installer\windows\LICENSE.rtf
FinishMessage=Lya Code instalado com sucesso.
TargetName=%TEMP%\lyacode-setup
FriendlyName=Lya Code Setup
AppLaunched=cmd.exe /c powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%TEMP%\lyacode-setup\install.ps1"
PostInstallCmd=<None>
[SourceFiles]
SourceFilesPath=scripts\installer\windows\
SourceFiles=install.ps1
; The tarball is referenced from the repo root, not the SED path. Use a
; SourceFiles0.. entry with an absolute path instead.
SourceFiles0=studiocodeai-lyacode-1.0.6.tgz
SourceFiles1=scripts\installer\windows\install.ps1
SourceFiles2=scripts\installer\windows\LICENSE.rtf
[SourceFiles0]
SourceFilesPath=\
SourceFiles0=studiocodeai-lyacode-1.0.6.tgz
[SourceFiles1]
SourceFilesPath=\
SourceFiles0=scripts\installer\windows\install.ps1
[SourceFiles2]
SourceFilesPath=\
SourceFiles0=scripts\installer\windows\LICENSE.rtf
[Strings]
FriendlyName=lyacode-setup
PostInstallCmd=
AdminQuietInstallCmd=
UserQuietInstallCmd=
