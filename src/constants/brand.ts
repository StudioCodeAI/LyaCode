/**
 * Lya Cloud brand identity — single source of truth for the product name,
 * tagline, accent color, and wordmark art used across the TUI.
 *
 * Theme entries derived from the accent MUST stay in `rgb(r,g,b)` form
 * (never hex): the spinner's shimmer/stall interpolation parses theme values
 * with `parseRGB`, which only matches `rgb(...)` strings.
 */

export const BRAND_NAME = 'Lya Cloud'

export const BRAND_TAGLINE = 'Um produto Studio CodeAI'

/** Studio CodeAI green in the rgb() form required by theme consumers. */
export const BRAND_ACCENT_RGB = 'rgb(34,197,94)'

/**
 * Two-row Unicode half-block wordmark, split so the two halves can be
 * rendered in different accent shades. Block characters (█ ▀ ▄) render
 * correctly in Apple Terminal. Rendered side by side with a 1-col gap:
 *
 *   █   █ █ ▄▀█   █▀▀ █   █▀█ █ █ █▀▄
 *   █▄▄  █  █▀█   █▄▄ █▄▄ █▄█ █▄█ █▄▀
 */
export const WORDMARK_LYA = [
  '█   █ █ ▄▀█',
  '█▄▄  █  █▀█',
] as const

export const WORDMARK_CLOUD = [
  '█▀▀ █   █▀█ █ █ █▀▄',
  '█▄▄ █▄▄ █▄█ █▄█ █▄▀',
] as const

/** Rendered width of the full wordmark: Lya half + 1-col gap + Cloud half. */
export const WORDMARK_WIDTH =
  WORDMARK_LYA[0].length + 1 + WORDMARK_CLOUD[0].length
