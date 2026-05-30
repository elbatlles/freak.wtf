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
      bg: '#202023',
      color: 'gray.100'
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
          value: '{colors.purple.300}'
        },
        'text-muted': {
          value: '{colors.gray.300}'
        },
        'glass-bg': {
          value: 'rgba(255, 255, 255, 0.07)'
        },
        'glass-border': {
          value: 'rgba(255, 255, 255, 0.12)'
        },
        'glass-image-bg': {
          value: 'rgba(0, 0, 0, 0.2)'
        },
        'code-block-bg': {
          value: '{colors.gray.800}'
        },
        'code-inline-bg': {
          value: '{colors.gray.700}'
        },
        'quote-bg': {
          value: '{colors.purple.900}'
        }
      }
    }
  }
})

export default system
