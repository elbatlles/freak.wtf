import type { GetStaticProps } from 'next'
import { getI18nProps } from '../../lib/i18n'
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
    <Layout title="Kumux">
      <Container maxW="6xl">
        <Grid
          templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
          gap={10}
          alignItems="center"
        >
          <GridItem>
            <Title>
              Kumux <Badge colorPalette="gray" variant="subtle" ml={2} fontSize="sm" fontWeight="normal">2020-2021</Badge>
            </Title>
            <P>{t('textKumux')}</P>
            <List.Root ml={4} my={4}>
              <List.Item>
                <Meta>Website</Meta>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.kumux.io/"
                  textDecoration="underline"
                  _hover={{ color: 'purple.300' }}
                >
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
            <WorkGallery
              images={[
                { src: '/images/works/kumux_1.png', alt: 'Kumux' },
                { src: '/images/works/kumux_2.png', alt: 'Kumux' }
              ]}
            />
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
