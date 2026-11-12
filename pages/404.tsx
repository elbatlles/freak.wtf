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
    <Container pt={20} pb={10}>
      <Text
        fontFamily="mono"
        fontSize="sm"
        color="phosphor.400"
        letterSpacing="0.1em"
        mb={2}
      >
        ERROR 404
      </Text>
      <Heading as="h1" fontFamily="heading" size="2xl" mb={2}>
        {t('heading')}
      </Heading>
      <Text color="text-muted" maxW="md">
        {t('description')}
      </Text>
      <Separator my={6} />

      <Box my={6} textAlign="center">
        <NextLink href="/">
          <Button
            borderRadius="md"
            bg="phosphor.400"
            color="#0a0e0b"
            fontWeight="semibold"
            _hover={{ bg: 'phosphor.300' }}
          >
            {t('back')}
          </Button>
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
