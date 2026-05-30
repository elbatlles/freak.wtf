const SUPPORTED_LOCALES = ['en', 'es'] as const
type Locale = (typeof SUPPORTED_LOCALES)[number]

export async function getI18nProps(locale: string | undefined) {
  const lang = (SUPPORTED_LOCALES.includes(locale as Locale)
    ? locale
    : 'es') as Locale
  const messages = (await import(`../messages/${lang}.json`)).default
  return { messages }
}
