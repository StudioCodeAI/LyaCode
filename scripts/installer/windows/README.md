# Lya Code Windows Installer

Conjunto de scripts para distribuir o Lya Code como instalador nativo
Windows sem dependências externas (sem Inno Setup, sem NSIS).

## Como funciona

1. O usuário faz download de `lyacode-setup-x64-0.1.0.exe` (gerado por IExpress)
2. Clica duas vezes no `.exe`
3. O IExpress extrai `install.ps1` + `studiocodeai-lyacode-0.1.0.tgz` para `%TEMP%\lyacode-setup\`
4. Roda `cmd.exe /c powershell.exe -NoProfile -ExecutionPolicy Bypass -File install.ps1`
5. O PowerShell:
   - Detecta Node.js ≥ 22 (ou aborta com link de download)
   - Roda `npm install -g <tarball>` com progresso visível
   - Valida `lyacode --version` e todos os 5 aliases
   - Cria atalhos no Menu Iniciar (Iniciar → Lya Code → lyacode.cmd)
   - Log completo em `%LOCALAPPDATA%\lyacode\lyacode-setup-<timestamp>.log`

## Como buildar o `.exe`

Pré-requisitos:
- Windows 10/11 com `iexpress.exe` (já vem com Windows)
- Tarball `studiocodeai-lyacode-0.1.0.tgz` na raiz do repo (gerado por `npm pack`)

Comandos (PowerShell):
```powershell
# 1. Buildar tarball
npm pack

# 2. Validar instalador PowerShell standalone (sem .exe)
cd scripts\installer\windows
powershell -ExecutionPolicy Bypass -File .\install.ps1
# ou
.\install.cmd

# 3. Gerar o .exe auto-extraível
iexpress /N:.\lyacode-setup-x64.sed /O:..\..\..\dist\installer\lyacode-setup-x64-0.1.0.exe
```

Resultado: `dist\installer\lyacode-setup-x64-0.1.0.exe` — single-file installer.

## Flags

- `/D` — Dry run (mostra comandos sem executar)
- `/T:<path>` — Caminho do tarball (default: `./studiocodeai-lyacode-0.1.0.tgz`)
- `/Y` — Suprime criação de atalhos no Menu Iniciar

## Distribuição

Distribua o `.exe` em:
- GitHub Releases (asset do tag v0.1.0)
- Site público quando for lançado (`web/dist/download`)

## Instalação manual (fallback)

Se o `.exe` falhar ou se preferir:

```powershell
# 1. Instalar Node.js 22 LTS
winget install OpenJS.NodeJS.LTS

# 2. Gerar tarball
cd E:\GitHub\lyacode-main
npm pack

# 3. Instalar global
npm install -g .\studiocodeai-lyacode-0.1.0.tgz

# 4. Validar
lyacode --version
lscloud --version
lya --version
lyacode --version
lscode --version
```

## Desinstalação

```powershell
npm uninstall -g @studiocodeai/lyacode
```

Para remover atalhos do Menu Iniciar manualmente:
```
%APPDATA%\Microsoft\Windows\Start Menu\Programs\Lya Code\
```

## Versão política

- `v0.x.y` (teste) → este instalador
- `v1.0.0+` (produção) → instalador com assinatura de código e Microsoft SmartScreen trust
