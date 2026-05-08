import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type MemoryType = 'core' | 'timeline' | 'project' | 'note'
export type IntentSignal = 'technical' | 'product' | 'personal' | 'reflective'

export interface MemoryDocument {
  id: string
  title: string
  type: MemoryType
  period: string
  themes: string[]
  signals: IntentSignal[]
  priority: number
  confidence: 'high' | 'medium' | 'low'
  body: string
  sourcePath: string
}

export interface RetrievalResult {
  answer: string
  sources: string[]
  confidence: 'high' | 'medium' | 'low'
  limitedMatch: boolean
}

const MEMORY_ROOT = path.join(process.cwd(), 'content', 'memory')
const DEFAULT_MODEL_TIMEOUT_MS = 15000
const MIN_MODEL_TIMEOUT_MS = 1000
const MAX_MODEL_TIMEOUT_MS = 60000
const parsedTimeout = Number(process.env.OPENAI_TIMEOUT_MS || DEFAULT_MODEL_TIMEOUT_MS)
const MODEL_TIMEOUT_MS =
  Number.isFinite(parsedTimeout) &&
  parsedTimeout >= MIN_MODEL_TIMEOUT_MS &&
  parsedTimeout <= MAX_MODEL_TIMEOUT_MS
    ? parsedTimeout
    : DEFAULT_MODEL_TIMEOUT_MS

let cache: MemoryDocument[] | null = null

const SIGNAL_TERMS: Record<IntentSignal, string[]> = {
  technical: [
    'api', 'sdk', 'architecture', 'technical', 'engineer', 'engineering', 'code', 'ci',
    'backend', 'frontend', 'performance', 'debug', 'stack', 'design system', 'typescript',
    'arquitectura', 'ingeniería', 'código', 'rendimiento', 'depurar', 'sistema'
  ],
  product: [
    'product', 'ux', 'user', 'experiment', 'mvp', 'funnel', 'adoption', 'market', 'decision',
    'scope', 'onboarding', 'usability', 'feature', 'producto', 'usuarios', 'experimento',
    'negocio', 'validación', 'iteración'
  ],
  personal: [
    'personal', 'life', 'family', 'emotion', 'feel', 'grew', 'change', 'timeline', 'memory',
    'travel', 'sport', 'crossfit', 'persona', 'vida', 'familia', 'emocional', 'cambio',
    'recuerdo', 'viaje', 'deporte'
  ],
  reflective: [
    'why', 'lesson', 'mistake', 'tradeoff', 'trade-off', 'learn', 'reflection', 'opinion',
    'philosophy', 'principle', 'insight', 'risk', 'por qué', 'lección', 'error', 'aprendizaje',
    'reflexión', 'principio', 'riesgo', 'criterio'
  ]
}

const yearRangeRegex = /\b(19|20)\d{2}(?:\s*-\s*(19|20)\d{2})?\b/

const asArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === 'string' && value.trim()) return [value]
  return []
}

const normalize = (value: string) => value.toLowerCase().trim()
const extractSnippet = (body: string, sentenceCount = 1) =>
  body.split('. ').slice(0, sentenceCount).join('. ').trim()

