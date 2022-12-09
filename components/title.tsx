import { Heading, Box } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { Link } from './link'

type Props = {
  children: string
  linkback: string
  title: JSX.Element | JSX.Element[] | string
}
export const Title = ({ children, linkback, title }: Props) => (
  <Box>
    <Link href={linkback}>{title}</Link>
    <span>
      <ChevronRightIcon />
    </span>
    <Heading display="inline-block" as="h3" fontSize={20} mb={4}>
      {children}
    </Heading>
  </Box>
)
