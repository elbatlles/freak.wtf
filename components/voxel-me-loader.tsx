import { forwardRef } from 'react'
import { Box, Spinner } from '@chakra-ui/react'

export const MeSpinner = () => (
  <Spinner
    size="xl"
    position="absolute"
    left="50%"
    top="50%"
    ml="calc(0px - var(--spinner-size) / 2)"
    mt="calc(0px - var(--spinner-size))"
  />
)

type ButtonProps = React.HTMLProps<HTMLDivElement>

export const MeContainer = forwardRef<HTMLDivElement, ButtonProps>(
  (props, ref) => (
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
      {props.children}
    </Box>
  )
)

const Loader = () => {
  return (
    <MeContainer>
      <MeSpinner />
    </MeContainer>
  )
}

export default Loader
