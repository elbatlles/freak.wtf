import NextLink from 'next/link'
import Image from 'next/image'
import {
  Box,
  Text,
  LinkBox,
  LinkOverlay,
  useColorModeValue
} from '@chakra-ui/react'
import { Global } from '@emotion/react'

export const GridItem = ({ children, href, title, thumbnail }) => (
  <Box w="100%" textAlign="center">
    <LinkBox cursor="pointer">
      <Image
        src={thumbnail}
        alt={title}
        className="grid-item-thumbnail"
        placeholder="blur"
        loading="lazy"
      />
      <LinkOverlay href={href} target="_blank">
        <Text mt={2}>{title}</Text>
      </LinkOverlay>
      <Text fontSize={14}>{children}</Text>
    </LinkBox>
  </Box>
)

export const WorkGridItem = ({ children, id, title, thumbnail }) => {
  const glassBg = useColorModeValue(
    'rgba(255, 255, 255, 0.25)',
    'rgba(255, 255, 255, 0.1)'
  )
  const glassBorder = useColorModeValue(
    'rgba(255, 255, 255, 0.2)',
    'rgba(255, 255, 255, 0.1)'
  )

  return (
    <Box
      w="100%"
      textAlign="center"
      bg={glassBg}
      backdropFilter="blur(20px)"
      border="1px solid"
      borderColor={glassBorder}
      borderRadius="xl"
      p={6}
      boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.5)'
      }}
      transition="all 0.3s ease"
    >
      <NextLink href={`/works/${id}`}>
        <LinkBox cursor="pointer">
          <Image
            placeholder="blur"
            src={thumbnail}
            className="grid-item-thumbnail"
            alt={`/${id}`}
          />
          <Text mt={4} fontSize={20} fontWeight="bold" color="gray.200">
            {title}
          </Text>
          <Text fontSize={14} color="gray.300" mt={2}>
            {children}
          </Text>
        </LinkBox>
      </NextLink>
    </Box>
  )
}

export const GridItemStyle = () => (
  <Global
    styles={`
      .grid-item-thumbnail {
        border-radius: 12px;
      }
    `}
  />
)
