import { Container, Badge, Link, List, Icon, Grid, GridItem } from '@chakra-ui/react'
import { Title, WorkGallery, Meta } from '../../components/work'
import P from '../../components/paragraph'
import Layout from '../../components/layouts/article'
import { LuExternalLink } from 'react-icons/lu'
import { useTranslations } from 'next-intl'

const Work = () => {
  const t = useTranslations('works')
  return (
    <Layout title="Kumux">
      <Container maxW="6xl">
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={10} alignItems="center">
          <GridItem>
            <Title>
              Kumux <Badge>2021-</Badge>
            </Title>
            <P>{t('textKumux')}</P>
            <List.Root ml={4} my={4}>
              <List.Item>
                <Meta>Website</Meta>
                <Link target="_blank" rel="noopener noreferrer" href="https://www.kumux.io/">
                  Kumux <Icon as={LuExternalLink} mx="2px" />
                </Link>
              </List.Item>
              <List.Item>
                <Meta>Stack</Meta>
                <span>Javascript, Gatsby</span>
              </List.Item>
            </List.Root>
          </GridItem>
          <GridItem>
            <WorkGallery images={[
              { src: '/images/works/kumux_1.png', alt: 'Kumux' },
              { src: '/images/works/kumux_2.png', alt: 'Kumux' },
            ]} />
          </GridItem>
        </Grid>
      </Container>
    </Layout>
  )
}

export default Work
