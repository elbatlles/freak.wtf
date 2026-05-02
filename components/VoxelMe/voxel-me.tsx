import { useState, useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { WebGLRenderer } from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { loadGLTFModel } from '../../lib/model'
import { MeSpinner, MeContainer } from '../voxel-me-loader'

function easeOutCirc(x) {
  return Math.sqrt(1 - Math.pow(x - 1, 4))
}

const VoxelMe = () => {
  const refContainer = useRef<HTMLDivElement | null>(null)
  const [loading, setLoading] = useState(true)
  const refRenderer = useRef<WebGLRenderer | null>(null)

  const handleWindowResize = useCallback(() => {
    const { current: renderer } = refRenderer
    const { current: container } = refContainer
    if (container && renderer) {
      const scW = container.clientWidth
      const scH = container.clientHeight

      renderer.setSize(scW, scH)
    }
  }, [])

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const { current: container } = refContainer
    if (container) {
      const scW = container.clientWidth
      const scH = container.clientHeight

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'low-power'
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(scW, scH)
      renderer.outputColorSpace = THREE.SRGBColorSpace
      container.appendChild(renderer.domElement)
      refRenderer.current = renderer
      const scene = new THREE.Scene()

      const target = new THREE.Vector3(-0.2, 1.2, 0)
      const initialCameraPosition = new THREE.Vector3(
        20 * Math.sin(0.2 * Math.PI),
        10,
        20 * Math.cos(0.2 * Math.PI)
      )

      // 640 -> 240
      // 8   -> 6
      const scale = scH * 0.002
      const camera = new THREE.OrthographicCamera(
        -scale,
        scale,
        scale / 2,
        -scale * 3,
        0.01,
        50000
      )
      camera.position.copy(initialCameraPosition)
      camera.lookAt(target)

      const ambientLight = new THREE.AmbientLight(0xcccccc, 1)
      scene.add(ambientLight)

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.autoRotate = true
      controls.target = target

      loadGLTFModel(scene, '/angel.glb', {
        receiveShadow: false,
        castShadow: false
      }).then(() => {
        animate()
        setLoading(false)
      })

      let req: number | null = null
      let frame = 0
      let visible = true

      const animate = () => {
        req = requestAnimationFrame(animate)

        if (!visible || document.hidden) return

        frame = frame <= 100 ? frame + 1 : frame

        if (frame <= 100) {
          const p = initialCameraPosition
          const rotSpeed = -easeOutCirc(frame / 120) * Math.PI * 20

          camera.position.y = 10
          camera.position.x =
            p.x * Math.cos(rotSpeed) + p.z * Math.sin(rotSpeed)
          camera.position.z =
            p.z * Math.cos(rotSpeed) - p.x * Math.sin(rotSpeed)
          camera.lookAt(target)
        } else {
          controls.update()
        }

        renderer.render(scene, camera)
      }

      const observer = new IntersectionObserver(
        entries => {
          visible = entries[0]?.isIntersecting ?? true
        },
        { threshold: 0 }
      )
      observer.observe(container)

      return () => {
        if (req !== null) cancelAnimationFrame(req)
        observer.disconnect()
        controls.dispose()
        renderer.domElement.remove()
        renderer.dispose()
      }
    }
  }, [])

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize, false)
    return () => {
      window.removeEventListener('resize', handleWindowResize, false)
    }
  }, [handleWindowResize])

  return (
    <MeContainer ref={refContainer}>{loading && <MeSpinner />}</MeContainer>
  )
}

export default VoxelMe
