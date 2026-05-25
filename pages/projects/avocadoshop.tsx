import {
  Badge,
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
import { Meta, Title, WorkImage } from '../../components/work'

const Work = () => {
  const t = useTranslations('works')
  return (
    <Layout title="Avocado Shop">
      <Container maxW="6xl">
        <Grid
          templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
          gap={10}
          alignItems="center"
        >
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
                <Link
                  href="https://nextjs-tienda-two.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  textDecoration="underline"
                  _hover={{ color: 'purple.300' }}
                >
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
