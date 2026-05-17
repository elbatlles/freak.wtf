import { useState } from 'react'
import NextImage from 'next/image'
import { Heading, Box, Text, Badge, Icon, HStack, IconButton } from '@chakra-ui/react'
import { LuChevronRight, LuChevronLeft, LuArrowLeft } from 'react-icons/lu'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'

export const Title = ({ children }) => {
  const t = useTranslations('works')
  const router = useRouter()
  return (
  <Box mb={8}>
    <HStack
      as="span"
      display="inline-flex"
      gap={2}
      align="center"
      mb={6}
      px={3}
      py={1.5}
      borderRadius="full"
      border="1px solid"
      borderColor="rgba(168, 85, 247, 0.3)"
      bg="rgba(168, 85, 247, 0.07)"
      color="purple.300"
      fontSize="sm"
      fontWeight="medium"
      transition="all 0.2s"
      _hover={{
        bg: 'rgba(168, 85, 247, 0.15)',
        borderColor: 'purple.400',
        color: 'purple.200',
      }}
      cursor="pointer"
      onClick={() => router.back()}
    >
      <Icon as={LuArrowLeft} boxSize={4} />
      <Text as="span">{t('backToWorks')}</Text>
    </HStack>

    <Heading
      as="h1"
      fontSize={{ base: '4xl', md: '5xl' }}
      fontWeight="bold"
      lineHeight="tight"
      mb={4}
    >
      {children}
    </Heading>

    <Box
      h="3px"
      w="64px"
      borderRadius="full"
      bgGradient="to-r"
      gradientFrom="purple.400"
      gradientTo="blue.400"
    />
  </Box>
  )
}

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
  <WorkGallery images={[{ src, alt, width, height }]} />
)

interface GalleryImage {
  src: string
  alt: string
  width?: number
  height?: number
}

export const WorkGallery = ({ images }: { images: GalleryImage[] }) => {
  const [current, setCurrent] = useState(0)
  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length)
  const next = () => setCurrent(i => (i + 1) % images.length)

  return (
    <Box mb={6}>
      <Box
        position="relative"
        borderRadius="xl"
        overflow="hidden"
        border="1px solid"
        borderColor="rgba(168, 85, 247, 0.2)"
        boxShadow="0 4px 24px rgba(0,0,0,0.25), 0 0 0 1px rgba(168,85,247,0.08)"
        bg="#0a0a14"
        h={{ base: '220px', md: '340px', lg: '420px' }}
      >
        <NextImage
          src={images[current].src}
          alt={images[current].alt}
          fill
          sizes="(max-width: 768px) 100vw, 500px"
          style={{ objectFit: 'contain' }}
        />
        {images.length > 1 && (
          <>
            <IconButton
              aria-label="Previous image"
              size="sm"
              variant="solid"
              bg="rgba(10,10,20,0.7)"
              color="white"
              borderRadius="full"
              _hover={{ bg: 'rgba(168,85,247,0.8)' }}
              position="absolute"
              top="50%"
              left={2}
              style={{ transform: 'translateY(-50%)' }}
              zIndex={1}
              onClick={prev}
            >
              <Icon as={LuChevronLeft} />
            </IconButton>
            <IconButton
              aria-label="Next image"
              size="sm"
              variant="solid"
              bg="rgba(10,10,20,0.7)"
              color="white"
              borderRadius="full"
              _hover={{ bg: 'rgba(168,85,247,0.8)' }}
              position="absolute"
              top="50%"
              right={2}
              style={{ transform: 'translateY(-50%)' }}
              zIndex={1}
              onClick={next}
            >
              <Icon as={LuChevronRight} />
            </IconButton>
            <Box
              position="absolute"
              top={2}
              right={3}
              bg="rgba(10,10,20,0.65)"
              color="white"
              fontSize="xs"
              fontFamily="mono"
              px={2}
              py={0.5}
              borderRadius="md"
              letterSpacing="wide"
              zIndex={1}
            >
              {current + 1} / {images.length}
            </Box>
          </>
        )}
      </Box>

      {images.length > 1 && (
        <HStack justify="center" gap={1.5} mt={3}>
          {images.map((_, i) => (
            <Box
              key={i}
              as="button"
              onClick={() => setCurrent(i)}
              h="8px"
              w={i === current ? '20px' : '8px'}
              borderRadius="full"
              bg={i === current ? 'purple.400' : 'rgba(168,85,247,0.25)'}
              transition="all 0.25s ease"
              _hover={{ bg: 'purple.300' }}
            />
          ))}
        </HStack>
      )}
    </Box>
  )
}

export const Meta = ({ children }) => (
  <Badge
    variant="outline"
    colorPalette="purple"
    mr={2}
    fontSize="2xs"
    letterSpacing="widest"
    textTransform="uppercase"
    px={2.5}
    py={1}
    borderRadius="md"
    fontWeight="semibold"
  >
    {children}
  </Badge>
)
