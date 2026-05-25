import {
  Badge,
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Icon,
  Text,
  VStack
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import NextLink from 'next/link'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import {
  IoCodeSlashOutline,
  IoLogoLinkedin,
  IoMailOutline
} from 'react-icons/io5'
import { GlassCard } from '../GlassCard'
import Section from '../section'

const MotionGrid = motion.create(Grid)

const EMAIL = 'angel@freak.wtf'

export const BentoGrid = () => {
  const t = useTranslations('home')
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <Section delay={0.5}>
      <MotionGrid
        templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
        gap={{ base: 4, md: 6 }}
        mb={12}
        initial={{ y: 8 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* ── About (2/3) ── */}
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <GlassCard p={{ base: 5, md: 6 }} h={{ base: 'auto', md: '100%' }}>
            <VStack align="start" gap={4} h="100%">
              {/* Header */}
              <HStack>
                <Icon
                  as={IoCodeSlashOutline}
                  color="purple.400"
                  boxSize={{ base: 5, md: 6 }}
                />
                <Text
                  fontWeight="semibold"
                  fontSize={{ base: 'md', md: 'lg' }}
                  color="gray.100"
                >
                  {t('aboutMe')}
                </Text>
              </HStack>

              {/* Bio */}
              <VStack align="start" gap={2}>
                <Text
                  color="gray.300"
                  lineHeight="tall"
                  fontSize={{ base: 'sm', md: 'md' }}
                >
                  {t('aboutDescription')}
                </Text>
                <Text
                  color="gray.400"
                  lineHeight="tall"
                  fontSize={{ base: 'xs', md: 'sm' }}
                >
                  {t('aboutContext')}
                </Text>
                <NextLink href="/lab" passHref>
                  <Button
                    size="sm"
                    variant="outline"
                    borderColor="purple.500"
                    color="purple.300"
                    _hover={{
                      bg: 'rgba(168,85,247,0.12)',
                      borderColor: 'purple.300'
                    }}
                    mt={1}
                  >
                    {t('experimentsBtn')}
                  </Button>
                </NextLink>
              </VStack>

              {/* Footer */}
              <HStack gap={3} flexWrap="wrap" mt="auto" pt={1}>
                <Badge colorPalette="purple" variant="subtle" fontSize="xs">
                  📍 {t('locationBadge')}
                </Badge>
                <Badge colorPalette="blue" variant="subtle" fontSize="xs">
                  💼 {t('jobBadge')}
                </Badge>
              </HStack>
            </VStack>
          </GlassCard>
        </GridItem>

        {/* ── Contact (1/3) ── */}
        <GridItem>
          <GlassCard p={{ base: 4, md: 5 }} h={{ base: 'auto', md: '100%' }}>
            <VStack align="start" gap={4} h="100%">
              <HStack>
                <Icon
                  as={IoMailOutline}
                  color="purple.400"
                  boxSize={{ base: 5, md: 6 }}
                />
                <Text
                  fontWeight="semibold"
                  fontSize={{ base: 'md', md: 'lg' }}
                  color="gray.100"
                >
                  {t('connectTitle')}
                </Text>
              </HStack>

              <Text fontSize="sm" color="gray.400" mt={-2}>
                {t('connectSubtitle')}
              </Text>

              <Box w="100%" h="1px" bg="rgba(255,255,255,0.06)" />

              {/* Email */}
              <VStack align="start" gap={2} w="100%">
                <Text
                  fontSize="xs"
                  color="gray.500"
                  textTransform="uppercase"
                  letterSpacing="wide"
                  fontWeight="medium"
                >
                  Email
                </Text>
                <Text
                  fontSize="xs"
                  color="gray.200"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  w="100%"
                >
                  {EMAIL}
                </Text>
                <Button
                  size="xs"
                  variant="outline"
                  borderColor={copied ? 'green.500' : 'rgba(168,85,247,0.35)'}
                  color={copied ? 'green.300' : 'purple.300'}
                  fontSize="10px"
                  h={5}
                  px={2}
                  _hover={{
                    bg: 'rgba(168,85,247,0.1)',
                    borderColor: 'purple.400'
                  }}
                  onClick={handleCopy}
                >
                  {copied ? t('connectCopied') : t('connectCopy')}
                </Button>
              </VStack>

              <Box w="100%" h="1px" bg="rgba(255,255,255,0.06)" />

              {/* LinkedIn */}
              <VStack align="start" gap={2} w="100%">
                <Text
                  fontSize="xs"
                  color="gray.500"
                  textTransform="uppercase"
                  letterSpacing="wide"
                  fontWeight="medium"
                >
                  LinkedIn
                </Text>
                <NextLink
                  href="https://www.linkedin.com/in/abatlles/"
                  passHref
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <HStack
                    gap={2}
                    cursor="pointer"
                    role="group"
                    _hover={{ opacity: 1 }}
                    opacity={0.8}
                    transition="opacity 0.15s ease"
                  >
                    <Icon as={IoLogoLinkedin} boxSize={4} color="blue.400" />
                    <Text
                      fontSize="xs"
                      color="gray.300"
                      _groupHover={{ color: 'blue.300' }}
                      transition="color 0.15s ease"
                    >
                      /in/abatlles →
                    </Text>
                  </HStack>
                </NextLink>
              </VStack>
            </VStack>
          </GlassCard>
        </GridItem>
      </MotionGrid>
    </Section>
  )
}
