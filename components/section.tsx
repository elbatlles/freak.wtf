import { chakra, shouldForwardProp } from '@chakra-ui/react'
import { motion, isValidMotionProp } from 'framer-motion'

const ChakraBox = chakra(motion.div, {
  shouldForwardProp: prop => isValidMotionProp(prop) || shouldForwardProp(prop)
})
type Props = {
  delay?: number
  children: React.ReactNode
}

const Section: React.FC<Props> = ({ children, delay = 0 }) => (
  <ChakraBox
    initial={{ y: 10, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    // @ts-ignore no problem in operation, although type error appears.
    transition={{ duration: 0.8, delay }}
    mb={6}
  >
    {children}
  </ChakraBox>
)

export default Section
