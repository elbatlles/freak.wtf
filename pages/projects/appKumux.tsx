import type { GetStaticProps } from 'next'
import { getI18nProps } from '../../lib/i18n'
import {
  Badge,
  Box,
  Container,
  Grid,
  GridItem,
  Icon,
  Link,
  List
} from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { LuExternalLink } from 'react-icons/lu'
import Layout from '../../components/layouts/article'
import P from '../../components/paragraph'
import { Meta, Title, WorkGallery } from '../../components/work'

const Work = () => {
  const t = useTranslations('works')
  return (
    <Layout title="APP Kumux">
      <Container maxW="6xl">
        <Grid
          templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
          gap={10}
          alignItems="center"
        >
          <GridItem>
            <Title>
              Kumux App <Badge colorPalette="gray" variant="subtle" ml={2} fontSize="sm" fontWeight="normal">2020-2021</Badge>
            </Title>
            <P>{t('textAppKumux')}</P>
            <List.Root ml={4} my={4}>
              <List.Item>
                <Meta>Website</Meta>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://app.kumux.io/login"
                  textDecoration="underline"
                  _hover={{ color: 'purple.300' }}
                >
                  App Kumux <Icon as={LuExternalLink} mx="2px" />
                </Link>
              </List.Item>
              <List.Item>
                <Meta>Stack</Meta>
                <span>React (pure), JavaScript</span>
              </List.Item>
            </List.Root>
          </GridItem>
          <GridItem>
            <WorkGallery
              images={[
                {
                  src: '/images/works/kumux_1.png',
                  alt: 'App Kumux Interface'
                },
                { src: '/images/works/kumux_2.png', alt: 'App Kumux Features' }
              ]}
            />
            <Box mt={4}>
              <iframe
                src="https://www.youtube.com/embed/R33ZpQ4uqZY?start=38"
                width="100%"
                height="280"
                frameBorder="0"
                title="App Kumux demo video"
                allowFullScreen
              />
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </Layout>
  )
}


export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const { messages } = await getI18nProps(locale)
  return { props: { messages } }
}

export default Work
