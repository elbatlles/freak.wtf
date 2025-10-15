import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { 
  Box, 
  Container, 
  Text, 
  Button, 
  VStack,
  Divider,
  useColorModeValue
} from '@chakra-ui/react'
import { ChevronLeftIcon } from '@chakra-ui/icons'
import Layout from '../../components/layouts/article'
import { BlogLayout } from '../../components/blog/BlogCard'
import { getPostBySlug, getAllPosts, markdownToHtml, BlogPost } from '../../lib/blog/api'
import Lang from '../../lib/utils'

interface BlogPostPageProps {
  post: BlogPost & { htmlContent: string }
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ post }) => {
  const t = Lang('blog')
  const router = useRouter()
  const linkColor = useColorModeValue('purple.500', 'purple.300')
  const textColor = useColorModeValue('gray.700', 'gray.300')
  const headingColor = useColorModeValue('gray.800', 'white')
  const codeBlockBg = useColorModeValue('gray.50', 'gray.800')
  const codeBg = useColorModeValue('gray.100', 'gray.700')
  const quoteBg = useColorModeValue('purple.50', 'purple.900')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const tableBg = useColorModeValue('gray.50', 'gray.700')
  
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
          <VStack spacing={4}>
            <Text>Post not found</Text>
            <Link href="/blog" passHref>
              <Button leftIcon={<ChevronLeftIcon />} colorScheme="purple">
                {t.backToBlog}
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
              leftIcon={<ChevronLeftIcon />}
              variant="ghost"
              color={linkColor}
              _hover={{ bg: 'transparent', transform: 'translateX(-4px)' }}
              transition="all 0.3s ease"
            >
              {t.backToBlog}
            </Button>
          </Link>
        </Box>

        {/* Blog content */}
        <Box 
          dangerouslySetInnerHTML={{ __html: post.htmlContent }}
          sx={{
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              fontWeight: 'bold',
              lineHeight: '1.3',
              mt: 8,
              mb: 4,
              color: headingColor
            },
            '& h1': { fontSize: '2xl' },
            '& h2': { fontSize: 'xl' },
            '& h3': { fontSize: 'lg' },
            '& p': {
              mb: 4,
              lineHeight: '1.7',
              fontSize: 'md',
              color: textColor
            },
            '& pre': {
              bg: codeBlockBg,
              p: 4,
              borderRadius: 'md',
              overflow: 'auto',
              fontSize: 'sm',
              my: 6,
              border: '1px solid',
              borderColor: borderColor
            },
            '& code': {
              bg: codeBg,
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
              bg: quoteBg,
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
              color: textColor
            },
            '& a': {
              color: 'purple.500',
              textDecoration: 'underline',
              _hover: {
                color: 'purple.600'
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
              borderColor: borderColor,
              p: 3,
              textAlign: 'left'
            },
            '& th': {
              bg: tableBg,
              fontWeight: 'bold'
            }
          }}
        />

        <Divider my={8} />

        {/* Navigation */}
        <Box textAlign="center">
          <Link href="/blog" passHref>
            <Button colorScheme="purple" size="lg">
              {t.backToBlog}
            </Button>
          </Link>
        </Box>
      </BlogLayout>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const paths: any[] = []
  
  // Generate paths for each locale
  for (const locale of locales || ['es', 'en']) {
    try {
      const posts = getAllPosts(locale as 'en' | 'es')
      const localePaths = posts.map((post) => ({
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