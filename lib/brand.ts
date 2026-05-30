/**
 * Centralised brand gradient constants.
 * Use these instead of hardcoding gradient strings in components.
 */

/** Purple→blue gradient for main headings (light/dark variants) */
export const headingGradient = {
  light: 'linear-gradient(to right, #9333ea, #2563eb)',
  dark: 'linear-gradient(to right, #d8b4fe, #a3cfff)'
} as const

/**
 * Purple→blue accent gradient used on secondary headings,
 * works page title, posts page title, timeline title.
 */
export const accentGradient =
  'linear-gradient(to right, #a855f7, #60a5fa)' as const

/** Inline CSS helper for gradient text */
export const gradientTextStyle = {
  WebkitBackgroundClip: 'text' as const,
  WebkitTextFillColor: 'transparent' as const,
  backgroundClip: 'text' as const
}
