import { useState, useRef, useEffect, KeyboardEvent, useCallback } from 'react'
import { Box, Text, Input, HStack } from '@chakra-ui/react'

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

const COMMANDS = ['ask', 'trace', 'sources', 'timeline', 'projects', 'notes', 'clear', 'help']

const DICT = {
  en: {
    banner: 'angel@freak.wtf ~ memory-terminal v1.0.0',
    boot: [
      '  loading memory index...',
      '  loading timeline...',
      '  loading project reflections...',
      '  ready.'
    ],
    help: [
      '  Available commands:',
      '  ask <question>         → Ask and retrieve contextual memory',
      '  trace <topic>          → Traverse related reasoning over time',
      '  sources                → Show sources from the last retrieval',
      '  timeline [year|range]  → Explore timeline memories',
      '  projects [name]        → Explore project memories',
      '  notes [tag]            → Explore note memories',
      '  clear                  → Clear terminal',
      '  help                   → Show this help'
    ],
    placeholders: {
      input: 'type a command...',
      ask: 'Usage: ask <question>',
      trace: 'Usage: trace <topic>',
      noSources: 'No sources yet. Run ask/trace/timeline/projects/notes first.',
      commandNotFound: (cmd: string, suggestion?: string) =>
        suggestion
          ? `command not found: ${cmd}. Did you mean "${suggestion}"?`
          : `command not found: ${cmd}. Try "help".`,
      recovering: 'retrieving memory context...',
      timeout: 'I could not retrieve memory right now. Try again.',
      limited: 'limited memory match: answer confidence is low.',
      sources: (values: string[]) => `— sources: ${values.join(', ')}`
    }
  },
  es: {
    banner: 'angel@freak.wtf ~ memory-terminal v1.0.0',
    boot: [
      '  cargando índice de memoria...',
      '  cargando timeline...',
      '  cargando reflexiones de proyectos...',
      '  listo.'
    ],
    help: [
      '  Comandos disponibles:',
      '  ask <pregunta>         → Preguntar con memoria contextual',
      '  trace <tema>           → Recorrer razonamiento relacionado en el tiempo',
      '  sources                → Ver fuentes de la última recuperación',
      '  timeline [año|rango]   → Explorar memoria temporal',
      '  projects [nombre]      → Explorar memoria de proyectos',
      '  notes [tag]            → Explorar notas',
      '  clear                  → Limpiar terminal',
      '  help                   → Mostrar ayuda'
    ],
    placeholders: {
      input: 'escribe un comando...',
      ask: 'Uso: ask <pregunta>',
      trace: 'Uso: trace <tema>',
      noSources: 'Aún no hay fuentes. Ejecuta ask/trace/timeline/projects/notes primero.',
      commandNotFound: (cmd: string, suggestion?: string) =>
        suggestion
          ? `comando no encontrado: ${cmd}. ¿Quizás "${suggestion}"?`
          : `comando no encontrado: ${cmd}. Prueba "help".`,
      recovering: 'recuperando contexto de memoria...',
      timeout: 'No pude recuperar memoria en este momento. Inténtalo de nuevo.',
      limited: 'coincidencia de memoria limitada: confianza baja en la respuesta.',
      sources: (values: string[]) => `— fuentes: ${values.join(', ')}`
    }
  }
}

