import { createSystem, defaultConfig } from '@chakra-ui/react'
import { M_PLUS_Rounded_1c } from 'next/font/google'
import { inter } from './fonts'

const font = M_PLUS_Rounded_1c({
  weight: ['300', '700'],
  display: 'swap',
  style: 'normal',
  subsets: ['latin']
})

export const system = createSystem(defaultConfig, {
  globalCss: {
    body: {
      bg: '#f0e7db'
    }
  },
  theme: {
    tokens: {
      fonts: {
        heading: { value: font.style.fontFamily },
        body: { value: inter.style.fontFamily }
      },
      colors: {
        grassTeal: { value: '#88ccca' }
      }
    },
    semanticTokens: {
      colors: {
        'link-color': {
          value: '#3d7aed'
        },
        'glass-bg': {
          value: 'rgba(255, 255, 255, 0.25)'
        },
        'glass-border': {
          value: 'rgba(255, 255, 255, 0.3)'
        },
        'glass-image-bg': {
          value: 'rgba(255, 255, 255, 0.8)'
        }
      }
    }
  }
})

export default system
