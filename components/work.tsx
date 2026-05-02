import NextLink from 'next/link'
import NextImage from 'next/image'
import { Heading, Box, Link, Badge } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'

export const Title = ({ children }) => (
  <Box>
    <NextLink href="/works">
      <Link>Works</Link>
    </NextLink>
    <span>
      {' '}
      <ChevronRightIcon />{' '}
    </span>
    <Heading display="inline-block" as="h3" fontSize={20} mb={4}>
      {children}
    </Heading>
  </Box>
)

export const WorkImage = ({
  src,
  alt,
  width = 1200,
  height = 800
}: {
  src: string
  alt: string
  width?: number
  height?: number
}) => (
  <Box position="relative" borderRadius="lg" overflow="hidden" mb={4}>
    <NextImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes="(max-width: 768px) 100vw, 700px"
      style={{ width: '100%', height: 'auto', display: 'block' }}
      loading="lazy"
    />
  </Box>
)

export const Meta = ({ children }) => (
  <Badge colorScheme="green" mr={2}>
    {children}
  </Badge>
)
