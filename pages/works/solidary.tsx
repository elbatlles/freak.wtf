import {
  Container,
  Badge,
  Link,
  List,
  Icon,
  Grid,
  GridItem
} from '@chakra-ui/react'
import { Title, WorkImage, Meta } from '../../components/work'
import P from '../../components/paragraph'
import Layout from '../../components/layouts/article'
import { LuExternalLink } from 'react-icons/lu'

const Work = () => (
  <Layout title="solidary">
    <Container maxW="6xl">
      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={10} alignItems="center">
        <GridItem>
          <Title>
            Landing for help children <Badge>2021</Badge>
          </Title>
          <P>
            Website to help organise an event to raise money for hospitalised
            children
          </P>
          <List.Root ml={4} my={4}>
            <List.Item>
              <Meta>Stack</Meta>
              <span>Html, css, Tailwind</span>
            </List.Item>
            <List.Item>
              <Meta>Presentation</Meta>
              <Link href="https://unainktatto.vercel.app/">
                Website <Icon as={LuExternalLink} mx="2px" />
              </Link>
            </List.Item>
          </List.Root>
        </GridItem>
        <GridItem>
          <WorkImage src="/images/works/web_1.png" alt="Solidary Landing" />
        </GridItem>
      </Grid>
    </Container>
  </Layout>
)

export default Work
