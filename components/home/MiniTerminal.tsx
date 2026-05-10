import { useState, useRef, useEffect, KeyboardEvent, useCallback } from 'react'
import { useRouter } from 'next/router'
import { Box, Text, Input, HStack } from '@chakra-ui/react'
import { TERMINAL_DICT } from '../../lib/terminal/messages'
import { COMMANDS, ROOT_COMMANDS } from '../../lib/terminal/commands'

interface Line {
  id: number
  type: 'input' | 'output' | 'error' | 'info'
  content: string
}

interface MiniTerminalProps {
  introLines?: string[]
  h?: string | object
  locale?: string
}

const MiniTerminal = ({ introLines, h = { base: '320px', md: '300px' }, locale = 'en' }: MiniTerminalProps) => {
  const lang = locale === 'es' ? 'es' : 'en'
  const text = TERMINAL_DICT[lang]
  const router = useRouter()

  const outputRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const lineId = useRef(0)

  const createLine = useCallback((type: Line['type'], content: string): Line => {
    lineId.current += 1
    return { id: lineId.current, type, content }
  }, [])

  const buildInitialLines = useCallback((): Line[] => {
    const lines: Line[] = []

    text.boot.forEach(line => lines.push(createLine('info', line)))

    if (introLines?.length) {
      introLines.forEach(line => lines.push(createLine('output', line)))
    }

    lines.push(createLine('input', '[guest@freak]~$ help'))
    text.help.forEach(line => lines.push(createLine('output', line)))

    return lines
  }, [createLine, introLines, text.banner, text.boot, text.help])

  const [lines, setLines] = useState<Line[]>(buildInitialLines)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [busy, setBusy] = useState(false)
  const [termUser, setTermUser] = useState<'guest' | 'angel'>('guest')
  const [secretRevealed, setSecretRevealed] = useState(false)
  const initialLinesCount = useRef(lines.length)

  // Typewriter placeholder animation
  const [typedPlaceholder, setTypedPlaceholder] = useState('')
  useEffect(() => {
    const examples = text.examples
    let exampleIdx = 0
    let charIdx = 0
    let deleting = false
    let timeoutId: ReturnType<typeof setTimeout>

    const tick = () => {
      const current = examples[exampleIdx]
      if (!deleting) {
        charIdx++
        setTypedPlaceholder(current.slice(0, charIdx))
        if (charIdx === current.length) {
          deleting = true
          timeoutId = setTimeout(tick, 1400)
        } else {
          timeoutId = setTimeout(tick, 60)
        }
      } else {
        charIdx--
        setTypedPlaceholder(current.slice(0, charIdx))
        if (charIdx === 0) {
          deleting = false
          exampleIdx = (exampleIdx + 1) % examples.length
          timeoutId = setTimeout(tick, 400)
        } else {
          timeoutId = setTimeout(tick, 30)
        }
      }
    }

    timeoutId = setTimeout(tick, 800)
    return () => clearTimeout(timeoutId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  useEffect(() => {
    const next = buildInitialLines()
    setLines(next)
    initialLinesCount.current = next.length
  }, [buildInitialLines])

  useEffect(() => {
    if (!outputRef.current) return

    if (lines.length > initialLinesCount.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    } else {
      outputRef.current.scrollTop = 0
    }
  }, [lines])

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true })
  }, [])

  const appendLines = (...newLines: Line[]) => {
    setLines(prev => [...prev, ...newLines])
  }

  const replaceLine = (id: number, patch: Partial<Line>) => {
    setLines(prev => prev.map(line => (line.id === id ? { ...line, ...patch } : line)))
  }

  const suggestCommand = (value: string) => {
    const normalized = value.toLowerCase()
    const candidate = COMMANDS.find(cmd => cmd.startsWith(normalized))
    return candidate
  }

  const runAsk = async (query: string) => {
    const loadingLine = createLine('info', `  ${text.placeholders.recovering}`)
    const outputLine = createLine('output', '  ...')
    appendLines(loadingLine, outputLine)

    setBusy(true)

    try {
      const response = await fetch('/api/terminal/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, locale: lang })
      })

      if (!response.ok || !response.body) {
        replaceLine(outputLine.id, { type: 'error', content: `  ${text.placeholders.timeout}` })
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let done = false
      let answer = ''

      while (!done) {
        const chunk = await reader.read()
        done = chunk.done

        if (!done) {
          answer += decoder.decode(chunk.value, { stream: true })
          replaceLine(outputLine.id, { content: `  ${answer}` })
        }
      }

      // Flush any trailing buffered bytes from the decoder after stream completion.
      answer += decoder.decode()
      replaceLine(outputLine.id, { content: `  ${answer}` })

      const limited = response.headers.get('X-Terminal-Limited-Match') === '1'

      if (limited) {
        appendLines(createLine('info', `  ${text.placeholders.limited}`))
      }
    } catch {
      replaceLine(outputLine.id, { type: 'error', content: `  ${text.placeholders.timeout}` })
    } finally {
      setBusy(false)
      inputRef.current?.focus()
    }
  }

  const run = async (cmd: string) => {
    const raw = cmd.trim()
    const normalized = raw.toLowerCase()

    appendLines(createLine('input', `[${termUser}@freak]~$ ${cmd}`))

    if (!raw) return

    if (normalized === 'su' || normalized === 'su angel') {
      if (termUser === 'angel') {
        appendLines(createLine('info', '  Already logged in as angel.'))
      } else {
        setTermUser('angel')
        appendLines(createLine('output', '  Welcome back, angel. 🔓'))
      }
      setHistory(prev => [raw, ...prev].slice(0, 50))
      setHistoryIdx(-1)
      return
    }

    if (normalized === 'exit' && termUser === 'angel') {
      setTermUser('guest')
      appendLines(createLine('info', '  Logged out.'))
      setHistory(prev => [raw, ...prev].slice(0, 50))
      setHistoryIdx(-1)
      return
    }

    // Root-only commands
    if (termUser === 'angel') {
      const rootCmds = ROOT_COMMANDS[lang]
      const rootKey = normalized as keyof typeof rootCmds
      if (rootKey in rootCmds) {
        appendLines(...rootCmds[rootKey].map(line => createLine('output', line)))
        setHistory(prev => [raw, ...prev].slice(0, 50))
        setHistoryIdx(-1)
        return
      }
    }

    if (normalized === 'invoke') {
      const msg = lang === 'es'
        ? '  Abriendo modo chat...'
        : '  Opening chat mode...'
      appendLines(createLine('info', msg))
      setTimeout(() => router.push('/terminal'), 400)
      setHistory(prev => [raw, ...prev].slice(0, 50))
      setHistoryIdx(-1)
      return
    }

    if (normalized === 'clear') {
      const reset = buildInitialLines()
      setLines(reset)
      initialLinesCount.current = reset.length
      setHistoryIdx(-1)
      return
    }

    if (normalized === 'help') {
      const rootCmds = ROOT_COMMANDS[lang]
      const helpLines = termUser === 'angel'
        ? [...text.help, '', ...rootCmds.help]
        : text.help
      appendLines(...helpLines.map(line => createLine('output', line)))
      setHistory(prev => [raw, ...prev].slice(0, 50))
      setHistoryIdx(-1)
      return
    }

    const staticKey = normalized as keyof typeof text.static
    if (staticKey in text.static) {
      if (normalized === 'secret') setSecretRevealed(true)
      appendLines(...text.static[staticKey].map(line => createLine('output', line)))
      setHistory(prev => [raw, ...prev].slice(0, 50))
      setHistoryIdx(-1)
      return
    }

    const [command] = normalized.split(/\s+/)
    const arg = raw.slice(command.length).trim()

    if (command === 'ask') {
      if (!arg) {
        appendLines(createLine('error', `  ${text.placeholders.ask}`))
      } else {
        await runAsk(arg)
      }
      setHistory(prev => [raw, ...prev].slice(0, 50))
      setHistoryIdx(-1)
      return
    }

    const suggestion = suggestCommand(command)
    appendLines(createLine('error', `  ${text.placeholders.commandNotFound(command, suggestion)}`))
    setHistory(prev => [raw, ...prev].slice(0, 50))
    setHistoryIdx(-1)
  }

  const autocomplete = (value: string) => {
    if (!value) return value

    const [commandPart, ...rest] = value.split(/\s+/)
    const completedCommand = suggestCommand(commandPart) || commandPart

    if (rest.length === 0 && !value.endsWith(' ')) return completedCommand
    return `${completedCommand} ${rest.join(' ')}`.trimEnd()
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      run(input)
      setInput('')
    } else if (e.key === 'Tab') {
      e.preventDefault()
      setInput(autocomplete(input))
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

  const renderWithLinks = (content: string) => {
    const tokenRegex = /(https?:\/\/\S+|[a-z0-9.-]+\.[a-z]{2,}\/[^\s]*|`[^`]+`)/gi
    const parts = content.split(tokenRegex)
    if (parts.length === 1) return content
    return parts.map((part, i) => {
      if (/^`[^`]+`$/.test(part)) {
        return (
          <Box key={i} as="span" color="#fbbf24" fontWeight="bold">{part.slice(1, -1)}</Box>
        )
      }
      if (/^(https?:\/\/|[a-z0-9.-]+\.[a-z]{2,}\/)/.test(part)) {
        const href = part.startsWith('http') ? part : `https://${part}`
        return (
          <a key={i} href={href} target="_blank" rel="noopener noreferrer"
            style={{ color: '#60a5fa', textDecoration: 'underline', cursor: 'pointer' }}
            onClick={e => e.stopPropagation()}
          >{part}</a>
        )
      }
      return part
    })
  }

  const lineColor = (type: Line['type'], isIntro?: boolean) => {
    if (type === 'input') return 'purple.300'
    if (type === 'error') return 'red.400'
    if (type === 'info') return 'cyan.400'
    if (isIntro) return 'gray.200'
    return 'green.300'
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
    >
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
          {text.banner}
        </Text>
      </Box>

      <Box
        ref={outputRef}
        flex={1}
        overflowY="auto"
        overflowX="hidden"
        px={4}
        py={3}
        fontFamily="mono"
        css={{
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(168,85,247,0.3)',
            borderRadius: '2px'
          }
        }}
      >
        {lines.map((line, i) => {
          const isIntro = line.type === 'output' && i < initialLinesCount.current
          return (
            <Text
              key={line.id}
              color={lineColor(line.type, isIntro)}
              whiteSpace="pre-wrap"
              wordBreak="break-word"
              lineHeight="tall"
              fontSize={isIntro ? 'sm' : { base: '10px', md: 'xs' }}
              fontWeight={isIntro ? 'medium' : 'normal'}
            >
              {renderWithLinks(line.content)}
            </Text>
          )
        })}
      </Box>

      <Box
        display={{ base: 'flex', md: 'none' }}
        position="relative"
        flexShrink={0}
        borderTop="1px solid rgba(168, 85, 247, 0.1)"
      >
        <Box
          position="absolute"
          right={0}
          top={0}
          bottom={0}
          w="32px"
          background="linear-gradient(to right, transparent, rgba(10,10,20,0.95))"
          pointerEvents="none"
          zIndex={1}
        />
        <Box
          overflowX="auto"
          px={3}
          py={2}
          w="full"
          css={{
            '&::-webkit-scrollbar': { height: '3px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(168,85,247,0.4)',
              borderRadius: '2px'
            },
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(168,85,247,0.4) transparent'
          }}
        >
          <HStack gap={2} flexShrink={0} pb="2px">
            {(termUser === 'angel'
              ? ['help', 'status', 'env', 'cv', 'invoke', 'exit']
              : ['help', 'ask', ...(secretRevealed ? ['su'] : []), 'whoami', 'skills', 'secret', 'experience', 'contact', 'clear']
            ).map(cmd => {
              const isSu = cmd === 'su' && termUser !== 'angel'
              return (
                <Box
                  key={cmd}
                  as="button"
                  onClick={() => {
                    if (busy) return
                    if (cmd === 'ask') {
                      setInput('ask ')
                      inputRef.current?.focus()
                      return
                    }
                    run(cmd)
                    setInput('')
                  }}
                  px={3}
                  py={1}
                  borderRadius="full"
                  border={isSu ? '1px solid rgba(251,191,36,0.6)' : '1px solid rgba(168, 85, 247, 0.35)'}
                  bg={isSu ? 'rgba(251,191,36,0.12)' : 'rgba(168, 85, 247, 0.1)'}
                  color={isSu ? '#fbbf24' : 'purple.300'}
                  fontSize="xs"
                  fontFamily="mono"
                  whiteSpace="nowrap"
                  flexShrink={0}
                  _active={{ bg: isSu ? 'rgba(251,191,36,0.25)' : 'rgba(168, 85, 247, 0.25)' }}
                  opacity={busy ? 0.6 : 1}
                >
                  {cmd}
                </Box>
              )
            })}
          </HStack>
        </Box>
      </Box>

      <Box
        px={4}
        py={2}
        borderTop="1px solid rgba(168, 85, 247, 0.15)"
        display="flex"
        alignItems="center"
        gap={2}
        flexShrink={0}
      >
        <Text color="purple.400" fontFamily="mono" fontSize="xs" flexShrink={0} whiteSpace="nowrap">
          [{termUser}@freak]~$
        </Text>
        <Box position="relative" flex={1} display="flex" alignItems="center">
          {input && autocomplete(input) !== input && (
            <Text
              position="absolute"
              left={0}
              top="50%"
              transform="translateY(-50%)"
              fontFamily="mono"
              fontSize="xs"
              color="gray.600"
              whiteSpace="pre"
              pointerEvents="none"
              userSelect="none"
            >
              {input}
              <Text
                as="span"
                color="rgba(168,85,247,0.4)"
                cursor="pointer"
                pointerEvents="auto"
                onClick={() => setInput(autocomplete(input))}
                title="Tap to complete"
              >
                {autocomplete(input).slice(input.length)}
              </Text>
            </Text>
          )}
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
            placeholder={busy ? '' : (input ? '' : typedPlaceholder)}
            _placeholder={{ color: 'gray.600' }}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            position="relative"
            zIndex={1}
            readOnly={busy}
          />
        </Box>
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
            run(input)
            setInput('')
          }}
        >
          ↵
        </Box>
      </Box>
    </Box>
  )
}

export default MiniTerminal
