import {
  Container,
  Heading,
  SimpleGrid,
  Separator,
  Box,
  Badge,
  Text,
  Flex,
  Link,
} from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import { WorkGridItem } from '../components/GridItem/grid-item'
import { useTranslations } from 'next-intl'
import Section from '../components/section'
import { accentGradient, gradientTextStyle } from '../lib/brand'
import { useColorModeValue } from '../lib/color-mode'
import { LuExternalLink } from 'react-icons/lu'

import pidemeImg from '../public/images/works/pideme_1.png'
import mediaImg from '../public/images/works/iaprevent_1.png'
import personalwebImg from '../public/images/works/web_1.png'

interface ExperimentCardProps {
  title: string
  period: string
  description: string
  tag?: string
  href?: string
  linkLabel?: string
  wip?: boolean
}

const ExperimentCard = ({
  title,
  period,
  description,
  tag,
  href,
  linkLabel,
  wip,
}: ExperimentCardProps) => {
  const glassBg = useColorModeValue('rgba(255,255,255,0.25)', 'rgba(255,255,255,0.07)')
  const glassBorder = useColorModeValue('rgba(255,255,255,0.3)', 'rgba(255,255,255,0.12)')

  return (
    <Box
      bg={glassBg}
      backdropFilter="blur(20px)"
      border="1px solid"
      borderColor={glassBorder}
      borderRadius="xl"
      p={6}
      boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.2)"
      _hover={{
        transform: 'translateY(-3px)',
        boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.35)',
      }}
      transition="transform 0.2s ease, box-shadow 0.2s ease"
    >
      <Flex align="center" gap={2} mb={2} flexWrap="wrap">
        <Text fontWeight="bold" fontSize="md">
          {title}
        </Text>
        {wip && (
          <Badge colorPalette="orange" variant="subtle" borderRadius="full" px={2} fontSize="xs">
            WIP
          </Badge>
        )}
        {tag && (
          <Badge variant="outline" borderRadius="full" px={2} fontSize="xs" opacity={0.6}>
            {tag}
          </Badge>
        )}
      </Flex>
      <Text fontSize="xs" opacity={0.5} mb={3}>
        {period}
      </Text>
      <Text fontSize="sm" lineHeight="tall" opacity={0.85}>
        {description}
      </Text>
      {href && linkLabel && (
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          display="inline-flex"
          alignItems="center"
          gap={1}
          mt={4}
          fontSize="sm"
          fontWeight="medium"
          color="purple.400"
          _hover={{ textDecoration: 'underline' }}
        >
          {linkLabel} <LuExternalLink size={12} />
        </Link>
      )}
    </Box>
  )
}

const Experiments = () => {
  const t = useTranslations('experiments')

  return (
    <Layout title="Experiments">
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

        {/* Building now */}
        <Section>
          <Box
            borderLeft="3px solid"
            borderColor="purple.400"
            pl={3}
            mb={6}
          >
            <Heading as="h3" fontSize={18} fontWeight="semibold" color="purple.300">
              {t('buildingNow')}
            </Heading>
          </Box>
        </Section>
        <SimpleGrid columns={[1, 1, 2]} gap={6} mb={2}>
          <Section delay={0.1}>
            <ExperimentCard
              title="freak.wtf"
              period="2024 – present"
              description={t('freakwtf')}
              href="https://github.com/elbatlles/freak.wtf"
              linkLabel="View source"
              wip
            />
          </Section>
          <Section delay={0.1}>
            <ExperimentCard
              title="beefy-guardian"
              period="2025 – present"
              description={t('beefyGuardian')}
              tag="DeFi / Node.js"
              wip
            />
          </Section>
          <Section delay={0.15}>
            <ExperimentCard
              title="ai-dev-flow"
              period="2025 – present"
              description={t('aiDevFlow')}
              tag="AI / Multi-agent"
              wip
            />
          </Section>
          <Section delay={0.15}>
            <ExperimentCard
              title="Home Assistant"
              period="ongoing"
              description={t('homeAssistant')}
              tag="Home automation"
            />
          </Section>
        </SimpleGrid>

        {/* Past experiments */}
        <Section delay={0.25}>
          <Separator my={8} />
          <Box
            borderLeft="3px solid"
            borderColor="gray.500"
            pl={3}
            mb={6}
          >
            <Heading as="h3" fontSize={18} fontWeight="semibold" color="gray.400">
              {t('pastExperiments')}
            </Heading>
          </Box>
        </Section>
        <SimpleGrid columns={[1, 1, 2]} gap={6}>
          <Section delay={0.3}>
            <WorkGridItem id="pideme" title="Pídeme" thumbnail={pidemeImg}>
              {t('textPideme')}
            </WorkGridItem>
          </Section>
          <Section delay={0.3}>
            <WorkGridItem id="media" title="IA-Prevent" thumbnail={mediaImg}>
              {t('textMedia')}
            </WorkGridItem>
          </Section>
          <Section delay={0.35}>
            <WorkGridItem id="personalweb" title="Web personal" thumbnail={personalwebImg}>
              {t('textPersonal')}
            </WorkGridItem>
          </Section>
        </SimpleGrid>
      </Container>
    </Layout>
  )
}

export default Experiments
