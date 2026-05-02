import { Container, Badge, Link, List, Icon } from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { LuExternalLink } from 'react-icons/lu'
import { Title, WorkImage, Meta } from '../../components/work'
import P from '../../components/paragraph'
import Lang from '../../lib/utils'

const Work = () => {
  const t = Lang('works')
  return (
    <Layout title="WeatherApp">
      <Container>
        <Title>
          WeatherApp <Badge>2021</Badge>
        </Title>
        <P>{t.textWeatherApp}</P>

        <List.Root ml={4} my={4}>
          <List.Item>
            <Meta>Stack</Meta>
            <span>Javascript, Reactjs, Jest, Redux</span>
          </List.Item>
          <List.Item>
            <Meta>Website</Meta>
            <Link target="_blank" rel="noopener noreferrer" href="https://weatherapp-theta.vercel.app/">
              Website <Icon as={LuExternalLink} mx="2px" />
            </Link>
          </List.Item>
        </List.Root>

        <WorkImage src="/images/works/weather_1.png" alt="WeatherApp" />
        <WorkImage src="/images/works/weather_2.png" alt="WeatherApp" />
      </Container>
    </Layout>
  )
}

export default Work
