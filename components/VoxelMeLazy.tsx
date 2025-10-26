import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import VoxelMeLoader from './voxel-me-loader'

const VoxelMe = dynamic(() => import('./VoxelMe/voxel-me'), {
  ssr: false,
  loading: () => <VoxelMeLoader />
})

const VoxelMeLazy = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true)
          setHasLoaded(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [hasLoaded])

  return (
    <div ref={ref} style={{ minHeight: '200px' }}>
      {isVisible ? <VoxelMe /> : <VoxelMeLoader />}
    </div>
  )
}

export default VoxelMeLazy