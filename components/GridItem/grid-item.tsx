import { Box, LinkBox, LinkOverlay, Text } from '@chakra-ui/react'
import { Global } from '@emotion/react'
import Image from 'next/image'
import NextLink from 'next/link'

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
  return (
    <Box
      w="100%"
      textAlign="center"
      bg="glass-bg"
      backdropFilter="blur(20px)"
      border="1px solid"
      borderColor="glass-border"
      borderRadius="xl"
      p={6}
      boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.5)'
      }}
      transition="transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
      style={{ willChange: 'transform' }}
    >
      <NextLink href={`/projects/${id}`}>
        <LinkBox cursor="pointer">
          <Box
            position="relative"
            width="100%"
            height={{ base: '180px', md: '200px' }}
            borderRadius="12px"
            overflow="hidden"
            mb={4}
            bg="glass-image-bg"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Image
              placeholder="blur"
              src={thumbnail}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{
                objectFit: 'contain'
              }}
            />
          </Box>
          <Text mt={2} fontSize={20} fontWeight="bold" color="gray.200">
            {title}
          </Text>
          <Text fontSize={14} color="text-muted" mt={2}>
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
        width: 100%;
        height: 100%;
        object-fit: contain;
        padding: 10px;
      }
    `}
  />
)
