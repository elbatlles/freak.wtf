import { Box, Flex, Link } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useTranslations } from 'next-intl'

const Footer = () => {
  const t = useTranslations('footer')
  return (
    <Box textAlign="center" opacity={0.4} fontSize="sm" pt={2} pb={4}>
      <Flex justify="center" gap={4} mb={2}>
        <NextLink href="/timeline" passHref legacyBehavior>
          <Link _hover={{ opacity: 1 }} transition="opacity 0.2s">
            {t('timeline')}
          </Link>
        </NextLink>
      </Flex>
      &copy; {new Date().getFullYear()} Angel Batlles. {t('rights')}
    </Box>
  )
}

export default Footer
