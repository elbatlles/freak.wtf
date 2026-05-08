import { Container, Heading, SimpleGrid, Separator, Box } from '@chakra-ui/react'
import Layout from '../components/layouts/article'

import { WorkGridItem } from '../components/GridItem/grid-item'
import { useTranslations } from 'next-intl'
import Section from '../components/section'
import { accentGradient, gradientTextStyle } from '../lib/brand'

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
  const t = useTranslations('work')
  return (
    <Layout title="Works">
      <Container maxW="container.lg">
        <Heading
          as="h2"
          size="2xl"
          fontWeight="bold"
          textAlign="center"
          mb={8}
          pb={2}
          lineHeight="1.2"
        >
          <span style={{ background: accentGradient, ...gradientTextStyle }}>
            {t('work')}
          </span>
        </Heading>
        <SimpleGrid columns={[1, 1, 2]} gap={6}>
          <Section>
            <WorkGridItem id="pideme" title="Pídeme" thumbnail={pidemeImg}>
              {t('textPideme')}
            </WorkGridItem>
          </Section>
          <Section>
            <WorkGridItem id="media" title="Media" thumbnail={mediaImg}>
              {t('textMedia')}
            </WorkGridItem>
          </Section>
          <Section>
            <WorkGridItem
              id="personalweb"
              title="Web personal"
              thumbnail={personalwebImg}
            >
              {t('textPersonal')}
            </WorkGridItem>
          </Section>
        </SimpleGrid>
        <Section delay={0.4}>
          <Separator my={6} />

          <Box
            borderLeft="3px solid"
            borderColor="purple.400"
            pl={3}
            mb={4}
          >
            <Heading as="h3" fontSize={18} fontWeight="semibold" color="purple.300">
              {t('kumux')}
            </Heading>
          </Box>
        </Section>
        <SimpleGrid columns={[1, 1, 2]} gap={6}>
          <Section delay={0.3}>
            <WorkGridItem
              id="kumux"
              thumbnail={kumuxImg}
              title={'Web de Kumux'}
            >
              {t('kumuxText')}
            </WorkGridItem>
          </Section>
          <Section delay={0.3}>
            <WorkGridItem
              id="appKumux"
              thumbnail={appKumuxImg}
              title={'AppWeb para Kumux'}
            >
              {t('textAppkumux')}
            </WorkGridItem>
          </Section>
        </SimpleGrid>
        <Section delay={0.2}>
          <Separator my={6} />

          <Box
            borderLeft="3px solid"
            borderColor="blue.400"
            pl={3}
            mb={4}
          >
            <Heading as="h3" fontSize={18} fontWeight="semibold" color="blue.300">
              {t('grafix')}
            </Heading>
          </Box>
        </Section>
        <SimpleGrid columns={[1, 1, 2]} gap={6}>
          <Section delay={0.3}>
            <WorkGridItem
              id="aqdindustrial"
              thumbnail={aqdImg}
              title={'Ecommerce de productos de seguridad industrial'}
            >
              {t('textAQD')}
            </WorkGridItem>
          </Section>
          <Section delay={0.3}>
            <WorkGridItem
              id="littlebox"
              thumbnail={littleboxImg}
              title={'Ecommerce de productos para campings'}
            >
              {t('textLittlebox')}
            </WorkGridItem>
          </Section>
        </SimpleGrid>

        <Section delay={0.4}>
          <Separator my={6} />

          <Box
            borderLeft="3px solid"
            borderColor="teal.400"
            pl={3}
            mb={4}
          >
            <Heading as="h3" fontSize={18} fontWeight="semibold" color="teal.300">
              {t('titleLearning')}
            </Heading>
          </Box>
        </Section>
        <SimpleGrid columns={[1, 1, 2]} gap={6}>
          <Section delay={0.5}>
            <WorkGridItem
              id="avocadoshop"
              thumbnail={avocadoImg}
              title="Avocado shop"
            >
              {t('textAvocado')}
            </WorkGridItem>
          </Section>
          <Section delay={0.5}>
            <WorkGridItem
              id="weatherapp"
              thumbnail={weatherImg}
              title="Weatherapp"
            >
              {t('textWeatherApp')}
            </WorkGridItem>
          </Section>
          <Section delay={0.6}>
            <WorkGridItem
              id="cryptoTracker"
              thumbnail={cryptoImg}
              title="CryptoTracker"
            >
              {t('textCryptoTracker')}
            </WorkGridItem>
          </Section>
          <Section>
            <WorkGridItem
              id="scrapper"
              thumbnail={scrapperImg}
              title="Scrapper JS"
            >
              {t('textScrapper')}
            </WorkGridItem>
          </Section>
        </SimpleGrid>
      </Container>
    </Layout>
  )
}

export default Works
