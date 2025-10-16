import { forwardRef } from 'react'
import { Box, Spinner } from '@chakra-ui/react'

export const MeSpinnerHomepage = () => (
  <Spinner
    size="lg"
    position="absolute"
    left="50%"
    top="50%"
    transform="translate(-50%, -50%)"
    color="purple.400"
  />
)

type ButtonProps = React.HTMLProps<HTMLDivElement>

export const MeContainerHomepage = forwardRef<HTMLDivElement, ButtonProps>(
  (props, ref) => (
    <Box
      ref={ref}
      className="voxel-angel-homepage"
      w="100%"
      h="100%"
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {props.children}
    </Box>
  )
)
