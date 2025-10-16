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
  Image,
  Icon,
  useColorModeValue,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Link
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { 
  IoLogoGithub, 
  IoLogoTwitter, 
  IoLogoInstagram,
  IoBrushOutline,
  IoCodeSlashOutline,
  IoRocket,
  IoReader
} from 'react-icons/io5'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import FloatingParticles from '../components/home/FloatingParticles'
import VoxelMe from '../components/VoxelMe/voxel-me'
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
      <Box position="relative" minH="100vh">
        <FloatingParticles />
        
        <Container maxW="6xl" py={8}>
          {/* Hero Section */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            mb={12}
          >
            <Grid
              templateColumns={{ base: '1fr', lg: '2fr 1fr' }}
              gap={8}
              alignItems="center"
              minH="60vh"
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
                      size="2xl" 
                      mb={4}
                      bgGradient={gradientText}
                      bgClip="text"
                      lineHeight="shorter"
                    >
                      Angel Batlles
                    </Heading>
                    <Text fontSize="xl" color="gray.500" mb={2}>
                      {t.subName}
                    </Text>
                    <Text fontSize="md" color="gray.400" maxW="md">
                      {t.workText}
                    </Text>
                  </Box>

                  <HStack spacing={4}>
                    <NextLink href="/works" passHref>
                      <Button 
                        size="lg" 
                        colorScheme="purple" 
                        rightIcon={<ChevronRightIcon />}
                        bg="purple.500"
                        _hover={{ bg: 'purple.600', transform: 'translateY(-2px)' }}
                        transition="all 0.3s ease"
                      >
                        {t.bottomPortfolio}
                      </Button>
                    </NextLink>
                    <NextLink href="/blog" passHref>
                      <Button 
                        size="lg" 
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

              <GridItem display="flex" justifyContent="center">
                <MotionBox
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  w="300px"
                  h="300px"
                  position="relative"
                >
                  <VoxelMe />
                </MotionBox>
              </GridItem>
            </Grid>
          </MotionBox>

          {/* Stats Section */}
          <Section delay={0.3}>
            <MotionGrid
              templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
              gap={6}
              mb={12}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {[
                { label: 'Años de Experiencia', value: '10+', icon: IoCodeSlashOutline },
                { label: 'Proyectos Completados', value: '50+', icon: IoRocket },
                { label: 'Tecnologías', value: '15+', icon: IoBrushOutline },
                { label: 'Posts en Blog', value: '2', icon: IoReader },
              ].map((stat, index) => (
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
                    <Icon as={stat.icon} size="2xl" color="purple.400" mb={2} />
                    <Stat>
                      <StatNumber fontSize="2xl" color="purple.300">
                        {stat.value}
                      </StatNumber>
                      <StatLabel fontSize="sm">
                        {stat.label}
                      </StatLabel>
                    </Stat>
                  </MotionBox>
                </GridItem>
              ))}
            </MotionGrid>
          </Section>

          {/* Bento Grid Layout */}
          <Section delay={0.5}>
            <MotionGrid
              templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
              templateRows={{ base: 'auto', md: 'repeat(3, 200px)' }}
              gap={6}
              mb={12}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {/* About Card */}
              <GridItem colSpan={{ base: 1, md: 2 }} rowSpan={2}>
                <MotionBox
                  bg={glassBg}
                  backdropFilter="blur(20px)"
                  border="1px solid"
                  borderColor={glassBorder}
                  borderRadius="xl"
                  p={8}
                  h="100%"
                  boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
                  _hover={{ 
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.5)'
                  }}
                  transition="all 0.3s ease"
                >
                  <VStack align="start" spacing={4} h="100%">
                    <HStack>
                      <Icon as={IoCodeSlashOutline} color="purple.400" boxSize={6} />
                      <Heading size="md">Sobre mí</Heading>
                    </HStack>
                    
                    <Text color="gray.300" lineHeight="tall">
                      Desarrollador Full Stack con más de 10 años de experiencia creando 
                      soluciones web innovadoras. Especializado en React, TypeScript, y 
                      tecnologías modernas. Actualmente trabajando en Travelport como 
                      Senior Developer.
                    </Text>
                    
                    <VStack align="start" spacing={2} mt="auto">
                      <Badge colorScheme="purple" variant="subtle">
                        📍 Barcelona, España
                      </Badge>
                      <Badge colorScheme="blue" variant="subtle">
                        💼 Senior Developer @ Travelport
                      </Badge>
                    </VStack>
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
                  p={6}
                  h="100%"
                  textAlign="center"
                  boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
                  _hover={{ 
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.5)'
                  }}
                  transition="all 0.3s ease"
                >
                  <VStack spacing={4}>
                    <Icon as={IoReader} color="purple.400" boxSize={8} />
                    <Text fontWeight="bold">Blog Tech</Text>
                    <Text fontSize="sm" color="gray.400">
                      Tutoriales y experiencias
                    </Text>
                    <NextLink href="/blog" passHref>
                      <Button size="sm" colorScheme="purple" variant="ghost">
                        Leer →
                      </Button>
                    </NextLink>
                  </VStack>
                </MotionBox>
              </GridItem>

              {/* Social Links */}
              <GridItem colSpan={{ base: 1, md: 1 }}>
                <MotionBox
                  bg={glassBg}
                  backdropFilter="blur(20px)"
                  border="1px solid"
                  borderColor={glassBorder}
                  borderRadius="xl"
                  p={6}
                  h="100%"
                  boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
                  _hover={{ 
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.5)'
                  }}
                  transition="all 0.3s ease"
                >
                  <VStack spacing={4}>
                    <Text fontWeight="bold" fontSize="sm">Sígueme</Text>
                    <VStack spacing={2}>
                      <Link href="https://github.com/elbatlles" isExternal>
                        <Button
                          size="sm"
                          variant="ghost"
                          leftIcon={<Icon as={IoLogoGithub} />}
                          color="gray.300"
                          _hover={{ color: 'white' }}
                        >
                          GitHub
                        </Button>
                      </Link>
                      <Link href="https://twitter.com/elbatlles" isExternal>
                        <Button
                          size="sm"
                          variant="ghost"
                          leftIcon={<Icon as={IoLogoTwitter} />}
                          color="gray.300"
                          _hover={{ color: 'white' }}
                        >
                          Twitter
                        </Button>
                      </Link>
                    </VStack>
                  </VStack>
                </MotionBox>
              </GridItem>

              {/* Journey Timeline (Condensed) */}
              <GridItem colSpan={{ base: 1, md: 3 }}>
                <MotionBox
                  bg={glassBg}
                  backdropFilter="blur(20px)"
                  border="1px solid"
                  borderColor={glassBorder}
                  borderRadius="xl"
                  p={6}
                  h="100%"
                  boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
                  _hover={{ 
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.5)'
                  }}
                  transition="all 0.3s ease"
                >
                  <VStack align="start" spacing={4}>
                    <Heading size="md">Mi Journey</Heading>
                    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} w="100%">
                      {[
                        { year: '2013', event: 'Fundé Grafix' },
                        { year: '2020', event: 'Co-fundé Kumux' },
                        { year: '2021', event: 'Freelancer' },
                        { year: '2022', event: 'Travelport' },
                      ].map((item, index) => (
                        <VStack key={index} spacing={1} align="center">
                          <Badge colorScheme="purple" variant="solid" fontSize="xs">
                            {item.year}
                          </Badge>
                          <Text fontSize="xs" textAlign="center" color="gray.300">
                            {item.event}
                          </Text>
                        </VStack>
                      ))}
                    </SimpleGrid>
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