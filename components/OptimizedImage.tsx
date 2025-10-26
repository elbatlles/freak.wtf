import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react'
import Image from 'next/image'
import { useState, useMemo } from 'react'

interface OptimizedImageProps extends Omit<BoxProps, 'as' | 'fill'> {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  quality?: number
  sizes?: string
  fill?: boolean
}

const generateBlurSvg = (width: number, height: number, colors?: { from: string; to: string }): string => {
  // Colores adaptativos basados en el tema o personalizables
  const defaultColors = {
    from: '#f7fafc',
    to: '#e2e8f0'
  }
  
  const gradientColors = colors || defaultColors
  
  // SVG optimizado con patrones más naturales
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="blur-gradient" cx="50%" cy="50%" r="70%">
          <stop offset="0%" style="stop-color:${gradientColors.from};stop-opacity:0.9" />
          <stop offset="50%" style="stop-color:${gradientColors.to};stop-opacity:0.6" />
          <stop offset="100%" style="stop-color:${gradientColors.from};stop-opacity:0.3" />
        </radialGradient>
        <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3"/>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#blur-gradient)" filter="url(#blur)" />
    </svg>
  `.replace(/\s+/g, ' ').trim()
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width = 400,
  height = 300,
  priority = false,
  quality = 85,
  sizes,
  fill = false,
  ...boxProps
}) => {
  const [isLoading, setIsLoading] = useState(true)

  // Colores adaptativos según el tema
  const lightColors = { from: '#f7fafc', to: '#e2e8f0' }
  const darkColors = { from: '#2d3748', to: '#1a202c' }
  const blurColors = useColorModeValue(lightColors, darkColors)

  const blurDataURL = useMemo(
    () => generateBlurSvg(width, height, blurColors),
    [width, height, blurColors]
  )

  return (
    <Box
      position="relative"
      overflow="hidden"
      borderRadius="md"
      transition="all 0.3s ease"
      _hover={{ transform: 'scale(1.02)' }}
      {...boxProps}
    >
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={quality}
        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        placeholder="blur"
        blurDataURL={blurDataURL}
        style={{
          objectFit: 'cover',
          transition: 'opacity 0.3s ease',
          opacity: isLoading ? 0.7 : 1,
        }}
        onLoad={() => setIsLoading(false)}
      />
    </Box>
  )
}

export default OptimizedImage
