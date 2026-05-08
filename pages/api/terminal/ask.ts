import type { NextApiRequest, NextApiResponse } from 'next'
import { askMemory } from '../../../lib/memory'

const chunkText = async (res: NextApiResponse, value: string) => {
  const chunks = value.match(/.{1,48}(\s|$)/g) || [value]

  for (const chunk of chunks) {
    res.write(chunk)
    await new Promise(resolve => setTimeout(resolve, 8))
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const query = String(req.body?.query || '').trim()
  const locale = req.body?.locale === 'es' ? 'es' : 'en'
  const trace = Boolean(req.body?.trace)

  if (!query) {
    return res.status(400).json({
      message: locale === 'es' ? 'Falta la consulta.' : 'Missing query.'
    })
  }

  try {
    const result = await askMemory(query, { trace, locale })

    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache, no-transform')
    res.setHeader('X-Terminal-Sources', encodeURIComponent(JSON.stringify(result.sources)))
    res.setHeader('X-Terminal-Confidence', result.confidence)
    res.setHeader('X-Terminal-Limited-Match', result.limitedMatch ? '1' : '0')

    await chunkText(res, result.answer)
    res.end()
  } catch {
    if (!res.headersSent) {
      res.status(500).json({
        message: locale === 'es'
          ? 'No pude recuperar memoria en este momento. Inténtalo de nuevo.'
          : 'I could not retrieve memory right now. Please try again.'
      })
      return
    }

    res.end()
  }
}
