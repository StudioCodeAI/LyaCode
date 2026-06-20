/**
 * Print the official Lya Code startup wordmark with the same title-case
 * drawing used by the CLI.
 *
 * Run: bun scripts/preview-final-wordmark.ts
 */

import { LYACODE_STARTUP_WORDMARK } from '../src/components/wordmark.js'

const PALETTE: ReadonlyArray<[number, number, number]> = [
  [255, 168, 80],
  [255, 122, 26],
  [220, 100, 20],
  [180, 70, 10],
]

const ANSI_RESET = '\x1b[0m'
const BOLD = '\x1b[1m'

function lerp(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t)
}

function rgb(r: number, g: number, b: number): string {
  return `\x1b[38;2;${r};${g};${b}m`
}

function gradient(t: number): [number, number, number] {
  const clamped = Math.max(0, Math.min(1, t))
  const scaled = clamped * (PALETTE.length - 1)
  const index = Math.min(Math.floor(scaled), PALETTE.length - 2)
  const localT = scaled - index
  const from = PALETTE[index]
  const to = PALETTE[index + 1]

  return [
    lerp(from[0], to[0], localT),
    lerp(from[1], to[1], localT),
    lerp(from[2], to[2], localT),
  ]
}

function colorize(row: string): string {
  let out = ''
  const width = row.length
  for (let i = 0; i < width; i++) {
    const ch = row[i]
    if (ch !== ' ') {
      const [r, g, b] = gradient(width > 1 ? i / (width - 1) : 0)
      out += rgb(r, g, b) + ch
    } else {
      out += ch
    }
  }
  return out + ANSI_RESET
}

console.log('')
console.log('Lya Code wordmark oficial — title case')
console.log('Studio CodeAI orange gradient')
console.log('')
for (const line of LYACODE_STARTUP_WORDMARK) {
  console.log(BOLD + colorize(line) + ANSI_RESET)
}
console.log('')
console.log(`(rows: ${LYACODE_STARTUP_WORDMARK.length}, cols: ${LYACODE_STARTUP_WORDMARK[0]?.length ?? 0})`)
