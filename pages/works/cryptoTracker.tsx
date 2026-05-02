import { Container, Badge, Link, List, Icon } from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { LuExternalLink } from 'react-icons/lu'
import { Title, WorkImage, Meta } from '../../components/work'
import P from '../../components/paragraph'
import Lang from '../../lib/utils'

const Work = () => {
  const t = Lang('works')
  return (
    <Layout title="CryptoTracker">
      <Container>
        <Title>
          CryptoTracker <Badge>2021</Badge>
        </Title>
        <P>{t.textCryptoTracker}</P>

        <List.Root ml={4} my={4}>
          <List.Item>
            <Meta>Stack</Meta>
            <span>Javascript,React Native</span>
          </List.Item>
          <List.Item>
            <Meta>Presentation</Meta>
            <Link href="https://github.com/elbatlles/cryptotracker/">
              Github <Icon as={LuExternalLink} mx="2px" />
            </Link>
          </List.Item>
        </List.Root>

        <WorkImage src="/images/works/cryptotraker_1.png" alt="Cryptotracker" />
        <WorkImage src="/images/works/cryptotraker_2.png" alt="Cryptotracker" />
      </Container>
    </Layout>
  )
}

export default Work
