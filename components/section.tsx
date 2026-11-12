import { Box } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const ChakraBox = motion.create(Box)
type Props = {
  delay?: number
  mb?: number
  children: React.ReactNode
}

const Section: React.FC<Props> = ({ children, delay = 0, mb = 6 }) => (
  <ChakraBox
    initial={{ y: 10 }}
    animate={{ y: 0 }}
    transition={{ duration: 0.8, delay }}
    mb={mb}
  >
    {children}
  </ChakraBox>
)

export default Section
