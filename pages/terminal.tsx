import { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Box, Text, Input, HStack, VStack } from '@chakra-ui/react'
import { inter } from '../lib/fonts'

interface Message {
  id: number
  role: 'user' | 'assistant' | 'system'
  content: string
  streaming?: boolean
}

const BANNER_EN = 'angel@freak.wtf — invoke mode'
const BANNER_ES = 'angel@freak.wtf — modo invoke'

const WELCOME_EN: string[] = [
  '  Invoke mode — direct chat with Angel\'s AI persona.',
  '  Ask anything about my work, projects, stack or opinions.',
  '',
  '  Commands: clear · exit (or Ctrl+D)',
  '',
]

const WELCOME_ES: string[] = [
  '  Modo invoke — chat directo con la IA de Angel.',
  '  Pregunta lo que quieras sobre mi trabajo, proyectos, stack u opiniones.',
  '',
  '  Comandos: clear · exit (o Ctrl+D)',
  '',
]

let msgId = 0
const nextId = () => ++msgId

export default function TerminalPage() {
  const router = useRouter()
  const locale = (router.locale === 'es' ? 'es' : 'en') as 'en' | 'es'

  const banner = locale === 'es' ? BANNER_ES : BANNER_EN
  const welcome = locale === 'es' ? WELCOME_ES : WELCOME_EN

  const buildWelcome = useCallback((): Message[] =>
    welcome.map(line => ({ id: nextId(), role: 'system', content: line })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale]
  )

  const [messages, setMessages] = useState<Message[]>(buildWelcome)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatHistoryRef = useRef<{ role: 'user' | 'assistant'; content: string }[]>([])

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true })
  }, [])

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Ctrl+D → exit
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault()
        router.push('/')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router])

  const append = (msg: Omit<Message, 'id'>) => {
    const full = { ...msg, id: nextId() }
    setMessages(prev => [...prev, full])
    return full.id
  }

  const updateMessage = (id: number, patch: Partial<Message>) => {
    setMessages(prev => prev.map(m => (m.id === id ? { ...m, ...patch } : m)))
  }

  const sendMessage = useCallback(async (text: string) => {
    const userContent = text.trim()
    if (!userContent || busy) return

    const normalized = userContent.toLowerCase()

    // Built-in commands
    if (normalized === 'exit' || normalized === 'quit') {
      router.push('/')
      return
    }

    if (normalized === 'clear') {
      setMessages(buildWelcome())
      chatHistoryRef.current = []
      setHistoryIdx(-1)
      return
    }

    // Echo user input
    append({ role: 'user', content: userContent })
    setHistory(prev => [userContent, ...prev].slice(0, 50))
    setHistoryIdx(-1)

    // Build message history for API (previous turns)
    const turnHistory = [...chatHistoryRef.current, { role: 'user' as const, content: userContent }]

    // Placeholder for streaming response
    const assistantId = append({ role: 'assistant', content: '', streaming: true })

    setBusy(true)
    let fullResponse = ''

    try {
      const res = await fetch('/api/terminal/invoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: turnHistory, locale }),
      })

      if (!res.ok || !res.body) {
        updateMessage(assistantId, {
          content: locale === 'es'
            ? '  Error al conectar. Inténtalo de nuevo.'
            : '  Connection error. Please try again.',
          streaming: false,
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

      // Store in local chat history for multi-turn context
      chatHistoryRef.current = [
        ...chatHistoryRef.current,
        { role: 'user', content: userContent },
        { role: 'assistant', content: fullResponse },
      ].slice(-30)
    } catch {
      updateMessage(assistantId, {
        content: locale === 'es'
          ? '  No se pudo conectar. Inténtalo de nuevo.'
          : '  Could not connect. Please try again.',
        streaming: false,
      })
    } finally {
      setBusy(false)
      inputRef.current?.focus()
    }
  }, [busy, locale, buildWelcome, router])

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(historyIdx + 1, history.length - 1)
      setHistoryIdx(next)
      setInput(history[next] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(historyIdx - 1, -1)
      setHistoryIdx(next)
      setInput(next === -1 ? '' : history[next])
    }
  }

  const promptLabel = `[you@freak]~$`
  const responseLabel = `[angel@freak]~`

  return (
    <>
      <Head>
        <title>invoke — freak.wtf</title>
        <meta name="robots" content="noindex" />
      </Head>

      <Box
        className={inter.className}
        minH="100dvh"
        h="100dvh"
        bg="#0a0a0a"
        display="flex"
        flexDirection="column"
        fontFamily="'Courier New', Courier, monospace"
        fontSize={{ base: '13px', md: '14px' }}
        color="#e2e8f0"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Header */}
        <Box
          borderBottom="1px solid"
          borderColor="#1e1e1e"
          px={{ base: 4, md: 6 }}
          py={3}
          flexShrink={0}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <HStack gap={3}>
            <HStack gap={1.5}>
              <Box w="12px" h="12px" borderRadius="full" bg="#ff5f57" />
              <Box w="12px" h="12px" borderRadius="full" bg="#febc2e" />
              <Box w="12px" h="12px" borderRadius="full" bg="#28c840" />
            </HStack>
            <Text color="#a855f7" fontWeight="semibold" fontSize="sm" userSelect="none">
              {banner}
            </Text>
          </HStack>
          <Text
            as="button"
            fontSize="xs"
            color="#4a5568"
            cursor="pointer"
            _hover={{ color: '#a0aec0' }}
            onClick={(e) => { e.stopPropagation(); router.push('/') }}
            userSelect="none"
          >
            ← exit
          </Text>
        </Box>

        {/* Messages */}
        <Box
          ref={scrollRef}
          flex={1}
          overflowY="auto"
          px={{ base: 4, md: 6 }}
          py={4}
          display="flex"
          flexDirection="column"
          gap={0}
          css={{
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { background: '#2d3748', borderRadius: '2px' },
          }}
        >
          {messages.map(msg => (
            <MessageRow
              key={msg.id}
              msg={msg}
              promptLabel={promptLabel}
              responseLabel={responseLabel}
            />
          ))}

          {/* Typing indicator */}
          {busy && messages[messages.length - 1]?.streaming !== true && (
            <Box color="#60a5fa" py="2px">
              <Text as="span" color="#a855f7">{responseLabel} </Text>
              <TypingCursor />
            </Box>
          )}
        </Box>

        {/* Input */}
        <Box
          borderTop="1px solid"
          borderColor="#1e1e1e"
          px={{ base: 4, md: 6 }}
          py={3}
          flexShrink={0}
          bg="#0a0a0a"
        >
          <HStack gap={2} align="center">
            <Text
              color={busy ? '#4a5568' : '#a855f7'}
              whiteSpace="nowrap"
              flexShrink={0}
              userSelect="none"
            >
              {promptLabel}
            </Text>
            <Input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={busy}
              placeholder={busy
                ? (locale === 'es' ? 'pensando...' : 'thinking...')
                : (locale === 'es' ? 'escribe algo...' : 'type something...')}
              border="none"
              outline="none"
              bg="transparent"
              color="#e2e8f0"
              fontFamily="inherit"
              fontSize="inherit"
              p={0}
              h="auto"
              flex={1}
              _placeholder={{ color: '#4a5568' }}
              _focus={{ boxShadow: 'none', outline: 'none' }}
              _focusVisible={{ boxShadow: 'none', outline: 'none' }}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          </HStack>
        </Box>
      </Box>
    </>
  )
}

