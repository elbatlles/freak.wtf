import { ColorModeScript } from '@chakra-ui/react'
import NextDocument, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps
} from 'next/document'
import theme from '../lib/theme'

interface MyDocumentProps extends DocumentInitialProps {
  locale: string
}

export default class Document extends NextDocument<MyDocumentProps> {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<MyDocumentProps> {
    const initialProps = await NextDocument.getInitialProps(ctx)
    const locale = ctx?.locale || ctx?.defaultLocale || 'es'
    return { ...initialProps, locale }
  }

  render() {
    const { locale } = this.props
    return (
      <Html lang={locale}>
        <Head>
          {/* Performance hints */}
          <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="" />
          <link rel="dns-prefetch" href="https://www.google-analytics.com" />

          {/* PWA / Theme color */}
          <meta name="theme-color" content="#1a202c" media="(prefers-color-scheme: dark)" />
          <meta name="theme-color" content="#f7fafc" media="(prefers-color-scheme: light)" />
          <meta name="format-detection" content="telephone=no" />
        </Head>
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
