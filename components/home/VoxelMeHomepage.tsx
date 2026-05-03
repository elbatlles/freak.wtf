import { useState, useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { WebGLRenderer } from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { loadGLTFModel } from '../../lib/model'
import {
  MeSpinnerHomepage,
  MeContainerHomepage
} from './voxel-me-loader-homepage'

const VoxelMeHomepage = () => {
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

      let renderer: THREE.WebGLRenderer
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: 'low-power'
        })
      } catch {
        setLoading(false)
        return
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(scW, scH)
      renderer.outputColorSpace = THREE.SRGBColorSpace
      container.appendChild(renderer.domElement)
      refRenderer.current = renderer
      const scene = new THREE.Scene()

      const target = new THREE.Vector3(0, -0.2, 0)
      const initialCameraPosition = new THREE.Vector3(0, -0.2, 3.0)

      const aspect = scW / scH
      const scaleH = scH * 0.001 + 0.9
      const scaleW = scaleH * aspect

      const camera = new THREE.OrthographicCamera(
        -scaleW,
        scaleW,
        scaleH,
        -scaleH,
        0.01,
        50000
      )
      camera.position.copy(initialCameraPosition)
      camera.lookAt(target)

      const ambientLight = new THREE.AmbientLight(0xcccccc, Math.PI)
      scene.add(ambientLight)

      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.autoRotate = true
      controls.autoRotateSpeed = 2
      controls.target = target
      controls.enableZoom = false
      controls.minPolarAngle = Math.PI / 2.5
      controls.maxPolarAngle = Math.PI / 1.5

      if (isTouchDevice) {
        controls.enabled = false
        renderer.domElement.style.pointerEvents = 'none'
      }

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
          camera.position.copy(initialCameraPosition)
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

      const onVisibility = () => {
        // resume rAF when tab becomes visible again (browser pauses rAF when hidden)
      }
      document.addEventListener('visibilitychange', onVisibility)

      return () => {
        if (req !== null) cancelAnimationFrame(req)
        observer.disconnect()
        document.removeEventListener('visibilitychange', onVisibility)
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
    <MeContainerHomepage ref={refContainer}>
      {loading && <MeSpinnerHomepage />}
    </MeContainerHomepage>
  )
}

export default VoxelMeHomepage
