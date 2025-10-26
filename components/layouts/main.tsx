import Head from 'next/head'
import dynamic from 'next/dynamic'
import NavBar from '../navbar'
import { Box, Container } from '@chakra-ui/react'
import Footer from '../footer'
import VoxelDogLoader from '../voxel-me-loader'

const LazyVoxelDog = dynamic(() => import('../VoxelMe/voxel-me'), {
  ssr: false,
  loading: () => <VoxelDogLoader />
})

const Main = ({ children, router }) => {
  return (
    <Box as="main" pb={8}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Full-stack developer specialized in React, Node.js, and modern web technologies. Explore my portfolio, timeline, and blog with insights about software development." />
        <meta name="author" content="Angel Batlles" />
        <meta name="author" content="abatlles" />
        <meta name="keywords" content="Angel Batlles, Full Stack Developer, React, Node.js, TypeScript, Web Development, Software Engineer, Barcelona" />
        <link rel="apple-touch-icon" href="apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@abatlles" />
        <meta name="twitter:creator" content="@abatlles" />
        <meta name="twitter:title" content="Angel Batlles - Full Stack Developer" />
        <meta name="twitter:description" content="Full-stack developer specialized in React, Node.js, and modern web technologies. Explore my portfolio, timeline, and blog." />
        <meta name="twitter:image" content="https://freak.wtf/card.png" />
        
        {/* Open Graph tags */}
        <meta property="og:site_name" content="Angel Batlles - Developer Portfolio" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Angel Batlles - Full Stack Developer" />
        <meta property="og:description" content="Full-stack developer specialized in React, Node.js, and modern web technologies. Explore my portfolio, timeline, and blog with insights about software development." />
        <meta property="og:image" content="https://freak.wtf/card.png" />
        <meta property="og:url" content="https://freak.wtf" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale:alternate" content="es_ES" />
        
        <title>Angel Batlles - Full Stack Developer</title>
      </Head>

      <NavBar path={router.asPath} />

      <Container maxW="container.md" pt={14}>
        <LazyVoxelDog />

        {children}

        <Footer />
      </Container>
    </Box>
  )
}

export default Main
