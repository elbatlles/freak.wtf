import { Container, Badge, Link, List, Icon, Box, Grid, GridItem } from '@chakra-ui/react'
import { Title, WorkGallery, Meta } from '../../components/work'
import P from '../../components/paragraph'
import Layout from '../../components/layouts/article'
import { LuExternalLink } from 'react-icons/lu'
import { useTranslations } from 'next-intl'

const Work = () => {
  const t = useTranslations('works')
  return (
    <Layout title="APP Kumux">
      <Container maxW="6xl">
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={10} alignItems="center">
          <GridItem>
            <Title>
              Kumux App <Badge>2020-2021</Badge>
            </Title>
            <P>{t('textAppKumux')}</P>
            <List.Root ml={4} my={4}>
              <List.Item>
                <Meta>Website</Meta>
                <Link target="_blank" rel="noopener noreferrer" href="https://app.kumux.io/login" textDecoration="underline" _hover={{ color: 'purple.300' }}>
                  App Kumux <Icon as={LuExternalLink} mx="2px" />
                </Link>
              </List.Item>
              <List.Item>
                <Meta>Stack</Meta>
                <span>Typescript, ReactJS</span>
              </List.Item>
            </List.Root>
          </GridItem>
          <GridItem>
            <WorkGallery images={[
              { src: '/images/works/kumux_1.png', alt: 'App Kumux Interface' },
              { src: '/images/works/kumux_2.png', alt: 'App Kumux Features' },
            ]} />
            <Box mt={4}>
              <iframe
                src="https://www.youtube.com/embed/R33ZpQ4uqZY?start=38"
                width="100%"
                height="280"
                frameBorder="0"
                allowFullScreen
              />
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </Layout>
  )
}

export default Work