const MiniTerminal = ({ introLines, h = { base: '320px', md: '300px' }, locale = 'en' }: MiniTerminalProps) => {
  const lang = locale === 'es' ? 'es' : 'en'
  const text = DICT[lang]

  const outputRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const lineId = useRef(0)

  const createLine = useCallback((type: Line['type'], content: string): Line => {
    lineId.current += 1
    return { id: lineId.current, type, content }
  }, [])

  const buildInitialLines = useCallback((): Line[] => {
    const lines: Line[] = [createLine('info', `  ${text.banner}`)]

    text.boot.forEach(line => lines.push(createLine('info', line)))

    if (introLines?.length) {
      introLines.forEach(line => lines.push(createLine('output', line)))
    }

    lines.push(createLine('input', '> help'))
    text.help.forEach(line => lines.push(createLine('output', line)))

    return lines
  }, [createLine, introLines, text.banner, text.boot, text.help])

  const [lines, setLines] = useState<Line[]>(buildInitialLines)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [busy, setBusy] = useState(false)
  const [lastSources, setLastSources] = useState<string[]>([])
  const initialLinesCount = useRef(lines.length)

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
    const candidate = COMMANDS.find(cmd => cmd.startsWith(value.toLowerCase()))
    return candidate
  }

  const decodeSources = (header: string | null): string[] => {
    if (!header) return []

    try {
      const decoded = decodeURIComponent(header)
      const parsed = JSON.parse(decoded)
      return Array.isArray(parsed) ? parsed.map(String) : []
    } catch {
      return []
    }
  }

  const runAskLike = async (query: string, trace: boolean) => {
    const loadingLine = createLine('info', `  ${text.placeholders.recovering}`)
    const outputLine = createLine('output', '  ...')
    appendLines(loadingLine, outputLine)

    setBusy(true)

    try {
      const response = await fetch('/api/terminal/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, trace, locale: lang })
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

      answer += decoder.decode()
      replaceLine(outputLine.id, { content: `  ${answer.trim()}` })

      const sources = decodeSources(response.headers.get('X-Terminal-Sources'))
      const limited = response.headers.get('X-Terminal-Limited-Match') === '1'

      setLastSources(sources)

      if (sources.length) {
        appendLines(createLine('info', `  ${text.placeholders.sources(sources)}`))
      }

      if (limited) {
        appendLines(createLine('info', `  ${text.placeholders.limited}`))
      }
    } catch {
      replaceLine(outputLine.id, { type: 'error', content: `  ${text.placeholders.timeout}` })
    } finally {
      setBusy(false)
    }
  }

  const runNavigate = async (command: 'timeline' | 'projects' | 'notes', arg: string) => {
    appendLines(createLine('info', `  ${text.placeholders.recovering}`))

    setBusy(true)
    try {
      const response = await fetch('/api/terminal/navigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, arg, locale: lang })
      })

      if (!response.ok) {
        appendLines(createLine('error', `  ${text.placeholders.timeout}`))
        return
      }

      const json = await response.json()
      const remoteLines = Array.isArray(json?.lines) ? json.lines.map(String) : []
      const sourceIds = Array.isArray(json?.sourceIds) ? json.sourceIds.map(String) : []

      if (remoteLines.length === 0) {
        appendLines(createLine('error', `  ${text.placeholders.timeout}`))
        return
      }

      appendLines(...remoteLines.map((line: string) => createLine('output', `  ${line}`)))
      setLastSources(sourceIds)

      if (sourceIds.length) {
        appendLines(createLine('info', `  ${text.placeholders.sources(sourceIds)}`))
      }
    } catch {
      appendLines(createLine('error', `  ${text.placeholders.timeout}`))
    } finally {
      setBusy(false)
    }
  }

  const run = async (cmd: string) => {
    const raw = cmd.trim()
    const normalized = raw.toLowerCase()

    appendLines(createLine('input', `> ${cmd}`))

    if (!raw) return

    if (normalized === 'clear') {
      const reset = buildInitialLines()
      setLines(reset)
      initialLinesCount.current = reset.length
      setHistoryIdx(-1)
      return
    }

    if (normalized === 'help') {
      appendLines(...text.help.map(line => createLine('output', line)))
      setHistory(prev => [raw, ...prev].slice(0, 50))
      setHistoryIdx(-1)
      return
    }

    if (normalized === 'sources') {
      if (lastSources.length === 0) {
        appendLines(createLine('info', `  ${text.placeholders.noSources}`))
      } else {
        appendLines(createLine('info', `  ${text.placeholders.sources(lastSources)}`))
      }
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
        await runAskLike(arg, false)
      }
      setHistory(prev => [raw, ...prev].slice(0, 50))
      setHistoryIdx(-1)
      return
    }

    if (command === 'trace') {
      if (!arg) {
        appendLines(createLine('error', `  ${text.placeholders.trace}`))
      } else {
        await runAskLike(arg, true)
      }
      setHistory(prev => [raw, ...prev].slice(0, 50))
      setHistoryIdx(-1)
      return
    }

    if (command === 'timeline' || command === 'projects' || command === 'notes') {
      await runNavigate(command, arg)
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
    if (!value || value.includes(' ')) return value
    return suggestCommand(value) || value
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
        <Text ml={2} fontSize="xs" color="purple.300" fontFamily="mono" letterSpacing="wider">
          angel@freak.wtf
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
              fontSize={isIntro ? 'sm' : 'xs'}
              fontWeight={isIntro ? 'medium' : 'normal'}
            >
              {line.content}
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
            {COMMANDS.map(cmd => (
              <Box
                key={cmd}
                as="button"
                onClick={() => {
                  if (busy) return
                  if (cmd === 'ask' || cmd === 'trace') {
                    setInput(`${cmd} `)
                    inputRef.current?.focus()
                    return
                  }
                  run(cmd)
                  setInput('')
                }}
                px={3}
                py={1}
                borderRadius="full"
                border="1px solid rgba(168, 85, 247, 0.35)"
                bg="rgba(168, 85, 247, 0.1)"
                color="purple.300"
                fontSize="xs"
                fontFamily="mono"
                whiteSpace="nowrap"
                flexShrink={0}
                _active={{ bg: 'rgba(168, 85, 247, 0.25)' }}
                opacity={busy ? 0.6 : 1}
              >
                {cmd}
              </Box>
            ))}
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
        <Text color="purple.400" fontFamily="mono" fontSize="xs" flexShrink={0}>
          &gt;
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
            placeholder={busy ? '' : text.placeholders.input}
            _placeholder={{ color: 'gray.600' }}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            position="relative"
            zIndex={1}
            disabled={busy}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default MiniTerminal
