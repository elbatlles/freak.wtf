import type { BoxProps } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'

interface GlassCardProps extends BoxProps {
  children: React.ReactNode
}

export const GlassCard = ({ children, ...props }: GlassCardProps) => {
  const glassBg = 'rgba(255, 255, 255, 0.25)'
  const glassBorder = 'rgba(255, 255, 255, 0.3)'

  return (
    <Box
      bg={glassBg}
      backdropFilter="blur(20px)"
      border="1px solid"
      borderColor={glassBorder}
      borderRadius="xl"
      boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.5)'
      }}
      style={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
      {...props}
    >
      {children}
    </Box>
  )
}
