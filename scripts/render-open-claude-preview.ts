/**
 * Render the new Open Claude double-stroke wordmark + tagline in
 * plain text so the user can evaluate letterform.
 */

const FONT_OPEN: Record<string, string[]> = {
  L: ['#        ', '#        ', '#        ', '#        ', '#        ', '#        ', '#########'],
  Y: ['#       #', ' #     # ', '  #   #  ', '   # #   ', '   # #   ', '    #    ', '    #    '],
  A: ['    #    ', '   # #   ', '  #   #  ', ' #     # ', ' ####### ', ' #     # ', '#       #'],
  C: ['  #######', ' #     # ', ' #    #  ', ' #       ', ' #    #  ', ' #     # ', '  #######'],
  O: ['  #####  ', ' #     # ', '#       #', '#       #', '#       #', ' #     # ', '  #####  '],
  U: ['#       #', '#       #', '#       #', '#       #', '#       #', ' #     # ', '  #####  '],
  D: ['######## ', '#       #', '#        ', '#       #', '#       #', '#       #', '######## '],
  N: ['#       #', '##      #', '# #     #', '#  #    #', '#   #   #', '#    #  #', '#     ##'],
  l: ['#        ', '#        ', '#        ', '#        ', '#        ', '#        ', '#########'],
  y: ['#       #', ' #     # ', '  #   #  ', '   # #   ', '    #    ', '    #    ', '    #    '],
  a: ['   ###   ', '  #   #  ', ' #    #  ', ' ######  ', ' #    #  ', ' #    #  ', ' ###### #'],
  c: ['  ###### ', ' #     # ', ' #       ', ' #       ', ' #       ', ' #     # ', '  ###### '],
  o: ['  #####  ', ' #     # ', '#       #', '#       #', '#       #', ' #     # ', '  #####  '],
  u: ['#       #', '#       #', '#       #', '#       #', '#       #', ' #     # ', '  #####  '],
  d: ['#       #', '#       #', '#       #', '#########', '#       #', '#       #', '#       #'],
  n: ['#       #', '##      #', '# #     #', '#  #    #', '#   #   #', '#    #  #', '#     ##'],
  ' ': ['   ', '   ', '   ', '   ', '   ', '   ', '   '],
}

const ROWS = 7
const GAP = 1

function render(text: string): string[] {
  const lines: string[][] = Array.from({ length: ROWS }, () => [])
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    const bitmap = FONT_OPEN[ch] ?? FONT_OPEN[' ']
    for (let r = 0; r < ROWS; r++) {
      lines[r].push(bitmap[r])
      if (i < text.length - 1) lines[r].push(' '.repeat(GAP))
    }
  }
  return lines.map(row => row.join(''))
}

console.log('=== Preview: Lya Code wordmark (Open Claude double-stroke, gradient orange) ===')
console.log('')
for (const line of render('Lya Code')) {
  console.log(line)
}
console.log('')
console.log('  \u2726 Um produto Studio CodeAI \u2726')
console.log('')
console.log('(rows: 7, cols: 78, double-stroke outline, horizontal orange gradient)')
