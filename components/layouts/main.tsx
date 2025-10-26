import Head from 'next/head'
import NavBar from '../navbar'
import { Box, Container, useColorModeValue } from '@chakra-ui/react'
import Footer from '../footer'
import SEO from '../seo'

const Main = ({ children, router }) => {
  const isHomepage = router.pathname === '/'

  // Unified glassmorphism background for all pages
  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50, pink.50)',
    'linear(to-br, gray.900, purple.900, blue.900)'
  )

  return (
    <Box
      as="main"
      pb={8}
      minH="100vh"
      bgGradient={bgGradient}
      position="relative"
    >
      <SEO 
        title="Angel Batlles - Full Stack Developer"
        description="Portfolio personal de Angel Batlles, desarrollador Full Stack especializado en React, Next.js y tecnologías web modernas."
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
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@abatlles" />
        <meta name="twitter:creator" content="@abatlles" />
        <meta name="twitter:image" content="/card.png" />
        <meta property="og:site_name" content="Angel Batlles's Homepage" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/card.png" />
        <title>Angel Batlles- Software Developer</title>
      </Head>

      <NavBar path={router.asPath} />

      <Container
        maxW={isHomepage ? '6xl' : 'container.md'}
        pt={{ base: 16, md: 20 }}
      >
        {children}

        <Footer />
      </Container>
    </Box>
  )
}

export default Main
