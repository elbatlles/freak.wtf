import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { Box, Text, Input, HStack } from '@chakra-ui/react'

interface Line {
  type: 'input' | 'output' | 'error' | 'info'
  content: string
}

const COMMANDS: Record<string, { en: string[]; es: string[] }> = {
  help: {
    en: [
      '  Available commands:',
      '  whoami       → Who is Angel?',
      '  skills       → Tech stack',
      '  contact      → How to reach me',
      '  experience   → Work history',
      '  secret       → 👀',
      '  clear        → Clear terminal',
    ],
    es: [
      '  Comandos disponibles:',
      '  whoami       → ¿Quién es Angel?',
      '  skills       → Stack tecnológico',
      '  contact      → Cómo contactarme',
      '  experience   → Historial laboral',
      '  secret       → 👀',
      '  clear        → Limpiar terminal',
    ],
  },
  whoami: {
    en: [
      '  Angel Batlles — Full Stack Developer',
      '  Based in Barcelona 🇪🇸',
      '  10+ years building products',
      '  Currently @ Travelport',
      '  Obsessed with clean code & crossfit 🏋️',
    ],
    es: [
      '  Angel Batlles — Desarrollador Full Stack',
      '  Basado en Barcelona 🇪🇸',
      '  Más de 10 años creando productos',
      '  Actualmente en Travelport',
      '  Apasionado del código limpio y el crossfit 🏋️',
    ],
  },
  skills: {
    en: [
      '  Languages  → TypeScript, JavaScript, PHP, Python',
      '  Frontend   → React, Next.js, Gatsby, TailwindCSS',
      '  Backend    → Node.js, Express, Fastify, Strapi',
      '  DevOps     → Docker, CI/CD, GitHub Actions, Git',
      '  Tools      → Nx, Jest/Vitest, Biome, Postman',
    ],
    es: [
      '  Lenguajes  → TypeScript, JavaScript, PHP, Python',
      '  Frontend   → React, Next.js, Gatsby, TailwindCSS',
      '  Backend    → Node.js, Express, Fastify, Strapi',
      '  DevOps     → Docker, CI/CD, GitHub Actions, Git',
      '  Tools      → Nx, Jest/Vitest, Biome, Postman',
    ],
  },
  contact: {
    en: [
      '  GitHub   → github.com/elbatlles',
      '  LinkedIn → linkedin.com/in/abatlles',
      '  X        → x.com/elbatlles',
      '  Web      → freak.wtf',
    ],
    es: [
      '  GitHub   → github.com/elbatlles',
      '  LinkedIn → linkedin.com/in/abatlles',
      '  X        → x.com/elbatlles',
      '  Web      → freak.wtf',
    ],
  },
  experience: {
    en: [
      '  2022-now   Travelport  — Software Development Engineer',
      '  2021-2022  Freelance   — Full Stack Developer',
      '  2020-2021  Kumux       — Frontend Developer',
      '  2012-2020  Grafix      — Web Developer',
    ],
    es: [
      '  2022-hoy   Travelport  — Software Development Engineer',
      '  2021-2022  Freelance   — Full Stack Developer',
      '  2020-2021  Kumux       — Frontend Developer',
      '  2012-2020  Grafix      — Web Developer',
    ],
  },
  secret: {
    en: [
      '  🎮 First program: a Basic game on a 486 at age 14',
      '  🏃 Ran a half-marathon in 2022',
      '  🪲 Once debugged a bug for 3 days... it was a semicolon',
      '  🤖 This terminal was built with ♥ by GitHub Copilot',
    ],
    es: [
      '  🎮 Primer programa: un juego en Basic en un 486 con 14 años',
      '  🏃 Corrí una media maratón en 2022',
      '  🪲 Una vez debugueé un bug 3 días... era un punto y coma',
      '  🤖 Esta terminal fue creada con ♥ por GitHub Copilot',
    ],
  },
}

const BASE_LINES: Line[] = [
  { type: 'info', content: '  angel@freak.wtf ~ v1.0.0' },
]

