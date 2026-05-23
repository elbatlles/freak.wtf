import { useState, useEffect } from 'react'
import NextLink from 'next/link'
import dynamic from 'next/dynamic'
import {
  Box,
  Grid,
  GridItem,
  Heading,
  HStack,
  VStack,
  Button,
  Icon,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { LuChevronRight } from 'react-icons/lu'
import { IoReader } from 'react-icons/io5'
import { useTranslations } from 'next-intl'

const MotionBox = motion.create(Box)

const VoxelMeHomepage = dynamic(() => import('./VoxelMeHomepage'), {
  ssr: false,
  loading: () => <Box />,
})
const MiniTerminal = dynamic(() => import('./MiniTerminal'), {
  ssr: false,
  loading: () => <Box />,
})

const TOGGLE_OPTIONS = [
  { label: '◎ 3D', value: false },
  { label: '> terminal', value: true },
] as const

interface HeroSectionProps {
  locale: string | undefined
}

export const HeroSection = ({ locale }: HeroSectionProps) => {
  const t = useTranslations('home')
  // Default to terminal on mobile so Three.js doesn't block initial load.
  // On desktop, Three.js is deferred via requestIdleCallback.
  const [showTerminal, setShowTerminal] = useState(true)
  const [loadThreeD, setLoadThreeD] = useState(false)

  useEffect(() => {
    // Load Three.js only when the browser is idle (after LCP has a chance to happen)
    const load = () => setLoadThreeD(true)
    if ('requestIdleCallback' in window) {
      const id = (window as Window & typeof globalThis & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(load, { timeout: 3000 })
      return () => (window as Window & typeof globalThis & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(id)
    }
    const id = setTimeout(load, 2000)
    return () => clearTimeout(id)
  }, [])

  return (
    <Box
      mb={{ base: 8, md: 12 }}
    >
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
              <Heading
                as="h2"
                fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
                fontWeight="semibold"
                lineHeight={1.4}
                mb={1}
                style={{
                  background: 'linear-gradient(to right, #a855f7, #60a5fa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {t('subName')}
              </Heading>
            </MotionBox>

            {/* Mobile toggle */}
            <HStack display={{ base: 'flex', md: 'none' }} gap={2} mt={-1}>
              {TOGGLE_OPTIONS.map(({ label, value }) => (
                <Box
                  key={label}
                  as="button"
                  px={3} py={1} borderRadius="full" fontSize="xs"
                  border="1px solid"
                  borderColor={showTerminal === value ? 'rgba(168,85,247,0.6)' : 'rgba(168,85,247,0.25)'}
                  bg={showTerminal === value ? 'rgba(168,85,247,0.15)' : 'transparent'}
                  color={showTerminal === value ? '#c084fc' : 'gray.500'}
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
                h="300px" w="full" position="relative"
              >
                <VoxelMeHomepage />
              </Box>
            )}

            {/* MiniTerminal */}
            <MotionBox
              w="full"
              mt={{ base: -3, md: 0 }}
              display={{ base: showTerminal ? 'block' : 'none', md: 'block' }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <MiniTerminal
                h={{ base: '360px', md: '300px' }}
                locale={locale}
              />
            </MotionBox>

            {/* Action buttons */}
            <HStack gap={{ base: 2, md: 4 }} flexWrap="wrap">
              <NextLink href="/experience" passHref>
                <Button
                  size={{ base: 'md', md: 'lg' }}
                  colorPalette="purple"
                  bg="purple.500"
                  _hover={{ bg: 'purple.600', transform: 'translateY(-2px)' }}
                  transition="all 0.3s ease"
                >
                  {t('bottomPortfolio')} <LuChevronRight />
                </Button>
              </NextLink>
              <NextLink href="/blog" passHref>
                <Button
                  size={{ base: 'md', md: 'lg' }}
                  variant="outline"
                  borderColor="purple.300"
                  color="purple.400"
                  _hover={{ bg: 'purple.50', borderColor: 'purple.400', transform: 'translateY(-2px)' }}
                  transition="all 0.3s ease"
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
              bg="radial-gradient(circle at 50% 50%, rgba(138, 43, 226, 0.15), transparent 70%)"
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
