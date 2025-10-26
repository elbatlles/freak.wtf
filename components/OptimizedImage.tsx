import NextImage from 'next/image'
import { Box } from '@chakra-ui/react'
import { useState } from 'react'

// Función para generar blur placeholder dinámico basado en el color principal
const generateBlurDataURL = (color = '#f1f1f1') => {
  const svg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
    </svg>
  `
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
  style?: React.CSSProperties
  blurColor?: string
  fill?: boolean
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  style,
  blurColor,
  fill = false
}) => {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <Box
      position="relative"
      overflow="hidden"
      className={className}
      style={style}
    >
      <NextImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        priority={priority}
        quality={90}
        placeholder="blur"
        blurDataURL={generateBlurDataURL(blurColor)}
        onLoad={() => setIsLoading(false)}
        style={{
          filter: isLoading ? 'blur(2px)' : 'none',
          transition: 'filter 0.2s ease-out',
          objectFit: 'cover'
        }}
      />
    </Box>
  )
}

export default OptimizedImage