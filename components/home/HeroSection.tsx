import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Text,
  useBreakpointValue,
  VStack
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import NextLink from 'next/link'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { IoReader } from 'react-icons/io5'
import { LuChevronRight } from 'react-icons/lu'

const MotionBox = motion.create(Box)

const VoxelMeHomepage = dynamic(() => import('./VoxelMeHomepage'), {
  ssr: false,
  loading: () => <Box />
})
const MiniTerminal = dynamic(() => import('./MiniTerminal'), {
  ssr: false,
  loading: () => <Box />
})

const TOGGLE_OPTIONS = [
  { label: '◎ 3D', value: false },
  { label: '> terminal', value: true }
] as const

interface HeroSectionProps {
  locale: string | undefined
}

export const HeroSection = ({ locale }: HeroSectionProps) => {
  const t = useTranslations('home')
  // "Software engineer / AI & CrossFit / Always in beta" → styled segments,
  // last one highlighted in phosphor.
  const segments = (t('subName') as string).split('/')
  // Default to terminal on mobile so Three.js doesn't block initial load.
  // On desktop, Three.js is deferred via requestIdleCallback.
  const [showTerminal, setShowTerminal] = useState(true)
  const [loadThreeD, setLoadThreeD] = useState(false)
  // undefined during SSR/hydration — default to true (mobile-first: don't mount 3D)
  const isMobile = useBreakpointValue({ base: true, md: false }) ?? true

  useEffect(() => {
    // Load Three.js only AFTER LCP has been observed (or after 5s fallback).
    // requestIdleCallback fires too early on desktop (immediately after hydration),
    // causing Three.js WebGL compilation to block the main thread during TBT window.
    let settled = false
    const load = () => {
      if (settled) return
      settled = true
      setLoadThreeD(true)
    }

    // Wait for LCP to fire, then load Three.js on the next idle frame
    if (typeof PerformanceObserver !== 'undefined') {
      try {
        const po = new PerformanceObserver(list => {
          // LCP entries can keep firing; schedule load after the last one
          list.getEntries()
          // Give the browser one more frame after LCP before loading
          requestAnimationFrame(() => setTimeout(load, 300))
        })
        po.observe({ type: 'largest-contentful-paint', buffered: true })
        // Fallback: load after 5s regardless
        const fallback = setTimeout(load, 5000)
        return () => {
          po.disconnect()
          clearTimeout(fallback)
        }
      } catch {
        // PerformanceObserver not supported
      }
    }
    // Final fallback for old browsers
    const id = setTimeout(load, 3000)
    return () => clearTimeout(id)
  }, [])

  return (
    <Box mb={{ base: 8, md: 12 }}>
      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
        gap={{ base: 6, md: 6 }}
        alignItems="center"
      >
        <GridItem colSpan={{ base: 1, md: 2 }} minW={0} overflow="hidden">
          <VStack align="stretch" gap={5} w="full" minW={0}>
            {/* Subheading */}
            <MotionBox
              w="full"
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <Text
                fontFamily="mono"
                fontSize={{ base: '2xs', md: 'xs' }}
                letterSpacing="0.08em"
                mb={3}
                userSelect="none"
              >
                <Text as="span" color="gray.500">
                  ~/
                </Text>
                <Text as="span" color="phosphor.300">
                  angel
                </Text>
                <Text as="span" color="gray.500">
                  :~$
                </Text>
              </Text>
              <Heading
                as="h1"
                fontFamily="heading"
                fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
                fontWeight="bold"
                lineHeight={1.15}
                letterSpacing="-0.02em"
                mb={1}
              >
                {segments.map((seg, i) => {
                  const isLast = i === segments.length - 1
                  return (
                    <Box as="span" key={seg}>
                      <Box
                        as="span"
                        color={isLast && segments.length > 1 ? 'phosphor.300' : 'gray.100'}
                      >
                        {seg.trim()}
                      </Box>
                      {!isLast && (
                        <Box as="span" color="phosphor.700" mx={{ base: 1, md: 2 }}>
                          /
                        </Box>
                      )}
                    </Box>
                  )
                })}
              </Heading>
            </MotionBox>

            {/* Mobile toggle */}
            <HStack display={{ base: 'flex', md: 'none' }} gap={2} mt={-1}>
              {TOGGLE_OPTIONS.map(({ label, value }) => (
                <Box
                  key={label}
                  as="button"
                  px={3}
                  py={1}
                  borderRadius="md"
                  fontSize="xs"
                  fontFamily="mono"
                  letterSpacing="0.05em"
                  border="1px solid"
                  borderColor={
                    showTerminal === value
                      ? 'rgba(96,224,128,0.55)'
                      : 'rgba(96,224,128,0.22)'
                  }
                  bg={
                    showTerminal === value
                      ? 'rgba(96,224,128,0.12)'
                      : 'transparent'
                  }
                  color={showTerminal === value ? 'phosphor.300' : 'gray.500'}
                  onClick={() => {
                    setShowTerminal(value)
                    // Trigger Three.js load when user explicitly requests 3D
                    if (!value) setLoadThreeD(true)
                  }}
                >
                  {label}
                </Box>
              ))}
            </HStack>

            {/* Mobile VoxelMe — only render when user explicitly requests 3D */}
            {!showTerminal && loadThreeD && (
              <Box
                display={{ base: 'block', md: 'none' }}
                h="300px"
                w="full"
                position="relative"
              >
                <VoxelMeHomepage />
              </Box>
            )}

            {/* Mobile: auto-animated interview (no AI, instant load) */}
            {showTerminal && (
              <MotionBox
                display={{ base: 'block', md: 'none' }}
                w="full"
                mt={{ base: -3, md: 0 }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <MiniTerminal h="360px" locale={locale} />
              </MotionBox>
            )}

            {/* Desktop: full AI terminal */}
            {!isMobile && (
              <MotionBox
                w="full"
                mt={{ base: -3, md: 0 }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <MiniTerminal
                  h={{ base: '360px', md: '300px' }}
                  locale={locale}
                />
              </MotionBox>
            )}

            {/* Action buttons */}
            <HStack gap={{ base: 2, md: 4 }} flexWrap="wrap">
              <NextLink href="/experience" passHref>
                <Button
                  size={{ base: 'md', md: 'lg' }}
                  borderRadius="md"
                  bg="phosphor.400"
                  color="#0a0e0b"
                  fontWeight="semibold"
                  _hover={{
                    bg: 'phosphor.300',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 28px rgba(96,224,128,0.28)'
                  }}
                  transition="all 0.25s ease"
                >
                  {t('bottomPortfolio')} <LuChevronRight />
                </Button>
              </NextLink>
              <NextLink href="/blog" passHref>
                <Button
                  size={{ base: 'md', md: 'lg' }}
                  variant="outline"
                  borderRadius="md"
                  borderColor="phosphor.600"
                  color="phosphor.300"
                  _hover={{
                    bg: 'rgba(96,224,128,0.1)',
                    borderColor: 'phosphor.400',
                    transform: 'translateY(-2px)'
                  }}
                  transition="all 0.25s ease"
                >
                  Blog <Icon as={IoReader} />
                </Button>
              </NextLink>
            </HStack>
          </VStack>
        </GridItem>

        {/* Desktop 3D model */}
        <GridItem
          colSpan={1}
          display={{ base: 'none', md: 'flex' }}
          justifyContent="center"
          alignItems="center"
          minH="400px"
        >
          <MotionBox
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            w="full"
            h="400px"
            position="relative"
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
          >
            <Box
              position="absolute"
              inset="0"
              borderRadius="2xl"
              bg="radial-gradient(circle at 50% 50%, rgba(96, 224, 128, 0.1), transparent 70%)"
              filter="blur(40px)"
              pointerEvents="none"
            />
            {/* Three.js deferred until browser idle — prevents blocking LCP */}
            {loadThreeD && <VoxelMeHomepage />}
          </MotionBox>
        </GridItem>
      </Grid>
    </Box>
  )
}
