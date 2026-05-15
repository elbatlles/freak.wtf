import dynamic from 'next/dynamic'
import { Box, Container } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Layout from '../components/layouts/article'
import { HeroSection } from '../components/home/HeroSection'
import { BentoGrid } from '../components/home/BentoGrid'
import { getAllPosts, BlogPost } from '../lib/blog/api'

const StarryBackground = dynamic(() => import('../components/home/StarryBackground'), {
  ssr: false,
  loading: () => <Box h="100vh" />,
})

interface HomeProps {
  latestPostEn: Pick<BlogPost, 'slug' | 'title' | 'excerpt' | 'date'> | null
  latestPostEs: Pick<BlogPost, 'slug' | 'title' | 'excerpt' | 'date'> | null
}

const Home = ({ latestPostEn, latestPostEs }: HomeProps) => {
  const { locale } = useRouter()
  const latestPost = locale === 'es' ? latestPostEs : latestPostEn

  return (
    <Layout>
      <Box position="relative" minH="100vh" overflow="hidden">
        <StarryBackground />
        <Container
          maxW="6xl"
          pt={{ base: 10, md: 14 }}
          pb={{ base: 12, md: 16 }}
          px={{ base: 4, md: 6 }}
          position="relative"
          zIndex={2}
        >
          <HeroSection locale={locale} />
          <BentoGrid latestPost={latestPost} />
        </Container>
      </Box>
    </Layout>
  )
}

export async function getStaticProps() {
  const pickPost = (post: BlogPost | undefined) =>
    post ? { slug: post.slug, title: post.title, excerpt: post.excerpt, date: post.date } : null

  return {
    props: {
      latestPostEn: pickPost(getAllPosts('en')[0]),
      latestPostEs: pickPost(getAllPosts('es')[0]),
    },
  }
}

export default Home
