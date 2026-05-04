import { Container, Badge, List, Icon, Grid, GridItem } from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { LuExternalLink } from 'react-icons/lu'

import { Title, WorkGallery, Meta } from '../../components/work'
import P from '../../components/paragraph'
import Lang from '../../lib/utils'

const Work = () => {
  const t = Lang('work')
  return (
    <Layout title="IA Prevent">
      <Container maxW="6xl">
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={10} alignItems="center">
          <GridItem>
            <Title>
              IA-Prevent <Badge>2021-Nowaday</Badge>
            </Title>
            <P>{t.textMedia}</P>
            <List.Root ml={4} my={4}>
              <List.Item>
                <Meta>Stack</Meta>
                <span>Reactjs, Gatsby, Strapi</span>
              </List.Item>
            </List.Root>
          </GridItem>
          <GridItem>
            <WorkGallery images={[
              { src: '/images/works/iaprevent_1.png', alt: 'IA Prevent' },
              { src: '/images/works/iaprevent_2.png', alt: 'IA Prevent' },
            ]} />
          </GridItem>
        </Grid>
      </Container>
    </Layout>
  )
}

export default Work
