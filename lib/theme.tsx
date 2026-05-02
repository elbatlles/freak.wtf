import { createSystem, defaultConfig } from '@chakra-ui/react'
import { M_PLUS_Rounded_1c } from 'next/font/google'

const font = M_PLUS_Rounded_1c({
  weight: ['300', '700'],
  display: 'swap',
  style: 'normal',
  subsets: ['latin']
})

export const system = createSystem(defaultConfig, {
  globalCss: {
    body: {
      bg: { base: '#f0e7db', _dark: '#202023' }
    }
  },
  theme: {
    tokens: {
      fonts: {
        heading: { value: font.style.fontFamily }
      },
      colors: {
        grassTeal: { value: '#88ccca' }
      }
    },
    semanticTokens: {
      colors: {
        'link-color': {
          value: { base: '#3d7aed', _dark: '#ff63c3' }
        }
      }
    }
  }
})

export default system
