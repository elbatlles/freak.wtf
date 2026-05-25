import {
  Box,
  Button,
  Container,
  Separator,
  Text,
  VStack
} from '@chakra-ui/react'
import type { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
import { LuChevronLeft } from 'react-icons/lu'
import { BlogLayout } from '../../components/blog/BlogCard'
import Layout from '../../components/layouts/article'
import {
  type BlogPost,
  getAllPosts,
  getPostBySlug,
  markdownToHtml
} from '../../lib/blog/api'

interface BlogPostPageProps {
  post: BlogPost & { htmlContent: string }
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ post }) => {
  const t = useTranslations('blog')
  const router = useRouter()

  if (router.isFallback) {
    return (
      <Layout>
        <Container maxW="4xl" py={8}>
          <Text>Loading...</Text>
        </Container>
      </Layout>
    )
  }

  if (!post) {
    return (
      <Layout>
        <Container maxW="4xl" py={8}>
          <VStack gap={4}>
            <Text>Post not found</Text>
            <Link href="/blog" passHref>
              <Button colorPalette="purple">
                <LuChevronLeft /> {t('backToBlog')}
              </Button>
            </Link>
          </VStack>
        </Container>
      </Layout>
    )
  }

  return (
    <Layout title={post.title}>
      <BlogLayout post={post}>
        {/* Back to blog button */}
        <Box mb={8}>
          <Link href="/blog" passHref>
            <Button
              variant="ghost"
              color="purple.500"
              _hover={{ bg: 'transparent', transform: 'translateX(-4px)' }}
              transition="all 0.3s ease"
            >
              <LuChevronLeft /> {t('backToBlog')}
            </Button>
          </Link>
        </Box>

        {/* Blog content — HTML parsed server-side from trusted markdown */}
        <Box
          dangerouslySetInnerHTML={{ __html: post.htmlContent }}
          css={{
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              fontWeight: 'bold',
              lineHeight: '1.3',
              mt: 8,
              mb: 4,
              color: 'white'
            },
            '& h1': { fontSize: '2xl' },
            '& h2': { fontSize: 'xl' },
            '& h3': { fontSize: 'lg' },
            '& p': {
              mb: 4,
              lineHeight: '1.7',
              fontSize: 'md',
              color: 'text-muted'
            },
            '& pre': {
              bg: 'code-block-bg',
              p: 4,
              borderRadius: 'md',
              overflow: 'auto',
              fontSize: 'sm',
              my: 6,
              border: '1px solid',
              borderColor: 'gray.600'
            },
            '& code': {
              bg: 'code-inline-bg',
              px: 2,
              py: 1,
              borderRadius: 'sm',
              fontSize: 'sm',
              fontFamily: 'mono'
            },
            '& pre code': {
              bg: 'transparent',
              p: 0,
              borderRadius: 0,
              fontSize: 'sm'
            },
            '& blockquote': {
              borderLeft: '4px solid',
              borderColor: 'purple.300',
              pl: 4,
              py: 2,
              bg: 'quote-bg',
              borderRadius: 'md',
              fontStyle: 'italic',
              my: 6
            },
            '& ul, & ol': {
              pl: 6,
              mb: 4
            },
            '& li': {
              mb: 2,
              color: 'text-muted'
            },
            '& a': {
              color: 'link-color',
              textDecoration: 'underline',
              _hover: {
                color: 'purple.200'
              }
            },
            '& img': {
              borderRadius: 'md',
              my: 6,
              maxW: '100%',
              height: 'auto'
            },
            '& table': {
              width: '100%',
              borderCollapse: 'collapse',
              my: 6
            },
            '& th, & td': {
              border: '1px solid',
              borderColor: 'gray.600',
              p: 3,
              textAlign: 'left'
            },
            '& th': {
              bg: 'code-inline-bg',
              fontWeight: 'bold'
            }
          }}
        />

        <Separator my={8} />

        {/* Navigation */}
        <Box textAlign="center">
          <Link href="/blog" passHref>
            <Button colorPalette="purple" size="lg">
              {t('backToBlog')}
            </Button>
          </Link>
        </Box>
      </BlogLayout>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const paths: { params: { slug: string }; locale: string }[] = []

  // Generate paths for each locale
  for (const locale of locales || ['es', 'en']) {
    try {
      const posts = getAllPosts(locale as 'en' | 'es')
      const localePaths = posts.map(post => ({
        params: { slug: post.slug },
        locale
      }))
      paths.push(...localePaths)
    } catch {
      // If no posts exist yet, continue
      console.log(`No posts found for locale: ${locale}`)
    }
  }

  return {
    paths,
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const lang = (locale || 'es') as 'en' | 'es'
  const slug = params?.slug as string

  try {
    const post = getPostBySlug(slug, lang)

    if (!post) {
      return {
        notFound: true
      }
    }

    const htmlContent = await markdownToHtml(post.content)

    return {
      props: {
        post: {
          ...post,
          htmlContent
        }
      },
      revalidate: 60 // Revalidate every minute
    }
  } catch {
    return {
      notFound: true
    }
  }
}

export default BlogPostPage
