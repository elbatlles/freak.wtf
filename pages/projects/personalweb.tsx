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
    <Layout title="Web Profesional">
      <Container maxW="6xl">
        <Grid
          templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
          gap={10}
          alignItems="center"
        >
          <GridItem>
            <Title>
              Web personal <Badge>2021-2022</Badge>
            </Title>
            <P>{t('textPersonal')}</P>
            <List.Root ml={4} my={4}>
              <List.Item>
                <Meta>Website</Meta>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://angelbatlles-git-main-elbatlles.vercel.app/"
                  textDecoration="underline"
                  _hover={{ color: 'purple.300' }}
                >
                  Web personal <Icon as={LuExternalLink} mx="2px" />
                </Link>
              </List.Item>
              <List.Item>
                <Meta>Presentation</Meta>
                <Link href="https://github.com/elbatlles/webnueva/">
                  Github <Icon as={LuExternalLink} mx="2px" />
                </Link>
              </List.Item>
              <List.Item>
                <Meta>Stack</Meta>
                <span>Typescript, Nextjs</span>
              </List.Item>
            </List.Root>
          </GridItem>
          <GridItem>
            <WorkGallery
              images={[
                { src: '/images/works/web_1.png', alt: 'Web Personal' },
                { src: '/images/works/web_2.png', alt: 'Web personal' }
              ]}
            />
          </GridItem>
        </Grid>
      </Container>
    </Layout>
  )
}

export default Work
