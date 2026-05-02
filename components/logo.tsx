import Link from 'next/link'
import { Box, Text } from '@chakra-ui/react'
import { useColorModeValue } from '../lib/color-mode'

const LogoBox = ({ children }: { children: React.ReactNode }) => (
  <Box
    as="span"
    fontWeight="bold"
    fontSize="18px"
    display="inline-flex"
    alignItems="center"
    h="30px"
    lineHeight="20px"
    p="10px"
    css={{
      '&:hover img': { transform: 'rotate(20deg)' }
    }}
  >
    {children}
  </Box>
)

const Logo = () => {
  return (
    <Link href="/">
      <LogoBox>
        <Text as="span" fontSize="xl" role="img" aria-label="wizard" mr={2}>
          🧙‍♂️
        </Text>
        <Text
          color={useColorModeValue('gray.800', 'whiteAlpha.900')}
          fontFamily='M PLUS Rounded 1c", sans-serif'
          fontWeight="bold"
        >
          Angel Batlles
        </Text>
      </LogoBox>
    </Link>
  )
}

export default Logo
