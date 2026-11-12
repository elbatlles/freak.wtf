export const PROMPT = '[you@freak]~$'
export const RESPONSE = '[angel@freak]~'

export const URL_REGEX = /(https?:\/\/[^\s,)"\]]+)/g
export const IMG_REGEX = /\.(jpg|jpeg|png|gif|webp|svg)(\?[^\s,)]*)?$/i
export const MD_LINK_REGEX = /!?\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g

export const LINK_STYLE = {
  color: '#7deda4',
  textDecoration: 'underline',
  wordBreak: 'break-all'
} as const