const buildInitialLines = (introLines?: string[], locale?: string): Line[] => {
  const lang = locale === 'es' ? 'es' : 'en'
  const helpOutput = COMMANDS['help'][lang]
  return [
    ...BASE_LINES,
    ...(introLines ? introLines.map(l => ({ type: 'output' as const, content: l })) : []),
    { type: 'input' as const, content: '> help' },
    ...helpOutput.map(l => ({ type: 'output' as const, content: l })),
  ]
}

interface MiniTerminalProps {
  introLines?: string[]
  h?: string | object
  locale?: string
}

const MiniTerminal = ({ introLines, h = { base: '320px', md: '300px' }, locale = 'en' }: MiniTerminalProps) => {
  const lang = locale === 'es' ? 'es' : 'en'
  const getOutput = (cmd: string): string[] | null => COMMANDS[cmd]?.[lang] ?? null
  const clearCmds = ['clear']
  const initialLines = buildInitialLines(introLines, locale)
  const [lines, setLines] = useState<Line[]>(initialLines)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const outputRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const initialLinesCount = useRef(initialLines.length)

  // Scroll to bottom only when new lines are added (user ran a command).
  // Otherwise reset to top so the intro is always visible from the start.
  useEffect(() => {
    if (!outputRef.current) return
    if (lines.length > initialLinesCount.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    } else {
      outputRef.current.scrollTop = 0
    }
  }, [lines])

  // Auto-focus input on mount (preventScroll avoids the browser scrolling the page to the terminal)
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true })
  }, [])

  const run = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    const newLines: Line[] = [...lines, { type: 'input', content: `> ${cmd}` }]

    if (trimmed === '') {
      setLines(newLines)
      return
    }

    if (clearCmds.includes(trimmed)) {
      setLines(initialLines)
      return
    }

    const output = getOutput(trimmed)
    if (output) {
      output.forEach(l => newLines.push({ type: 'output', content: l }))
    } else {
      const notFound = locale === 'es'
        ? `  comando no encontrado: ${trimmed}. Prueba "help".`
        : `  command not found: ${trimmed}. Try "help".`
      newLines.push({ type: 'error', content: notFound })
    }

    setLines(newLines)
    setHistory(h => [trimmed, ...h].slice(0, 50))
    setHistoryIdx(-1)
  }

  const autocomplete = (value: string) => {
    if (!value) return value
    const matches = Object.keys(COMMANDS).filter(cmd => cmd.startsWith(value.toLowerCase()))
    return matches.length > 0 ? matches[0] : value
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
        >
          angel@freak.wtf
        </Text>
      </Box>

      {/* Output */}
      <Box
        ref={outputRef}
        flex={1}
        overflowY="auto"
        overflowX="hidden"
        px={4}
        py={3}
        fontFamily="mono"
        css={{ '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { background: 'rgba(168,85,247,0.3)', borderRadius: '2px' } }}
      >
        {lines.map((line, i) => {
          const isIntro = line.type === 'output' && i < initialLines.length
          return (
            <Text
              key={i}
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

      {/* Mobile command pills — only visible on touch screens */}
      <Box
        display={{ base: 'flex', md: 'none' }}
        position="relative"
        flexShrink={0}
        borderTop="1px solid rgba(168, 85, 247, 0.1)"
      >
        {/* fade hint on the right */}
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
            '&::-webkit-scrollbar-thumb': { background: 'rgba(168,85,247,0.4)', borderRadius: '2px' },
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(168,85,247,0.4) transparent',
          }}
        >
          <HStack gap={2} flexShrink={0} pb="2px">
            {Object.keys(COMMANDS).map(cmd => (
              <Box
                key={cmd}
                as="button"
                onClick={() => { run(cmd); setInput('') }}
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
              >
                {cmd}
              </Box>
            ))}
          </HStack>
        </Box>
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
        <Text color="purple.400" fontFamily="mono" fontSize="xs" flexShrink={0}>
          &gt;
        </Text>
        {/* Ghost text container — positioned relative so suggestion overlays the input */}
        <Box position="relative" flex={1} display="flex" alignItems="center">
          {/* Ghost suggestion (rendered behind input text) */}
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
            placeholder={input ? '' : (locale === 'es' ? 'escribe un comando...' : 'type a command...')}
            _placeholder={{ color: 'gray.600' }}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            position="relative"
            zIndex={1}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default MiniTerminal
