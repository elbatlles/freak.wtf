import type { GetStaticProps } from 'next'
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
import { getI18nProps } from '../lib/i18n'

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

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const { messages } = await getI18nProps(locale)
  return { props: { messages } }
}

export default NotFound
