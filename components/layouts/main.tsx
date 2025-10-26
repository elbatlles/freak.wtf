import Head from 'next/head'
import dynamic from 'next/dynamic'
import NavBar from '../navbar'
import { Box, Container } from '@chakra-ui/react'
import Footer from '../footer'
import VoxelMeLoader from '../voxel-me-loader'

const LazyVoxelMe = dynamic(() => import('../VoxelMe/voxel-me'), {
  ssr: false,
  loading: () => <VoxelMeLoader />
})

const Main = ({ children, router }) => {
  return (
    <Box as="main" pb={8}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Angel Batlles" />
        <meta name="author" content="abatlles" />
        <link rel="apple-touch-icon" href="apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </Head>

      <NavBar path={router.asPath} />

      <Container maxW="container.md" pt={14}>
        <LazyVoxelMe />

        {children}

        <Footer />
      </Container>
    </Box>
  )
}

export default Main
