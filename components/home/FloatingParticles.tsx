import { useEffect, useRef, useState } from 'react'
import { Box } from '@chakra-ui/react'

const FloatingParticles = () => {
  const mountRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!mountRef.current) return

    // Pequeño delay para asegurar que el DOM esté listo
    const initTimeout = setTimeout(() => {
      const container = mountRef.current
      if (!container) return

      // Crear canvas para las partículas
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = container.offsetWidth || window.innerWidth
      canvas.height = container.offsetHeight || window.innerHeight
      canvas.style.position = 'absolute'
      canvas.style.top = '0'
      canvas.style.left = '0'
      canvas.style.zIndex = '1'
      canvas.style.opacity = '0.7'
      canvas.style.pointerEvents = 'none'

      container.appendChild(canvas)
      setIsVisible(true)

      // Partículas
      const particles: Array<{
        x: number
        y: number
        vx: number
        vy: number
        size: number
        alpha: number
      }> = []

      // Crear partículas
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          alpha: Math.random() * 0.8 + 0.2
        })
      }

      // Función de animación
      const animate = () => {
        if (!ctx || !canvas) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        particles.forEach(particle => {
          // Actualizar posición
          particle.x += particle.vx
          particle.y += particle.vy

          // Rebote en bordes
          if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
          if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

          // Dibujar partícula
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(139, 92, 246, ${particle.alpha})`
          ctx.fill()
        })

        animationRef.current = requestAnimationFrame(animate)
      }

      animate()

      // Redimensionar canvas
      const handleResize = () => {
        if (!canvas || !container) return
        canvas.width = container.offsetWidth || window.innerWidth
        canvas.height = container.offsetHeight || window.innerHeight
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
        if (container && canvas && container.contains(canvas)) {
          container.removeChild(canvas)
        }
        setIsVisible(false)
      }
    }, 100)

    return () => {
      clearTimeout(initTimeout)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <Box
      ref={mountRef}
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="100%"
      zIndex={1}
      pointerEvents="none"
      opacity={isVisible ? 1 : 0}
      transition="opacity 0.5s ease-in-out"
    />
  )
}

export default FloatingParticles
