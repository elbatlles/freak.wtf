import Logo from './logo'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import {
  Container,
  Box,
  Link,
  Stack,
  Heading,
  Flex,
  Portal,
  IconButton,
  Button,
  DrawerRoot,
  DrawerBackdrop,
  DrawerPositioner,
  DrawerContent,
  DrawerBody,
  DrawerCloseTrigger,
  Text,
  VStack,
  HStack,
} from '@chakra-ui/react'
import { LuMenu, LuX } from 'react-icons/lu'
import { IoLogoGithub } from 'react-icons/io5'
import { useTranslations } from 'next-intl'

const LinkItem = ({ href, path, children, ...props }) => {
  const active = path === href

  return (
    <NextLink legacyBehavior href={href} passHref>
      <Link
        px={3}
        py={2}
        borderRadius="lg"
        bg={active
          ? { base: 'rgba(139, 92, 246, 0.18)', _dark: 'rgba(168, 85, 247, 0.18)' }
          : 'transparent'
        }
        color={active
          ? { base: 'purple.700', _dark: 'purple.200' }
          : { base: 'gray.600', _dark: 'gray.300' }
        }
        fontWeight={active ? 'semibold' : 'medium'}
        _hover={{
          bg: active
            ? { base: 'rgba(139, 92, 246, 0.22)', _dark: 'rgba(168, 85, 247, 0.22)' }
            : { base: 'rgba(139, 92, 246, 0.08)', _dark: 'rgba(168, 85, 247, 0.08)' },
          color: { base: 'purple.700', _dark: 'purple.200' },
          textDecoration: 'none'
        }}
        transition="all 0.2s ease"
        {...props}
      >
        {children}
      </Link>
    </NextLink>
  )
}

