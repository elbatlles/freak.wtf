import { AnimatePresence, motion } from 'framer-motion'
import { IconButton } from '@chakra-ui/react'
import { LuSun, LuMoon } from 'react-icons/lu'
import { useColorMode, useColorModeValue } from '../lib/color-mode'

const ThemeToggleButton = () => {
  const { toggleColorMode } = useColorMode()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        style={{ display: 'inline-block' }}
        key={useColorModeValue('light', 'dark')}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <IconButton
          aria-label="Toggle theme"
          colorPalette={useColorModeValue('purple', 'orange')}
          onClick={toggleColorMode}
        >
          {useColorModeValue(<LuMoon />, <LuSun />)}
        </IconButton>
      </motion.div>
    </AnimatePresence>
  )
}

export default ThemeToggleButton
