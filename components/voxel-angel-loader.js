import { forwardRef } from 'react'
import { Box, Spinner } from '@chakra-ui/react'

export const AngelSpinner = () => (
  <Spinner
    size="xl"
    position="absolute"
    left="50%"
    top="50%"
    ml="calc(0px - var(--spinner-size) / 2)"
    mt="calc(0px - var(--spinner-size))"
  />
)

export const DogContainer = forwardRef(({ children }, ref) => (
  <Box
    ref={ref}
    className="voxel-angel"
    m="auto"
    w={'full'}
    h={'full'}
    position="absolute"
  >
    {children}
  </Box>
))

const Loader = () => {
  return (
    <DogContainer>
      <AngelSpinner />
    </DogContainer>
  )
}

export default Loader
