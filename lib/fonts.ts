import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from 'next/font/google'

/**
 * Type system — "acid phosphor terminal" identity.
 * Display: Bricolage Grotesque (characterful headings)
 * Body: Instrument Sans (refined, not Inter-generic)
 * Mono: JetBrains Mono (labels, terminal, metadata)
 */
export const display = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap'
})

export const body = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap'
})

export const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap'
})

export const fontVariables = `${display.variable} ${body.variable} ${mono.variable}`
