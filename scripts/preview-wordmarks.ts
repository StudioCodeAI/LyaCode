/**
 * Wordmark style samples for the user to choose from.
 * Renders "Lya Code" in 4 different fonts × 3 sizes, prints each
 * preview to stdout so the user can compare visually.
 *
 * Run: bun scripts/preview-wordmarks.ts
 */

const FONT_5_THIN: Record<string, string[]> = {
  L: ['#   ', '#   ', '#   ', '#   ', '#   '],
  Y: ['# # ', '# # ', ' #  ', ' #  ', ' #  '],
  A: [' #  ', '# # ', '### ', '# # ', '# # '],
  C: [' ## ', '#   ', '#   ', '#   ', ' ## '],
  O: [' #  ', '# # ', '# # ', '# # ', ' #  '],
  U: ['# # ', '# # ', '# # ', '# # ', ' #  '],
  D: ['##  ', '# # ', '# # ', '# # ', '##  '],
  N: ['# # ', '## #', '# ##', '# # ', '# # '],
  ' ': ['   '],
}

const FONT_5_BIG: Record<string, string[]> = {
  L: ['#    ', '#    ', '#    ', '#    ', '#####'],
  Y: ['#   #', ' # # ', '  #  ', '  #  ', '  #  '],
  A: [' ### ', '#   #', '#####', '#   #', '#   #'],
  C: [' ####', '#    ', '#    ', '#    ', ' ####'],
  O: [' ### ', '#   #', '#   #', '#   #', ' ### '],
  U: ['#   #', '#   #', '#   #', '#   #', ' ### '],
  D: ['#### ', '#   #', '#   #', '#   #', '#### '],
  N: ['#   #', '##  #', '# # #', '#  ##', '#   #'],
  ' ': ['     '],
}

const FONT_7_BOLD: Record<string, string[]> = {
  L: ['#      ', '#      ', '#      ', '#      ', '#      ', '#      ', '#######'],
  Y: ['#     #', ' #   # ', '  # #  ', '   #   ', '   #   ', '   #   ', '   #   '],
  A: ['  ###  ', ' #   # ', '#     #', '#     #', '#######', '#     #', '#     #'],
  C: [' ##### ', '#       ', '#       ', '#       ', '#       ', '#       ', ' ##### '],
  O: ['  ###  ', ' #   # ', '#     #', '#     #', '#     #', ' #   # ', '  ###  '],
  U: ['#     #', '#     #', '#     #', '#     #', '#     #', ' #   # ', '  ###  '],
  D: ['###### ', '#     #', '#     #', '#     #', '#     #', '#     #', '###### '],
  N: ['#     #', '##    #', '# #   #', '#  #  #', '#   # #', '#    ##', '#     #'],
  ' ': ['       '],
  '.': [' ', ' ', ' ', ' ', ' ', ' ', '##'],
}

const PALETTE = {
  // Studio CodeAI warm orange gradient (matches assets/brand/lyacode-logo.svg)
  start: [255, 122, 26] as [number, number, number],
  mid: [220, 100, 20] as [number, number, number],
  end: [180, 70, 10] as [number, number, number],
}

function lerp(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t)
}

function gradient(t: number): [number, number, number] {
  if (t < 0.5) {
    const u = t * 2
    return [
      lerp(PALETTE.start[0], PALETTE.mid[0], u),
      lerp(PALETTE.start[1], PALETTE.mid[1], u),
      lerp(PALETTE.start[2], PALETTE.mid[2], u),
    ]
  }
  const u = (t - 0.5) * 2
  return [
    lerp(PALETTE.mid[0], PALETTE.end[0], u),
    lerp(PALETTE.mid[1], PALETTE.end[1], u),
    lerp(PALETTE.mid[2], PALETTE.end[2], u),
  ]
}

const ANSI_RESET = '\x1b[0m'
function rgb(r: number, g: number, b: number): string {
  return `\x1b[38;2;${r};${g};${b}m`
}

function renderText(
  text: string,
  font: Record<string, string[]>,
): string[] {
  const rows = font[' '].length
  const lines: string[][] = Array.from({ length: rows }, () => [])
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    const upper = ch === ch.toUpperCase() ? ch : ch.toUpperCase()
    const bitmap = font[upper] ?? font[ch] ?? font[' ']
    for (let r = 0; r < rows; r++) {
      lines[r].push(bitmap[r])
      if (i < text.length - 1) lines[r].push(' ')
    }
  }
  return lines.map(row => row.join(''))
}

function colorizeRow(row: string, gradientT: number): string {
  let out = ''
  for (let i = 0; i < row.length; i++) {
    if (row[i] === '#') {
      const t = gradientT + (i / Math.max(row.length, 1)) * 0.3
      const [r, g, b] = gradient(Math.min(t, 1))
      out += rgb(r, g, b) + '#'
    } else {
      out += row[i]
    }
  }
  return out + ANSI_RESET
}

function printPreview(label: string, text: string, font: Record<string, string>) {
  console.log(`\n${'═'.repeat(60)}`)
  console.log(`${label}`)
  console.log(`${'─'.repeat(60)}`)
  const lines = renderText(text, font)
  for (const line of lines) {
    console.log(colorizeRow(line, 0.2))
  }
  console.log(`${'─'.repeat(60)}`)
  console.log(`rows: ${lines.length}  cols: ${lines[0]?.length ?? 0}`)
}

console.log('\nLya Code wordmark samples')
console.log('Compare e me diga qual você quer no startup.')

printPreview('A. 5-row thin (compact, single line look)', 'Lya Code', FONT_5_THIN)
printPreview('B. 5-row big (default block, balanced)', 'Lya Code', FONT_5_BIG)
printPreview('C. 7-row bold (LARGE, hero impact)', 'LYA CLOUD', FONT_7_BOLD)
printPreview('D. 7-row bold mixed case (LARGE + Lya.Cloud dot)', 'Lya.Cloud', FONT_7_BOLD)

console.log('\n' + '═'.repeat(60))
console.log('Recomendacao: D (Lya.Cloud em 7-row bold)')
console.log('═'.repeat(60))
