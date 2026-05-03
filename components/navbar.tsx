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
  NativeSelect
} from '@chakra-ui/react'
import { LuMenu } from 'react-icons/lu'

import { IoLogoGithub } from 'react-icons/io5'
import * as en from '../locales/en'
import * as es from '../locales/es'

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
  const tAux = locale === 'en' ? en : es
  const t = tAux.navbar

  const changeLanguage = e => {
    const locale = e.target.value
    router.push(router.pathname, router.asPath, { locale })
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
        maxW="container.md"
        flexWrap={'wrap'}
        alignContent={'center'}
        justifyContent={'space-between'}
      >
        <Flex align="center" mr={5}>
          <Heading as="h1" size="lg" letterSpacing={'tighter'}>
            <Logo />
          </Heading>
        </Flex>

        <Stack
          direction={{ base: 'column', md: 'row' }}
          display={{ base: 'none', md: 'flex' }}
          width={{ base: 'full', md: 'auto' }}
          alignItems="center"
          flexGrow={1}
          mt={{ base: 4, md: 0 }}
          gap={4}
        >
          <LinkItem href="/works" path={path}>
            {t.works}
          </LinkItem>
          <LinkItem href="/timeline" path={path}>
            {t.timeline}
          </LinkItem>
          <LinkItem href="/blog" path={path}>
            {t.posts}
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
            {t.source}
          </LinkItem>
        </Stack>

        <Flex alignItems="center" gap={2}>
          <NativeSelect.Root
            display={{ base: 'none', md: 'inline-flex' }}
            w="75px"
            size="sm"
          >
            <NativeSelect.Field
              onChange={changeLanguage}
              defaultValue={locale}
              bg="whiteAlpha.800"
              _dark={{ bg: 'blackAlpha.800', borderColor: 'whiteAlpha.200', color: 'gray.200' }}
              backdropFilter="blur(10px)"
              border="1px solid"
              borderColor="whiteAlpha.400"
              color="gray.700"
              borderRadius="lg"
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>

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
                    <Menu.Item value="works" asChild>
                      <NextLink href="/works">{t.works}</NextLink>
                    </Menu.Item>
                    <Menu.Item value="timeline" asChild>
                      <NextLink href="/timeline">{t.timeline}</NextLink>
                    </Menu.Item>
                    <Menu.Item value="blog" asChild>
                      <NextLink href="/blog">{t.posts}</NextLink>
                    </Menu.Item>
                    <Menu.Item value="source" asChild>
                      <Link
                        href="https://github.com/elbatlles/freak.wtf"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t.source}
                      </Link>
                    </Menu.Item>

                    <Box px={3} py={2}>
                      <NativeSelect.Root size="sm">
                        <NativeSelect.Field
                          onChange={changeLanguage}
                          defaultValue={locale}
                        >
                          <option value="en">EN</option>
                          <option value="es">ES</option>
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                      </NativeSelect.Root>
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