const stripMarkdown = (value: string) => value
  .replace(/```[\s\S]*?```/g, ' ')
  .replace(/`([^`]+)`/g, '$1')
  .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
  .replace(/[>#*_~-]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

const walk = (dir: string): string[] => {
  if (!fs.existsSync(dir)) return []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  return entries.flatMap(entry => {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(fullPath)
    if (entry.isFile() && fullPath.endsWith('.md')) return [fullPath]
    return []
  })
}

export const loadMemoryDocuments = (): MemoryDocument[] => {
  if (cache) return cache

  const files = walk(MEMORY_ROOT)
  cache = files.map(filePath => {
    const raw = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(raw)
    const inferredType = path.basename(path.dirname(filePath))

    const mappedType: MemoryType = inferredType === 'projects'
      ? 'project'
      : inferredType === 'notes'
      ? 'note'
      : inferredType === 'timeline'
      ? 'timeline'
      : 'core'

    return {
      id: String(data.id || path.basename(filePath, '.md')),
      title: String(data.title || path.basename(filePath, '.md')),
      type: (data.type as MemoryType) || mappedType,
      period: String(data.period || 'unknown'),
      themes: asArray(data.themes).map(normalize),
      signals: asArray(data.signals).map(normalize).filter(Boolean) as IntentSignal[],
      priority: Number(data.priority || 3),
      confidence: (data.confidence as 'high' | 'medium' | 'low') || 'medium',
      body: stripMarkdown(content),
      sourcePath: filePath.replace(`${process.cwd()}/`, '')
    }
  })

  return cache
}

const inferIntent = (query: string): Record<IntentSignal, number> => {
  const q = normalize(query)
  const score: Record<IntentSignal, number> = {
    technical: 0,
    product: 0,
    personal: 0,
    reflective: 0
  }

  ;(Object.keys(SIGNAL_TERMS) as IntentSignal[]).forEach(signal => {
    SIGNAL_TERMS[signal].forEach(term => {
      if (q.includes(term)) score[signal] += 1
    })
  })

  const total = Object.values(score).reduce((acc, curr) => acc + curr, 0)
  if (total === 0) {
    score.reflective = 1
    score.product = 0.5
    return score
  }

  return score
}

const inferThemes = (query: string): string[] => normalize(query)
  .split(/\W+/)
  .filter(token => token.length > 3)

const parsePeriodRange = (query: string): { from?: number; to?: number } => {
  const match = query.match(yearRangeRegex)
  const firstMatch = match?.[0]
  if (!firstMatch) return {}

  const numbers = firstMatch.split('-').map(n => Number(n.trim()))
  if (numbers.length === 1 && numbers[0]) return { from: numbers[0], to: numbers[0] }
  if (numbers.length === 2 && numbers[0] && numbers[1]) {
    return { from: Math.min(numbers[0], numbers[1]), to: Math.max(numbers[0], numbers[1]) }
  }

  return {}
}

const periodScore = (period: string, range: { from?: number; to?: number }) => {
  if (!range.from || !range.to) return 0
  const year = Number(period.slice(0, 4))
  if (Number.isNaN(year)) return 0
  return year >= range.from && year <= range.to ? 2 : 0
}

const signalScore = (
  signals: IntentSignal[],
  intentWeight: Record<IntentSignal, number>
): number => signals.reduce((sum, signal) => sum + (intentWeight[signal] || 0), 0)

const themeScore = (themes: string[], queryThemes: string[]): number => {
  if (queryThemes.length === 0) return 0
  let score = 0
  queryThemes.forEach(theme => {
    if (themes.some(t => t.includes(theme) || theme.includes(t))) score += 1
  })
  return score
}

const pickConfidence = (score: number): 'high' | 'medium' | 'low' => {
  if (score >= 7) return 'high'
  if (score >= 4) return 'medium'
  return 'low'
}

export const selectMemoryContext = (query: string, count = 4): { docs: MemoryDocument[]; confidence: 'high' | 'medium' | 'low' } => {
  const docs = loadMemoryDocuments()
  const intentWeight = inferIntent(query)
  const queryThemes = inferThemes(query)
  const range = parsePeriodRange(query)

  const scored = docs.map(doc => {
    const score =
      doc.priority * 0.8 +
      signalScore(doc.signals, intentWeight) * 1.4 +
      themeScore(doc.themes, queryThemes) * 1.2 +
      periodScore(doc.period, range)

    return { doc, score }
  })

  const core = scored
    .filter(item => item.doc.type === 'core')
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)

  const contextual = scored
    .filter(item => item.doc.type !== 'core')
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(1, count - core.length))

  const selected = [...core, ...contextual].sort((a, b) => b.score - a.score)
  const topScore = selected[0]?.score || 0

  return {
    docs: selected.map(item => item.doc),
    confidence: pickConfidence(topScore)
  }
}

const buildLocalAnswer = (
  query: string,
  docs: MemoryDocument[],
  trace = false,
  locale: 'en' | 'es' = 'en'
): string => {
  if (!docs.length) {
    return locale === 'es'
      ? 'Tengo una coincidencia de memoria limitada para esa pregunta. Prueba a acotar el tema con un año, un proyecto o una decisión concreta.'
      : 'I have a limited memory match for that question right now. Try narrowing the topic with a year, project name, or concrete decision.'
  }

  const intro = trace
    ? `Tracing "${query}" across memory:`
    : `Here is how I reason about "${query}":`

  const body = docs
    .map(doc => {
      const excerpt = extractSnippet(doc.body, 2)
      return `- ${doc.title}: ${excerpt}${excerpt.endsWith('.') ? '' : '.'}`
    })
    .join('\n')

  return `${intro}\n${body}`
}

const generateWithOpenAI = async (
  query: string,
  docs: MemoryDocument[],
  trace: boolean,
  locale: 'en' | 'es'
): Promise<string | null> => {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'
  const baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'

  const context = docs
    .map(doc => `${doc.id} | ${doc.title} | ${doc.period}\n${doc.body}`)
    .join('\n\n')

  const system = locale === 'es'
    ? 'Eres una interfaz de memoria personal coherente en el tiempo. No uses modos ni personajes. Responde con tono sobrio, introspectivo y concreto. Menciona tradeoffs y evolución cuando aplique.'
    : 'You are a coherent personal memory interface over time. Do not use modes or personas. Respond with a calm, introspective, concrete tone. Mention tradeoffs and evolution when relevant.'

  const userPrompt = trace
    ? `Trace this topic through memory:\n${query}\n\nMemory context:\n${context}`
    : `Question:\n${query}\n\nMemory context:\n${context}`

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), MODEL_TIMEOUT_MS)

  try {
    const res = await fetch(`${baseURL.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: userPrompt }
        ]
      }),
      signal: controller.signal
    })

    if (!res.ok) return null

    const json = await res.json()
    const content = json?.choices?.[0]?.message?.content
    return typeof content === 'string' && content.trim() ? content.trim() : null
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

