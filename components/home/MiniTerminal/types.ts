export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  streaming?: boolean
}

export interface MiniTerminalProps {
  h?: string | object
  locale?: string
}

export type Segment = {
  type: 'text' | 'link' | 'image'
  value: string
  label?: string
}
