import { Box, Text } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'

const INIT = 'angel@freak.wtf — init'

interface InfoLine {
  label: string
  value: string
  cta?: boolean
}

const CONTENT: Record<string, InfoLine[]> = {
  es: [
    { label: 'who', value: 'Angel Batlles · Barcelona' },
    { label: 'now', value: 'SDK · IA · automation' },
    { label: 'stack', value: 'TS · React · Node · LLMs' },
    { label: 'meet', value: '/terminal — habla conmigo', cta: true },
  ],
  en: [
    { label: 'who', value: 'Angel Batlles · Barcelona' },
    { label: 'now', value: 'SDK · AI · automation' },
    { label: 'stack', value: 'TS · React · Node · LLMs' },
    { label: 'meet', value: '/terminal — talk to me', cta: true },
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
      ml="2px"
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
  const lines = CONTENT[locale] ?? CONTENT.es

  const [headerChars, setHeaderChars] = useState(0)
  const [revealedCount, setRevealedCount] = useState(0)
  const [finished, setFinished] = useState(false)
  const cancelledRef = useRef(false)

  useEffect(() => {
    cancelledRef.current = false
    const tids: ReturnType<typeof setTimeout>[] = []

    const schedule = (fn: () => void, delay: number) => {
      const tid = setTimeout(() => {
        if (!cancelledRef.current) fn()
      }, delay)
      tids.push(tid)
    }

    let t = 400

    // Type the init line
    for (let i = 1; i <= INIT.length; i++) {
      const n = i
      schedule(() => setHeaderChars(n), t)
      t += 36
    }

    t += 480

    // Reveal info lines one by one
    for (let i = 1; i <= lines.length; i++) {
      const n = i
      schedule(() => setRevealedCount(n), t)
      t += 400
    }

    schedule(() => setFinished(true), t + 100)

    return () => {
      cancelledRef.current = true
      tids.forEach(clearTimeout)
    }
  }, [lines])

  const headerDone = headerChars >= INIT.length

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
      {/* macOS-style title bar */}
      <Box
        px={4}
        py="10px"
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
      </Box>

      {/* Content — vertically centered, no scroll */}
      <Box
        flex={1}
        px={4}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        gap={5}
      >
        {/* Init line with typing effect */}
        <Text color="purple.300" letterSpacing="tight" lineHeight={1}>
          {INIT.slice(0, headerChars)}
          {!headerDone && <BlinkingCursor />}
        </Text>

        {/* Info rows */}
        <Box display="flex" flexDirection="column" gap="12px">
          {lines.slice(0, revealedCount).map(line => (
            <Box key={line.label} display="flex" gap={2} alignItems="baseline">
              <Text
                as="span"
                color="gray.600"
                flexShrink={0}
                fontSize="11px"
                w="40px"
              >
                {line.label}
              </Text>
              <Text
                color={line.cta ? 'purple.300' : 'gray.100'}
                fontSize="sm"
                lineHeight={1.4}
              >
                {line.value}
              </Text>
            </Box>
          ))}
        </Box>

        {/* Blinking cursor after all lines */}
        {finished && <BlinkingCursor />}
      </Box>
    </Box>
  )
}
