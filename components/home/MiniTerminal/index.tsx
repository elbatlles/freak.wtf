import { Box, Input, Text } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import { PROMPT } from './constants'
import { useCommandHistory, useTypewriter } from './hooks'
import { TerminalMessage } from './TerminalMessage'
import type { Message, MiniTerminalProps } from './types'

export default function MiniTerminal({
  h = { base: '360px', md: '300px' },
  locale = 'en'
}: MiniTerminalProps) {
  const t = useTranslations('terminal')

  const buildWelcome = useCallback(
    (): Message[] =>
      (t.raw('welcome') as string[]).map(line => ({
        id: crypto.randomUUID(),
        role: 'system' as const,
        content: line
      })),
    [t]
  )

  const [messages, setMessages] = useState<Message[]>(buildWelcome)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatHistoryRef = useRef<
    { role: 'user' | 'assistant'; content: string }[]
  >([])

  const typedPlaceholder = useTypewriter(t.raw('examples') as string[])
  const { push: pushHistory, navigate: navigateHistory } = useCommandHistory()

  useEffect(() => {
    setMessages(buildWelcome())
    chatHistoryRef.current = []
  }, [buildWelcome])
  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [])
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true })
  }, [])

  const append = useCallback((msg: Omit<Message, 'id'>) => {
    const full = { ...msg, id: crypto.randomUUID() }
    setMessages(prev => [...prev, full])
    return full.id
  }, [])

  const updateMessage = useCallback(
    (id: string, patch: Partial<Message>) =>
      setMessages(prev =>
        prev.map(m => (m.id === id ? { ...m, ...patch } : m))
      ),
    []
  )

  const sendMessage = useCallback(
    async (text: string) => {
      const content = text.trim()
      if (!content || busy) return

      if (content.toLowerCase() === 'clear') {
        setMessages(buildWelcome())
        chatHistoryRef.current = []
        return
      }

      append({ role: 'user', content })
      pushHistory(content)

      const turnHistory = [
        ...chatHistoryRef.current,
        { role: 'user' as const, content }
      ]
      const assistantId = append({
        role: 'assistant',
        content: '',
        streaming: true
      })
      setBusy(true)
      let fullResponse = ''

      try {
        const res = await fetch('/api/terminal/invoke', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: turnHistory, locale })
        })

        if (!res.ok || !res.body) {
          updateMessage(assistantId, {
            content: t('errorConnect'),
            streaming: false
          })
          return
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          fullResponse += decoder.decode(value, { stream: true })
          updateMessage(assistantId, { content: fullResponse, streaming: true })
        }
        fullResponse += decoder.decode()
        updateMessage(assistantId, { content: fullResponse, streaming: false })
        chatHistoryRef.current = [
          ...chatHistoryRef.current,
          { role: 'user' as const, content },
          { role: 'assistant' as const, content: fullResponse }
        ].slice(-20)
      } catch {
        updateMessage(assistantId, {
          content: t('errorDisconnect'),
          streaming: false
        })
      } finally {
        setBusy(false)
        inputRef.current?.focus()
      }
    },
    [busy, buildWelcome, locale, pushHistory, t, updateMessage, append]
  )

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      navigateHistory('up', setInput)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      navigateHistory('down', setInput)
    }
  }

  return (
    <Box
      w="100%"
      maxW="100%"
      bg="rgba(10, 10, 20, 0.95)"
      border="1px solid"
      borderColor="rgba(168, 85, 247, 0.3)"
      borderRadius="xl"
      overflow="hidden"
      boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
      cursor="text"
      onClick={() => inputRef.current?.focus()}
      h={h}
      minH={{ base: '220px', md: '260px' }}
      display="flex"
      flexDirection="column"
      fontFamily="'Courier New', Courier, monospace"
      fontSize={{ base: '11px', md: 'xs' }}
    >
      {/* Title bar */}
      <Box
        bg="rgba(168, 85, 247, 0.15)"
        borderBottom="1px solid rgba(168, 85, 247, 0.2)"
        px={4}
        py={2}
        display="flex"
        alignItems="center"
        gap={2}
        flexShrink={0}
      >
        <Box w={3} h={3} borderRadius="full" bg="red.400" />
        <Box w={3} h={3} borderRadius="full" bg="yellow.400" />
        <Box w={3} h={3} borderRadius="full" bg="green.400" />
        <Text
          ml={2}
          fontSize="xs"
          color="purple.300"
          fontFamily="mono"
          letterSpacing="wider"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          {t('banner')}
        </Text>
      </Box>

      {/* Message list */}
      <Box
        ref={scrollRef}
        flex={1}
        overflowY="auto"
        overflowX="hidden"
        px={4}
        py={3}
        display="flex"
        flexDirection="column"
        gap={0}
        css={{
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(168,85,247,0.3)',
            borderRadius: '2px'
          }
        }}
      >
        {messages.map(msg => (
          <TerminalMessage key={msg.id} msg={msg} />
        ))}
      </Box>

      {/* Input row */}
      <Box
        px={4}
        py={2}
        borderTop="1px solid rgba(168, 85, 247, 0.15)"
        display="flex"
        alignItems="center"
        gap={2}
        flexShrink={0}
      >
        <Text
          color={busy ? 'gray.600' : 'purple.300'}
          fontFamily="mono"
          fontSize="xs"
          flexShrink={0}
          whiteSpace="nowrap"
          userSelect="none"
        >
          {PROMPT}
        </Text>
        <Input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          variant="flushed"
          border="none"
          outline="none"
          _focusVisible={{ outline: 'none', boxShadow: 'none' }}
          fontFamily="mono"
          fontSize="xs"
          color="purple.200"
          bg="transparent"
          placeholder={busy ? t('thinking') : input ? '' : typedPlaceholder}
          _placeholder={{ color: 'gray.600' }}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          flex={1}
          p={0}
          h="auto"
          readOnly={busy}
        />
        <Box
          as="button"
          display={{ base: 'flex', md: 'none' }}
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
          w={7}
          h={7}
          borderRadius="md"
          border="1px solid rgba(168, 85, 247, 0.35)"
          bg="rgba(168, 85, 247, 0.1)"
          color="purple.300"
          fontSize="xs"
          fontFamily="mono"
          opacity={busy ? 0.4 : 1}
          _active={{ bg: 'rgba(168, 85, 247, 0.25)' }}
          onClick={() => {
            if (busy) return
            sendMessage(input)
            setInput('')
          }}
        >
          ↵
        </Box>
      </Box>
    </Box>
  )
}
