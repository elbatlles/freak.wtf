import {
  Grid,
  GridItem,
  VStack,
  HStack,
  Heading,
  Text,
  Badge,
  Button,
  Icon,
  Link,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { IoCodeSlashOutline, IoLogoGithub } from 'react-icons/io5'
import { FaXTwitter } from 'react-icons/fa6'
import { useTranslations } from 'next-intl'
import NextLink from 'next/link'
import { GlassCard } from '../GlassCard'
import Section from '../section'

const MotionGrid = motion(Grid)

const SOCIAL_LINKS = [
  {
    href: 'https://github.com/elbatlles',
    icon: IoLogoGithub,
    label: 'GitHub',
    borderColor: 'gray.600',
    color: 'gray.300',
    hoverBorderColor: 'gray.400',
    hoverColor: 'white',
    hoverBg: 'gray.700',
  },
  {
    href: 'https://x.com/elbatlles',
    icon: FaXTwitter,
    label: 'X',
    borderColor: 'gray.600',
    color: 'gray.300',
    hoverBorderColor: 'gray.400',
    hoverColor: 'white',
    hoverBg: 'gray.700',
  },
  {
    href: 'https://www.linkedin.com/in/abatlles/',
    icon: null,
    label: 'LinkedIn',
    borderColor: 'blue.500',
    color: 'blue.300',
    hoverBorderColor: 'blue.300',
    hoverColor: 'white',
    hoverBg: 'blue.500',
  },
] as const

const LinkedInIcon = () => (
  <Icon boxSize={4} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </Icon>
)

export const BentoGrid = () => {
  const t = useTranslations('home')

  return (
    <Section delay={0.5}>
      <MotionGrid
        templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
        templateRows={{ base: 'auto', md: '1fr' }}
        gap={{ base: 4, md: 6 }}
        mb={12}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* About Card */}
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <GlassCard
            p={{ base: 5, md: 6 }}
            h={{ base: 'auto', md: '100%' }}
            minH={{ base: '180px', md: 'auto' }}
          >
            <VStack align="start" gap={4} h="100%">
              <HStack>
                <Icon
                  as={IoCodeSlashOutline}
                  color="purple.400"
                  boxSize={{ base: 5, md: 6 }}
                />
                <Heading size={{ base: 'sm', md: 'md' }}>
                  {t('aboutMe')}
                </Heading>
              </HStack>

              <VStack align="start" gap={3}>
                <Text color="gray.300" lineHeight="tall" fontSize={{ base: 'sm', md: 'md' }}>
                  {t('aboutDescription')}
                </Text>
                <Text color="gray.400" lineHeight="tall" fontSize={{ base: 'xs', md: 'sm' }}>
                  {t('aboutContext')}
                </Text>
              </VStack>

              <NextLink href="/lab" passHref>
                <Button
                  size="sm"
                  variant="outline"
                  borderColor="purple.500"
                  color="purple.300"
                  _hover={{ bg: 'rgba(168,85,247,0.12)', borderColor: 'purple.300' }}
                  mt={1}
                >
                  {t('experimentsBtn')}
                </Button>
              </NextLink>

              <VStack align="start" gap={2} mt="auto">
                <Badge colorPalette="purple" variant="subtle">
                  📍 {t('locationBadge')}
                </Badge>
                <Badge colorPalette="blue" variant="subtle">
                  💼 {t('jobBadge')}
                </Badge>
              </VStack>
            </VStack>
          </GlassCard>
        </GridItem>

        {/* Social Links Card */}
        <GridItem>
          <GlassCard
            p={{ base: 5, md: 5 }}
            h={{ base: 'auto', md: '100%' }}
            minH={{ base: '200px', md: 'auto' }}
            textAlign="center"
          >
            <VStack gap={4} h="100%" justify="space-between">
              <VStack gap={1}>
                <Text fontSize={{ base: 'lg', md: 'xl' }}>🤝</Text>
                <Text fontWeight="bold" fontSize={{ base: 'xs', md: 'sm' }}>
                  {t('connectTitle')}
                </Text>
                <Text fontSize={{ base: 'xs', md: 'xs' }} color="gray.400" textAlign="center">
                  {t('connectSubtitle')}
                </Text>
              </VStack>

              <VStack gap={2} w="100%" flex={1} justify="center">
                {SOCIAL_LINKS.map(({ href, icon, label, borderColor, color, hoverBorderColor, hoverColor, hoverBg }) => (
                  <Link key={label} href={href} target="_blank" rel="noopener noreferrer" w="100%">
                    <Button
                      size="sm"
                      variant="outline"
                      w="100%"
                      borderColor={borderColor}
                      color={color}
                      _hover={{ borderColor: hoverBorderColor, color: hoverColor, bg: hoverBg }}
                    >
                      {icon ? <Icon as={icon} /> : <LinkedInIcon />} {label}
                    </Button>
                  </Link>
                ))}
              </VStack>

              <Text fontSize="xs" color="gray.500" textAlign="center">
                {t('alwaysOpen')}
              </Text>
            </VStack>
          </GlassCard>
        </GridItem>
      </MotionGrid>
    </Section>
  )
}
