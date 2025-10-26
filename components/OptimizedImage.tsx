import NextImage from 'next/image'
import { Box } from '@chakra-ui/react'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
  style?: React.CSSProperties
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  style
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
        priority={priority}
        quality={85}
        loading={priority ? 'eager' : 'lazy'}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        onLoad={() => setIsLoading(false)}
        style={{
          filter: isLoading ? 'blur(5px)' : 'none',
          transition: 'filter 0.3s ease',
          objectFit: 'cover'
        }}
      />
    </Box>
  )
}

export default OptimizedImage