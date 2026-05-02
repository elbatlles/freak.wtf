import { Container, Badge, Link, List, Icon } from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { LuExternalLink } from 'react-icons/lu'
import { Title, WorkImage, Meta } from '../../components/work'
import P from '../../components/paragraph'
import Lang from '../../lib/utils'

const Work = () => {
  const t = Lang('works')
  return (
    <Layout title="Avocado Shop">
      <Container>
        <Title>
          Avocado Shop <Badge>2021</Badge>
        </Title>
        <P>{t.textAvocado}</P>

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
            <Link href="https://nextjs-tienda-two.vercel.app/">
              Avocado Shop <Icon as={LuExternalLink} mx="2px" />
            </Link>
          </List.Item>
        </List.Root>

        <WorkImage src="/images/works/avocado.png" alt="Avocado" />
      </Container>
    </Layout>
  )
}

export default Work
