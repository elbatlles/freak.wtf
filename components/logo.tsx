import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Box, Text } from '@chakra-ui/react'
import { useColorModeValue } from '../lib/color-mode'

const LogoBox = ({ children }: { children: React.ReactNode }) => (
  <Box
    as="span"
    fontWeight="bold"
    fontSize="18px"
    display="inline-flex"
    alignItems="center"
    py="8px"
    px="10px"
    css={{
      '@media (hover: hover)': {
        '&:hover img': { transform: 'rotate(20deg)' }
      }
    }}
  >
    {children}
  </Box>
)

const Logo = () => {
  const [rotated, setRotated] = useState(false)

  const handleClick = () => {
    setRotated(true)
    setTimeout(() => setRotated(false), 300)
  }

  return (
    <Link href="/" onClick={handleClick}>
      <LogoBox>
        <Image
          src="/logo.png"
          alt="logo"
          width={64}
          height={64}
          style={{
            width: '30px',
            height: '30px',
            marginRight: 10,
            display: 'block',
            imageRendering: 'pixelated',
            transition: 'transform 0.2s ease',
            transform: rotated ? 'rotate(20deg)' : 'rotate(0deg)'
          }}
        />
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
