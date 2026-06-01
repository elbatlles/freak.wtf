import { Box, HStack, Text, VStack } from '@chakra-ui/react'
import { PROMPT, RESPONSE } from './constants'
import { renderWithLinks } from './RichText'
import type { Message } from './types'

export function BlinkingCursor() {
  return (
        <Text
          as="span"
          display="inline-block"
          w="7px"
          h="13px"
          bg="purple.300"
          ml="1px"
          verticalAlign="text-bottom"
          style={{ animation: 'blink 0.8s step-end infinite' }}
        />
  )
}

export function TerminalMessage({ msg }: { msg: Message }) {
  if (msg.role === 'system') {
    return (
      <Text color="gray.400" whiteSpace="pre-wrap" lineHeight={1.6} py="1px">
        {msg.content}
      </Text>
    )
  }

  if (msg.role === 'user') {
    return (
      <VStack align="stretch" gap={0} mb={2}>
        <HStack gap={2} align="baseline">
          <Text
            color="purple.200"
            whiteSpace="nowrap"
            flexShrink={0}
            userSelect="none"
          >
            {PROMPT}
          </Text>
          <Text color="gray.50" whiteSpace="pre-wrap" wordBreak="break-word">
            {msg.content}
          </Text>
        </HStack>
      </VStack>
    )
  }

  return (
    <VStack align="stretch" gap={0} mb={3}>
      <HStack gap={2} align="baseline" mb={1}>
        <Text
          color="purple.300"
          whiteSpace="nowrap"
          flexShrink={0}
          userSelect="none"
        >
          {RESPONSE}
        </Text>
        {msg.streaming && msg.content === '' && <BlinkingCursor />}
      </HStack>
      <Box>
        <Text
          color="green.400"
          whiteSpace="pre-wrap"
          wordBreak="break-word"
          lineHeight={1.7}
        >
          {renderWithLinks(msg.content)}
          {msg.streaming && msg.content.length > 0 && <BlinkingCursor />}
        </Text>
      </Box>
    </VStack>
  )
}
