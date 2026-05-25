import {
  AspectRatio,
  Badge,
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  List,
  Text
} from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import Layout from '../../components/layouts/article'
import P from '../../components/paragraph'
import { Meta, Title } from '../../components/work'

const Work = () => {
  const t = useTranslations('works')
  return (
    <Layout title="Travelport">
      <Container maxW="6xl">
        <Grid
          templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
          gap={10}
          alignItems="start"
        >
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
                <span>TypeScript, React, Node.js, REST APIs, .NET</span>
              </List.Item>
            </List.Root>
          </GridItem>
          <GridItem>
            <Box
              bg="rgba(255,255,255,0.15)"
              backdropFilter="blur(20px)"
              border="1px solid"
              borderColor="rgba(255,255,255,0.3)"
              borderRadius="xl"
              p={8}
            >
              <Heading
                as="h3"
                fontSize="md"
                fontWeight="semibold"
                mb={4}
                opacity={0.7}
              >
                {t('travelportWhatIWorkOn')}
              </Heading>
              <List.Root gap={3} ml={2}>
                <List.Item fontSize="sm" lineHeight="tall">
                  {t('travelportItem1')}
                </List.Item>
                <List.Item fontSize="sm" lineHeight="tall">
                  {t('travelportItem2')}
                </List.Item>
                <List.Item fontSize="sm" lineHeight="tall">
                  {t('travelportItem3')}
                </List.Item>
              </List.Root>
              <Box
                mt={6}
                pt={6}
                borderTop="1px solid"
                borderColor="rgba(0,0,0,0.08)"
              >
                <Text fontSize="xs" opacity={0.5}>
                  {t('travelportGdsNote')}
                </Text>
              </Box>
            </Box>
          </GridItem>
        </Grid>

        <Box mt={10}>
          <Heading
            as="h3"
            fontSize="md"
            fontWeight="semibold"
            mb={4}
            opacity={0.7}
          >
            {t('travelportAbout')}
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
