import NextLink, { type LinkProps as NextLinkProps } from 'next/link'
import { chakra, MenuItem, useColorModeValue } from '@chakra-ui/react'

// wrap the NextLink with Chakra UI's factory function

const MagicLink = chakra<typeof NextLink, NextLinkProps>(NextLink, {
  // ensure that you're forwarding all of the required props for your case
  shouldForwardProp: prop => ['href', 'target', 'children'].includes(prop)
})
type Props = {
  href?: string
  children: JSX.Element | JSX.Element[] | string
}
export const Link: React.FC<Props> = ({ children, href }) => (
  <MagicLink color={useColorModeValue('#3d7aed', '#ff63c3')} href={href}>
    {children}
  </MagicLink>
)
const Menulink = chakra<typeof MenuItem, NextLinkProps>(MenuItem, {
  // ensure that you're forwarding all of the required props for your case
  shouldForwardProp: prop => ['as'].includes(prop)
})
