import dynamic from 'next/dynamic'
import { Box, Container } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Layout from '../components/layouts/article'
import { HeroSection } from '../components/home/HeroSection'
import { BentoGrid } from '../components/home/BentoGrid'

const StarryBackground = dynamic(() => import('../components/home/StarryBackground'), {
  ssr: false,
  loading: () => <Box h="100vh" />,
})

const Home = () => {
  const { locale } = useRouter()

  return (
    <Layout>
      <Box position="relative" minH="100vh" overflow="hidden">
        <StarryBackground />
        <Container
          maxW="6xl"
          pt={{ base: 4, md: 8 }}
          pb={{ base: 12, md: 16 }}
          px={{ base: 4, md: 6 }}
          position="relative"
          zIndex={2}
        >
          <HeroSection locale={locale} />
          <BentoGrid />
        </Container>
      </Box>
    </Layout>
  )
}

export default Home
