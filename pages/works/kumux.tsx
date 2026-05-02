import { Container, Badge, Link, List, Icon } from '@chakra-ui/react'
import { Title, WorkImage, Meta } from '../../components/work'
import P from '../../components/paragraph'
import Layout from '../../components/layouts/article'
import { LuExternalLink } from 'react-icons/lu'
import Lang from '../../lib/utils'

const Work = () => {
  const t = Lang('works')
  return (
    <Layout title="Kumux">
      <Container>
        <Title>
          Kumux <Badge>2021-</Badge>
        </Title>
        <P>{t.textKumux}</P>
        <List.Root ml={4} my={4}>
          <List.Item>
            <Meta>Website</Meta>
            <Link target="_blank" rel="noopener noreferrer" href="https://www.kumux.io/">
              Kumux <Icon as={LuExternalLink} mx="2px" />
            </Link>
          </List.Item>

          <List.Item>
            <Meta>Stack</Meta>
            <span>Javascript, Gatsby</span>
          </List.Item>
        </List.Root>

        <WorkImage src="/images/works/kumux_1.png" alt="Kumux" />
        <WorkImage src="/images/works/kumux_2.png" alt="Kumux" />
      </Container>
    </Layout>
  )
}

export default Work
