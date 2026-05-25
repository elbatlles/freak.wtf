import { Box } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const ChakraBox = motion.create(Box)
type Props = {
  delay?: number
  children: React.ReactNode
}

const Section: React.FC<Props> = ({ children, delay = 0 }) => (
  <ChakraBox
    initial={{ y: 10 }}
    animate={{ y: 0 }}
    transition={{ duration: 0.8, delay }}
    mb={6}
  >
    {children}
  </ChakraBox>
)

export default Section
