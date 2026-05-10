import { Box, Flex, Link } from '@chakra-ui/react'
import NextLink from 'next/link'

const Footer = () => {
  return (
    <Box textAlign="center" opacity={0.4} fontSize="sm" pt={2} pb={4}>
      <Flex justify="center" gap={4} mb={2}>
        <NextLink href="/timeline" passHref legacyBehavior>
          <Link _hover={{ opacity: 1 }} transition="opacity 0.2s">
            Timeline
          </Link>
        </NextLink>
      </Flex>
      &copy; {new Date().getFullYear()} Angel Batlles. All Rights Reserved.
    </Box>
  )
}

export default Footer
