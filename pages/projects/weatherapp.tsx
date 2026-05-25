import {
  Badge,
  Container,
  Grid,
  GridItem,
  Icon,
  Link,
  List
} from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { LuExternalLink } from 'react-icons/lu'
import Layout from '../../components/layouts/article'
import P from '../../components/paragraph'
import { Meta, Title, WorkGallery } from '../../components/work'

const Work = () => {
  const t = useTranslations('works')
  return (
    <Layout title="WeatherApp">
      <Container maxW="6xl">
        <Grid
          templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
          gap={10}
          alignItems="center"
        >
          <GridItem>
            <Title>
              WeatherApp <Badge colorPalette="gray" variant="subtle" ml={2} fontSize="sm" fontWeight="normal">2021</Badge>
            </Title>
            <P>{t('textWeatherApp')}</P>
            <List.Root ml={4} my={4}>
              <List.Item>
                <Meta>Stack</Meta>
                <span>Javascript, Reactjs, Jest, Redux</span>
              </List.Item>
              <List.Item>
                <Meta>Website</Meta>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://weatherapp-theta.vercel.app/"
                  textDecoration="underline"
                  _hover={{ color: 'purple.300' }}
                >
                  Website <Icon as={LuExternalLink} mx="2px" />
                </Link>
              </List.Item>
            </List.Root>
          </GridItem>
          <GridItem>
            <WorkGallery
              images={[
                { src: '/images/works/weather_1.png', alt: 'WeatherApp' },
                { src: '/images/works/weather_2.png', alt: 'WeatherApp' }
              ]}
            />
          </GridItem>
        </Grid>
      </Container>
    </Layout>
  )
}

export default Work
