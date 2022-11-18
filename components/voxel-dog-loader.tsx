import { forwardRef, LegacyRef } from 'react'
import { Box, Spinner } from '@chakra-ui/react'

export const DogSpinner = () => (
  <Spinner
    size="xl"
    position="absolute"
    left="50%"
    top="50%"
    ml="calc(0px - var(--spinner-size) / 2)"
    mt="calc(0px - var(--spinner-size))"
  />
)
type DogProps = {
  ref: LegacyRef<HTMLDivElement>
  children: React.ReactNode
}
// https://stackoverflow.com/questions/54654303/using-a-forwardref-component-with-children-in-typescript
export const DogContainer = forwardRef(
  ({ children }, ref: LegacyRef<HTMLDivElement>) => (
    <Box
      ref={ref}
      className="voxel-angel"
      m="auto"
      mt={['-20px', '-60px', '-120px']}
      mb={['-40px', '-140px', '-200px']}
      w={[280, 480, 640]}
      h={[280, 480, 640]}
      position="relative"
    >
      {children}
    </Box>
  )
)

const Loader = () => {
  return (
    <DogContainer>
      <DogSpinner />
    </DogContainer>
  )
}

export default Loader
