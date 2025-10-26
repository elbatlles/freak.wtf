import { Container, Badge, Link, List, ListItem } from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, WorkImage, Meta } from '../../components/work'
import P from '../../components/paragraph'
import Lang from '../../lib/utils'

const Work = () => {
  const t = Lang('works')
  return (
    <Layout title="Scrapper JS">
      <Container>
        <Title>
          Scrapper JS <Badge>2021</Badge>
        </Title>
        <P>{t.textScrapper}</P>

        <List ml={4} my={4}>
          <ListItem>
            <Meta>Stack</Meta>
            <span>Javascript</span>
          </ListItem>

          <ListItem>
            <Meta>Source</Meta>
            <Link href="https://github.com/elbatlles/scrapperjs">
              github.com/elbatlles/scrapperjs <ExternalLinkIcon mx="2px" />
            </Link>
          </ListItem>
        </List>

        <WorkImage src="/images/works/web_1.png" alt="Scrapper Code" />
      </Container>
    </Layout>
  )
}

export default Work
