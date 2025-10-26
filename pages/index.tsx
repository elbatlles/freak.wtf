import NextLink from 'next/link'
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
  useColorModeValue,
  Link
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { ChevronRightIcon } from '@chakra-ui/icons'
import {
  IoLogoGithub,
  IoLogoTwitter,
  IoCodeSlashOutline,
  IoReader
} from 'react-icons/io5'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import StarryBackground from '../components/home/StarryBackground'
import VoxelMeHomepage from '../components/home/VoxelMeHomepage'
import Lang from '../lib/utils'

const MotionBox = motion(Box)
const MotionGrid = motion(Grid)

const Home = () => {
  const t = Lang('home')

  const glassBg = useColorModeValue(
    'rgba(255, 255, 255, 0.25)',
    'rgba(255, 255, 255, 0.1)'
  )
  const glassBorder = useColorModeValue(
    'rgba(255, 255, 255, 0.3)',
    'rgba(255, 255, 255, 0.2)'
  )
  const gradientText = useColorModeValue(
    'linear(to-r, purple.600, blue.600)',
    'linear(to-r, purple.300, blue.300)'
  )

  return (
    <Layout>
      <Box position="relative" minH="100vh" overflow="hidden">
        <StarryBackground />

        <Container
          maxW="6xl"
          py={{ base: 4, md: 8 }}
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
              templateColumns={{ base: '1fr', lg: '2fr 1fr' }}
              gap={{ base: 6, md: 8 }}
              alignItems="center"
              minH={{ base: 'auto', md: '60vh' }}
            >
              <GridItem>
                <VStack align="start" spacing={6}>
                  <MotionBox
                    bg={glassBg}
                    backdropFilter="blur(20px)"
                    border="1px solid"
                    borderColor={glassBorder}
                    borderRadius="xl"
                    p={4}
                    boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
                  >
                    <Text fontSize="sm" color="purple.400" fontWeight="medium">
                      {t.title}
                    </Text>
                  </MotionBox>

                  <Box>
                    <Heading
                      as="h1"
                      size={{ base: 'xl', md: '2xl' }}
                      mb={4}
                      bgGradient={gradientText}
                      bgClip="text"
                      lineHeight="shorter"
                    >
                      Angel Batlles
                    </Heading>
                    <Text
                      fontSize={{ base: 'lg', md: 'xl' }}
                      color="gray.500"
                      mb={2}
                    >
                      {t.subName}
                    </Text>
                    <Text
                      fontSize={{ base: 'sm', md: 'md' }}
                      color="gray.400"
                      maxW="md"
                    >
                      {t.workText}
                    </Text>
                  </Box>

                  <HStack spacing={{ base: 2, md: 4 }} flexWrap="wrap">
                    <NextLink href="/works" passHref>
                      <Button
                        size={{ base: 'md', md: 'lg' }}
                        colorScheme="purple"
                        rightIcon={<ChevronRightIcon />}
                        bg="purple.500"
                        _hover={{
                          bg: 'purple.600',
                          transform: 'translateY(-2px)'
                        }}
                        transition="all 0.3s ease"
                      >
                        {t.bottomPortfolio}
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
                        rightIcon={<Icon as={IoReader} />}
                      >
                        Blog
                      </Button>
                    </NextLink>
                  </HStack>
                </VStack>
              </GridItem>

              <GridItem
                display={{ base: 'none', lg: 'flex' }}
                justifyContent="center"
                alignItems="center"
              >
                <MotionBox
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  w="500px"
                  h="600px"
                  position="relative"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <VoxelMeHomepage />
                </MotionBox>
              </GridItem>
            </Grid>
          </MotionBox>

          {/* Tech Stack Section */}
          <Section delay={0.3}>
            <VStack spacing={6} mb={12} display={{ base: 'none', md: 'flex' }}>
              <Heading size="lg" textAlign="center">
                <Icon as={IoCodeSlashOutline} color="purple.400" mr={3} />
                {t.techStack}
              </Heading>
              <Text color="gray.300" textAlign="center" fontSize="md">
                {t.techStackSubtitle}
              </Text>

              <MotionGrid
                templateColumns={{
                  base: 'repeat(2, 1fr)',
                  md: 'repeat(8, 1fr)'
                }}
                gap={4}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {[
                  { name: 'React', icon: '⚛️' },
                  { name: 'TypeScript', icon: '📘' },
                  { name: 'JavaScript', icon: '🟨' },
                  { name: 'Next.js', icon: '▲' },
                  { name: 'Node.js', icon: '🟢' },
                  { name: 'C#', icon: '🔷' },
                  { name: 'Tailwind', icon: '🎨' },
                  { name: 'Jest', icon: '🧪' }
                ].map((tech, index) => (
                  <GridItem key={index}>
                    <MotionBox
                      bg={glassBg}
                      backdropFilter="blur(20px)"
                      border="1px solid"
                      borderColor={glassBorder}
                      borderRadius="xl"
                      p={6}
                      textAlign="center"
                      boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
                      _hover={{
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.5)'
                      }}
                      transition="all 0.3s ease"
                    >
                      <VStack spacing={3}>
                        <Text fontSize="3xl">{tech.icon}</Text>
                        <Text fontWeight="bold" fontSize="sm" color="gray.200">
                          {tech.name}
                        </Text>
                      </VStack>
                    </MotionBox>
                  </GridItem>
                ))}
              </MotionGrid>
            </VStack>
          </Section>

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
                  transition="all 0.3s ease"
                >
                  <VStack align="start" spacing={4} h="100%">
                    <HStack>
                      <Icon
                        as={IoCodeSlashOutline}
                        color="purple.400"
                        boxSize={{ base: 5, md: 6 }}
                      />
                      <Heading size={{ base: 'sm', md: 'md' }}>
                        {t.aboutMe}
                      </Heading>
                    </HStack>

                    <VStack align="start" spacing={3}>
                      <Text
                        color="gray.300"
                        lineHeight="tall"
                        fontSize={{ base: 'xs', md: 'sm' }}
                      >
                        <strong>{t.aboutDescription}</strong> <strong>Travelport</strong>.
                      </Text>

                      <Text
                        color="gray.300"
                        lineHeight="tall"
                        fontSize={{ base: 'xs', md: 'sm' }}
                      >
                        🚀 {t.aboutPassion}{' '}
                        <strong>
                          {t.aboutPassionBold}
                        </strong>
                        {t.aboutPassionEnd}
                      </Text>

                      <Text
                        color="gray.300"
                        lineHeight="tall"
                        fontSize={{ base: 'xs', md: 'sm' }}
                      >
                        🎯 <strong>{t.aboutSpecialized}</strong> {t.aboutSpecializedText}
                      </Text>

                      <Text
                        color="gray.300"
                        lineHeight="tall"
                        fontSize={{ base: 'xs', md: 'sm' }}
                      >
                        💪 {t.aboutFreetime} <strong>{t.aboutFreetimeBold}</strong>{t.aboutFreetimeEnd}
                      </Text>

                      <Text
                        color="purple.300"
                        lineHeight="tall"
                        fontSize={{ base: 'xs', md: 'sm' }}
                        fontWeight="medium"
                      >
                        🌟 {t.aboutProject}
                      </Text>
                    </VStack>

                    <VStack align="start" spacing={2} mt="auto">
                      <Badge colorScheme="purple" variant="subtle">
                        📍 {t.locationBadge}
                      </Badge>
                      <Badge colorScheme="blue" variant="subtle">
                        💼 {t.jobBadge}
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
                  p={{ base: 4, md: 6 }}
                  h={{ base: 'auto', md: '100%' }}
                  minH={{ base: '200px', md: 'auto' }}
                  textAlign="center"
                  boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.5)'
                  }}
                  transition="all 0.3s ease"
                >
                  <VStack
                    spacing={4}
                    h="100%"
                    justify="space-between"
                    px={1}
                    py={1}
                  >
                    <VStack spacing={1}>
                      <Text fontSize={{ base: 'lg', md: 'xl' }}>🤝</Text>
                      <Text
                        fontWeight="bold"
                        fontSize={{ base: 'xs', md: 'sm' }}
                      >
                        {t.connectTitle}
                      </Text>
                      <Text
                        fontSize={{ base: 'xs', md: 'xs' }}
                        color="gray.400"
                        textAlign="center"
                      >
                        {t.connectSubtitle}
                      </Text>
                    </VStack>

                    <VStack spacing={2} w="100%" flex={1} justify="center">
                      <Link
                        href="https://github.com/elbatlles"
                        isExternal
                        w="100%"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={<Icon as={IoLogoGithub} />}
                          w="100%"
                          borderColor="gray.600"
                          color="gray.300"
                          _hover={{
                            borderColor: 'gray.400',
                            color: 'white',
                            bg: 'gray.700'
                          }}
                        >
                          GitHub
                        </Button>
                      </Link>
                      <Link
                        href="https://twitter.com/elbatlles"
                        isExternal
                        w="100%"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={<Icon as={IoLogoTwitter} />}
                          w="100%"
                          borderColor="blue.600"
                          color="blue.400"
                          _hover={{
                            borderColor: 'blue.400',
                            color: 'white',
                            bg: 'blue.600'
                          }}
                        >
                          Twitter
                        </Button>
                      </Link>
                      <Link
                        href="https://linkedin.com/in/angel-batlles"
                        isExternal
                        w="100%"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={
                            <Icon
                              boxSize={4}
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </Icon>
                          }
                          w="100%"
                          borderColor="blue.500"
                          color="blue.300"
                          _hover={{
                            borderColor: 'blue.300',
                            color: 'white',
                            bg: 'blue.500'
                          }}
                        >
                          LinkedIn
                        </Button>
                      </Link>
                    </VStack>

                    <Text fontSize="xs" color="gray.500" textAlign="center">
                      {t.alwaysOpen}
                    </Text>
                  </VStack>
                </MotionBox>
              </GridItem>

              {/* Quick Links */}
              <GridItem>
                <MotionBox
                  bg={glassBg}
                  backdropFilter="blur(20px)"
                  border="1px solid"
                  borderColor={glassBorder}
                  borderRadius="xl"
                  p={{ base: 4, md: 6 }}
                  h={{ base: 'auto', md: '100%' }}
                  minH={{ base: '200px', md: 'auto' }}
                  textAlign="center"
                  boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.5)'
                  }}
                  transition="all 0.3s ease"
                >
                  <VStack spacing={4}>
                    <Icon
                      as={IoReader}
                      color="purple.400"
                      boxSize={{ base: 6, md: 8 }}
                    />
                    <Text fontWeight="bold" fontSize={{ base: 'sm', md: 'md' }}>
                      {t.blogTech}
                    </Text>
                    <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.400">
                      {t.blogSubtitle}
                    </Text>
                    <NextLink href="/blog" passHref>
                      <Button size="sm" colorScheme="purple" variant="ghost">
                        {t.readMore}
                      </Button>
                    </NextLink>
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
