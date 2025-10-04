import { Container, Heading, Text, Box, VStack, useColorModeValue } from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import Lang from '../lib/utils'
import { useRouter } from 'next/router'

const Posts = () => {
  const t = Lang('blog')
  const router = useRouter()
  
  const bgGradient = useColorModeValue(
    'linear(to-r, purple.50, blue.50)',
    'linear(to-r, purple.900, blue.900)'
  )
  const textColor = useColorModeValue('gray.600', 'gray.300')

  return (
    <Layout title={t.title}>
      <Container maxW="6xl" py={8}>
        <VStack spacing={8} textAlign="center">
          <Box bg={bgGradient} p={8} borderRadius="2xl" w="100%">
            <Heading as="h1" size="xl" mb={4}>
              {t.title}
            </Heading>
            <Text fontSize="lg" color={textColor}>
              {t.subtitle}
            </Text>
          </Box>
          
          <Box py={16}>
            <Heading as="h2" size="lg" mb={4}>
              {t.commingSoon}
            </Heading>
            <Text color={textColor} maxW="2xl">
              {router.locale === 'es' 
                ? 'Estoy preparando contenido increíble sobre desarrollo, tecnología y programación. ¡Vuelve pronto!'
                : 'I\'m preparing amazing content about development, technology and programming. Come back soon!'
              }
            </Text>
          </Box>
        </VStack>
      </Container>
    </Layout>
  )
}

export default Posts
