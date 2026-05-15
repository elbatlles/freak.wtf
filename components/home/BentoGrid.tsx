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
import { IoCodeSlashOutline } from 'react-icons/io5'
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

        {/* Contact Card — terminal style */}
        <GridItem>
          <GlassCard
            p={{ base: 5, md: 5 }}
            h={{ base: 'auto', md: '100%' }}
            minH={{ base: '200px', md: 'auto' }}
          >
            <VStack align="start" gap={4} h="100%" justify="space-between">
              {/* Terminal block */}
              <VStack align="start" gap={3} w="100%">
                {/* Prompt line */}
                <HStack gap={2} fontFamily="mono" fontSize={{ base: '11px', md: 'xs' }}>
                  <Text color="purple.400" userSelect="none">$</Text>
                  <Text color="gray.200">{t('connectCommand')}</Text>
                </HStack>

                {/* Output block */}
                <Box
                  pl={4}
                  borderLeft="2px solid"
                  borderColor="rgba(168,85,247,0.25)"
                  w="100%"
                >
                  <VStack align="start" gap={2}>
                    <HStack gap={2} flexWrap="wrap">
                      <Text fontFamily="mono" fontSize={{ base: '11px', md: 'xs' }} color="gray.500">email:</Text>
                      <Text fontFamily="mono" fontSize={{ base: '11px', md: 'xs' }} color="green.300" fontWeight="medium">
                        {EMAIL}
                      </Text>
                    </HStack>
                    <Button
                      size="xs"
                      variant="outline"
                      borderColor={copied ? 'green.500' : 'rgba(168,85,247,0.4)'}
                      color={copied ? 'green.300' : 'purple.300'}
                      fontFamily="mono"
                      fontSize="10px"
                      h={6}
                      px={3}
                      _hover={{ bg: 'rgba(168,85,247,0.1)', borderColor: 'purple.400' }}
                      onClick={handleCopy}
                    >
                      {copied ? t('connectCopied') : t('connectCopy')}
                    </Button>
                  </VStack>
                </Box>
              </VStack>

              {/* Secondary CTA */}
              <NextLink href="/terminal" passHref>
                <Text
                  fontFamily="mono"
                  fontSize={{ base: '10px', md: 'xs' }}
                  color="gray.500"
                  _hover={{ color: 'purple.300' }}
                  transition="color 0.15s ease"
                  cursor="pointer"
                >
                  {t('connectInvoke')}
                </Text>
              </NextLink>
            </VStack>
          </GlassCard>
        </GridItem>
      </MotionGrid>
    </Section>
  )
}
