import { Container, Badge, Link, List, Icon } from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { LuExternalLink } from 'react-icons/lu'
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

        <List.Root ml={4} my={4}>
          <List.Item>
            <Meta>Stack</Meta>
            <span>Javascript</span>
          </List.Item>

          <List.Item>
            <Meta>Source</Meta>
            <Link href="https://github.com/elbatlles/scrapperjs">
              github.com/elbatlles/scrapperjs <Icon as={LuExternalLink} mx="2px" />
            </Link>
          </List.Item>
        </List.Root>

        <WorkImage src="/images/works/web_1.png" alt="Scrapper Code" />
      </Container>
    </Layout>
  )
}

export default Work
