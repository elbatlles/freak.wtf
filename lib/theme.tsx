import { createSystem, defaultConfig } from '@chakra-ui/react'

/**
 * phosphor — primary accent scale.
 * Source of truth: the pixel logo's dominant green (#60e080, rgb(96,224,128)).
 * Terminal phosphor heritage, anchored to the brand asset.
 * Base surface: near-black with a green cast (#0a0e0b).
 */
export const system = createSystem(defaultConfig, {
  globalCss: {
    body: {
      bg: '#0a0e0b',
      color: 'gray.100'
    },
    '::selection': {
      background: '#60e080',
      color: '#0a0e0b'
    },
    html: {
      scrollbarColor: '#144726 transparent',
      scrollbarWidth: 'thin'
    },
    '*::-webkit-scrollbar': {
      width: '8px',
      height: '8px'
    },
    '*::-webkit-scrollbar-track': {
      background: 'transparent'
    },
    '*::-webkit-scrollbar-thumb': {
      background: '#144726',
      borderRadius: 'full'
    },
    '*::-webkit-scrollbar-thumb:hover': {
      background: '#238541'
    }
  },
  theme: {
    tokens: {
      fonts: {
        heading: { value: 'var(--font-display), sans-serif' },
        body: { value: 'var(--font-body), sans-serif' },
        mono: { value: 'var(--font-mono), monospace' }
      },
      colors: {
        phosphor: {
          50: { value: '#eafdf0' },
          100: { value: '#d3f9dd' },
          200: { value: '#a9f2c0' },
          300: { value: '#7deda4' },
          400: { value: '#60e080' },
          500: { value: '#46c866' },
          600: { value: '#2fa852' },
          700: { value: '#238541' },
          800: { value: '#1c6a36' },
          900: { value: '#144726' },
          950: { value: '#0a2b16' }
        },
        grassTeal: { value: '#88ccca' }
      }
    },
    semanticTokens: {
      colors: {
        'link-color': {
          value: '{colors.phosphor.300}'
        },
        'text-muted': {
          value: '{colors.gray.300}'
        },
        'glass-bg': {
          value: 'rgba(255, 255, 255, 0.045)'
        },
        'glass-border': {
          value: 'rgba(255, 255, 255, 0.1)'
        },
        'glass-image-bg': {
          value: 'rgba(0, 0, 0, 0.2)'
        },
        'code-block-bg': {
          value: '#0f140f'
        },
        'code-inline-bg': {
          value: '#18231a'
        },
        'quote-bg': {
          value: '{colors.phosphor.950}'
        }
      }
    }
  }
})

export default system
