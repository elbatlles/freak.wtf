import type { BoxProps } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'

interface GlassCardProps extends BoxProps {
  children: React.ReactNode
}

export const GlassCard = ({ children, ...props }: GlassCardProps) => {
  return (
    <Box
      position="relative"
      bg="glass-bg"
      backdropFilter="blur(20px)"
      border="1px solid"
      borderColor="glass-border"
      borderRadius="xl"
      boxShadow="inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 16px 40px rgba(0, 0, 0, 0.4)"
      _hover={{
        transform: 'translateY(-4px)',
        borderColor: 'rgba(96, 224, 128, 0.35)',
        boxShadow:
          'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 0 0 1px rgba(96, 224, 128, 0.12), 0 20px 48px rgba(0, 0, 0, 0.5)'
      }}
      style={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease' }}
      {...props}
    >
      {children}
    </Box>
  )
}
