import { Box, Text } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'

const HOST = 'angel@freak.wtf:~$'

interface Step {
  cmd: string
  output: string[]
}

const SCRIPT: Record<string, Step[]> = {
  es: [
    {
      cmd: 'whoami',
      output: [
        '  Angel Batlles — ingeniero de software, Barcelona.',
        '  10+ años construyendo productos que aguantan presión real.',
        '  Actualmente en Travelport. Antes lanzando startups de cero.',
      ]
    },
    {
      cmd: 'cat now.txt',
      output: [
        '  SDK y workflows de producto a escala.',
        '  IA aplicada a interfaces con memoria.',
        '  Siempre automatizando algo.',
      ]
    },
    {
      cmd: 'ls skills/',
      output: [
        '  TypeScript   React     Next.js   Node.js',
        '  Three.js     Python    Docker    LLMs',
      ]
    },
    {
      cmd: 'cat contact.txt',
      output: [
        '  github.com/elbatlles',
        '  linkedin.com/in/abatlles',
        '  o pregúntame en vivo → /terminal',
      ]
    },
  ],
  en: [
    {
      cmd: 'whoami',
      output: [
        '  Angel Batlles — software engineer, Barcelona.',
        '  10+ years building products that hold up under pressure.',
        '  Currently at Travelport. Previously shipped startups from zero.',
      ]
    },
    {
      cmd: 'cat now.txt',
      output: [
        '  Product SDK and workflows at scale.',
        '  AI-driven interfaces. Memory-first UX.',
        '  Always automating something.',
      ]
    },
    {
      cmd: 'ls skills/',
      output: [
        '  TypeScript   React     Next.js   Node.js',
        '  Three.js     Python    Docker    LLMs',
      ]
    },
    {
      cmd: 'cat contact.txt',
      output: [
        '  github.com/elbatlles',
        '  linkedin.com/in/abatlles',
        '  or ask me live → /terminal',
      ]
    },
  ]
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

interface Props {
  locale?: string
  h?: string | object
}

export default function MobileInterview({ locale = 'es', h = '360px' }: Props) {
  const script = SCRIPT[locale] ?? SCRIPT.es

  const [completedSteps, setCompletedSteps] = useState<Step[]>([])
  const [typedCmd, setTypedCmd] = useState('')
  const [revealedLines, setRevealedLines] = useState<string[]>([])
  const [finished, setFinished] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const cancelledRef = useRef(false)

  // Auto-scroll to bottom as content appears — runs after every render intentionally
  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  })

  useEffect(() => {
    cancelledRef.current = false
    const tids: ReturnType<typeof setTimeout>[] = []

    const schedule = (fn: () => void, delay: number) => {
      const tid = setTimeout(() => {
        if (!cancelledRef.current) fn()
      }, delay)
      tids.push(tid)
    }

    let t = 400 // initial pause before first command

    for (let si = 0; si < script.length; si++) {
      const step = script[si]

      // Type the command character by character
      for (let ci = 1; ci <= step.cmd.length; ci++) {
        const chars = ci
        schedule(() => setTypedCmd(step.cmd.slice(0, chars)), t)
        t += ci === 1 ? 60 : 45
      }

      // Brief pause after full command appears (simulates Enter)
      t += 180

      // Reveal output lines
      for (let li = 0; li < step.output.length; li++) {
        const line = step.output[li]
        schedule(() => setRevealedLines(prev => [...prev, line]), t)
        t += 70
      }

      // Pause, then commit step and reset current state
      t += si === script.length - 1 ? 400 : 800
      const stepSnapshot = step
      schedule(() => {
        setCompletedSteps(prev => [...prev, stepSnapshot])
        setTypedCmd('')
        setRevealedLines([])
      }, t)
      t += 80
    }

    // Show final blinking cursor
    schedule(() => setFinished(true), t)

    return () => {
      cancelledRef.current = true
      tids.forEach(clearTimeout)
    }
  }, [script])

  return (
    <Box
      fontFamily="mono"
      fontSize="sm"
      bg="#0d0d10"
      borderRadius="xl"
      border="1px solid"
      borderColor="rgba(255,255,255,0.08)"
      overflow="hidden"
      h={h}
      display="flex"
      flexDirection="column"
    >
      {/* Title bar */}
      <Box
        px={4}
        py={2}
        bg="rgba(255,255,255,0.04)"
        borderBottom="1px solid"
        borderColor="rgba(255,255,255,0.06)"
        display="flex"
        alignItems="center"
        gap={2}
        flexShrink={0}
      >
        <Box w="10px" h="10px" borderRadius="full" bg="rgba(255,95,86,0.7)" />
        <Box w="10px" h="10px" borderRadius="full" bg="rgba(255,189,46,0.7)" />
        <Box w="10px" h="10px" borderRadius="full" bg="rgba(39,201,63,0.7)" />
        <Text color="gray.600" fontSize="xs" ml={2} userSelect="none">
          angel@freak.wtf
        </Text>
      </Box>

      {/* Content */}
      <Box
        ref={scrollRef}
        flex={1}
        overflowY="auto"
        p={4}
        css={{
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none'
        }}
      >
        {/* Completed steps */}
        {completedSteps.map(step => (
          <Box key={step.cmd} mb={3}>
            <Text color="gray.100" mb="2px">
              <Text as="span" color="rgba(168,85,247,0.7)" userSelect="none">
                {HOST}{' '}
              </Text>
              {step.cmd}
            </Text>
            {step.output.map(line => (
              <Text
                key={`${step.cmd}:${line}`}
                color="green.300"
                whiteSpace="pre-wrap"
                lineHeight={1.6}
              >
                {line}
              </Text>
            ))}
          </Box>
        ))}

        {/* Current step being animated */}
        {!finished && (
          <Box mb={2}>
            <Text color="gray.100" mb="2px">
              <Text as="span" color="rgba(168,85,247,0.7)" userSelect="none">
                {HOST}{' '}
              </Text>
              {typedCmd}
              {revealedLines.length === 0 && <BlinkingCursor />}
            </Text>
            {revealedLines.map(line => (
              <Text
                key={line}
                color="green.300"
                whiteSpace="pre-wrap"
                lineHeight={1.6}
              >
                {line}
              </Text>
            ))}
          </Box>
        )}

        {/* Final blinking prompt */}
        {finished && (
          <Text color="gray.100">
            <Text as="span" color="rgba(168,85,247,0.7)" userSelect="none">
              {HOST}{' '}
            </Text>
            <BlinkingCursor />
          </Text>
        )}
      </Box>
    </Box>
  )
}
