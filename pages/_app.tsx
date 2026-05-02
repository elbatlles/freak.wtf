import { ChakraProvider } from '@chakra-ui/react'
import { ThemeProvider } from 'next-themes'
import Layout from '../components/layouts/main'
import { system } from '../lib/theme'
import { useEffect } from 'react'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { inter } from '../lib/fonts'

const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    // eslint-disable-next-line no-unused-vars
    gtag?: (..._args: unknown[]) => void
  }
}

function Website({ Component, pageProps, router }) {
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
    </div>
  )
}

export default Website
