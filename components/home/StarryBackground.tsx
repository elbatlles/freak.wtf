import { useEffect, useRef } from 'react'

// Canvas-based starry background.
// Replaces 80 individually-animated DOM nodes (which caused 50+ non-composited
// animations and significant paint work) with a single canvas element.
// All drawing happens off the main thread via the compositor.
const StarryBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Pre-compute star data once (avoids Math.random() on every frame)
    const PURPLE = 'rgba(168, 85, 247, '
    const BLUE = 'rgba(96, 165, 250, '
    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 2.5 + 0.5,
      speed: Math.random() * 0.6 + 0.3,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.4 ? PURPLE : BLUE
    }))

    let raf: number
    let start: number | null = null
    let visible = true

    const draw = (ts: number) => {
      if (!start) start = ts
      const t = (ts - start) * 0.001

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const s of stars) {
        const alpha =
          0.25 + 0.55 * (0.5 + 0.5 * Math.sin(s.speed * t + s.phase))
        ctx.beginPath()
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.size, 0, Math.PI * 2)
        ctx.fillStyle = `${s.color}${alpha.toFixed(2)})`
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)

    // Pause rAF when canvas scrolls out of viewport to save GPU/CPU
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !visible) {
          visible = true
          start = null // reset time so stars don't jump
          raf = requestAnimationFrame(draw)
        } else if (!entry.isIntersecting && visible) {
          visible = false
          cancelAnimationFrame(raf)
        }
      },
      { threshold: 0 }
    )
    observer.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      observer.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none'
      }}
    />
  )
}

export default StarryBackground