const Navbar = props => {
  const { path } = props
  const router = useRouter()
  const { locale } = router
  const t = useTranslations('navbar')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const changeLanguage = (lang: string) => {
    router.push(router.pathname, router.asPath, { locale: lang })
  }

  const NAV_LINKS = [
    { href: '/experience', label: t('experience') },
    { href: '/lab', label: t('experiments') },
    { href: '/blog', label: t('writing') },
  ]

  return (
    <Box
      position="fixed"
      as="nav"
      w="100%"
      bg="rgba(255, 255, 255, 0.8)"
      _dark={{ bg: 'rgba(20, 20, 20, 0.8)', borderBottomColor: 'rgba(255, 255, 255, 0.1)' }}
      backdropFilter="blur(20px)"
      borderBottom="1px solid"
      borderBottomColor="rgba(255, 255, 255, 0.3)"
      boxShadow="0 4px 20px 0 rgba(31, 38, 135, 0.2)"
      zIndex={1000}
      {...props}
    >
      <Container
        display="flex"
        p={2}
        maxW="5xl"
        alignItems={'center'}
        position="relative"
      >
        {/* Logo — left */}
        <Flex align="center" flexShrink={0}>
          <Heading as="h1" size="lg" letterSpacing={'tighter'}>
            <Logo />
          </Heading>
        </Flex>

        {/* Links — absolutely centered */}
        <Stack
          direction={{ base: 'column', md: 'row' }}
          display={{ base: 'none', md: 'flex' }}
          alignItems="center"
          justifyContent="center"
          gap={4}
          position="absolute"
          left="50%"
          transform="translateX(-50%)"
        >
          <LinkItem href="/experience" path={path}>
            {t('experience')}
          </LinkItem>
          <LinkItem href="/lab" path={path}>
            {t('experiments')}
          </LinkItem>
          <LinkItem href="/blog" path={path}>
            {t('writing')}
          </LinkItem>
          <LinkItem
            href="https://github.com/elbatlles/freak.wtf"
            path={path}
            display="inline-flex"
            alignItems="center"
            style={{ gap: 4 }}
            pl={2}
          >
            <IoLogoGithub />
            {t('source')}
          </LinkItem>
        </Stack>

        <Flex alignItems="center" gap={2} ml="auto">
          <Flex
            display={{ base: 'none', md: 'flex' }}
            gap={1}
            bg={{ base: 'rgba(0,0,0,0.06)', _dark: 'rgba(255,255,255,0.06)' }}
            borderRadius="lg"
            p="2px"
          >
            {(['es', 'en'] as const).map(lang => (
              <Button
                key={lang}
                size="xs"
                variant="ghost"
                onClick={() => changeLanguage(lang)}
                borderRadius="md"
                px={2}
                py={1}
                fontWeight={locale === lang ? 'semibold' : 'medium'}
                bg={locale === lang
                  ? { base: 'rgba(139,92,246,0.18)', _dark: 'rgba(168,85,247,0.18)' }
                  : 'transparent'
                }
                color={locale === lang
                  ? { base: 'purple.700', _dark: 'purple.200' }
                  : { base: 'gray.500', _dark: '#CBD5E0' }
                }
                _hover={{
                  bg: { base: 'rgba(139,92,246,0.12)', _dark: 'rgba(168,85,247,0.12)' },
                  color: { base: 'purple.700', _dark: 'purple.200' }
                }}
                transition="all 0.15s ease"
                textTransform="uppercase"
                fontSize="xs"
                letterSpacing="wider"
              >
                {lang}
              </Button>
            ))}
          </Flex>

          {/* Mobile: hamburger + drawer */}
          <Box display={{ base: 'inline-block', md: 'none' }}>
            <IconButton
              variant="ghost"
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
              color={{ base: 'gray.700', _dark: 'gray.200' }}
              _hover={{ bg: 'rgba(168,85,247,0.1)' }}
              size="md"
            >
              <LuMenu size={22} />
            </IconButton>
          </Box>
        </Flex>
      </Container>

      {/* ── Mobile Drawer ── */}
      <DrawerRoot
        open={drawerOpen}
        onOpenChange={e => setDrawerOpen(e.open)}
        placement="end"
      >
        <Portal>
          <DrawerBackdrop backdropFilter="blur(4px)" bg="rgba(0,0,0,0.5)" />
          <DrawerPositioner>
            <DrawerContent
              bg="rgba(10, 10, 18, 0.92)"
              backdropFilter="blur(24px)"
              borderLeft="1px solid rgba(168,85,247,0.15)"
              boxShadow="-8px 0 40px rgba(0,0,0,0.4)"
              maxW="75vw"
              w="300px"
            >
              <DrawerBody px={6} pt={6} pb={8}>
                <VStack align="stretch" gap={0} h="100%">

                  {/* Header */}
                  <HStack justify="space-between" mb={8}>
                    <Logo />
                    <DrawerCloseTrigger asChild>
                      <IconButton
                        variant="ghost"
                        aria-label="Close menu"
                        size="sm"
                        color="gray.400"
                        _hover={{ color: 'white', bg: 'rgba(255,255,255,0.08)' }}
                      >
                        <LuX size={18} />
                      </IconButton>
                    </DrawerCloseTrigger>
                  </HStack>

                  {/* Nav links */}
                  <VStack align="stretch" gap={1} flex={1}>
                    {NAV_LINKS.map(({ href, label }) => (
                      <NextLink key={href} href={href} passHref>
                        <Box
                          as="a"
                          display="block"
                          px={4}
                          py={3}
                          borderRadius="xl"
                          fontSize="lg"
                          fontWeight={path === href ? 'semibold' : 'medium'}
                          color={path === href ? 'purple.300' : 'gray.200'}
                          bg={path === href ? 'rgba(168,85,247,0.12)' : 'transparent'}
                          borderLeft={path === href ? '2px solid' : '2px solid transparent'}
                          borderColor={path === href ? 'purple.400' : 'transparent'}
                          _hover={{ bg: 'rgba(168,85,247,0.08)', color: 'purple.200' }}
                          transition="all 0.15s ease"
                          onClick={() => setDrawerOpen(false)}
                        >
                          {label}
                        </Box>
                      </NextLink>
                    ))}

                    {/* GitHub */}
                    <a
                      href="https://github.com/elbatlles/freak.wtf"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none' }}
                      onClick={() => setDrawerOpen(false)}
                    >
                      <HStack
                        px={4}
                        py={3}
                        borderRadius="xl"
                        fontSize="lg"
                        fontWeight="medium"
                        color="gray.400"
                        borderLeft="2px solid transparent"
                        _hover={{ bg: 'rgba(168,85,247,0.08)', color: 'gray.200' }}
                        transition="all 0.15s ease"
                        gap={2}
                      >
                        <IoLogoGithub size={18} />
                        <Text>{t('source')}</Text>
                      </HStack>
                    </a>
                  </VStack>

                  {/* Language switcher */}
                  <HStack
                    gap={1}
                    mt={8}
                    bg="rgba(255,255,255,0.05)"
                    borderRadius="lg"
                    p="3px"
                    w="fit-content"
                  >
                    {(['es', 'en'] as const).map(lang => (
                      <Button
                        key={lang}
                        size="sm"
                        variant="ghost"
                        onClick={() => { changeLanguage(lang); setDrawerOpen(false) }}
                        borderRadius="md"
                        px={3}
                        fontWeight={locale === lang ? 'semibold' : 'medium'}
                        bg={locale === lang ? 'rgba(168,85,247,0.2)' : 'transparent'}
                        color={locale === lang ? 'purple.200' : 'gray.400'}
                        _hover={{ bg: 'rgba(168,85,247,0.12)', color: 'purple.200' }}
                        textTransform="uppercase"
                        fontSize="sm"
                        letterSpacing="wider"
                      >
                        {lang}
                      </Button>
                    ))}
                  </HStack>

                </VStack>
              </DrawerBody>
            </DrawerContent>
          </DrawerPositioner>
        </Portal>
      </DrawerRoot>
    </Box>
  )
}

export default Navbar
