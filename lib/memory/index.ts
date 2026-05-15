import fs from 'fs'
import path from 'path'
import { globSync } from 'glob'
import matter from 'gray-matter'
import { createGateway } from '@ai-sdk/gateway'
import { embed, cosineSimilarity, generateText } from 'ai'

const gateway = createGateway({ apiKey: process.env.AI_GATEWAY_API_KEY })
const chatModel = (id: string) => gateway(`openai/${id}`)
const embeddingModel = () => gateway.textEmbeddingModel('openai/text-embedding-3-small')

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
const parsedTimeout = Number(process.env.OPENAI_TIMEOUT_MS || DEFAULT_MODEL_TIMEOUT_MS)
const MODEL_TIMEOUT_MS =
  Number.isFinite(parsedTimeout) && parsedTimeout >= 1000 && parsedTimeout <= 60000
    ? parsedTimeout
    : DEFAULT_MODEL_TIMEOUT_MS

const normalize = (value: string) => value.toLowerCase().trim()

const stripMarkdown = (value: string) => value
  .replace(/```[\s\S]*?```/g, ' ')
  .replace(/`([^`]+)`/g, '$1')
  .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
  .replace(/[>#*_~-]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

const asArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === 'string' && value.trim()) return [value]
  return []
}



// --- Caches ---

let documentCache: MemoryDocument[] | null = null
let systemPromptCache: Partial<Record<'en' | 'es', string>> = {}
let embeddingStore: { id: string; embedding: number[] }[] | null = null

export const loadSystemPrompt = (locale: 'en' | 'es'): string => {
  if (systemPromptCache[locale]) return systemPromptCache[locale]!
  const filePath = path.join(MEMORY_ROOT, 'core', `system-prompt.${locale}.md`)
  if (!fs.existsSync(filePath)) return ''
  const { content } = matter(fs.readFileSync(filePath, 'utf8'))
  systemPromptCache[locale] = content.trim()
  return systemPromptCache[locale]!
}

const loadEmbeddingStore = () => {
  if (embeddingStore) return embeddingStore
  const p = path.join(MEMORY_ROOT, 'embeddings.json')
  if (!fs.existsSync(p)) return []
  embeddingStore = JSON.parse(fs.readFileSync(p, 'utf8'))
  return embeddingStore!
}

export const loadMemoryDocuments = (): MemoryDocument[] => {
  if (documentCache) return documentCache

  documentCache = globSync('**/*.md', { cwd: MEMORY_ROOT, absolute: true })
    .filter(f => !path.basename(f).startsWith('system-prompt'))
    .map(filePath => {
      const { data, content } = matter(fs.readFileSync(filePath, 'utf8'))
      const dir = path.basename(path.dirname(filePath))
      const type: MemoryType =
        dir === 'projects' ? 'project' :
        dir === 'notes' ? 'note' :
        dir === 'timeline' ? 'timeline' : 'core'

      return {
        id: String(data.id || path.basename(filePath, '.md')),
        title: String(data.title || path.basename(filePath, '.md')),
        type: (data.type as MemoryType) || type,
        period: String(data.period || 'unknown'),
        themes: asArray(data.themes).map(normalize),
        signals: asArray(data.signals).map(normalize).filter(Boolean) as IntentSignal[],
        priority: Number(data.priority || 3),
        confidence: (data.confidence as 'high' | 'medium' | 'low') || 'medium',
        body: stripMarkdown(content),
        sourcePath: filePath.replace(`${process.cwd()}/`, ''),
      }
    })

  return documentCache
}

const pickConfidence = (score: number): 'high' | 'medium' | 'low' =>
  score >= 0.20 ? 'high' : score >= 0.12 ? 'medium' : 'low'

export const selectMemoryContext = async (
  query: string,
  count = 4
): Promise<{ docs: MemoryDocument[]; confidence: 'high' | 'medium' | 'low' }> => {
  const docs = loadMemoryDocuments()
  const store = loadEmbeddingStore()

  const { embedding: queryEmbedding } = await embed({
    model: embeddingModel(),
    value: query,
  })

  const sorted = docs
    .map(doc => {
      const entry = store.find(e => e.id === doc.id)
      return { doc, score: entry ? cosineSimilarity(queryEmbedding, entry.embedding) : 0 }
    })
    .sort((a, b) => b.score - a.score)

  const selected = sorted.slice(0, count)
  return {
    docs: selected.map(s => s.doc),
    confidence: pickConfidence(selected[0]?.score ?? 0),
  }
}

const generateAnswer = async (
  query: string,
  docs: MemoryDocument[],
  trace: boolean,
  locale: 'en' | 'es'
): Promise<string | null> => {
  if (!process.env.AI_GATEWAY_API_KEY) return null

  const system = loadSystemPrompt(locale)
  if (!system) return null

  const context = docs
    .map(doc => `${doc.id} | ${doc.title} | ${doc.period}\n${doc.body}`)
    .join('\n\n')

  const prompt = trace
    ? `Topic to trace through my experience: ${query}\n\nMemory context:\n${context}`
    : `${query}\n\nRelevant context from my memory:\n${context}`

  try {
    const { text } = await generateText({
      model: chatModel(process.env.OPENAI_MODEL || 'gpt-4o-mini'),
      system,
      prompt,
      temperature: 0.4,
      abortSignal: AbortSignal.timeout(MODEL_TIMEOUT_MS),
      providerOptions: {
        gateway: {
          models: ['groq/llama-3.3-70b-instruct'],
        },
      },
    })
    return text?.trim() || null
  } catch {
    return null
  }
}

export const askMemory = async (
  query: string,
  options?: { trace?: boolean; locale?: string }
): Promise<RetrievalResult> => {
  const safeQuery = String(query || '').trim().slice(0, 500)
  const trace = Boolean(options?.trace)
  const locale = options?.locale === 'es' ? 'es' : 'en'

  const { docs, confidence } = await selectMemoryContext(safeQuery, trace ? 6 : 4)
  const answer = await generateAnswer(safeQuery, docs, trace, locale) ??
    (locale === 'es'
      ? 'No pude generar una respuesta. Comprueba la configuración del gateway.'
      : 'Could not generate a response. Check the gateway configuration.')

  return {
    answer,
    sources: docs.map(d => d.id),
    confidence,
    limitedMatch: confidence === 'low',
  }
}

