import { Container, Badge, Link, List, Icon } from '@chakra-ui/react'
import { Title, WorkImage, Meta } from '../../components/work'
import P from '../../components/paragraph'
import Layout from '../../components/layouts/article'
import { LuExternalLink } from 'react-icons/lu'
import Lang from '../../lib/utils'

const Work = () => {
  const t = Lang('works')
  return (
    <Layout title="Pideme">
      <Container>
        <Title>
          Pídeme <Badge>2021- Nowadays</Badge>
        </Title>
        <P>{t.textPideme}</P>
        <List.Root ml={4} my={4}>
          <List.Item>
            <Meta>Website</Meta>
            <Link target="_blank" rel="noopener noreferrer" href="https://www.pideme.es/">
              P&iacute;deme <Icon as={LuExternalLink} mx="2px" />
            </Link>
          </List.Item>

          <List.Item>
            <Meta>Stack</Meta>
            <span>PHP, Laravel</span>
          </List.Item>
        </List.Root>

        <WorkImage src="/images/works/pideme_1.png" alt="Pideme" />
        <WorkImage src="/images/works/pideme_2.png" alt="Pideme" />
      </Container>
    </Layout>
  )
}

export default Work
