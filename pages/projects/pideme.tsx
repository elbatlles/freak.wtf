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
import { Meta, Title, WorkGallery } from '../../components/work'

const Work = () => {
  const t = useTranslations('works')
  return (
    <Layout title="Pideme">
      <Container maxW="6xl">
        <Grid
          templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
          gap={10}
          alignItems="center"
        >
          <GridItem>
            <Title>
              Pídeme <Badge>2021-2022</Badge>
            </Title>
            <P>{t('textPideme')}</P>
            <List.Root ml={4} my={4}>
              <List.Item>
                <Meta>Website</Meta>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.pideme.es/"
                  textDecoration="underline"
                  _hover={{ color: 'purple.300' }}
                >
                  P&iacute;deme <Icon as={LuExternalLink} mx="2px" />
                </Link>
              </List.Item>
              <List.Item>
                <Meta>Stack</Meta>
                <span>PHP, Laravel</span>
              </List.Item>
            </List.Root>
          </GridItem>
          <GridItem>
            <WorkGallery
              images={[
                { src: '/images/works/pideme_1.png', alt: 'Pideme' },
                { src: '/images/works/pideme_2.png', alt: 'Pideme' }
              ]}
            />
          </GridItem>
        </Grid>
      </Container>
    </Layout>
  )
}

export default Work
