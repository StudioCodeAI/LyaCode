; LyaCode NSIS Installer Hooks
; Adds/removes install directory from System PATH using registry directly (no external plugins needed)

!macro NSIS_HOOK_POSTINSTALL
  ; Append install dir to System PATH in registry
  ReadRegStr $R0 HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path"
  WriteRegExpandStr HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path" "$R0;$INSTDIR"
  ; Broadcast environment change so open windows pick it up without reboot
  SendMessage 65535 26 0 "STR:Environment" /TIMEOUT=5000
!macroend

!macro NSIS_HOOK_PREUNINSTALL
!macroend
