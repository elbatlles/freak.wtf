import { Box, Container } from '@chakra-ui/react'
import Head from 'next/head'
import { useTranslations } from 'next-intl'
import Footer from '../footer'
import NavBar from '../navbar'
import SEO from '../seo'

const Main = ({ children, router }) => {
  const t = useTranslations('seo')
  const isHomepage = router.pathname === '/'

  // Dedicated full-screen pages skip the layout shell entirely
  if (router.pathname === '/terminal') {
    return <>{children}</>
  }

  // Only routes that don't match their own SEO key need an entry here.
  // blog, timeline, posts → use segment directly.
  const SEO_OVERRIDES: Record<string, string> = {
    experience: 'works',
    projects: 'works',
    lab: 'works'
  }
  const segment = router.pathname.split('/')[1]
  const pageType = SEO_OVERRIDES[segment] ?? (segment || 'home')

  return (
    <Box
      as="main"
      pb={8}
      minH="100vh"
      position="relative"
    >
      <SEO
        title={t(`${pageType}.title`)}
        description={t(`${pageType}.description`)}
      />
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Angel Batlles" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="48x48"
          href="/favicon-48x48.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/android-chrome-512x512.png"
        />
        {/* Meta tags now handled by SEO component to avoid duplication */}
      </Head>

      <NavBar path={router.asPath} />

      <Container
        maxW={
          isHomepage
            ? '6xl'
            : router.pathname.startsWith('/works/')
              ? 'container.lg'
              : 'container.md'
        }
        pt={{ base: 16, md: 20 }}
      >
        {children}

        <Footer />
      </Container>
    </Box>
  )
}

export default Main
