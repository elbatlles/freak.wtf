import { Box } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'

// Animaciones para las estrellas
const twinkle = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
`

const float = keyframes`
  0%, 100% { transform: translateY(0px) translateX(0px); }
  33% { transform: translateY(-10px) translateX(5px); }
  66% { transform: translateY(5px) translateX(-5px); }
`

const StarryBackground = () => {
  // Generar posiciones aleatorias para las estrellas
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 3,
    duration: Math.random() * 3 + 2
  }))

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="100%"
      zIndex={1}
      pointerEvents="none"
      overflow="hidden"
    >
      {stars.map(star => (
        <Box
          key={star.id}
          position="absolute"
          left={`${star.left}%`}
          top={`${star.top}%`}
          width={`${star.size}px`}
          height={`${star.size}px`}
          backgroundColor="purple.300"
          borderRadius="50%"
          boxShadow="0 0 6px rgba(139, 92, 246, 0.8)"
          animation={`${twinkle} ${star.duration}s ease-in-out ${star.delay}s infinite, ${float} ${star.duration * 2}s ease-in-out ${star.delay}s infinite`}
          opacity={0.7}
        />
      ))}

      {/* Estrellas adicionales más pequeñas */}
      {Array.from({ length: 30 }, (_, i) => {
        const smallStar = {
          id: i + 50,
          left: Math.random() * 100,
          top: Math.random() * 100,
          delay: Math.random() * 4,
          duration: Math.random() * 2 + 1
        }

        return (
          <Box
            key={smallStar.id}
            position="absolute"
            left={`${smallStar.left}%`}
            top={`${smallStar.top}%`}
            width="1px"
            height="1px"
            backgroundColor="blue.200"
            borderRadius="50%"
            boxShadow="0 0 4px rgba(96, 165, 250, 0.6)"
            animation={`${twinkle} ${smallStar.duration}s ease-in-out ${smallStar.delay}s infinite`}
            opacity={0.5}
          />
        )
      })}
    </Box>
  )
}

export default StarryBackground
