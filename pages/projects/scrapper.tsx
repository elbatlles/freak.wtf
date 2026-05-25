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
    <Layout title="Scrapper JS">
      <Container maxW="6xl">
        <Grid
          templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
          gap={10}
          alignItems="center"
        >
          <GridItem>
            <Title>
              Scrapper JS <Badge colorPalette="gray" variant="subtle" ml={2} fontSize="sm" fontWeight="normal">2021</Badge>
            </Title>
            <P>{t('textScrapper')}</P>
            <List.Root ml={4} my={4}>
              <List.Item>
                <Meta>Stack</Meta>
                <span>Javascript</span>
              </List.Item>
              <List.Item>
                <Meta>Source</Meta>
                <Link href="https://github.com/elbatlles/scrapperjs">
                  github.com/elbatlles/scrapperjs{' '}
                  <Icon as={LuExternalLink} mx="2px" />
                </Link>
              </List.Item>
            </List.Root>
          </GridItem>
          <GridItem>
            <WorkImage src="/images/works/web_1.png" alt="Scrapper Code" />
          </GridItem>
        </Grid>
      </Container>
    </Layout>
  )
}

export default Work
