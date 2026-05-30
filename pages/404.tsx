import {
  Box,
  Button,
  Container,
  Heading,
  Separator,
  Text
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useTranslations } from 'next-intl'

const NotFound = () => {
  const t = useTranslations('notFound')
  return (
    <Container>
      <Heading as="h1">{t('heading')}</Heading>
      <Text>{t('description')}</Text>
      <Separator my={6} />

      <Box my={6} textAlign="center">
        <NextLink href="/">
          <Button colorPalette="teal">{t('back')}</Button>
        </NextLink>
      </Box>
    </Container>
  )
}

export default NotFound