export const askMemory = async (
  query: string,
  options?: { trace?: boolean; locale?: string }
): Promise<RetrievalResult> => {
  const safeQuery = String(query || '').trim().slice(0, 500)
  const trace = Boolean(options?.trace)
  const locale = options?.locale === 'es' ? 'es' : 'en'

  const { docs, confidence } = selectMemoryContext(safeQuery, trace ? 6 : 4)
  const modelOutput = await generateWithOpenAI(safeQuery, docs, trace, locale)
  const answer = modelOutput || buildLocalAnswer(safeQuery, docs, trace, locale)

  return {
    answer,
    sources: docs.map(doc => doc.id),
    confidence,
    limitedMatch: confidence === 'low'
  }
}

const compactLine = (doc: MemoryDocument) => {
  const snippet = extractSnippet(doc.body, 1)
  return `${doc.period} — ${doc.title}: ${snippet}${snippet.endsWith('.') ? '' : '.'}`
}

export const navigateMemory = (
  command: 'timeline' | 'projects' | 'notes',
  arg?: string
): { lines: string[]; sourceIds: string[] } => {
  const docs = loadMemoryDocuments()
  const filter = normalize(arg || '')

  const filtered = docs.filter(doc => {
    if (command === 'timeline' && doc.type !== 'timeline') return false
    if (command === 'projects' && doc.type !== 'project') return false
    if (command === 'notes' && doc.type !== 'note') return false
    if (!filter) return true

    const inMeta =
      doc.id.includes(filter) ||
      normalize(doc.title).includes(filter) ||
      normalize(doc.period).includes(filter) ||
      doc.themes.some(theme => theme.includes(filter))

    const inBody = normalize(doc.body).includes(filter)
    return inMeta || inBody
  })

  const sorted = filtered.sort((a, b) => b.period.localeCompare(a.period)).slice(0, 8)

  if (!sorted.length) {
    return {
      lines: [
        command === 'timeline'
          ? `No timeline memories found for "${arg}".`
          : command === 'projects'
          ? `No project memories found for "${arg}".`
          : `No notes found for "${arg}".`
      ],
      sourceIds: []
    }
  }

  return {
    lines: sorted.map(compactLine),
    sourceIds: sorted.map(doc => doc.id)
  }
}
