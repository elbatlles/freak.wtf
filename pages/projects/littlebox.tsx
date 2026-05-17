import { Container, Badge, Link, List, Icon, Grid, GridItem } from '@chakra-ui/react'
import { Title, WorkGallery, Meta } from '../../components/work'
import P from '../../components/paragraph'
import Layout from '../../components/layouts/article'
import { LuExternalLink } from 'react-icons/lu'
import { useTranslations } from 'next-intl'

const Work = () => {
  const t = useTranslations('works')
  return (
    <Layout title="Littlebox">
      <Container maxW="6xl">
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={10} alignItems="center">
          <GridItem>
            <Title>
              Littlebox <Badge>2018</Badge>
            </Title>
            <P>{t('textLittlebox')}</P>
            <List.Root ml={4} my={4}>
              <List.Item>
                <Meta>Website</Meta>
                <Link target="_blank" rel="noopener noreferrer" href="https://www.littlebox-shop.com/" textDecoration="underline" _hover={{ color: 'purple.300' }}>
                  Littlebox <Icon as={LuExternalLink} mx="2px" />
                </Link>
              </List.Item>
              <List.Item>
                <Meta>Stack</Meta>
                <span>PHP, Prestashop</span>
              </List.Item>
            </List.Root>
          </GridItem>
          <GridItem>
            <WorkGallery images={[
              { src: '/images/works/littlebox_1.png', alt: 'Littlebox' },
              { src: '/images/works/littlebox_2.png', alt: 'Littlebox' },
            ]} />
          </GridItem>
        </Grid>
      </Container>
    </Layout>
  )
}

export default Work
