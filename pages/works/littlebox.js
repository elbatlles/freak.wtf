import { Container, Badge, Link, List, ListItem } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, WorkImage, Meta } from '../../components/work'
import P from '../../components/paragraph'
import Layout from '../../components/layouts/article'

const Work = () => (
  <Layout title="Pideme">
    <Container>
      <Title>
        Littlebox <Badge>2018</Badge>
      </Title>
      <P>Plataforma para la venda de campings</P>
      <List ml={4} my={4}>
        <ListItem>
          <Meta>Website</Meta>
          <Link isExternal href="https://www.littlebox-shop.com/">
            Littlebox <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>

        <ListItem>
          <Meta>Stack</Meta>
          <span>PHP, Prestashop</span>
        </ListItem>
      </List>

      <WorkImage src="/images/works/littlebox_1.png" alt="Littlebox" />
      <WorkImage src="/images/works/littlebox_2.png" alt="Littlebox" />
    </Container>
  </Layout>
)

export default Work
