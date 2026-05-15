import { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react'
import { Box, Text, Input, HStack, VStack, Image, Portal } from '@chakra-ui/react'

interface Message {
  id: number
  role: 'user' | 'assistant' | 'system'
  content: string
  streaming?: boolean
}

interface MiniTerminalProps {
  h?: string | object
  locale?: string
}

const BANNER_EN = 'freak.wtf — AI chat'
const BANNER_ES = 'freak.wtf — chat IA'

const WELCOME_EN = [
  '  Ask me anything about Angel.',
  '  Work, stack, projects, opinions — type to start.',
  '',
]

const WELCOME_ES = [
  '  Pregúntame cualquier cosa sobre Angel.',
  '  Trabajo, stack, proyectos, opiniones — escribe para empezar.',
  '',
]

const EXAMPLES_EN = [
  "What do you work on?",
  "What's your tech stack?",
  "Tell me about your projects",
  "What do you think about AI?",
  "How do you approach problem-solving?",
]

const EXAMPLES_ES = [
  "¿En qué trabajas?",
  "¿Qué stack usas?",
  "¿Cuáles son tus proyectos?",
  "¿Qué opinas de la IA?",
  "¿Cómo abordas los problemas?",
]

let msgId = 0
const nextId = () => ++msgId

const URL_REGEX = /(https?:\/\/[^\s,)"\]]+)/g
const IMG_REGEX = /\.(jpg|jpeg|png|gif|webp|svg)(\?[^\s,)]*)?$/i
// Matches [text](url) and ![alt](url)
const MD_LINK_REGEX = /!?\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g

function ImageThumb({ src }: { src: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Image
        src={src}
        alt=""
        display="inline-block"
        h="64px"
        borderRadius="md"
        border="1px solid rgba(168,85,247,0.4)"
        cursor="pointer"
        mt={1}
        onClick={() => setOpen(true)}
        style={{ verticalAlign: 'middle' }}
      />
      {open && (
        <Portal>
          <Box
            position="fixed"
            inset={0}
            zIndex={9999}
            bg="blackAlpha.800"
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={() => setOpen(false)}
          >
            <Image
              src={src}
              alt=""
              maxH="80vh"
              maxW="90vw"
              borderRadius="xl"
              boxShadow="2xl"
              onClick={e => e.stopPropagation()}
            />
          </Box>
        </Portal>
      )}
    </>
  )
}

const renderWithLinks = (text: string) => {
  // First expand markdown links into segments
  const segments: Array<{ type: 'text' | 'url' | 'img-url'; value: string; label?: string }> = []
  let last = 0
  let match: RegExpExecArray | null
  MD_LINK_REGEX.lastIndex = 0

  while ((match = MD_LINK_REGEX.exec(text)) !== null) {
    if (match.index > last) segments.push({ type: 'text', value: text.slice(last, match.index) })
    const isImg = match[0].startsWith('!')
    const url = match[2]
    segments.push({ type: isImg || IMG_REGEX.test(url) ? 'img-url' : 'url', value: url, label: match[1] })
    last = match.index + match[0].length
  }
  if (last < text.length) segments.push({ type: 'text', value: text.slice(last) })

  // Then expand raw URLs within text segments
  const result: React.ReactNode[] = []
  segments.forEach((seg, si) => {
    if (seg.type === 'img-url') {
      result.push(<ImageThumb key={`img-${si}`} src={seg.value} />)
    } else if (seg.type === 'url') {
      result.push(
        <a key={`lnk-${si}`} href={seg.value} target="_blank" rel="noopener noreferrer"
          style={{ color: '#a78bfa', textDecoration: 'underline', wordBreak: 'break-all' }}>
          {seg.label || seg.value}
        </a>
      )
    } else {
      // raw URL scan inside plain text
      const parts = seg.value.split(URL_REGEX)
      URL_REGEX.lastIndex = 0
      parts.forEach((part, pi) => {
        if (URL_REGEX.test(part)) {
          URL_REGEX.lastIndex = 0
          if (IMG_REGEX.test(part)) {
            result.push(<ImageThumb key={`ri-${si}-${pi}`} src={part} />)
          } else {
            result.push(
              <a key={`rl-${si}-${pi}`} href={part} target="_blank" rel="noopener noreferrer"
                style={{ color: '#a78bfa', textDecoration: 'underline', wordBreak: 'break-all' }}>
                {part}
              </a>
            )
          }
        } else {
          result.push(part)
        }
      })
    }
  })
  return result
}


export default function MiniTerminal({ h = { base: '360px', md: '300px' }, locale = 'en' }: MiniTerminalProps) {
  const lang = locale === 'es' ? 'es' : 'en'
  const welcome = lang === 'es' ? WELCOME_ES : WELCOME_EN
  const banner = lang === 'es' ? BANNER_ES : BANNER_EN
  const examples = lang === 'es' ? EXAMPLES_ES : EXAMPLES_EN

  const buildWelcome = useCallback(
    (): Message[] => welcome.map(line => ({ id: nextId(), role: 'system' as const, content: line })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang]
  )

  const [messages, setMessages] = useState<Message[]>(buildWelcome)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatHistoryRef = useRef<{ role: 'user' | 'assistant'; content: string }[]>([])

  // Typewriter placeholder
  const [typedPlaceholder, setTypedPlaceholder] = useState('')
  useEffect(() => {
    let exIdx = 0, charIdx = 0, deleting = false
    let tid: ReturnType<typeof setTimeout>

    const tick = () => {
      const cur = examples[exIdx]
      if (!deleting) {
        charIdx++
        setTypedPlaceholder(cur.slice(0, charIdx))
        if (charIdx === cur.length) { deleting = true; tid = setTimeout(tick, 1400) }
        else tid = setTimeout(tick, 60)
      } else {
        charIdx--
        setTypedPlaceholder(cur.slice(0, charIdx))
        if (charIdx === 0) { deleting = false; exIdx = (exIdx + 1) % examples.length; tid = setTimeout(tick, 400) }
        else tid = setTimeout(tick, 30)
      }
    }

    tid = setTimeout(tick, 800)
    return () => clearTimeout(tid)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  // Reset on lang change
  useEffect(() => {
    setMessages(buildWelcome())
    chatHistoryRef.current = []
  }, [buildWelcome])

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  // Auto-focus on mount
  useEffect(() => { inputRef.current?.focus({ preventScroll: true }) }, [])

  const append = (msg: Omit<Message, 'id'>) => {
    const full = { ...msg, id: nextId() }
    setMessages(prev => [...prev, full])
    return full.id
  }

  const updateMessage = (id: number, patch: Partial<Message>) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m))
  }

  const sendMessage = useCallback(async (text: string) => {
    const userContent = text.trim()
    if (!userContent || busy) return

    if (userContent.toLowerCase() === 'clear') {
      setMessages(buildWelcome())
      chatHistoryRef.current = []
      setHistoryIdx(-1)
      return
    }

    append({ role: 'user', content: userContent })
    setHistory(prev => [userContent, ...prev].slice(0, 50))
    setHistoryIdx(-1)

    const turnHistory = [...chatHistoryRef.current, { role: 'user' as const, content: userContent }]
    const assistantId = append({ role: 'assistant', content: '', streaming: true })

    setBusy(true)
    let fullResponse = ''

    try {
      const res = await fetch('/api/terminal/invoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: turnHistory, locale: lang }),
      })

      if (!res.ok || !res.body) {
        updateMessage(assistantId, {
          content: lang === 'es' ? '  Error al conectar. Inténtalo de nuevo.' : '  Connection error. Please try again.',
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

      chatHistoryRef.current = [
        ...chatHistoryRef.current,
        { role: 'user' as const, content: userContent },
        { role: 'assistant' as const, content: fullResponse },
      ].slice(-20)
    } catch {
      updateMessage(assistantId, {
        content: lang === 'es' ? '  No se pudo conectar.' : '  Could not connect.',
        streaming: false,
      })
    } finally {
      setBusy(false)
      inputRef.current?.focus()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busy, lang, buildWelcome])

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

  const promptLabel = '[you@freak]~$'
  const responseLabel = '[angel@freak]~'

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
      {/* Header */}
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
        <Text ml={2} fontSize="xs" color="purple.300" fontFamily="mono" letterSpacing="wider" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
          {banner}
        </Text>
      </Box>

      {/* Messages */}
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
          '&::-webkit-scrollbar-thumb': { background: 'rgba(168,85,247,0.3)', borderRadius: '2px' },
        }}
      >
        {messages.map(msg => {
          if (msg.role === 'system') {
            return (
              <Text key={msg.id} color="gray.500" whiteSpace="pre-wrap" lineHeight={1.6} py="1px">
                {msg.content}
              </Text>
            )
          }

          if (msg.role === 'user') {
            return (
              <VStack key={msg.id} align="stretch" gap={0} mb={2}>
                <HStack gap={2} align="baseline">
                  <Text color="purple.300" whiteSpace="nowrap" flexShrink={0} userSelect="none">{promptLabel}</Text>
                  <Text color="gray.100" whiteSpace="pre-wrap" wordBreak="break-word">{msg.content}</Text>
                </HStack>
              </VStack>
            )
          }

          // assistant
          return (
            <VStack key={msg.id} align="stretch" gap={0} mb={3}>
              <HStack gap={2} align="baseline" mb={1}>
                <Text color="purple.400" whiteSpace="nowrap" flexShrink={0} userSelect="none">{responseLabel}</Text>
                {msg.streaming && msg.content === '' && <BlinkingCursor />}
              </HStack>
              <Box>
                <Text color="green.300" whiteSpace="pre-wrap" wordBreak="break-word" lineHeight={1.7}>
                  {renderWithLinks(msg.content)}
                  {msg.streaming && msg.content.length > 0 && <BlinkingCursor />}
                </Text>
              </Box>
            </VStack>
          )
        })}
      </Box>

      {/* Input */}
      <Box
        px={4}
        py={2}
        borderTop="1px solid rgba(168, 85, 247, 0.15)"
        display="flex"
        alignItems="center"
        gap={2}
        flexShrink={0}
      >
        <Text color={busy ? 'gray.600' : 'purple.300'} fontFamily="mono" fontSize="xs" flexShrink={0} whiteSpace="nowrap" userSelect="none">
          {promptLabel}
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
          placeholder={busy ? (lang === 'es' ? 'pensando...' : 'thinking...') : (input ? '' : typedPlaceholder)}
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

function BlinkingCursor() {
  return (
    <Text
      as="span"
      display="inline-block"
      w="7px"
      h="13px"
      bg="purple.400"
      ml="1px"
      verticalAlign="text-bottom"
      style={{ animation: 'blink 0.8s step-end infinite' }}
    />
  )
}
