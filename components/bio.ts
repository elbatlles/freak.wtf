import { Box } from '@chakra-ui/react'
import React from 'react'

export const BioSection = (props: React.ComponentProps<typeof Box>) =>
  React.createElement(Box, { pl: '3.4em', textIndent: '-3.4em', ...props })

export const BioYear = (props: React.HTMLAttributes<HTMLSpanElement>) =>
  React.createElement('span', {
    style: { fontWeight: 'bold', marginRight: '1em' },
    ...props
  })
