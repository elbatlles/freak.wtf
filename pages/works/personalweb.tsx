import { Container, Badge, Link, List, Icon } from '@chakra-ui/react'
import { Title, WorkImage, Meta } from '../../components/work'
import P from '../../components/paragraph'
import Layout from '../../components/layouts/article'
import { LuExternalLink } from 'react-icons/lu'
import Lang from '../../lib/utils'

const Work = () => {
  const t = Lang('works')
  return (
    <Layout title="Web Profesional">
      <Container>
        <Title>
          Web personal <Badge>2021- Nowadays</Badge>
        </Title>
        <P>{t.textPersonal}</P>
        <List.Root ml={4} my={4}>
          <List.Item>
            <Meta>Website</Meta>
            <Link
              target="_blank" rel="noopener noreferrer"
              href="https://angelbatlles-git-main-elbatlles.vercel.app/"
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

        <WorkImage src="/images/works/web_1.png" alt="Web Personal" />
        <WorkImage src="/images/works/web_2.png" alt="Web personal" />
      </Container>
    </Layout>
  )
}

export default Work
