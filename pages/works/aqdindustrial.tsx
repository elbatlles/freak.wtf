import { Container, Badge, Link, List, Icon } from '@chakra-ui/react'
import { Title, WorkImage, Meta } from '../../components/work'
import P from '../../components/paragraph'
import Layout from '../../components/layouts/article'
import { LuExternalLink } from 'react-icons/lu'
import Lang from '../../lib/utils'

const Work = () => {
  const t = Lang('works')
  return (
    <Layout title="AQD  Industrial">
      <Container>
        <Title>
          AQD Industrial <Badge>2019</Badge>
        </Title>
        <P>{t.textAQD}</P>
        <List.Root ml={4} my={4}>
          <List.Item>
            <Meta>Website</Meta>
            <Link target="_blank" rel="noopener noreferrer" href="https://www.industrialproduct.es/">
              AQD Industrial <Icon as={LuExternalLink} mx="2px" />
            </Link>
          </List.Item>

          <List.Item>
            <Meta>Stack</Meta>
            <span>PHP, Prestashop</span>
          </List.Item>
        </List.Root>

        <WorkImage src="/images/works/aqd_1.png" alt="Inkdrop" />
        <WorkImage src="/images/works/aqd_2.png" alt="Inkdrop" />
      </Container>
    </Layout>
  )
}

export default Work
