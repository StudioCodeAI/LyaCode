@echo off
REM Lya Cloud Windows Installer launcher
REM Luis Cardozo · studiocoder.ai@gmail.com · Studio CodeAI
REM
REM Usage: install.cmd [/D] [/T:<tarball>] [/Y]
REM   /D           Dry run (nao instala, so mostra)
REM   /T:<tgz>     Caminho do tarball (default: .\studiocodeai-lyacloud-1.0.1.tgz)
REM   /Y           Suprime atalhos no Menu Iniciar
REM
REM Para buildar um .exe auto-extraivel:
REM   iexpress /N:lyacloud-setup-x64.sed /O:..\..\..\dist\installer\lyacloud-setup-x64-1.0.3.exe

setlocal

set "ARGS="
set "TARBALL="

:parse
if "%~1"=="" goto :end_parse
if /I "%~1"=="/D" set "ARGS=%ARGS% -DryRun" & shift & goto :parse
if /I "%~1"=="/Y" set "ARGS=%ARGS% -NoShortcuts" & shift & goto :parse
if /I "%~1"=="/T" (
  set "TARBALL=%~2"
  shift & shift & goto :parse
)
if /I "%~1"=="/?" (
  echo Usage: %~nx0 [/D] [/T:tarball] [/Y]
  exit /b 0
)
shift & goto :parse

:end_parse

if "%TARBALL%"=="" set "TARBALL=%~dp0studiocodeai-lyacloud-1.0.3.tgz"

echo.
echo  Lya Cloud v1.0.3 - Installer Windows
echo  Familia Studio CodeAI
echo.
echo  Requisitos: Node.js 22 LTS ou superior
echo  Download: https://nodejs.org/dist/latest-v22.x/
echo.
echo  Tarball: %TARBALL%
echo.

where powershell >nul 2>&1
if errorlevel 1 (
  echo [ERRO] PowerShell nao encontrado. Requer Windows 7 ou superior.
  exit /b 1
)

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0install.ps1" -Tarball "%TARBALL%" %ARGS%
exit /b %ERRORLEVEL%
