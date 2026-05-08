import { Container, Badge, Link, List, Icon, Grid, GridItem } from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { LuExternalLink } from 'react-icons/lu'
import { Title, WorkImage, Meta } from '../../components/work'
import P from '../../components/paragraph'
import { useTranslations } from 'next-intl'

const Work = () => {
  const t = useTranslations('works')
  return (
    <Layout title="Avocado Shop">
      <Container maxW="6xl">
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={10} alignItems="center">
          <GridItem>
            <Title>
              Avocado Shop <Badge>2021</Badge>
            </Title>
            <P>{t('textAvocado')}</P>
            <List.Root ml={4} my={4}>
              <List.Item>
                <Meta>Platform</Meta>
                <span>Web</span>
              </List.Item>
              <List.Item>
                <Meta>Stack</Meta>
                <span>React, Nextjs</span>
              </List.Item>
              <List.Item>
                <Meta>Website</Meta>
                <Link href="https://nextjs-tienda-two.vercel.app/">
                  Avocado Shop <Icon as={LuExternalLink} mx="2px" />
                </Link>
              </List.Item>
            </List.Root>
          </GridItem>
          <GridItem>
            <WorkImage src="/images/works/avocado.png" alt="Avocado" />
          </GridItem>
        </Grid>
      </Container>
    </Layout>
  )
}

export default Work
