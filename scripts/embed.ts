/**
 * Generates embeddings for all memory documents and writes them to
 * content/memory/embeddings.json. Run this whenever you add or edit a .md file:
 *
 *   npm run embed
 */

import fs from 'node:fs'
import path from 'node:path'
import { createGateway } from '@ai-sdk/gateway'
import { embedMany } from 'ai'
import matter from 'gray-matter'

const gateway = createGateway({ apiKey: process.env.AI_GATEWAY_API_KEY })
const embeddingModel = gateway.embeddingModel('openai/text-embedding-3-small')

const MEMORY_ROOT = path.join(process.cwd(), 'content', 'memory')
const OUT_FILE = path.join(MEMORY_ROOT, 'embeddings.json')

const walk = (dir: string): string[] => {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(full)
    if (entry.isFile() && full.endsWith('.md')) return [full]
    return []
  })
}

const stripMarkdown = (value: string) =>
  value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[>#*_~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

async function main() {
  if (!process.env.AI_GATEWAY_API_KEY) {
    console.warn('AI_GATEWAY_API_KEY not set — skipping embed')
    process.exit(0)
  }

  // Skip system prompts — they are instructions, not memory content
  const files = walk(MEMORY_ROOT).filter(
    f => !path.basename(f).startsWith('system-prompt')
  )

  const docs = files.map(filePath => {
    const raw = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(raw)
    const id = String(data.id || path.basename(filePath, '.md'))
    const title = String(data.title || id)
    const body = stripMarkdown(content)
    // Text sent to the embedding model: title + body for richer semantic coverage
    const text = `${title}\n\n${body}`
    return {
      id,
      title,
      filePath: filePath.replace(`${process.cwd()}/`, ''),
      text
    }
  })

  console.log(`Embedding ${docs.length} documents...`)

  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: docs.map(d => d.text)
  })

  const output = docs.map((doc, i) => ({
    id: doc.id,
    title: doc.title,
    filePath: doc.filePath,
    embedding: embeddings[i]
  }))

  fs.writeFileSync(OUT_FILE, JSON.stringify(output, null, 2))
  console.log(
    `✓ Written ${output.length} embeddings to ${OUT_FILE.replace(`${process.cwd()}/`, '')}`
  )
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
