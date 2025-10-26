import { Container, Heading, SimpleGrid, Divider } from '@chakra-ui/react'
import Layout from '../components/layouts/article'

import { WorkGridItem } from '../components/GridItem/grid-item'
import Lang from '../lib/utils'
import Section from '../components/section'

// Importar imágenes específicas de cada proyecto
import pidemeImg from '../public/images/works/pideme_1.png'
import mediaImg from '../public/images/works/iaprevent_1.png'
import personalwebImg from '../public/images/works/web_1.png'
import kumuxImg from '../public/images/works/kumux_1.png'
import appKumuxImg from '../public/images/works/kumux_2.png'
import aqdImg from '../public/images/works/aqd_1.png'
import littleboxImg from '../public/images/works/littlebox_1.png'
import avocadoImg from '../public/images/works/avocado.png'
import weatherImg from '../public/images/works/weather_1.png'
import cryptoImg from '../public/images/works/cryptotraker_1.png'
import scrapperImg from '../public/images/works/web_2.png' // Usando imagen de código para scrapper
const Works = () => {
  const t = Lang('work')
  return (
    <Layout title="Works">
      <Container>
        <Heading as="h3" fontSize={20} mb={4}>
          {t.work}
        </Heading>
        <SimpleGrid columns={[1, 1, 2]} gap={6}>
          <Section>
            <WorkGridItem id="pideme" title="Pídeme" thumbnail={pidemeImg}>
              {t.textPideme}
            </WorkGridItem>
          </Section>
          <Section>
            <WorkGridItem id="media" title="Media" thumbnail={mediaImg}>
              {t.textMedia}
            </WorkGridItem>
          </Section>
          <Section>
            <WorkGridItem
              id="personalweb"
              title="Web personal"
              thumbnail={personalwebImg}
            >
              {t.textPersonal}
            </WorkGridItem>
          </Section>
        </SimpleGrid>
        <Section delay={0.4}>
          <Divider my={6} />

          <Heading as="h3" fontSize={20} mb={4}>
            {t.kumux}
          </Heading>
        </Section>
        <SimpleGrid columns={[1, 1, 2]} gap={6}>
          <Section delay={0.3}>
            <WorkGridItem
              id="kumux"
              thumbnail={kumuxImg}
              title={'Web de Kumux'}
            >
              {t.kumuxText}
            </WorkGridItem>
          </Section>
          <Section delay={0.3}>
            <WorkGridItem
              id="appKumux"
              thumbnail={appKumuxImg}
              title={'AppWeb para Kumux'}
            >
              {t.textAppkumux}
            </WorkGridItem>
          </Section>
        </SimpleGrid>
        <Section delay={0.2}>
          <Divider my={6} />

          <Heading as="h3" fontSize={20} mb={4}>
            {t.grafix}
          </Heading>
        </Section>
        <SimpleGrid columns={[1, 1, 2]} gap={6}>
          <Section delay={0.3}>
            <WorkGridItem
              id="aqdindustrial"
              thumbnail={aqdImg}
              title={'Ecommerce de productos de seguridad industrial'}
            >
              {t.textAQD}
            </WorkGridItem>
          </Section>
          <Section delay={0.3}>
            <WorkGridItem
              id="littlebox"
              thumbnail={littleboxImg}
              title={'Ecommerce de productos para campings'}
            >
              {t.textLittlebox}
            </WorkGridItem>
          </Section>
        </SimpleGrid>

        <Section delay={0.4}>
          <Divider my={6} />

          <Heading as="h3" fontSize={20} mb={4}>
            {t.titleLearning}
          </Heading>
        </Section>
        <SimpleGrid columns={[1, 1, 2]} gap={6}>
          <Section delay={0.5}>
            <WorkGridItem
              id="avocadoshop"
              thumbnail={avocadoImg}
              title="Avocado shop"
            >
              {t.textAvocado}
            </WorkGridItem>
          </Section>
          <Section delay={0.5}>
            <WorkGridItem
              id="weatherapp"
              thumbnail={weatherImg}
              title="Weatherapp"
            >
              {t.textWeatherApp}
            </WorkGridItem>
          </Section>
          <Section delay={0.6}>
            <WorkGridItem
              id="cryptoTracker"
              thumbnail={cryptoImg}
              title="CryptoTracker"
            >
              {t.textCryptoTracker}
            </WorkGridItem>
          </Section>
          <Section>
            <WorkGridItem
              id="scrapper"
              thumbnail={scrapperImg}
              title="Scrapper JS"
            >
              {t.textScrapper}
            </WorkGridItem>
          </Section>
        </SimpleGrid>
      </Container>
    </Layout>
  )
}

export default Works
