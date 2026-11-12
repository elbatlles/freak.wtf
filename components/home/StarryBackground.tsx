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
    const PALE = 'rgba(226, 240, 210, '
    const ACID = 'rgba(96, 224, 128, '
    const TEAL = 'rgba(136, 204, 202, '
    const stars = Array.from({ length: 80 }, () => {
      const size = Math.random() * 2.5 + 0.5
      const roll = Math.random()
      return {
        x: Math.random(),
        y: Math.random(),
        size,
        // depth drives parallax: bigger stars move more
        depth: size / 3,
        speed: Math.random() * 0.6 + 0.3,
        phase: Math.random() * Math.PI * 2,
        color: roll > 0.55 ? PALE : roll > 0.25 ? ACID : TEAL
      }
    })

    // Mouse parallax — lerped target, no re-render
    let targetX = 0
    let targetY = 0
    let curX = 0
    let curY = 0
    const onPointerMove = (e: PointerEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2
      targetY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    let raf: number
    let start: number | null = null
    let visible = true

    const draw = (ts: number) => {
      if (!start) start = ts
      const t = (ts - start) * 0.001

      curX += (targetX - curX) * 0.04
      curY += (targetY - curY) * 0.04

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const s of stars) {
        const alpha =
          0.25 + 0.55 * (0.5 + 0.5 * Math.sin(s.speed * t + s.phase))
        const px = s.x * canvas.width + curX * s.depth * 14
        const py = s.y * canvas.height + curY * s.depth * 10
        ctx.beginPath()
        ctx.arc(px, py, s.size, 0, Math.PI * 2)
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
      window.removeEventListener('pointermove', onPointerMove)
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
