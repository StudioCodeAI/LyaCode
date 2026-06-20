/**
 * Standalone preview that draws the wordmark + box to a plain-text
 * string for visual inspection. No side effects, no imports of the
 * full CLI runtime (which has config-init requirements).
 *
 * Run: bun scripts/render-startup-preview.ts
 */

const FONT_7: Record<string, string[]> = {
  L: ['#      ', '#      ', '#      ', '#      ', '#      ', '#      ', '#######'],
  l: ['  #    ', ' ##    ', ' ##    ', '  #    ', '  #    ', '  #    ', '#####  '],
  Y: ['#     #', ' #   # ', '  # #  ', '   #   ', '   #   ', '   #   ', '   #   '],
  y: ['#     #', ' #   # ', '  # #  ', '   #   ', '   #   ', '  ##   ', '  #    '],
  A: ['  ###  ', ' #   # ', '#     #', '#     #', '#######', '#     #', '#     #'],
  a: [' ####  ', '#     #', ' ####  ', '#     #', '#   # #', '#    # ', ' #### #'],
  C: [' ##### ', '#       ', '#       ', '#       ', '#       ', '#       ', ' ##### '],
  c: ['  #### ', '#     #', '#       ', '#       ', '#       ', '#     #', '  #### '],
  O: ['  ###  ', ' #   # ', '#     #', '#     #', '#     #', ' #   # ', '  ###  '],
  o: ['  ###  ', ' #   # ', '#     #', '#     #', '#     #', ' #   # ', '  ###  '],
  U: ['#     #', '#     #', '#     #', '#     #', '#     #', ' #   # ', '  ###  '],
  u: ['#     #', '#     #', '#     #', '#     #', '#   # #', ' #   # ', '  ### #'],
  D: ['###### ', '#     #', '#     #', '#     #', '#     #', '#     #', '###### '],
  d: ['#     #', '#     #', '#     #', '#######', '      #', '#     #', '  ### #'],
  N: ['#     #', '##    #', '# #   #', '#  #  #', '#   # #', '#    ##', '#     #'],
  n: ['#     #', '##    #', '# #   #', '#  #  #', '#   # #', '#    ##', '#     #'],
  ' ': ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
}

const ROWS = 7
const GAP = 1

function render(text: string): string[] {
  const lines: string[][] = Array.from({ length: ROWS }, () => [])
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    const bitmap = FONT_7[ch] ?? FONT_7[' ']
    for (let r = 0; r < ROWS; r++) {
      lines[r].push(bitmap[r])
      if (i < text.length - 1) lines[r].push(' '.repeat(GAP))
    }
  }
  return lines.map(row => row.join(''))
}

const wordmarkLines = render('Lya Code')
const W = 72

const boxBorder = (n: number) => '\u2500'.repeat(n)

const out: string[] = []
out.push('')
for (const line of wordmarkLines) {
  out.push('  ' + line)
}
out.push('')
out.push(`  \u2726 Um produto Studio CodeAI \u2726`)
out.push('')
out.push(`  \u2554${boxBorder(W - 2)}\u2557`)
out.push(`  \u2502  Provider  Anthropic${' '.repeat(W - 22)}\u2502`)
out.push(`  \u2502  Model     claude-haiku-4-5-20251001${' '.repeat(2)}\u2502`)
out.push(`  \u2502  Endpoint  https://api.anthropic.com${' '.repeat(W - 41)}\u2502`)
out.push(`  \u2560${boxBorder(W - 2)}\u2563`)
out.push(`  \u2502  \u25cf cloud    Ready \u2014 type /help to begin${' '.repeat(W - 41)}\u2502`)
out.push(`  \u255a${boxBorder(W - 2)}\u255d`)
out.push(`  lyacode v0.1.0`)
out.push('')

console.log('=== Preview of the new startup screen ===')
console.log('')
for (const line of out) {
  console.log(line)
}
console.log('')
console.log(`(wordmark: ${ROWS} rows, ${wordmarkLines[0]?.length ?? 0} cols)`)
