import NextDocument, {
  type DocumentContext,
  type DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript
} from 'next/document'

interface MyDocumentProps extends DocumentInitialProps {
  locale: string
}

export default class Document extends NextDocument<MyDocumentProps> {
  static async getInitialProps(ctx: DocumentContext): Promise<MyDocumentProps> {
    const initialProps = await NextDocument.getInitialProps(ctx)
    const locale = ctx?.locale || ctx?.defaultLocale || 'es'
    return { ...initialProps, locale }
  }

  render() {
    const { locale } = this.props
    return (
      <Html lang={locale} className="dark" suppressHydrationWarning>
        <Head>
          {/* Performance hints */}
          <link
            rel="preconnect"
            href="https://fonts.googleapis.com"
            crossOrigin=""
          />
          <link rel="dns-prefetch" href="https://www.google-analytics.com" />

          {/* PWA / Theme color — matches body bg (#202023) */}
          <meta name="theme-color" content="#202023" />
          <meta name="format-detection" content="telephone=no" />
        </Head>
        <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
