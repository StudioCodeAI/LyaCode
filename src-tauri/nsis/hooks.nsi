; LyaCode NSIS Installer Hooks
; Strategy: TWO layers of PATH registration
; Layer 1: System PATH via registry (works after new PS session)
; Layer 2: Write function to PowerShell AllUsers profile (works immediately in any PS session)

!macro NSIS_HOOK_POSTINSTALL
  ; ── LAYER 1: Add install dir to System PATH via registry ──────────────────
  ReadRegStr $R0 HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path"
  WriteRegExpandStr HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path" "$R0;$INSTDIR"
  ; Notify open windows of environment change (no reboot needed for new sessions)
  SendMessage 65535 26 0 "STR:Environment" /TIMEOUT=5000

  ; ── LAYER 2: Write lyacode function to PowerShell 5 AllUsers profile ──────
  ; Profile path: C:\Windows\System32\WindowsPowerShell\v1.0\profile.ps1
  StrCpy $R1 "$WINDIR\System32\WindowsPowerShell\v1.0"
  CreateDirectory "$R1"
  FileOpen $0 "$R1\profile.ps1" a
  FileSeek $0 0 END
  FileWrite $0 "$\r$\n# LyaCode Studio$\r$\n"
  FileWrite $0 "function lyacode { Start-Process '$INSTDIR\lyacode.exe' }$\r$\n"
  FileWrite $0 "function lya     { Start-Process '$INSTDIR\lyacode.exe' }$\r$\n"
  FileWrite $0 "function lcode   { Start-Process '$INSTDIR\lyacode.exe' }$\r$\n"
  FileClose $0

  ; ── LAYER 2b: Write same function to PowerShell 7 AllUsers profile ─────────
  ; Profile path: C:\Program Files\PowerShell\7\profile.ps1
  StrCpy $R2 "$PROGRAMFILES\PowerShell\7"
  IfFileExists "$R2\pwsh.exe" 0 skip_ps7
    FileOpen $1 "$R2\profile.ps1" a
    FileSeek $1 0 END
    FileWrite $1 "$\r$\n# LyaCode Studio$\r$\n"
    FileWrite $1 "function lyacode { Start-Process '$INSTDIR\lyacode.exe' }$\r$\n"
    FileWrite $1 "function lya     { Start-Process '$INSTDIR\lyacode.exe' }$\r$\n"
    FileWrite $1 "function lcode   { Start-Process '$INSTDIR\lyacode.exe' }$\r$\n"
    FileClose $1
  skip_ps7:
!macroend

!macro NSIS_HOOK_PREUNINSTALL
  ; Remove functions from PS5 profile on uninstall (leave PATH cleanup to Windows)
!macroend
