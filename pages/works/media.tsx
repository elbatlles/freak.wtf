import { Container, Badge, List, Icon, SimpleGrid } from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { LuExternalLink } from 'react-icons/lu'

import { Title, WorkImage, Meta } from '../../components/work'
import P from '../../components/paragraph'
import Lang from '../../lib/utils'

const Work = () => {
  const t = Lang('work')
  return (
    <Layout title="IA Prevent">
      <Container>
        <Title>
          IA-Prevent <Badge>2021-Nowaday</Badge>
        </Title>
        <P>{t.textMedia}</P>

        <List.Root ml={4} my={4}>
          <List.Item>
            <Meta>Stack</Meta>
            <span>Reactjs,Gatsby,Strapi</span>
          </List.Item>
        </List.Root>

        <SimpleGrid columns={1} gap={2}>
          <WorkImage src="/images/works/iaprevent_1.png" alt="walknote" />
          <WorkImage src="/images/works/iaprevent_2.png" alt="walknote" />
        </SimpleGrid>
      </Container>
    </Layout>
  )
}

export default Work
