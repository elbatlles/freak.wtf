import { useState } from 'react'
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
  Box,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { IoCodeSlashOutline, IoMailOutline, IoLogoLinkedin } from 'react-icons/io5'
import { useTranslations } from 'next-intl'
import NextLink from 'next/link'
import { GlassCard } from '../GlassCard'
import Section from '../section'

const MotionGrid = motion(Grid)

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

        {/* Contact Card — compact rows */}
        <GridItem>
          <GlassCard
            p={{ base: 4, md: 4 }}
            h={{ base: 'auto', md: '100%' }}
            minH={{ base: 'auto', md: 'auto' }}
          >
            <VStack align="start" gap={3} h="100%" justify="center">

              {/* Email row */}
              <HStack w="100%" gap={3}>
                <Icon as={IoMailOutline} boxSize={4} color="gray.400" flexShrink={0} />
                <Text fontSize="xs" color="gray.200" flex={1} overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
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
                  flexShrink={0}
                  _hover={{ bg: 'rgba(168,85,247,0.1)', borderColor: 'purple.400' }}
                  onClick={handleCopy}
                >
                  {copied ? t('connectCopied') : t('connectCopy')}
                </Button>
              </HStack>

              <Box w="100%" h="1px" bg="rgba(255,255,255,0.06)" />

              {/* LinkedIn row */}
              <NextLink href="https://www.linkedin.com/in/abatlles/" passHref target="_blank" rel="noopener noreferrer">
                <HStack
                  w="100%"
                  gap={3}
                  cursor="pointer"
                  role="group"
                  _hover={{ opacity: 1 }}
                  opacity={0.8}
                  transition="opacity 0.15s ease"
                >
                  <Icon as={IoLogoLinkedin} boxSize={4} color="blue.400" flexShrink={0} />
                  <Text fontSize="xs" color="gray.300" flex={1} _groupHover={{ color: 'blue.300' }} transition="color 0.15s ease">
                    /in/abatlles
                  </Text>
                  <Text fontSize="xs" color="gray.600" _groupHover={{ color: 'blue.300' }} transition="color 0.15s ease" flexShrink={0}>
                    →
                  </Text>
                </HStack>
              </NextLink>


            </VStack>
          </GlassCard>
        </GridItem>
      </MotionGrid>
    </Section>
  )
}
