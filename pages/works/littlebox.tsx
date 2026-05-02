import { Container, Badge, Link, List, Icon } from '@chakra-ui/react'
import { Title, WorkImage, Meta } from '../../components/work'
import P from '../../components/paragraph'
import Layout from '../../components/layouts/article'
import { LuExternalLink } from 'react-icons/lu'
import Lang from '../../lib/utils'

const Work = () => {
  const t = Lang('works')
  return (
    <Layout title="Littlebox">
      <Container>
        <Title>
          Littlebox <Badge>2018</Badge>
        </Title>
        <P>{t.textLittlebox}</P>
        <List.Root ml={4} my={4}>
          <List.Item>
            <Meta>Website</Meta>
            <Link target="_blank" rel="noopener noreferrer" href="https://www.littlebox-shop.com/">
              Littlebox <Icon as={LuExternalLink} mx="2px" />
            </Link>
          </List.Item>

          <List.Item>
            <Meta>Stack</Meta>
            <span>PHP, Prestashop</span>
          </List.Item>
        </List.Root>

        <WorkImage src="/images/works/littlebox_1.png" alt="Littlebox" />
        <WorkImage src="/images/works/littlebox_2.png" alt="Littlebox" />
      </Container>
    </Layout>
  )
}

export default Work
