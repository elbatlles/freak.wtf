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
import { useColorModeValue } from '../lib/color-mode'

import { IoLogoGithub } from 'react-icons/io5'
import * as en from '../locales/en'
import * as es from '../locales/es'

const LinkItem = ({ href, path, children, ...props }) => {
  const active = path === href
  const inactiveColor = useColorModeValue('gray.600', 'gray.300')
  const activeColor = useColorModeValue('white', 'gray.900')
  const activeBg = useColorModeValue(
    'rgba(139, 92, 246, 0.8)',
    'rgba(168, 85, 247, 0.8)'
  )
  const hoverBg = useColorModeValue(
    'rgba(139, 92, 246, 0.2)',
    'rgba(168, 85, 247, 0.2)'
  )
  const hoverColor = useColorModeValue('gray.800', 'white')

  return (
    <NextLink legacyBehavior href={href} passHref>
      <Link
        px={3}
        py={2}
        borderRadius="lg"
        bg={active ? activeBg : undefined}
        color={active ? activeColor : inactiveColor}
        fontWeight={active ? 'bold' : 'medium'}
        backdropFilter={active ? 'blur(10px)' : undefined}
        _hover={{
          bg: active ? activeBg : hoverBg,
          color: active ? activeColor : hoverColor,
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

  const navBg = useColorModeValue(
    'rgba(255, 255, 255, 0.8)',
    'rgba(20, 20, 20, 0.8)'
  )
  const navBorder = useColorModeValue(
    'rgba(255, 255, 255, 0.3)',
    'rgba(255, 255, 255, 0.1)'
  )
  const selectBg = useColorModeValue('whiteAlpha.800', 'blackAlpha.800')
  const selectBorderColor = useColorModeValue('whiteAlpha.400', 'whiteAlpha.200')
  const selectColor = useColorModeValue('gray.700', 'gray.200')
  const btnBg = useColorModeValue('whiteAlpha.800', 'blackAlpha.800')
  const btnBorderColor = useColorModeValue('whiteAlpha.400', 'whiteAlpha.200')
  const btnHoverBg = useColorModeValue('whiteAlpha.900', 'blackAlpha.900')
  const menuBg = useColorModeValue('whiteAlpha.900', 'blackAlpha.900')
  const menuBorderColor = useColorModeValue('whiteAlpha.400', 'whiteAlpha.200')

  return (
    <Box
      position="fixed"
      as="nav"
      w="100%"
      bg={navBg}
      backdropFilter="blur(20px)"
      borderBottom="1px solid"
      borderBottomColor={navBorder}
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
              bg={selectBg}
              backdropFilter="blur(10px)"
              border="1px solid"
              borderColor={selectBorderColor}
              color={selectColor}
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
                  bg={btnBg}
                  backdropFilter="blur(10px)"
                  border="1px solid"
                  borderColor={btnBorderColor}
                  _hover={{ bg: btnHoverBg }}
                >
                  <LuMenu />
                </IconButton>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content
                    bg={menuBg}
                    backdropFilter="blur(20px)"
                    border="1px solid"
                    borderColor={menuBorderColor}
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
