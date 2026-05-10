import Logo from './logo'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import {
  Container,
  Box,
  Link,
  Stack,
  Heading,
  Flex,
  Menu,
  Portal,
  IconButton,
  Button
} from '@chakra-ui/react'
import { LuMenu } from 'react-icons/lu'

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
          : { base: 'gray.600', _dark: '#CBD5E0' }
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

  const changeLanguage = (lang: string) => {
    router.push(router.pathname, router.asPath, { locale: lang })
  }

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

          <Box display={{ base: 'inline-block', md: 'none' }}>
            <Menu.Root lazyMount>
              <Menu.Trigger asChild>
                <IconButton
                  variant="outline"
                  aria-label="Options"
                  bg="whiteAlpha.800"
                  _dark={{ bg: 'blackAlpha.800', borderColor: 'whiteAlpha.200', _hover: { bg: 'blackAlpha.900' } }}
                  backdropFilter="blur(10px)"
                  border="1px solid"
                  borderColor="whiteAlpha.400"
                  _hover={{ bg: 'whiteAlpha.900' }}
                >
                  <LuMenu />
                </IconButton>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content
                    bg="whiteAlpha.900"
                    _dark={{ bg: 'blackAlpha.900', borderColor: 'whiteAlpha.200' }}
                    backdropFilter="blur(20px)"
                    border="1px solid"
                    borderColor="whiteAlpha.400"
                  >
                    <Menu.Item value="experience" asChild>
                      <NextLink href="/experience">{t('experience')}</NextLink>
                    </Menu.Item>
                    <Menu.Item value="lab" asChild>
                      <NextLink href="/lab">{t('experiments')}</NextLink>
                    </Menu.Item>
                    <Menu.Item value="blog" asChild>
                      <NextLink href="/blog">{t('writing')}</NextLink>
                    </Menu.Item>
                    <Menu.Item value="source" asChild>
                      <Link
                        href="https://github.com/elbatlles/freak.wtf"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t('source')}
                      </Link>
                    </Menu.Item>

                    <Box px={2} py={1}>
                      <Flex
                        gap={1}
                        bg={{ base: 'rgba(0,0,0,0.06)', _dark: 'rgba(255,255,255,0.06)' }}
                        borderRadius="lg"
                        p="2px"
                        w="fit-content"
                      >
                        {(['es', 'en'] as const).map(lang => (
                          <Button
                            key={lang}
                            size="xs"
                            variant="ghost"
                            onClick={() => changeLanguage(lang)}
                            borderRadius="md"
                            px={2}
                            fontWeight={locale === lang ? 'semibold' : 'medium'}
                            bg={locale === lang
                              ? { base: 'rgba(139,92,246,0.18)', _dark: 'rgba(168,85,247,0.18)' }
                              : 'transparent'
                            }
                            color={locale === lang
                              ? { base: 'purple.700', _dark: 'purple.200' }
                              : { base: 'gray.500', _dark: '#CBD5E0' }
                            }
                            textTransform="uppercase"
                            fontSize="xs"
                            letterSpacing="wider"
                          >
                            {lang}
                          </Button>
                        ))}
                      </Flex>
                    </Box>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </Box>
        </Flex>
      </Container>
    </Box>
  )
}

export default Navbar
