import NextLink from 'next/link'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Grid,
  GridItem,
  Badge,
  Icon,
  Link
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { LuChevronRight } from 'react-icons/lu'
import {
  IoLogoGithub,
  IoCodeSlashOutline,
  IoReader
} from 'react-icons/io5'
import { FaXTwitter } from 'react-icons/fa6'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { useTranslations } from 'next-intl'
import { useColorModeValue } from '../lib/color-mode'


const MotionBox = motion(Box)
const MotionGrid = motion(Grid)

// Lazy load heavy 3D components
const StarryBackground = dynamic(() => import('../components/home/StarryBackground'), { 
  ssr: false,
  loading: () => <Box h="100vh" />
})
const VoxelMeHomepage = dynamic(() => import('../components/home/VoxelMeHomepage'), { 
  ssr: false,
  loading: () => <Box />
})
const MiniTerminal = dynamic(() => import('../components/home/MiniTerminal'), {
  ssr: false,
  loading: () => <Box />
})

const Home = () => {
  const t = useTranslations('home')
  const { locale } = useRouter()

  const glassBg = useColorModeValue(
    'rgba(255, 255, 255, 0.25)',
    'rgba(255, 255, 255, 0.1)'
  )
  const glassBorder = useColorModeValue(
    'rgba(255, 255, 255, 0.3)',
    'rgba(255, 255, 255, 0.2)'
  )
  return (
    <Layout>
      <Box position="relative" minH="100vh" overflow="hidden">
        <StarryBackground />

        <Container
          maxW="6xl"
          pt={{ base: 4, md: 8 }}
          pb={{ base: 12, md: 16 }}
          px={{ base: 4, md: 6 }}
          position="relative"
          zIndex={2}
        >
          {/* Hero Section */}
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            mb={{ base: 8, md: 12 }}
          >
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
              gap={{ base: 6, md: 6 }}
              alignItems="center"
            >
              <GridItem colSpan={{ base: 1, md: 2 }} minW={0} overflow="hidden">
                <VStack align="stretch" gap={5} w="full" minW={0}>
                  {/* Terminal with bio as initial output */}
                  <MotionBox
                    w="full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <MiniTerminal
                      h={{ base: '320px', md: '300px' }}
                      locale={locale}
                    />
                  </MotionBox>

                  <HStack gap={{ base: 2, md: 4 }} flexWrap="wrap">
                    <NextLink href="/works" passHref>
                      <Button
                        size={{ base: 'md', md: 'lg' }}
                        colorPalette="purple"
                        bg="purple.500"
                        _hover={{
                          bg: 'purple.600',
                          transform: 'translateY(-2px)'
                        }}
                        transition="all 0.3s ease"
                      >
                        {t('bottomPortfolio')} <LuChevronRight />
                      </Button>
                    </NextLink>
                    <NextLink href="/blog" passHref>
                      <Button
                        size={{ base: 'md', md: 'lg' }}
                        variant="outline"
                        borderColor="purple.300"
                        color="purple.400"
                        _hover={{
                          bg: 'purple.50',
                          borderColor: 'purple.400',
                          transform: 'translateY(-2px)'
                        }}
                        transition="all 0.3s ease"
                      >
                        Blog <Icon as={IoReader} />
                      </Button>
                    </NextLink>
                  </HStack>
                </VStack>
              </GridItem>

              <GridItem colSpan={1} display={{ base: 'none', md: 'flex' }} justifyContent="center" alignItems="center" minH="400px">
                {/* 3D model */}
                <MotionBox
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  w="full"
                  h="400px"
                  position="relative"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                >
                  <Box
                    position="absolute"
                    inset="0"
                    borderRadius="2xl"
                    bg="radial-gradient(circle at 50% 50%, rgba(138, 43, 226, 0.15), transparent 70%)"
                    filter="blur(40px)"
                    pointerEvents="none"
                  />
                  <VoxelMeHomepage />
                </MotionBox>
              </GridItem>
            </Grid>
          </MotionBox>

          {/* Bento Grid Layout */}
          <Section delay={0.5}>
            <MotionGrid
              templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
              templateRows={{ base: 'auto', md: 'repeat(3, 250px)' }}
              gap={{ base: 4, md: 6 }}
              mb={12}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* About Card */}
              <GridItem
                colSpan={{ base: 1, md: 2 }}
                rowSpan={{ base: 1, md: 2 }}
              >
                <MotionBox
                  bg={glassBg}
                  backdropFilter="blur(20px)"
                  border="1px solid"
                  borderColor={glassBorder}
                  borderRadius="xl"
                  p={{ base: 6, md: 8 }}
                  h={{ base: 'auto', md: '100%' }}
                  minH={{ base: '300px', md: 'auto' }}
                  boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.5)'
                  }}
                  style={{ transition: "all 0.3s ease" }}
                >
                  <VStack align="start" gap={4} h="100%">
                    <HStack>
                      <Icon
                        as={IoCodeSlashOutline}
                        color="purple.400"
                        boxSize={{ base: 5, md: 6 }}
                      />
                      <Heading size={{ base: 'sm', md: 'md' }}>
                        {t('aboutMe')}
                      </Heading>
                    </HStack>

                    <VStack align="start" gap={3}>
                      <Text
                        color="gray.300"
                        lineHeight="tall"
                        fontSize={{ base: 'xs', md: 'sm' }}
                      >
                        <strong>{t('aboutDescription')}</strong> <strong>Travelport</strong>.
                      </Text>

                      <Text
                        color="gray.300"
                        lineHeight="tall"
                        fontSize={{ base: 'xs', md: 'sm' }}
                      >
                        🚀 {t('aboutPassion')}{' '}
                        <strong>
                          {t('aboutPassionBold')}
                        </strong>
                        {t('aboutPassionEnd')}
                      </Text>

                      <Text
                        color="gray.300"
                        lineHeight="tall"
                        fontSize={{ base: 'xs', md: 'sm' }}
                      >
                        🎯 <strong>{t('aboutSpecialized')}</strong> {t('aboutSpecializedText')}
                      </Text>

                      <Text
                        color="gray.300"
                        lineHeight="tall"
                        fontSize={{ base: 'xs', md: 'sm' }}
                      >
                        💪 {t('aboutFreetime')} <strong>{t('aboutFreetimeBold')}</strong>{t('aboutFreetimeEnd')}
                      </Text>

                      <Text
                        color="purple.300"
                        lineHeight="tall"
                        fontSize={{ base: 'xs', md: 'sm' }}
                        fontWeight="medium"
                      >
                        🌟 {t('aboutProject')}
                      </Text>
                    </VStack>

                    <VStack align="start" gap={2} mt="auto">
                      <Badge colorPalette="purple" variant="subtle">
                        📍 {t('locationBadge')}
                      </Badge>
                      <Badge colorPalette="blue" variant="subtle">
                        💼 {t('jobBadge')}
                      </Badge>
                    </VStack>
                  </VStack>
                </MotionBox>
              </GridItem>

              {/* Social Links */}
              <GridItem>
                <MotionBox
                  bg={glassBg}
                  backdropFilter="blur(20px)"
                  border="1px solid"
                  borderColor={glassBorder}
                  borderRadius="xl"
                  p={{ base: 5, md: 5 }}
                  h={{ base: 'auto', md: '100%' }}
                  minH={{ base: '200px', md: 'auto' }}
                  textAlign="center"
                  boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.5)'
                  }}
                  style={{ transition: "all 0.3s ease" }}
                >
                  <VStack
                    gap={4}
                    h="100%"
                    justify="space-between"
                  >
                    <VStack gap={1}>
                      <Text fontSize={{ base: 'lg', md: 'xl' }}>🤝</Text>
                      <Text
                        fontWeight="bold"
                        fontSize={{ base: 'xs', md: 'sm' }}
                      >
                        {t('connectTitle')}
                      </Text>
                      <Text
                        fontSize={{ base: 'xs', md: 'xs' }}
                        color="gray.400"
                        textAlign="center"
                      >
                        {t('connectSubtitle')}
                      </Text>
                    </VStack>

                    <VStack gap={2} w="100%" flex={1} justify="center">
                      <Link
                        href="https://github.com/elbatlles"
                        target="_blank" rel="noopener noreferrer"
                        w="100%"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          w="100%"
                          borderColor="gray.600"
                          color="gray.300"
                          _hover={{
                            borderColor: 'gray.400',
                            color: 'white',
                            bg: 'gray.700'
                          }}
                        >
                          <Icon as={IoLogoGithub} /> GitHub
                        </Button>
                      </Link>
                      <Link
                        href="https://x.com/elbatlles"
                        target="_blank" rel="noopener noreferrer"
                        w="100%"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          w="100%"
                          borderColor="gray.600"
                          color="gray.300"
                          _hover={{
                            borderColor: 'gray.400',
                            color: 'white',
                            bg: 'gray.700'
                          }}
                        >
                          <Icon as={FaXTwitter} /> X
                        </Button>
                      </Link>
                      <Link
                        href="https://www.linkedin.com/in/abatlles/"
                        target="_blank" rel="noopener noreferrer"
                        w="100%"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          w="100%"
                          borderColor="blue.500"
                          color="blue.300"
                          _hover={{
                            borderColor: 'blue.300',
                            color: 'white',
                            bg: 'blue.500'
                          }}
                        >
                          <Icon
                            boxSize={4}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </Icon>{' '}
                          LinkedIn
                        </Button>
                      </Link>
                    </VStack>

                    <Text fontSize="xs" color="gray.500" textAlign="center">
                      {t('alwaysOpen')}
                    </Text>
                  </VStack>
                </MotionBox>
              </GridItem>

            </MotionGrid>
          </Section>
        </Container>
      </Box>
    </Layout>
  )
}

export default Home
