import type { NextApiRequest, NextApiResponse } from 'next'
import { navigateMemory } from '../../../lib/memory'

type Command = 'timeline' | 'projects' | 'notes'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const locale = req.body?.locale === 'es' ? 'es' : 'en'
  const command = String(req.body?.command || '') as Command
  const arg = String(req.body?.arg || '')

  if (!['timeline', 'projects', 'notes'].includes(command)) {
    return res.status(400).json({
      message: locale === 'es' ? 'Comando inválido.' : 'Invalid command.'
    })
  }

  const { lines, sourceIds } = navigateMemory(command, arg)

  return res.status(200).json({
    lines,
    sourceIds
  })
}
