/**
 * Standalone preview that draws the startup wordmark and provider box as
 * plain text. It intentionally uses the same title-case wordmark constant
 * as the real startup screen.
 *
 * Run: bun scripts/render-startup-preview.ts
 */

import { LYACODE_STARTUP_WORDMARK } from '../src/components/wordmark.js'

const W = 72
const boxBorder = (n: number) => '\u2500'.repeat(n)

const out: string[] = []
out.push('')
for (const line of LYACODE_STARTUP_WORDMARK) {
  out.push('  ' + line)
}
out.push('')
out.push(`  \u2726 Um produto Studio CodeAI \u2726`)
out.push('')
out.push(`  \u2554${boxBorder(W - 2)}\u2557`)
out.push(`  \u2502  Provider  Anthropic${' '.repeat(W - 22)}\u2502`)
out.push(`  \u2502  Model     claude-sonnet-4-6${' '.repeat(W - 32)}\u2502`)
out.push(`  \u2502  Endpoint  https://api.anthropic.com${' '.repeat(W - 41)}\u2502`)
out.push(`  \u2560${boxBorder(W - 2)}\u2563`)
out.push(`  \u2502  \u25cf cloud    Ready - type /help to begin${' '.repeat(W - 39)}\u2502`)
out.push(`  \u255a${boxBorder(W - 2)}\u255d`)
out.push(`  lyacode v1.0.8`)
out.push('')

console.log('=== Preview: startup wordmark oficial Lya Code ===')
console.log('')
for (const line of out) {
  console.log(line)
}
console.log('')
console.log(`(wordmark: ${LYACODE_STARTUP_WORDMARK.length} rows, ${LYACODE_STARTUP_WORDMARK[0]?.length ?? 0} cols)`)
