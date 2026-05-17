import { Container, Badge, Link, List, Icon, Grid, GridItem } from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { LuExternalLink } from 'react-icons/lu'
import { Title, WorkGallery, Meta } from '../../components/work'
import P from '../../components/paragraph'
import { useTranslations } from 'next-intl'

const Work = () => {
  const t = useTranslations('works')
  return (
    <Layout title="CryptoTracker">
      <Container maxW="6xl">
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={10} alignItems="center">
          <GridItem>
            <Title>
              CryptoTracker <Badge>2021</Badge>
            </Title>
            <P>{t('textCryptoTracker')}</P>
            <List.Root ml={4} my={4}>
              <List.Item>
                <Meta>Stack</Meta>
                <span>Javascript, React Native</span>
              </List.Item>
              <List.Item>
                <Meta>Presentation</Meta>
                <Link href="https://github.com/elbatlles/cryptotracker/">
                  Github <Icon as={LuExternalLink} mx="2px" />
                </Link>
              </List.Item>
            </List.Root>
          </GridItem>
          <GridItem>
            <WorkGallery images={[
              { src: '/images/works/cryptotraker_1.png', alt: 'CryptoTracker' },
              { src: '/images/works/cryptotraker_2.png', alt: 'CryptoTracker' },
            ]} />
          </GridItem>
        </Grid>
      </Container>
    </Layout>
  )
}

export default Work
