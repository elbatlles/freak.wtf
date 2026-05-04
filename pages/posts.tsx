import {
  Container,
  Heading,
  Text,
  Box,
  VStack,
  SimpleGrid
} from '@chakra-ui/react'
import { useColorModeValue } from '../lib/color-mode'
import Layout from '../components/layouts/article'
import { BlogCard } from '../components/blog/BlogCard'
import { getAllPosts, getAllCategories, BlogPost } from '../lib/blog/api'
import { GetStaticProps } from 'next'
import Lang from '../lib/utils'
import { useRouter } from 'next/router'

interface BlogProps {
  posts: BlogPost[]
  categories: string[]
}

const Posts: React.FC<BlogProps> = ({
  posts = [],
  categories: _categories = []
}) => {
  const t = Lang('blog')
  const router = useRouter()

  // Glassmorphism style consistent with homepage
  const glassBg = useColorModeValue(
    'rgba(255, 255, 255, 0.25)',
    'rgba(255, 255, 255, 0.1)'
  )
  const glassBorder = useColorModeValue(
    'rgba(255, 255, 255, 0.2)',
    'rgba(255, 255, 255, 0.1)'
  )
  const textColor = useColorModeValue('gray.600', 'gray.300')

  // Si no hay posts, mostrar mensaje de "coming soon"
  if (posts.length === 0) {
    return (
      <Layout title={t.title}>
        <Container maxW="6xl" py={8}>
          <VStack gap={8} textAlign="center">
            <Box w="100%" pt={4}>
              <Heading as="h1" size="xl" mb={3}>
                <span style={{
                  background: 'linear-gradient(to right, #a855f7, #60a5fa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  {t.title}
                </span>
              </Heading>
              <Text fontSize="lg" color={textColor}>
                {t.subtitle}
              </Text>
            </Box>

            <Box py={16}>
              <Heading as="h2" size="lg" mb={4}>
                {t.commingSoon}
              </Heading>
              <Text color={textColor} maxW="2xl">
                {router.locale === 'es'
                  ? 'Estoy preparando contenido increíble sobre desarrollo, tecnología y programación. ¡Vuelve pronto!'
                  : "I'm preparing amazing content about development, technology and programming. Come back soon!"}
              </Text>
            </Box>
          </VStack>
        </Container>
      </Layout>
    )
  }

  return (
    <Layout title={t.title}>
      <Container maxW="6xl" py={8}>
        <VStack gap={8}>
          {/* Header */}
          <Box w="100%" textAlign="center" pt={4}>
            <Heading as="h1" size="xl" mb={3}>
              <span style={{
                background: 'linear-gradient(to right, #a855f7, #60a5fa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {t.title}
              </span>
            </Heading>
            <Text fontSize="lg" color={textColor} maxW="2xl" mx="auto">
              {t.subtitle}
            </Text>
          </Box>

          {/* Posts Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6} w="100%">
            {posts.map((post, index) => (
              <BlogCard key={post.slug} post={post} index={index} />
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const lang = (locale || 'es') as 'en' | 'es'

  try {
    const posts = getAllPosts(lang)
    const categories = getAllCategories(lang)

    return {
      props: {
        posts,
        categories
      }
    }
  } catch {
    // Si no hay posts aún, devolver arrays vacíos
    return {
      props: {
        posts: [],
        categories: []
      }
    }
  }
}

export default Posts