function MessageRow({
  msg,
  promptLabel,
  responseLabel,
}: {
  msg: Message
  promptLabel: string
  responseLabel: string
}) {
  if (msg.role === 'system') {
    return (
      <Text color="#4a5568" whiteSpace="pre-wrap" lineHeight={1.6} py="1px">
        {msg.content}
      </Text>
    )
  }

  if (msg.role === 'user') {
    return (
      <VStack align="stretch" gap={0} mb={2}>
        <HStack gap={2} align="baseline">
          <Text color="#a855f7" whiteSpace="nowrap" flexShrink={0} userSelect="none">
            {promptLabel}
          </Text>
          <Text color="#e2e8f0" whiteSpace="pre-wrap" wordBreak="break-word">
            {msg.content}
          </Text>
        </HStack>
      </VStack>
    )
  }

  // assistant
  return (
    <VStack align="stretch" gap={0} mb={4}>
      <HStack gap={2} align="baseline" mb={1}>
        <Text color="#a855f7" whiteSpace="nowrap" flexShrink={0} userSelect="none">
          {responseLabel}
        </Text>
        {msg.streaming && msg.content === '' && <TypingCursor />}
      </HStack>
      <Box pl={{ base: 0, md: '2px' }}>
        <Text
          color="#c8d3e0"
          whiteSpace="pre-wrap"
          wordBreak="break-word"
          lineHeight={1.7}
        >
          {msg.content}
          {msg.streaming && msg.content.length > 0 && <BlinkingCursor />}
        </Text>
      </Box>
    </VStack>
  )
}

function BlinkingCursor() {
  return (
    <Text
      as="span"
      display="inline-block"
      w="8px"
      h="14px"
      bg="#a855f7"
      ml="1px"
      verticalAlign="text-bottom"
      style={{ animation: 'blink 0.8s step-end infinite' }}
    />
  )
}

function TypingCursor() {
  return (
    <Text
      as="span"
      color="#a855f7"
      style={{ animation: 'blink 0.8s step-end infinite' }}
    >
      ▋
    </Text>
  )
}
