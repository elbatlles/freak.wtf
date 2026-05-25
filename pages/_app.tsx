import { ChakraProvider } from '@chakra-ui/react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { AppContext, AppProps } from 'next/app'
import Script from 'next/script'
import { NextIntlClientProvider } from 'next-intl'
import { ThemeProvider } from 'next-themes'
import { useEffect } from 'react'
import Layout from '../components/layouts/main'
import { inter } from '../lib/fonts'
import { system } from '../lib/theme'

const SUPPORTED_LOCALES = ['en', 'es'] as const
type Locale = (typeof SUPPORTED_LOCALES)[number]

const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS

declare global {
  interface Window {
    gtag?: (..._args: unknown[]) => void
  }
}

interface WebsiteProps extends AppProps {
  messages: Record<string, unknown>
}

function Website({ Component, pageProps, router, messages }: WebsiteProps) {
  const locale = (
    SUPPORTED_LOCALES.includes(router.locale as Locale) ? router.locale : 'es'
  ) as Locale
  useEffect(() => {
    if (!GA_ID) return
    const handleRouteChange = (url: string) => {
      window.gtag?.('config', GA_ID, { page_path: url })
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])
  return (
    <div className={inter.className}>
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        timeZone="Europe/Madrid"
      >
        <ThemeProvider defaultTheme="dark" attribute="class" enableSystem>
          <ChakraProvider value={system}>
            <Layout router={router}>
              <Component {...pageProps} key={router.route} />
            </Layout>
            <Analytics />
            <SpeedInsights />
            {GA_ID && (
              <>
                <Script
                  src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                  strategy="lazyOnload"
                />
                <Script id="ga-init" strategy="lazyOnload">
                  {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}', { page_path: window.location.pathname });`}
                </Script>
              </>
            )}
          </ChakraProvider>
        </ThemeProvider>
      </NextIntlClientProvider>
    </div>
  )
}

export default Website

Website.getInitialProps = async ({ ctx, Component }: AppContext) => {
  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps(ctx)
    : {}
  const locale = SUPPORTED_LOCALES.includes(ctx.locale as Locale)
    ? ctx.locale
    : 'es'
  const messages = (await import(`../messages/${locale}.json`)).default
  return { pageProps, messages }
}
