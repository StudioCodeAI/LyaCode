; IExpress SED for Lya Code
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
DisplayLicense=scripts\installer\windows\LICENSE.rtf
FinishMessage=Lya Code instalado com sucesso.
TargetName=%TEMP%\lyacode-setup
FriendlyName=Lya Code Setup
AppLaunched=cmd.exe /c powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%TEMP%\lyacode-setup\install.ps1"
PostInstallCmd=<None>
[SourceFiles]
SourceFilesPath=scripts\installer\windows\
SourceFiles0=install.ps1
SourceFiles1=LICENSE.rtf
SourceFiles2=studiocodeai-lyacode-1.1.1.tgz