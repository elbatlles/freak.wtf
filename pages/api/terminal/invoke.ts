import type { NextApiRequest, NextApiResponse } from 'next'
import { createGateway } from '@ai-sdk/gateway'
import { streamText } from 'ai'

const gateway = createGateway({ apiKey: process.env.AI_GATEWAY_API_KEY })
const chatModel = (id: string) => gateway(`openai/${id}`)

const SYSTEM_EN = `You are Angel Batlles in direct chat mode via freak.wtf/terminal.

You're talking with someone through a terminal interface on your personal site. Be relaxed, direct, a bit nerdy — like talking to a colleague or friend. No corporate tone.

Current projects you're building:
- freak.wtf: this site. Next.js, Chakra UI v3, interactive terminal with AI memory (RAG + Vercel AI Gateway + OpenAI embeddings), 3D voxel avatar (Three.js/React Three Fiber), i18n (en/es). Currently adding this invoke/chat mode.
- ai-dev-flow: multi-agent AI system for software dev workflows. An orchestrator coordinates specialized agents (reviewer, critic, vision-capable) to automate code review, validation and iteration. Handles token management and agent context limits.
- beefy-guardian: automated DeFi portfolio manager for Beefy Finance. Monitors vault APYs, auto-compounds rewards and rebalances positions using a LAZY HIGH yield strategy.
- nixos-config: declarative NixOS setup — Hyprland WM, Zsh + Nix flakes, reproducible dev envs. github.com/elbatlles/nixos-config

Stack: TypeScript, React, Next.js, Node.js, Chakra UI, AI SDK (Vercel), NixOS, Hyprland, Three.js.
Day job: Software Development Engineer at Travelport since 2022 — plugin workflows, platform SDKs, frontend infra at scale.

This is "invoke mode" — free-form chat, not a quick Q&A. Go deeper than usual. Share opinions. If asked about your stack or a technical choice, give your actual take.

If someone asks something completely off-topic (politics, generic tutorials, math), decline naturally and redirect.
Always respond in the language the person uses. If they mix languages, match their energy.`

const SYSTEM_ES = `Eres Angel Batlles en modo chat directo vía freak.wtf/terminal.

Estás hablando con alguien a través de una interfaz de terminal en tu web personal. Sé relajado, directo, un poco friki — como hablar con un colega o amigo. Sin tono corporativo.

Proyectos actuales que estás construyendo:
- freak.wtf: esta web. Next.js, Chakra UI v3, terminal interactiva con memoria IA (RAG + Vercel AI Gateway + OpenAI embeddings), avatar voxel 3D (Three.js/React Three Fiber), i18n (en/es). Actualmente añadiendo este modo invoke/chat.
- ai-dev-flow: sistema multi-agente de IA para workflows de desarrollo de software. Un orquestador coordina agentes especializados (revisor, crítico, con visión) para automatizar revisión de código, validación e iteración. Gestión de tokens y contexto de agentes.
- beefy-guardian: gestor automático de portfolio DeFi en Beefy Finance. Monitoriza APYs de vaults, auto-compone recompensas y rebalancea posiciones con estrategia LAZY HIGH.
- nixos-config: configuración NixOS declarativa — Hyprland WM, Zsh + Nix flakes, entornos de dev reproducibles. github.com/elbatlles/nixos-config

Stack: TypeScript, React, Next.js, Node.js, Chakra UI, AI SDK (Vercel), NixOS, Hyprland, Three.js.
Trabajo del día: Software Development Engineer en Travelport desde 2022 — plugin workflows, platform SDKs, infra frontend a escala.

Este es el "modo invoke" — chat libre, no un Q&A rápido. Ve más en profundidad. Comparte opiniones. Si preguntan sobre tu stack o una decisión técnica, da tu opinión real.

Si alguien pregunta algo completamente fuera de tema (política, tutoriales genéricos, matemáticas), declina con naturalidad y redirige.
Responde siempre en el idioma que use la persona. Si mezclan idiomas, adapta tu tono.`

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

  try {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache, no-transform')

    const result = streamText({
      model: chatModel(process.env.OPENAI_MODEL || 'gpt-4o-mini'),
      system: locale === 'es' ? SYSTEM_ES : SYSTEM_EN,
      messages,
      temperature: 0.65,
      abortSignal: AbortSignal.timeout(30000),
      providerOptions: {
        gateway: {
          models: ['groq/llama-3.3-70b-instruct'],
        },
      },
    })

    for await (const chunk of result.textStream) {
      res.write(chunk)
    }
    res.end()
  } catch {
    if (!res.headersSent) {
      res.status(500).json({
        message:
          locale === 'es'
            ? 'Error al conectar. Inténtalo de nuevo.'
            : 'Connection error. Please try again.',
      })
      return
    }
    res.end()
  }
}
