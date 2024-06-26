import { ChakraProvider } from '@chakra-ui/react'
import Layout from '../components/layouts/main'
import theme from '../lib/theme'
import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
function Website({ Component, pageProps, router }) {
  const handleRouteChange = url => {
    window.gtag('config', '[Tracking ID]', {
      page_path: url
    })
  }
  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])
  return (
    <ChakraProvider theme={theme}>
      <Layout router={router}>
        <AnimatePresence mode="wait" initial={true}>
          <Component {...pageProps} key={router.route} />
        </AnimatePresence>
      </Layout>
      <Analytics />
    </ChakraProvider>
  )
}

export default Website
