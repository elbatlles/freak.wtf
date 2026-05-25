import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  VStack
} from '@chakra-ui/react'
import type { GetStaticProps } from 'next'
import { useTranslations } from 'next-intl'
import { BlogCard } from '../../components/blog/BlogCard'
import Layout from '../../components/layouts/article'
import {
  type BlogPost,
  getAllCategories,
  getAllPosts
} from '../../lib/blog/api'
import { accentGradient, gradientTextStyle } from '../../lib/brand'

interface BlogProps {
  posts: BlogPost[]
  categories: string[]
}

const Blog: React.FC<BlogProps> = ({
  posts = [],
  categories: _categories = []
}) => {
  const t = useTranslations('blog')

  const textColor = 'text-muted'

  // Si no hay posts, mostrar mensaje de "coming soon"
  if (posts.length === 0) {
    return (
      <Layout title={t('title')}>
        <Container maxW="6xl" pb={8}>
          <VStack gap={8} textAlign="center">
            <Box w="100%">
              <Heading as="h1" size="2xl" mb={3}>
                <span
                  style={{ background: accentGradient, ...gradientTextStyle }}
                >
                  {t('title')}
                </span>
              </Heading>
            </Box>

            <Box py={16}>
              <Heading as="h2" size="lg" mb={4}>
                {t('commingSoon')}
              </Heading>
              <Text color={textColor} maxW="2xl">
                {t('comingSoonText')}
              </Text>
            </Box>
          </VStack>
        </Container>
      </Layout>
    )
  }

  return (
    <Layout title={t('title')}>
      <Container maxW="6xl" pb={8}>
        <VStack gap={8}>
          {/* Header */}
          <Box w="100%" textAlign="center">
            <Heading as="h1" size="2xl" mb={3}>
              <span
                style={{ background: accentGradient, ...gradientTextStyle }}
              >
                {t('title')}
              </span>
            </Heading>
            <Text fontSize="lg" color={textColor} maxW="2xl" mx="auto">
              {t('subtitle')}
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

export default Blog
