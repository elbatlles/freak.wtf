import type { NextApiRequest, NextApiResponse } from 'next'
import { createGateway } from '@ai-sdk/gateway'
import { streamText } from 'ai'
import { selectMemoryContext, loadSystemPrompt } from '../../../lib/memory'
import { Langfuse } from 'langfuse'

const getLangfuse = () => {
  if (!process.env.LANGFUSE_SECRET_KEY || !process.env.LANGFUSE_PUBLIC_KEY) return null
  return new Langfuse({
    secretKey: process.env.LANGFUSE_SECRET_KEY,
    publicKey: process.env.LANGFUSE_PUBLIC_KEY,
    baseUrl: process.env.LANGFUSE_BASE_URL ?? 'https://us.cloud.langfuse.com',
    flushAt: 1,
  })
}

const gateway = createGateway({ apiKey: process.env.AI_GATEWAY_API_KEY })
const chatModel = (id: string) => gateway(`openai/${id}`)

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const locale = req.body?.locale === 'es' ? 'es' : 'en'
  const rawMessages: unknown[] = Array.isArray(req.body?.messages) ? req.body.messages : []

  // Sanitize: only user/assistant roles, string content, max 2000 chars, max 30 messages
  const messages: ChatMessage[] = rawMessages
    .filter(
      (m): m is Record<string, unknown> =>
        m !== null &&
        typeof m === 'object' &&
        typeof (m as Record<string, unknown>).role === 'string' &&
        typeof (m as Record<string, unknown>).content === 'string'
    )
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .map(m => ({
      role: m.role as 'user' | 'assistant',
      content: String(m.content).slice(0, 2000),
    }))
    .slice(-30)

  if (messages.length === 0 || messages[messages.length - 1].role !== 'user') {
    return res.status(400).json({
      message: locale === 'es' ? 'Falta el mensaje del usuario.' : 'Missing user message.',
    })
  }

  if (!process.env.AI_GATEWAY_API_KEY) {
    return res.status(503).json({
      message: locale === 'es' ? 'Servicio no disponible.' : 'Service unavailable.',
    })
  }

  // Retrieve relevant memory context for the latest user message
  const lastUserMessage = messages[messages.length - 1].content
  const { docs } = await selectMemoryContext(lastUserMessage, 4)
  const baseSystem = loadSystemPrompt(locale)
  const memoryContext = docs
    .map(doc => `${doc.id} | ${doc.title} | ${doc.period}\n${doc.body}`)
    .join('\n\n')
  const system = memoryContext
    ? `${baseSystem}\n\nMemory context:\n${memoryContext}`
    : baseSystem

  const lf = getLangfuse()
  const lfTrace = lf?.trace({
    name: 'terminal-invoke',
    input: { query: lastUserMessage, locale, turns: messages.length, docs: docs.map(d => d.id) },
  })

  try {
    const result = streamText({
      model: chatModel(process.env.OPENAI_MODEL || 'gpt-4o-mini'),
      system,
      messages,
      temperature: 0.65,
      abortSignal: AbortSignal.timeout(30000),
      providerOptions: {
        gateway: {
          models: ['groq/llama-3.3-70b-instruct'],
        },
      },
    })

    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache, no-transform')
    res.statusCode = 200

    let fullResponse = ''
    for await (const chunk of result.textStream) {
      fullResponse += chunk
      res.write(chunk)
    }

    lfTrace?.update({ output: { answer: fullResponse } })
    if (lf) await lf.flushAsync()

    res.end()
  } catch {
    lfTrace?.update({ output: { error: true } })
    if (lf) await lf.flushAsync()

    if (!res.headersSent) {
      return res.status(500).json({
        message: locale === 'es' ? 'Error al conectar. Inténtalo de nuevo.' : 'Connection error. Please try again.',
      })
    }
    res.end()
  }
}
