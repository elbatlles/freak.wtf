import React from 'react'

const Paragraph = (props: React.HTMLAttributes<HTMLParagraphElement>) =>
  React.createElement('p', {
    style: { textAlign: 'justify', textIndent: '1em', hyphens: 'auto' },
    ...props
  })

export default Paragraph
