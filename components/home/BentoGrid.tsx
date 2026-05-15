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
import {
  IoCodeSlashOutline,
  IoMailOutline,
  IoLogoLinkedin,
  IoTimeOutline,
  IoDocumentTextOutline,
} from 'react-icons/io5'
import { useTranslations } from 'next-intl'
import NextLink from 'next/link'
import { GlassCard } from '../GlassCard'
import Section from '../section'

const MotionGrid = motion(Grid)

const EMAIL = 'angel@freak.wtf'

interface LatestPost {
  slug: string
  title: string
  excerpt: string
  date: string
}

interface BentoGridProps {
  latestPost: LatestPost | null
}

export const BentoGrid = ({ latestPost }: BentoGridProps) => {
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
        templateRows={{ base: 'auto', md: 'auto auto' }}
        gap={{ base: 4, md: 6 }}
        mb={12}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* ── Row 1: About — full width ── */}
        <GridItem colSpan={{ base: 1, md: 3 }}>
          <GlassCard p={{ base: 5, md: 6 }}>
            <VStack align="start" gap={4}>
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

              <HStack gap={3} flexWrap="wrap">
                <Badge colorPalette="purple" variant="subtle">
                  📍 {t('locationBadge')}
                </Badge>
                <Badge colorPalette="blue" variant="subtle">
                  💼 {t('jobBadge')}
                </Badge>
                <NextLink href="/lab" passHref>
                  <Button
                    size="sm"
                    variant="outline"
                    borderColor="purple.500"
                    color="purple.300"
                    _hover={{ bg: 'rgba(168,85,247,0.12)', borderColor: 'purple.300' }}
                  >
                    {t('experimentsBtn')}
                  </Button>
                </NextLink>
              </HStack>
            </VStack>
          </GlassCard>
        </GridItem>

        {/* ── Row 2, Col 1: Now ── */}
        <GridItem>
          <GlassCard p={{ base: 4, md: 5 }} h="100%">
            <VStack align="start" gap={3} h="100%">
              <HStack>
                <Icon as={IoTimeOutline} boxSize={4} color="green.400" />
                <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="wider" fontWeight="semibold">
                  {t('nowTitle')}
                </Text>
              </HStack>

              <Box w="100%" h="1px" bg="rgba(255,255,255,0.06)" />

              <Text fontSize="sm" color="gray.200" fontWeight="medium">
                {t('nowStatus')}
              </Text>
              <Text fontSize="xs" color="gray.400" lineHeight="tall">
                {t('nowDetail')}
              </Text>

              <Box mt="auto">
                <NextLink href="/timeline" passHref>
                  <Text fontSize="xs" color="purple.400" _hover={{ color: 'purple.300' }} transition="color 0.15s ease">
                    {t('nowLink')}
                  </Text>
                </NextLink>
              </Box>
            </VStack>
          </GlassCard>
        </GridItem>

        {/* ── Row 2, Col 2: Contact ── */}
        <GridItem>
          <GlassCard p={{ base: 4, md: 5 }} h="100%">
            <VStack align="start" gap={3} h="100%">
              <HStack>
                <Icon as={IoMailOutline} boxSize={4} color="purple.400" />
                <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="wider" fontWeight="semibold">
                  {t('connectTitle')}
                </Text>
              </HStack>

              <Box w="100%" h="1px" bg="rgba(255,255,255,0.06)" />

              {/* Email row */}
              <VStack align="start" gap={1} w="100%">
                <Text fontSize="xs" color="gray.300" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" w="100%">
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
                  _hover={{ bg: 'rgba(168,85,247,0.1)', borderColor: 'purple.400' }}
                  onClick={handleCopy}
                >
                  {copied ? t('connectCopied') : t('connectCopy')}
                </Button>
              </VStack>

              <Box w="100%" h="1px" bg="rgba(255,255,255,0.06)" />

              {/* LinkedIn row */}
              <NextLink href="https://www.linkedin.com/in/abatlles/" passHref target="_blank" rel="noopener noreferrer">
                <HStack
                  gap={2}
                  cursor="pointer"
                  role="group"
                  _hover={{ opacity: 1 }}
                  opacity={0.8}
                  transition="opacity 0.15s ease"
                >
                  <Icon as={IoLogoLinkedin} boxSize={4} color="blue.400" />
                  <Text fontSize="xs" color="gray.300" _groupHover={{ color: 'blue.300' }} transition="color 0.15s ease">
                    /in/abatlles →
                  </Text>
                </HStack>
              </NextLink>
            </VStack>
          </GlassCard>
        </GridItem>

        {/* ── Row 2, Col 3: Latest post ── */}
        <GridItem>
          <GlassCard p={{ base: 4, md: 5 }} h="100%">
            <VStack align="start" gap={3} h="100%">
              <HStack>
                <Icon as={IoDocumentTextOutline} boxSize={4} color="blue.400" />
                <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="wider" fontWeight="semibold">
                  {t('latestPostTitle')}
                </Text>
              </HStack>

              <Box w="100%" h="1px" bg="rgba(255,255,255,0.06)" />

              {latestPost ? (
                <>
                  <Text fontSize="sm" color="gray.200" fontWeight="medium" lineHeight="short">
                    {latestPost.title}
                  </Text>
                  <Text fontSize="xs" color="gray.400" lineHeight="tall"
                    overflow="hidden"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {latestPost.excerpt}
                  </Text>
                  <Box mt="auto">
                    <NextLink href={`/blog/${latestPost.slug}`} passHref>
                      <Text fontSize="xs" color="purple.400" _hover={{ color: 'purple.300' }} transition="color 0.15s ease">
                        Read →
                      </Text>
                    </NextLink>
                  </Box>
                </>
              ) : (
                <NextLink href="/blog" passHref>
                  <Text fontSize="sm" color="purple.400" _hover={{ color: 'purple.300' }} transition="color 0.15s ease">
                    View all posts →
                  </Text>
                </NextLink>
              )}
            </VStack>
          </GlassCard>
        </GridItem>
      </MotionGrid>
    </Section>
  )
}

