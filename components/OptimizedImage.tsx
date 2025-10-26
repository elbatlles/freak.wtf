import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react'
import Image from 'next/image'
import { useState } from 'react'

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

// Simplified blur SVG for better performance
const generateBlurSvg = (width: number, height: number, color: string = '#f1f5f9'): string => {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${color}"/></svg>`
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

  // Simplified adaptive color for performance
  const blurColor = useColorModeValue('#f1f5f9', '#374151')
  const blurDataURL = generateBlurSvg(width, height, blurColor)

  return (
    <Box
      position="relative"
      overflow="hidden"
      borderRadius="md"
      transition="transform 0.3s ease"
      _hover={{ transform: 'scale(1.02)' }}
      style={{ willChange: 'transform' }}
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
          willChange: 'opacity',
        }}
        onLoad={() => setIsLoading(false)}
      />
    </Box>
  )
}

export default OptimizedImage
