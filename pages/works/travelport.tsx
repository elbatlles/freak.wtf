import { Container, Badge, List, Grid, GridItem, Text, Heading, Box, AspectRatio } from '@chakra-ui/react'
import { Title, Meta } from '../../components/work'
import P from '../../components/paragraph'
import Layout from '../../components/layouts/article'
import { useTranslations } from 'next-intl'

const Work = () => {
  const t = useTranslations('works')
  return (
    <Layout title="Travelport">
      <Container maxW="6xl">
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={10} alignItems="start">
          <GridItem>
            <Title>
              Travelport <Badge>2022 – present</Badge>
            </Title>
            <P>{t('textTravelport')}</P>
            <List.Root ml={4} my={4}>
              <List.Item>
                <Meta>Role</Meta>
                <span>Software Development Engineer</span>
              </List.Item>
              <List.Item>
                <Meta>Location</Meta>
                <span>Barcelona, Spain (hybrid)</span>
              </List.Item>
              <List.Item>
                <Meta>Stack</Meta>
                <span>TypeScript, React, Node.js, REST APIs, Java</span>
              </List.Item>
            </List.Root>
          </GridItem>
          <GridItem>
            <Box
              bg={{ base: 'rgba(255,255,255,0.15)', _dark: 'rgba(255,255,255,0.05)' }}
              backdropFilter="blur(20px)"
              border="1px solid"
              borderColor={{ base: 'rgba(255,255,255,0.3)', _dark: 'rgba(255,255,255,0.1)' }}
              borderRadius="xl"
              p={8}
            >
              <Heading as="h3" fontSize="md" fontWeight="semibold" mb={4} opacity={0.7}>
                What I work on
              </Heading>
              <List.Root gap={3} ml={2}>
                <List.Item fontSize="sm" lineHeight="tall">
                  Plugin workflows and integrations for travel commerce platforms used by airlines, hotels and agencies worldwide.
                </List.Item>
                <List.Item fontSize="sm" lineHeight="tall">
                  Platform SDKs for developer teams, including API design and developer experience tooling.
                </List.Item>
                <List.Item fontSize="sm" lineHeight="tall">
                  Frontend performance optimisation and component architecture across products.
                </List.Item>
              </List.Root>
              <Box mt={6} pt={6} borderTop="1px solid" borderColor={{ base: 'rgba(0,0,0,0.08)', _dark: 'rgba(255,255,255,0.08)' }}>
                <Text fontSize="xs" opacity={0.5}>
                  Travelport is a global distribution system (GDS) and travel commerce platform operating in 165+ countries.
                </Text>
              </Box>
            </Box>
          </GridItem>
        </Grid>

        <Box mt={10}>
          <Heading as="h3" fontSize="md" fontWeight="semibold" mb={4} opacity={0.7}>
            About Travelport
          </Heading>
          <AspectRatio ratio={16 / 9} borderRadius="xl" overflow="hidden">
            <iframe
              src="https://www.youtube.com/embed/UWuocEtI6vc"
              title="Travelport"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: 0 }}
            />
          </AspectRatio>
        </Box>
      </Container>
    </Layout>
  )
}

export default Work
