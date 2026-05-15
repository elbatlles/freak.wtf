import { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react'
import { Box, Text, Input, HStack, VStack, Image, Portal } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'

// ─── Types ───────────────────────────────────────────────────────────────────

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

const PROMPT = '[you@freak]~$'
const RESPONSE = '[angel@freak]~'

let msgId = 0
const nextId = () => ++msgId

// ─── Regexes ─────────────────────────────────────────────────────────────────

const URL_REGEX = /(https?:\/\/[^\s,)"\]]+)/g
const IMG_REGEX = /\.(jpg|jpeg|png|gif|webp|svg)(\?[^\s,)]*)?$/i
const MD_LINK_REGEX = /!?\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g

// ─── Custom hooks ─────────────────────────────────────────────────────────────

function useTypewriter(examples: readonly string[]) {
  const [typed, setTyped] = useState('')
  useEffect(() => {
    let exIdx = 0, charIdx = 0, deleting = false
    let tid: ReturnType<typeof setTimeout>
    const tick = () => {
      const cur = examples[exIdx]
      if (!deleting) {
        charIdx++
        setTyped(cur.slice(0, charIdx))
        tid = charIdx === cur.length ? setTimeout(tick, 1400) : setTimeout(tick, 60)
        if (charIdx === cur.length) deleting = true
      } else {
        charIdx--
        setTyped(cur.slice(0, charIdx))
        if (charIdx === 0) { deleting = false; exIdx = (exIdx + 1) % examples.length }
        tid = charIdx === 0 ? setTimeout(tick, 400) : setTimeout(tick, 30)
      }
    }
    tid = setTimeout(tick, 800)
    return () => clearTimeout(tid)
  }, [examples])
  return typed
}

function useCommandHistory() {
  const [history, setHistory] = useState<string[]>([])
  const [idx, setIdx] = useState(-1)

  const push = (cmd: string) => {
    setHistory(prev => [cmd, ...prev].slice(0, 50))
    setIdx(-1)
  }

  const navigate = (dir: 'up' | 'down', setInput: (v: string) => void) => {
    setIdx(prev => {
      const next = dir === 'up'
        ? Math.min(prev + 1, history.length - 1)
        : Math.max(prev - 1, -1)
      setInput(next === -1 ? '' : history[next] ?? '')
      return next
    })
  }

  return { push, navigate }
}

// ─── Image thumbnail + lightbox ───────────────────────────────────────────────

function ImageThumb({ src }: { src: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Image
        src={src} alt=""
        display="inline-block" h="64px" borderRadius="md"
        border="1px solid rgba(168,85,247,0.4)" cursor="pointer" mt={1}
        onClick={() => setOpen(true)}
        style={{ verticalAlign: 'middle' }}
      />
      {open && (
        <Portal>
          <Box
            position="fixed" inset={0} zIndex={9999} bg="blackAlpha.800"
            display="flex" alignItems="center" justifyContent="center"
            onClick={() => setOpen(false)}
          >
            <Image
              src={src} alt="" maxH="80vh" maxW="90vw" borderRadius="xl" boxShadow="2xl"
              onClick={e => e.stopPropagation()}
            />
          </Box>
        </Portal>
      )}
    </>
  )
}

// ─── Rich text renderer ───────────────────────────────────────────────────────

type Segment = { type: 'text' | 'link' | 'image'; value: string; label?: string }

function parseSegments(text: string): Segment[] {
  const segments: Segment[] = []
  let last = 0, m: RegExpExecArray | null
  MD_LINK_REGEX.lastIndex = 0
  while ((m = MD_LINK_REGEX.exec(text)) !== null) {
    if (m.index > last) segments.push({ type: 'text', value: text.slice(last, m.index) })
    const url = m[2]
    segments.push({ type: m[0].startsWith('!') || IMG_REGEX.test(url) ? 'image' : 'link', value: url, label: m[1] })
    last = m.index + m[0].length
  }
  if (last < text.length) segments.push({ type: 'text', value: text.slice(last) })
  return segments
}

const LINK_STYLE = { color: '#a78bfa', textDecoration: 'underline', wordBreak: 'break-all' } as const

function renderWithLinks(text: string): React.ReactNode[] {
  return parseSegments(text).flatMap((seg, si) => {
    if (seg.type === 'image') return [<ImageThumb key={`img-${si}`} src={seg.value} />]
    if (seg.type === 'link') return [<a key={`lnk-${si}`} href={seg.value} target="_blank" rel="noopener noreferrer" style={LINK_STYLE}>{seg.label || seg.value}</a>]
    // plain text: scan for raw URLs
    return seg.value.split(URL_REGEX).map((part, pi) => {
      if (!URL_REGEX.test(part)) return part
      URL_REGEX.lastIndex = 0
      return IMG_REGEX.test(part)
        ? <ImageThumb key={`ri-${si}-${pi}`} src={part} />
        : <a key={`rl-${si}-${pi}`} href={part} target="_blank" rel="noopener noreferrer" style={LINK_STYLE}>{part}</a>
    })
  })
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MiniTerminal({ h = { base: '360px', md: '300px' }, locale = 'en' }: MiniTerminalProps) {
  const t = useTranslations('terminal')

  const buildWelcome = useCallback(
    (): Message[] => (t.raw('welcome') as string[]).map(line => ({ id: nextId(), role: 'system' as const, content: line })),
    [t]
  )

  const [messages, setMessages] = useState<Message[]>(buildWelcome)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatHistoryRef = useRef<{ role: 'user' | 'assistant'; content: string }[]>([])

  const typedPlaceholder = useTypewriter(t.raw('examples') as string[])
  const { push: pushHistory, navigate: navigateHistory } = useCommandHistory()

  useEffect(() => { setMessages(buildWelcome()); chatHistoryRef.current = [] }, [buildWelcome])
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight }, [messages])
  useEffect(() => { inputRef.current?.focus({ preventScroll: true }) }, [])

  const append = (msg: Omit<Message, 'id'>) => {
    const full = { ...msg, id: nextId() }
    setMessages(prev => [...prev, full])
    return full.id
  }

  const updateMessage = (id: number, patch: Partial<Message>) =>
    setMessages(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m))

  const sendMessage = useCallback(async (text: string) => {
    const content = text.trim()
    if (!content || busy) return

    if (content.toLowerCase() === 'clear') {
      setMessages(buildWelcome())
      chatHistoryRef.current = []
      return
    }

    append({ role: 'user', content })
    pushHistory(content)

    const turnHistory = [...chatHistoryRef.current, { role: 'user' as const, content }]
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
        updateMessage(assistantId, { content: t('errorConnect'), streaming: false })
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
      chatHistoryRef.current = [...chatHistoryRef.current, { role: 'user' as const, content }, { role: 'assistant' as const, content: fullResponse }].slice(-20)
    } catch {
      updateMessage(assistantId, { content: t('errorDisconnect'), streaming: false })
    } finally {
      setBusy(false)
      inputRef.current?.focus()
    }
  }, [busy, buildWelcome, locale, pushHistory, t])

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { sendMessage(input); setInput('') }
    else if (e.key === 'ArrowUp') { e.preventDefault(); navigateHistory('up', setInput) }
    else if (e.key === 'ArrowDown') { e.preventDefault(); navigateHistory('down', setInput) }
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
          {t('banner')}
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
                  <Text color="purple.300" whiteSpace="nowrap" flexShrink={0} userSelect="none">{PROMPT}</Text>
                  <Text color="gray.100" whiteSpace="pre-wrap" wordBreak="break-word">{msg.content}</Text>
                </HStack>
              </VStack>
            )
          }

          // assistant
          return (
            <VStack key={msg.id} align="stretch" gap={0} mb={3}>
              <HStack gap={2} align="baseline" mb={1}>
                <Text color="purple.400" whiteSpace="nowrap" flexShrink={0} userSelect="none">{RESPONSE}</Text>
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
          placeholder={busy ? t('thinking') : (input ? '' : typedPlaceholder)}
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
