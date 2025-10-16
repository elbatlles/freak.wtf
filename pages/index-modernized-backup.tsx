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

              <GridItem display="flex" justifyContent="center" alignItems="center">
                <MotionBox
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
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
            <VStack spacing={6} mb={12}>
              <Heading size="lg" textAlign="center">
                <Icon as={IoCodeSlashOutline} color="purple.400" mr={3} />
                Tech Stack
              </Heading>
              <Text color="gray.300" textAlign="center" fontSize="md">
                Tecnologías que uso en mi día a día
              </Text>
              
              <MotionGrid
                templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(8, 1fr)' }}
                gap={4}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
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
                    
                    <VStack align="start" spacing={3}>
                      <Text color="gray.300" lineHeight="tall" fontSize="sm">
                        <strong>Desarrollador Full Stack</strong> con más de 10 años de experiencia 
                        creando soluciones web innovadoras y escalables. Mi pasión es transformar 
                        ideas complejas en productos digitales elegantes y funcionales.
                      </Text>
                      
                      <Text color="gray.300" lineHeight="tall" fontSize="sm">
                        Especializado en <strong>React, TypeScript, Next.js</strong> y el ecosistema 
                        JavaScript moderno. También tengo experiencia sólida con <strong>C#, .NET</strong> 
                        y arquitecturas de microservicios.
                      </Text>
                      
                      <Text color="gray.300" lineHeight="tall" fontSize="sm">
                        Fundé <strong>Grafix</strong> en 2013 y co-fundé <strong>Kumux</strong> en 2020. 
                        Actualmente trabajo como Senior Developer en <strong>Travelport</strong>, donde 
                        lidero proyectos de gran escala en el sector travel-tech.
                      </Text>
                      
                      <Text color="gray.400" lineHeight="tall" fontSize="xs" fontStyle="italic">
                        "Me encanta resolver problemas complejos y crear experiencias de usuario excepcionales"
                      </Text>
                    </VStack>
                    
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

              {/* Social Links */}
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
                  <VStack spacing={4} h="100%" justify="space-between" px={1} py={1}>
                    <VStack spacing={1}>
                      <Text fontSize="xl">🤝</Text>
                      <Text fontWeight="bold" fontSize="sm">Conectemos</Text>
                      <Text fontSize="xs" color="gray.400" textAlign="center">
                        Hablemos de proyectos
                      </Text>
                    </VStack>
                    
                    <VStack spacing={2} w="100%" flex={1} justify="center">
                      <Link href="https://github.com/elbatlles" isExternal w="100%">
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
                      <Link href="https://twitter.com/elbatlles" isExternal w="100%">
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
                      <Link href="https://linkedin.com/in/angel-batlles" isExternal w="100%">
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={<Icon boxSize={4} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </Icon>}
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
                      Siempre abierto a nuevas ideas
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


            </MotionGrid>
          </Section>
        </Container>
      </Box>
    </Layout>
  )
}

export default Home