import { useState, useRef, useEffect, KeyboardEvent, useCallback } from 'react'
import { useRouter } from 'next/router'
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

const COMMANDS = ['ask', 'invoke', 'whoami', 'skills', 'experience', 'contact', 'secret', 'clear', 'help']

const ROOT_COMMANDS_EN = {
  help: [
    '  [angel@freak] — elevated access.',
    '  Extra commands:',
    '  status → active projects & WIP',
    '  env → dev environment & setup',
    '  cv → resume / curriculum',
    '  invoke → open chat mode',
    '  exit → back to guest mode',
    '',
    '  All guest commands still work.',
  ],
  status: [
    '  ── Active projects ──────────────────────────────',
    '  ai-dev-flow     Multi-agent AI system for software development workflows.',
    '                  Orchestrator coordinates specialized agents (reviewer,',
    '                  critic) to automate code review, validation & iteration.',
    '                  Vision-capable with token management.',
    '',
    '  beefy-guardian  Automated DeFi portfolio manager for Beefy Finance.',
    '                  Monitors vault APYs, auto-compounds rewards and',
    '                  rebalances positions using a LAZY HIGH yield strategy.',
    '  ─────────────────────────────────────────────────',
  ],
  env: [
    '  ── Dev Environment ──────────────────────────────',
    '  OS:       NixOS (declarative, reproducible)',
    '  Editor:   VS Code + Copilot',
    '  Shell:    Zsh + Nix flakes',
    '  WM:       Hyprland',
    '  Lang:     TypeScript, Nix',
    '  Config:   github.com/elbatlles/nixos-config',
    '  ─────────────────────────────────────────────────',
  ],
  cv: [
    '  ── Curriculum Vitae ─────────────────────────────',
    '  Angel Batlles — Software Engineer',
    '  Barcelona · angelbatlles@gmail.com',
    '',
    '  2022–now   Travelport — Software Development Engineer',
    '             JS, TypeScript, React, Node.js, C#, Bash',
    '  2021–2022  Freelance — Full Stack Developer',
    '             React, Next.js, TailwindCSS, Node.js, Strapi',
    '  2020–2021  Kumux — Frontend Developer',
    '             React, Gatsby.js, Styled Components',
    '  2012–2020  Grafix Gestió Informàtica — Web Developer',
    '             PHP, JavaScript, WordPress, PrestaShop, jQuery',
    '',
    '  Education:',
    '  2009–2013  DAI – IES Carles Vallbona, Granollers',
    '  2006–2008  ESI – IES Carles Vallbona, Granollers',
    '',
    '  Full CV → overleaf.com/read/jsnwfqpjpwtg#c8b1ed',
    '  ─────────────────────────────────────────────────',
  ],
}

const ROOT_COMMANDS_ES = {
  help: [
    '  [angel@freak] — acceso elevado.',
    '  Comandos extra:',
    '  status → proyectos activos y WIP',
    '  env → entorno de desarrollo',
    '  cv → curriculum vitae',
    '  invoke → abrir modo chat',
    '  exit → volver a modo guest',
    '',
    '  Los comandos de guest siguen activos.',
  ],
  status: [
    '  ── Proyectos activos ────────────────────────────',
    '  ai-dev-flow     Sistema multi-agente de IA para workflows de desarrollo.',
    '                  Un orquestador coordina agentes especializados (revisor,',
    '                  crítico) para automatizar revisión, validación e iteración.',
    '                  Con capacidad de visión y gestión de tokens.',
    '',
    '  beefy-guardian  Gestor automático de portfolio DeFi en Beefy Finance.',
    '                  Monitoriza APYs de vaults, auto-compone recompensas y',
    '                  rebalancea posiciones con estrategia LAZY HIGH.',
    '  ─────────────────────────────────────────────────',
  ],
  env: [
    '  ── Entorno de desarrollo ────────────────────────',
    '  OS:       NixOS (declarativo, reproducible)',
    '  Editor:   VS Code + Copilot',
    '  Shell:    Zsh + Nix flakes',
    '  WM:       Hyprland',
    '  Lang:     TypeScript, Nix',
    '  Config:   github.com/elbatlles/nixos-config',
    '  ─────────────────────────────────────────────────',
  ],
  cv: [
    '  ── Curriculum Vitae ─────────────────────────────',
    '  Angel Batlles — Software Engineer',
    '  Barcelona · angelbatlles@gmail.com',
    '',
    '  2022–hoy   Travelport — Software Development Engineer',
    '             JS, TypeScript, React, Node.js, C#, Bash',
    '  2021–2022  Freelance — Full Stack Developer',
    '             React, Next.js, TailwindCSS, Node.js, Strapi',
    '  2020–2021  Kumux — Frontend Developer',
    '             React, Gatsby.js, Styled Components',
    '  2012–2020  Grafix Gestió Informàtica — Web Developer',
    '             PHP, JavaScript, WordPress, PrestaShop, jQuery',
    '',
    '  Formación:',
    '  2009–2013  DAI – IES Carles Vallbona, Granollers',
    '  2006–2008  ESI – IES Carles Vallbona, Granollers',
    '',
    '  CV completo → overleaf.com/read/jsnwfqpjpwtg#c8b1ed',
    '  ─────────────────────────────────────────────────',
  ],
}

