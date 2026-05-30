import { Box, Container } from '@chakra-ui/react'
import type { GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { getI18nProps } from '../lib/i18n'
import { BentoGrid } from '../components/home/BentoGrid'
import { HeroSection } from '../components/home/HeroSection'
import Layout from '../components/layouts/article'

const StarryBackground = dynamic(
  () => import('../components/home/StarryBackground'),
  {
    ssr: false
  }
)

const Home = () => {
  const { locale } = useRouter()

  return (
    <Layout>
      <Box position="relative" minH="100vh" overflow="hidden">
        <StarryBackground />
        <Container
          maxW="6xl"
          pt={{ base: 6, md: 8 }}
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

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const { messages } = await getI18nProps(locale)
  return { props: { messages } }
}

export default Home
