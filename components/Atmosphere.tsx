import { Box } from '@chakra-ui/react'

/**
 * Fixed, non-interactive atmosphere layer: film grain + vignette.
 * Pure CSS — zero JS per frame.
 */
const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

export const Atmosphere = () => (
  <>
    <Box
      aria-hidden
      pointerEvents="none"
      position="fixed"
      inset={0}
      zIndex={2147483000}
      opacity={0.05}
      mixBlendMode="overlay"
      backgroundImage={GRAIN_SVG}
      backgroundRepeat="repeat"
      backgroundSize="180px 180px"
    />
    <Box
      aria-hidden
      pointerEvents="none"
      position="fixed"
      inset={0}
      zIndex={0}
      background="radial-gradient(ellipse 120% 90% at 50% 0%, rgba(96, 224, 128, 0.04), transparent 55%), radial-gradient(ellipse 140% 100% at 50% 115%, rgba(0, 0, 0, 0.5), transparent 60%)"
    />
  </>
)

export default Atmosphere
