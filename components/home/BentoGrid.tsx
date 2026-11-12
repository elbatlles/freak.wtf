import {
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
              <HStack justify="space-between" w="full">
                <HStack>
                  <Icon
                    as={IoCodeSlashOutline}
                    color="phosphor.400"
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
                <Text
                  fontFamily="mono"
                  fontSize="xs"
                  color="gray.600"
                  userSelect="none"
                >
                  01
                </Text>
              </HStack>

              {/* Bio */}
              <VStack align="start" gap={2}>
                <Text
                  color="text-muted"
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
                    borderRadius="md"
                    borderColor="phosphor.600"
                    color="phosphor.300"
                    _hover={{
                      bg: 'rgba(96,224,128,0.1)',
                      borderColor: 'phosphor.400'
                    }}
                    mt={1}
                  >
                    {t('experimentsBtn')}
                  </Button>
                </NextLink>
              </VStack>

              {/* Footer */}
              <HStack gap={2} flexWrap="wrap" mt="auto" pt={1}>
                <Text
                  fontFamily="mono"
                  fontSize="xs"
                  color="gray.400"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                  borderRadius="md"
                  px={2}
                  py={0.5}
                >
                  📍 {t('locationBadge')}
                </Text>
                <Text
                  fontFamily="mono"
                  fontSize="xs"
                  color="gray.400"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                  borderRadius="md"
                  px={2}
                  py={0.5}
                >
                  💼 {t('jobBadge')}
                </Text>
              </HStack>
            </VStack>
          </GlassCard>
        </GridItem>

        {/* ── Contact (1/3) ── */}
        <GridItem>
          <GlassCard p={{ base: 4, md: 5 }} h={{ base: 'auto', md: '100%' }}>
            <VStack align="start" gap={4} h="100%">
              <HStack justify="space-between" w="full">
                <HStack>
                  <Icon
                    as={IoMailOutline}
                    color="phosphor.400"
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
                <Text
                  fontFamily="mono"
                  fontSize="xs"
                  color="gray.600"
                  userSelect="none"
                >
                  02
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
                  fontFamily="mono"
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
                  borderRadius="md"
                  borderColor={copied ? 'green.500' : 'rgba(96,224,128,0.4)'}
                  color={copied ? 'green.300' : 'phosphor.300'}
                  fontSize="10px"
                  fontFamily="mono"
                  h={5}
                  px={2}
                  _hover={{
                    bg: 'rgba(96,224,128,0.1)',
                    borderColor: 'phosphor.400'
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
                  fontFamily="mono"
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
                      color="text-muted"
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
