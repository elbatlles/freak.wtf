import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import VoxelDogLoader from './voxel-me-loader'

const VoxelDog = dynamic(() => import('./VoxelMe/voxel-me'), {
  ssr: false,
  loading: () => <VoxelDogLoader />
})

const LazyVoxelDogWithIntersection = () => {
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
      {isVisible ? <VoxelDog /> : <VoxelDogLoader />}
    </div>
  )
}

export default LazyVoxelDogWithIntersection