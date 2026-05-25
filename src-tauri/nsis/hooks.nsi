; LyaCode NSIS Installer Hooks
; Registers lyacode/lya/lcode in ALL PowerShell variants (x64 and x86, PS5 and PS7)

!macro NSIS_HOOK_POSTINSTALL
  ; ── LAYER 1: Add install dir to System PATH (HKLM) ──────────────────────────
  ReadRegStr $R0 HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path"
  WriteRegExpandStr HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path" "$R0;$INSTDIR"
  SendMessage 65535 26 0 "STR:Environment" /TIMEOUT=5000

  ; ── LAYER 2: PS5 64-bit — C:\Windows\System32\WindowsPowerShell\v1.0\ ───────
  StrCpy $R1 "$WINDIR\System32\WindowsPowerShell\v1.0"
  CreateDirectory "$R1"
  FileOpen $0 "$R1\profile.ps1" a
  FileSeek $0 0 END
  FileWrite $0 "$\r$\n# LyaCode Studio$\r$\n"
  FileWrite $0 "function lyacode { Start-Process '$INSTDIR\lyacode.exe' }$\r$\n"
  FileWrite $0 "function lya     { Start-Process '$INSTDIR\lyacode.exe' }$\r$\n"
  FileWrite $0 "function lcode   { Start-Process '$INSTDIR\lyacode.exe' }$\r$\n"
  FileClose $0

  ; ── LAYER 3: PS5 32-bit (x86) — C:\Windows\SysWOW64\WindowsPowerShell\v1.0\ ─
  StrCpy $R2 "$WINDIR\SysWOW64\WindowsPowerShell\v1.0"
  IfFileExists "$R2\powershell.exe" 0 skip_ps5_x86
    CreateDirectory "$R2"
    FileOpen $0 "$R2\profile.ps1" a
    FileSeek $0 0 END
    FileWrite $0 "$\r$\n# LyaCode Studio$\r$\n"
    FileWrite $0 "function lyacode { Start-Process '$INSTDIR\lyacode.exe' }$\r$\n"
    FileWrite $0 "function lya     { Start-Process '$INSTDIR\lyacode.exe' }$\r$\n"
    FileWrite $0 "function lcode   { Start-Process '$INSTDIR\lyacode.exe' }$\r$\n"
    FileClose $0
  skip_ps5_x86:

  ; ── LAYER 4: PS7 64-bit — C:\Program Files\PowerShell\7\ ────────────────────
  StrCpy $R3 "$PROGRAMFILES\PowerShell\7"
  IfFileExists "$R3\pwsh.exe" 0 skip_ps7
    FileOpen $1 "$R3\profile.ps1" a
    FileSeek $1 0 END
    FileWrite $1 "$\r$\n# LyaCode Studio$\r$\n"
    FileWrite $1 "function lyacode { Start-Process '$INSTDIR\lyacode.exe' }$\r$\n"
    FileWrite $1 "function lya     { Start-Process '$INSTDIR\lyacode.exe' }$\r$\n"
    FileWrite $1 "function lcode   { Start-Process '$INSTDIR\lyacode.exe' }$\r$\n"
    FileClose $1
  skip_ps7:
!macroend

!macro NSIS_HOOK_PREUNINSTALL
!macroend
