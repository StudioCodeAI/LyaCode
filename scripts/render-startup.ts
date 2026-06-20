/**
 * Captura o output real de printStartupScreen em stdout.
 * Run: bun scripts/render-startup.ts
 */

const origWrite = process.stdout.write.bind(process.stdout)
let captured = ''
process.stdout.write = (chunk: string | Uint8Array): boolean => {
  captured += chunk.toString()
  return true
}
;(globalThis as Record<string, unknown>).MACRO = { VERSION: '0.1.0' }

import('../src/components/StartupScreen.js' as string).then(m => {
  process.stdout.isTTY = true
  m.printStartupScreen()
  // Restore
  process.stdout.write = origWrite
  console.log('=== Captured output (with ANSI) ===')
  console.log(captured)
  console.log('=== End ===')
})
