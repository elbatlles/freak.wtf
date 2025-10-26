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
  MenuItem,
  MenuList,
  MenuButton,
  IconButton,
  useColorModeValue,
  Select
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'

import { IoLogoGithub } from 'react-icons/io5'
import * as en from '../locales/en'
import * as es from '../locales/es'

const LinkItem = ({ href, path, children, ...props }) => {
  const active = path === href
  const inactiveColor = useColorModeValue('gray.600', 'gray.300')
  const activeColor = useColorModeValue('white', 'gray.900')
  const activeBg = useColorModeValue(
    'rgba(139, 92, 246, 0.8)', // purple.500 with transparency
    'rgba(168, 85, 247, 0.8)' // purple.400 with transparency
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

  // Enhanced glassmorphism for navbar
  const navBg = useColorModeValue(
    'rgba(255, 255, 255, 0.8)',
    'rgba(20, 20, 20, 0.8)'
  )
  const navBorder = useColorModeValue(
    'rgba(255, 255, 255, 0.3)',
    'rgba(255, 255, 255, 0.1)'
  )

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
          spacing={4}
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
            _target="_blank"
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
          <Select
            display={{ base: 'none', md: 'inline-block' }}
            w="75px"
            placeholder={t.select}
            onChange={changeLanguage}
            defaultValue={locale}
            bg={useColorModeValue('whiteAlpha.800', 'blackAlpha.800')}
            backdropFilter="blur(10px)"
            border="1px solid"
            borderColor={useColorModeValue('whiteAlpha.400', 'whiteAlpha.200')}
            color={useColorModeValue('gray.700', 'gray.200')}
            borderRadius="lg"
            size="sm"
            _focus={{
              borderColor: useColorModeValue('purple.400', 'purple.300'),
              boxShadow: '0 0 0 1px rgba(139, 92, 246, 0.6)'
            }}
          >
            <option
              style={{
                backgroundColor: useColorModeValue('#f7fafc', '#1a202c'),
                color: useColorModeValue('#2d3748', '#e2e8f0')
              }}
              value="en"
            >
              EN
            </option>
            <option
              style={{
                backgroundColor: useColorModeValue('#f7fafc', '#1a202c'),
                color: useColorModeValue('#2d3748', '#e2e8f0')
              }}
              value="es"
            >
              ES
            </option>
          </Select>

          <Box display={{ base: 'inline-block', md: 'none' }}>
            <Menu isLazy id="navbar-menu">
              <MenuButton
                as={IconButton}
                icon={<HamburgerIcon />}
                variant="outline"
                aria-label="Options"
                bg={useColorModeValue('whiteAlpha.800', 'blackAlpha.800')}
                backdropFilter="blur(10px)"
                border="1px solid"
                borderColor={useColorModeValue(
                  'whiteAlpha.400',
                  'whiteAlpha.200'
                )}
                _hover={{
                  bg: useColorModeValue('whiteAlpha.900', 'blackAlpha.900')
                }}
              />
              <MenuList
                bg={useColorModeValue('whiteAlpha.900', 'blackAlpha.900')}
                backdropFilter="blur(20px)"
                border="1px solid"
                borderColor={useColorModeValue(
                  'whiteAlpha.400',
                  'whiteAlpha.200'
                )}
              >
                <NextLink href="/works" passHref>
                  <MenuItem as={Link}> {t.works}</MenuItem>
                </NextLink>
                <NextLink href="/timeline" passHref>
                  <MenuItem as={Link}> {t.timeline}</MenuItem>
                </NextLink>
                <NextLink href="/blog" passHref>
                  <MenuItem as={Link}> {t.posts}</MenuItem>
                </NextLink>
                <MenuItem
                  as={Link}
                  href="https://github.com/elbatlles/freak.wtf"
                >
                  {t.source}
                </MenuItem>

                <Box px={3} py={2}>
                  <Select
                    placeholder={t.select}
                    onChange={changeLanguage}
                    defaultValue={locale}
                    size="sm"
                    bg={useColorModeValue('white', 'gray.700')}
                    color={useColorModeValue('gray.700', 'gray.200')}
                  >
                    <option value="en">EN</option>
                    <option value="es">ES</option>
                  </Select>
                </Box>
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      </Container>
    </Box>
  )
}

export default Navbar
