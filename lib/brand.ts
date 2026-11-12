/**
 * Centralised brand gradient constants.
 * Use these instead of hardcoding gradient strings in components.
 * Accent hue derives from the pixel logo (#60e080).
 */

/** Logo-green gradient for main headings (light/dark variants) */
export const headingGradient = {
  light: 'linear-gradient(to right, #2fa852, #1e6e42)',
  dark: 'linear-gradient(100deg, #7deda4, #46c866)'
} as const

/**
 * Logo-green accent gradient used on secondary headings,
 * works page title, posts page title, timeline title.
 */
export const accentGradient =
  'linear-gradient(100deg, #7deda4, #46c866)' as const

/** Inline CSS helper for gradient text */
export const gradientTextStyle = {
  WebkitBackgroundClip: 'text' as const,
  WebkitTextFillColor: 'transparent' as const,
  backgroundClip: 'text' as const
}
