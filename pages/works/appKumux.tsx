import { Container, Badge, Link, List, Icon, Box } from '@chakra-ui/react'
import { Title, WorkImage, Meta } from '../../components/work'
import P from '../../components/paragraph'
import Layout from '../../components/layouts/article'
import { LuExternalLink } from 'react-icons/lu'
import Lang from '../../lib/utils'

const Work = () => {
  const t = Lang('works')
  return (
    <Layout title="APP Kumux">
      <Container>
        <Title>
          Kumux App <Badge>2020-2021</Badge>
        </Title>
        <P>{t.textAppKumux}</P>
        <List.Root ml={4} my={4}>
          <List.Item>
            <Meta>Website</Meta>
            <Link target="_blank" rel="noopener noreferrer" href="https://app.kumux.io/login">
              App Kumux <Icon as={LuExternalLink} mx="2px" />
            </Link>
          </List.Item>

          <List.Item>
            <Meta>Stack</Meta>
            <span>Typescript, ReactJS</span>
          </List.Item>
        </List.Root>

        <WorkImage src="/images/works/kumux_1.png" alt="App Kumux Interface" />
        <WorkImage src="/images/works/kumux_2.png" alt="App Kumux Features" />

        <Box mt={6}>
          <iframe
            src="https://www.youtube.com/embed/R33ZpQ4uqZY?start=38"
            width="100%"
            height="400"
            frameBorder="0"
            allowFullScreen
          />
        </Box>
      </Container>
    </Layout>
  )
}

export default Work
