import Head from 'next/head'
import NavBar from '../navbar'
import { Box, Container } from '@chakra-ui/react'
import Footer from '../footer'
import SEO from '../seo'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'

const Main = ({ children, router }) => {
  // Dedicated full-screen pages skip the layout shell entirely
  if (router.pathname === '/terminal') {
    return <>{children}</>
  }

  const { locale } = useRouter()
  const isHomepage = router.pathname === '/'
  const t = useTranslations('seo')
  
  // Determine page type from pathname
  const getPageType = (pathname: string) => {
    if (pathname === '/') return 'home'
    if (pathname.startsWith('/works')) return 'works'
    if (pathname.startsWith('/blog')) return 'blog'
    if (pathname.startsWith('/timeline')) return 'timeline'
    if (pathname.startsWith('/posts')) return 'posts'
    return 'home'
  }
  
  const pageType = getPageType(router.pathname)

  return (
    <Box
      as="main"
      pb={8}
      minH="100vh"
      bgGradient="to-br"
      gradientFrom={{ base: 'blue.50', _dark: 'gray.900' }}
      gradientVia={{ base: 'purple.50', _dark: 'purple.900' }}
      gradientTo={{ base: 'pink.50', _dark: 'blue.900' }}
      position="relative"
    >
      <SEO 
        title={t(`${pageType}.title`)}
        description={t(`${pageType}.description`)}
      />
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Angel Batlles" />
        <meta name="author" content="abatlles" />
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
        maxW={isHomepage ? '6xl' : router.pathname.startsWith('/works/') ? 'container.lg' : 'container.md'}
        pt={{ base: 16, md: 20 }}
      >
        {children}

        <Footer />
      </Container>
    </Box>
  )
}

export default Main
