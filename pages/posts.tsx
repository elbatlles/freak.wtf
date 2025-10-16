import { Container, Heading, Text, Box, VStack, useColorModeValue, SimpleGrid } from '@chakra-ui/react'
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

const Posts: React.FC<BlogProps> = ({ posts = [], categories: _categories = [] }) => {
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
          <VStack spacing={8} textAlign="center">
            <Box 
              bg={glassBg}
              backdropFilter="blur(20px)"
              border="1px solid"
              borderColor={glassBorder}
              p={8} 
              borderRadius="2xl" 
              w="100%"
              boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
            >
              <Heading as="h1" size="xl" mb={4}>
                {t.title}
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
                  : 'I\'m preparing amazing content about development, technology and programming. Come back soon!'
                }
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
        <VStack spacing={8}>
          {/* Header */}
          <Box 
            bg={glassBg}
            backdropFilter="blur(20px)"
            border="1px solid"
            borderColor={glassBorder}
            p={8} 
            borderRadius="2xl" 
            w="100%" 
            textAlign="center"
            boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
          >
            <Heading as="h1" size="xl" mb={4}>
              {t.title}
            </Heading>
            <Text fontSize="lg" color={textColor} maxW="2xl" mx="auto">
              {t.subtitle}
            </Text>
          </Box>

          {/* Posts Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="100%">
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
