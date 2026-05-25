import {
  Avatar,
  Badge,
  Box,
  Container,
  Heading,
  HStack,
  Icon,
  Separator,
  Text,
  VStack
} from '@chakra-ui/react'
import { format } from 'date-fns'
import { enUS, es } from 'date-fns/locale'
import { motion } from 'framer-motion'
import NextLink from 'next/link'
import { FiCalendar, FiClock, FiTag } from 'react-icons/fi'
import type { BlogPost } from '../../lib/blog/api'
import { useColorModeValue } from '../../lib/color-mode'

const MotionBox = motion.create(Box)

interface BlogCardProps {
  post: BlogPost
  index?: number
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, index = 0 }) => {
  const cardBg = useColorModeValue('white', 'whiteAlpha.100')
  const cardBorder = useColorModeValue('gray.200', 'whiteAlpha.200')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const titleColor = useColorModeValue('gray.800', 'white')

  const dateLocale = post.lang === 'es' ? es : enUS

  return (
    <NextLink
      href={`/blog/${post.slug}`}
      style={{ display: 'block', height: '100%' }}
    >
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        bg={cardBg}
        border="1px"
        borderColor={cardBorder}
        borderRadius="xl"
        p={6}
        _hover={{
          transform: 'translateY(-4px)',
          shadow: 'lg',
          borderColor: 'purple.300'
        }}
        style={{ transition: 'all 0.3s ease' }}
        cursor="pointer"
        h="100%"
      >
        <VStack align="stretch" gap={4} h="100%">
          {/* Header */}
          <Box>
            <Badge
              colorPalette="purple"
              variant="subtle"
              mb={2}
              textTransform="capitalize"
            >
              {post.category}
            </Badge>
            <Heading
              as="h3"
              size="md"
              color={titleColor}
              lineHeight="1.3"
              lineClamp={2}
              mb={2}
            >
              {post.title}
            </Heading>
            <Text color={textColor} lineClamp={3} fontSize="sm">
              {post.excerpt}
            </Text>
          </Box>

          {/* Tags */}
          <HStack wrap="wrap" gap={1}>
            {post.tags.slice(0, 3).map(tag => (
              <Badge
                key={tag}
                size="sm"
                variant="subtle"
                colorPalette="purple"
                borderRadius="full"
                px={2}
              >
                #{tag}
              </Badge>
            ))}
          </HStack>

          <Separator />

          {/* Footer */}
          <HStack fontSize="xs" color={textColor} gap={4}>
            <HStack>
              <Icon as={FiCalendar} />
              <Text>
                {format(new Date(post.date), 'MMM dd, yyyy', {
                  locale: dateLocale
                })}
              </Text>
            </HStack>
            <HStack>
              <Icon as={FiClock} />
              <Text>{post.readingTime}</Text>
            </HStack>
          </HStack>
        </VStack>
      </MotionBox>
    </NextLink>
  )
}

interface BlogLayoutProps {
  children: React.ReactNode
  post?: BlogPost
}

export const BlogLayout: React.FC<BlogLayoutProps> = ({ children, post }) => {
  const titleColor = useColorModeValue('gray.800', 'white')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const preBg = useColorModeValue('gray.50', 'gray.800')
  const codeBg = useColorModeValue('gray.100', 'gray.700')
  const quoteBg = useColorModeValue('purple.50', 'purple.900')

  return (
    <Container maxW="4xl" py={8}>
      {post && (
        <VStack gap={6} align="stretch" mb={8}>
          {/* Article Header */}
          <Box textAlign="center">
            <Badge
              colorPalette="purple"
              variant="subtle"
              mb={4}
              textTransform="capitalize"
            >
              {post.category}
            </Badge>
            <Heading
              as="h1"
              size="xl"
              color={titleColor}
              lineHeight="1.2"
              mb={4}
            >
              {post.title}
            </Heading>
            <Text color={textColor} fontSize="lg" mb={6}>
              {post.excerpt}
            </Text>
          </Box>

          {/* Article Meta */}
          <HStack justify="center" gap={8} fontSize="sm" color={textColor}>
            <HStack>
              <Avatar.Root size="sm">
                <Avatar.Fallback name={post.author} />
              </Avatar.Root>
              <Text>{post.author}</Text>
            </HStack>
            <HStack>
              <Icon as={FiCalendar} />
              <Text>
                {format(new Date(post.date), 'MMMM dd, yyyy', {
                  locale: post.lang === 'es' ? es : enUS
                })}
              </Text>
            </HStack>
            <HStack>
              <Icon as={FiClock} />
              <Text>{post.readingTime}</Text>
            </HStack>
          </HStack>

          {/* Tags */}
          <HStack justify="center" wrap="wrap" gap={2}>
            {post.tags.map(tag => (
              <Badge key={tag} variant="outline" colorPalette="purple">
                <HStack gap={1}>
                  <Icon as={FiTag} w={3} h={3} />
                  <Text>{tag}</Text>
                </HStack>
              </Badge>
            ))}
          </HStack>

          <Separator />
        </VStack>
      )}

      {/* Content */}
      <Box
        className="blog-content"
        css={{
          '& h1, & h2, & h3, & h4, & h5, & h6': {
            fontWeight: 'bold',
            lineHeight: '1.3',
            mt: 8,
            mb: 4
          },
          '& h1': { fontSize: '2xl' },
          '& h2': { fontSize: 'xl' },
          '& h3': { fontSize: 'lg' },
          '& p': {
            mb: 4,
            lineHeight: '1.7',
            fontSize: 'md'
          },
          '& pre': {
            bg: preBg,
            p: 4,
            borderRadius: 'md',
            overflow: 'auto',
            fontSize: 'sm'
          },
          '& code': {
            bg: codeBg,
            px: 2,
            py: 1,
            borderRadius: 'sm',
            fontSize: 'sm'
          },
          '& blockquote': {
            borderLeft: '4px solid',
            borderColor: 'purple.300',
            pl: 4,
            py: 2,
            bg: quoteBg,
            borderRadius: 'md',
            fontStyle: 'italic'
          },
          '& ul, & ol': {
            pl: 6,
            mb: 4
          },
          '& li': {
            mb: 2
          },
          '& a': {
            color: 'purple.500',
            textDecoration: 'underline'
          },
          '& img': {
            borderRadius: 'md',
            my: 6
          }
        }}
      >
        {children}
      </Box>
    </Container>
  )
}