const DICT = {
  en: {
    banner: 'angel@freak.wtf',
    boot: [],
    help: [
      '  Available commands:',
      '  ask <question> → about my work',
      '  whoami → who is Angel',
      '  skills → tech stack',
      '  experience → work history',
      '  contact → how to reach me',
      '  secret → 👀',
      '  clear → clear terminal',
      '  help → show this help'
    ],
    static: {
      whoami: [
        '  Angel Batlles — software engineer, Barcelona.',
        '  10+ years building products: from startup MVPs to platform SDKs at Travelport.',
        '  I care about clarity, velocity, and software that actually holds up under pressure.',
        '  Currently exploring AI-assisted interfaces and memory-driven UX.',
      ],
      skills: [
        '  Languages:   TypeScript, JavaScript, Python',
        '  Frontend:    React, Next.js, Chakra UI, Three.js',
        '  Backend:     Node.js, REST, GraphQL',
        '  Tooling:     Git, Docker, CI/CD, Turbopack',
        '  AI/ML:       OpenAI API, prompt engineering, RAG patterns',
      ],
      experience: [
        '  2022–now   Travelport — Senior Frontend Engineer',
        '             SDK, plugin workflows, platform-scale UI',
        '  2021       Freelance — Startup MVPs and product consulting',
        '  2020–2021  Kumux — Frontend & data visualization',
        '  2003       First computer. Never looked back.',
      ],
      contact: [
        '  GitHub    → github.com/elbatlles',
        '  LinkedIn  → linkedin.com/in/abatlles',
        '  X         → x.com/elbatlles',
        '  Or just use ask — I\'m right here.',
      ],
      secret: [
        '  You found it.',
        '  No magic prize, just proof you read the help.',
        '  That already puts you in the top 5%.',
        '',
        '  ...though if you really want to go deeper, try the su command',
      ],
    },
    placeholders: {
      input: 'type a command...',
      ask: 'Usage: ask <question>',
      commandNotFound: (cmd: string, suggestion?: string) =>
        suggestion
          ? `command not found: ${cmd}. Did you mean "${suggestion}"?`
          : `command not found: ${cmd}. Try "help".`,
      recovering: 'thinking...',
      timeout: 'Could not reach memory right now. Try again.',
      limited: 'low confidence match — try rephrasing.'
    },
    examples: [
      'ask who is Angel?',
      'whoami',
      'ask what does he work on?',
      'experience',
      'skills',
      'ask what are his side projects?',
      'contact',
    ]
  },
  es: {
    banner: 'angel@freak.wtf',
    boot: [],
    help: [
      '  Comandos disponibles:',
      '  ask <pregunta> → sobre mí',
      '  whoami → quién es Angel',
      '  skills → stack tecnológico',
      '  experience → historial',
      '  contact → contactarme',
      '  secret → 👀',
      '  clear → limpiar terminal',
      '  help → mostrar ayuda'
    ],
    static: {
      whoami: [
        '  Angel Batlles — software engineer, Barcelona.',
        '  +10 años construyendo productos: desde MVPs de startup hasta SDKs a escala en Travelport.',
        '  Me importan la claridad, la velocidad y el software que aguanta bajo presión.',
        '  Ahora explorando interfaces con IA y UX basada en memoria.',
      ],
      skills: [
        '  Lenguajes:   TypeScript, JavaScript, Python',
        '  Frontend:    React, Next.js, Chakra UI, Three.js',
        '  Backend:     Node.js, REST, GraphQL',
        '  Tooling:     Git, Docker, CI/CD, Turbopack',
        '  IA/ML:       OpenAI API, prompt engineering, patrones RAG',
      ],
      experience: [
        '  2022–hoy   Travelport — Senior Frontend Engineer',
        '             SDK, plugin workflows, UI a escala de plataforma',
        '  2021       Freelance — MVPs de startup y consultoría de producto',
        '  2020–2021  Kumux — Frontend y visualización de datos',
        '  2003       Mi primer ordenador. No he parado desde entonces.',
      ],
      contact: [
        '  GitHub    → github.com/elbatlles',
        '  LinkedIn  → linkedin.com/in/abatlles',
        '  X         → x.com/elbatlles',
        '  O usa ask — estoy aquí.',
      ],
      secret: [
        '  Lo encontraste.',
        '  No hay premio, solo prueba de que lees el help.',
        '  Eso ya te pone en el top 5%.',
        '',
        '  ...aunque si quieres ir más lejos, prueba el comando su',
      ],
    },
    placeholders: {
      input: 'escribe un comando...',
      ask: 'Uso: ask <pregunta>',
      commandNotFound: (cmd: string, suggestion?: string) =>
        suggestion
          ? `comando no encontrado: ${cmd}. ¿Quizás "${suggestion}"?`
          : `comando no encontrado: ${cmd}. Prueba "help".`,
      recovering: 'pensando...',
      timeout: 'No pude responder ahora mismo. Inténtalo de nuevo.',
      limited: 'respuesta con baja confianza — intenta reformular.'
    },
    examples: [
      'ask ¿quién es Angel?',
      'whoami',
      'ask ¿en qué trabaja?',
      'experience',
      'skills',
      'ask ¿cuáles son sus proyectos?',
      'contact',
    ]
  }
}

const MiniTerminal = ({ introLines, h = { base: '320px', md: '300px' }, locale = 'en' }: MiniTerminalProps) => {
  const lang = locale === 'es' ? 'es' : 'en'
  const text = DICT[lang]
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
      const rootCmds = lang === 'es' ? ROOT_COMMANDS_ES : ROOT_COMMANDS_EN
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
      const rootCmds = lang === 'es' ? ROOT_COMMANDS_ES : ROOT_COMMANDS_EN
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
    const urlRegex = /(https?:\/\/\S+|[a-z0-9.-]+\.[a-z]{2,}\/[^\s]*)/gi
    const parts = content.split(urlRegex)
    if (parts.length === 1) return content
    return parts.map((part, i) => {
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
            {COMMANDS.map(cmd => (
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
