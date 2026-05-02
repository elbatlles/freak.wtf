import NextLink from 'next/link'
import {
  Box,
  Heading,
  Text,
  Container,
  Separator,
  Button
} from '@chakra-ui/react'

const NotFound = () => {
  return (
    <Container>
      <Heading as="h1">Not found</Heading>
      <Text>The page you&apos;re looking for was not found.</Text>
      <Separator my={6} />

      <Box my={6} textAlign="center">
        <NextLink href="/">
          <Button colorPalette="teal">Return to home</Button>
        </NextLink>
      </Box>
    </Container>
  )
}

export default NotFound
