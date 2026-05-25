import { Box, Image, Portal, Text } from '@chakra-ui/react'
import type React from 'react'
import { useState } from 'react'
import { IMG_REGEX, LINK_STYLE, MD_LINK_REGEX, URL_REGEX } from './constants'
import type { Segment } from './types'

function ImageThumb({ src }: { src: string }) {
  const [open, setOpen] = useState(false)
  const [failed, setFailed] = useState(false)

  return (
    <>
      <Box
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        h="64px"
        minW="64px"
        borderRadius="md"
        mt={1}
        cursor="pointer"
        border="1px solid rgba(168,85,247,0.4)"
        bg={failed ? 'rgba(168,85,247,0.08)' : 'transparent'}
        onClick={() => !failed && setOpen(true)}
        style={{ verticalAlign: 'middle' }}
      >
        {failed ? (
          <Text fontSize="xl" userSelect="none" title={src}>
            🖼️
          </Text>
        ) : (
          <Image
            src={src}
            alt=""
            h="64px"
            borderRadius="md"
            onError={() => setFailed(true)}
          />
        )}
      </Box>

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

function parseSegments(text: string): Segment[] {
  const segments: Segment[] = []
  let last = 0
  let m: RegExpExecArray | null
  MD_LINK_REGEX.lastIndex = 0
  m = MD_LINK_REGEX.exec(text)
  while (m !== null) {
    if (m.index > last)
      segments.push({ type: 'text', value: text.slice(last, m.index) })
    const url = m[2]
    segments.push({
      type: m[0].startsWith('!') || IMG_REGEX.test(url) ? 'image' : 'link',
      value: url,
      label: m[1]
    })
    last = m.index + m[0].length
    m = MD_LINK_REGEX.exec(text)
  }
  if (last < text.length)
    segments.push({ type: 'text', value: text.slice(last) })
  return segments
}

export function renderWithLinks(text: string): React.ReactNode[] {
  return parseSegments(text).flatMap(seg => {
    if (seg.type === 'image') {
      return [<ImageThumb key={`img-${seg.value}`} src={seg.value} />]
    }
    if (seg.type === 'link') {
      return [
        <a
          key={`lnk-${seg.value}`}
          href={seg.value}
          target="_blank"
          rel="noopener noreferrer"
          style={LINK_STYLE}
        >
          {seg.label || seg.value}
        </a>
      ]
    }
    return seg.value.split(URL_REGEX).map(part => {
      if (!URL_REGEX.test(part)) return part
      URL_REGEX.lastIndex = 0
      const url = part.replace(/[.,!?;:]+$/, '')
      return IMG_REGEX.test(url) ? (
        <ImageThumb key={`ri-${url}`} src={url} />
      ) : (
        <a
          key={`rl-${url}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={LINK_STYLE}
        >
          {url}
        </a>
      )
    })
  })
}
