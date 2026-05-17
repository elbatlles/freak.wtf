import { Container, Heading, SimpleGrid, Separator, Box, Badge, Text, Flex } from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import { WorkGridItem } from '../components/GridItem/grid-item'
import { useTranslations } from 'next-intl'
import Section from '../components/section'
import { accentGradient, gradientTextStyle } from '../lib/brand'
import NextLink from 'next/link'
import { useColorModeValue } from '../lib/color-mode'

import kumuxImg from '../public/images/works/kumux_1.png'
import appKumuxImg from '../public/images/works/kumux_2.png'
import aqdImg from '../public/images/works/aqd_1.png'
import littleboxImg from '../public/images/works/littlebox_1.png'

const CurrentRoleCard = () => {
  const t = useTranslations('experience')
  const glassBg = useColorModeValue('rgba(255,255,255,0.25)', 'rgba(255,255,255,0.07)')
  const glassBorder = useColorModeValue('rgba(255,255,255,0.3)', 'rgba(255,255,255,0.12)')

  return (
    <Box
      bg={glassBg}
      backdropFilter="blur(20px)"
      border="1px solid"
      borderColor={glassBorder}
      borderRadius="xl"
      p={8}
      boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.25)"
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        h="3px"
        bgGradient={accentGradient}
      />
      <Flex align="center" gap={3} mb={3}>
        <Heading as="h3" fontSize="xl" fontWeight="bold">
          Travelport
        </Heading>
        <Badge colorPalette="green" variant="subtle" borderRadius="full" px={2}>
          {t('travelportBadge')}
        </Badge>
        <Badge variant="outline" borderRadius="full" px={2} fontSize="xs" opacity={0.7}>
          2022 – present
        </Badge>
      </Flex>
      <Text fontSize="sm" fontWeight="medium" opacity={0.6} mb={3}>
        {t('travelportRole')}
      </Text>
      <Text fontSize="sm" lineHeight="tall" maxW="600px">
        {t('travelportDescription')}
      </Text>
      <NextLink href="/projects/travelport" passHref>
        <Box
          as="span"
          display="inline-block"
          mt={4}
          fontSize="sm"
          fontWeight="medium"
          color="purple.400"
          cursor="pointer"
          _hover={{ textDecoration: 'underline' }}
        >
          {t('travelportCta')}
        </Box>
      </NextLink>
    </Box>
  )
}

const Experience = () => {
  const t = useTranslations('experience')

  return (
    <Layout title="Experience">
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
            {t('title')}
          </span>
        </Heading>

        {/* Current role */}
        <Section>
          <Box mb={6}>
            <Box
              borderLeft="3px solid"
              borderColor="green.400"
              pl={3}
              mb={4}
            >
              <Heading as="h3" fontSize={18} fontWeight="semibold" color="green.300">
                {t('currentRole')}
              </Heading>
            </Box>
            <CurrentRoleCard />
          </Box>
        </Section>

        <Section delay={0.15}>
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
          <Section delay={0.2}>
            <WorkGridItem id="kumux" thumbnail={kumuxImg} title="Web de Kumux">
              {t('kumuxText')}
            </WorkGridItem>
          </Section>
          <Section delay={0.2}>
            <WorkGridItem id="appKumux" thumbnail={appKumuxImg} title="AppWeb para Kumux">
              {t('textAppkumux')}
            </WorkGridItem>
          </Section>
        </SimpleGrid>

        <Section delay={0.3}>
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
          <Section delay={0.35}>
            <WorkGridItem
              id="aqdindustrial"
              thumbnail={aqdImg}
              title="Ecommerce de productos de seguridad industrial"
            >
              {t('textAQD')}
            </WorkGridItem>
          </Section>
          <Section delay={0.35}>
            <WorkGridItem
              id="littlebox"
              thumbnail={littleboxImg}
              title="Ecommerce de productos para campings"
            >
              {t('textLittlebox')}
            </WorkGridItem>
          </Section>
        </SimpleGrid>
      </Container>
    </Layout>
  )
}

export default Experience
