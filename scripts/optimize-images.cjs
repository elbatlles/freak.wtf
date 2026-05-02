#!/usr/bin/env node
/* eslint-disable no-console */
// Optimize images in public/images in place using sharp.
// PNG -> palette PNG (or webp if smaller). JPG -> mozjpeg q=82. GIF left alone (sharp can't keep animation).
// Also caps max dimension to 1600px.
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const ROOT = path.join(__dirname, '..', 'public', 'images')
const MAX_DIM = 1600
const exts = new Set(['.png', '.jpg', '.jpeg'])

async function walk(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      await walk(full)
    } else {
      const ext = path.extname(entry.name).toLowerCase()
      if (!exts.has(ext)) continue
      await optimize(full, ext)
    }
  }
}

async function optimize(file, ext) {
  try {
    const before = (await fs.promises.stat(file)).size
    const img = sharp(file, { failOn: 'none' })
    const meta = await img.metadata()
    const needsResize =
      (meta.width || 0) > MAX_DIM || (meta.height || 0) > MAX_DIM
    let pipeline = needsResize
      ? img.resize({ width: MAX_DIM, height: MAX_DIM, fit: 'inside' })
      : img

    if (ext === '.png') {
      pipeline = pipeline.png({
        compressionLevel: 9,
        palette: true,
        quality: 80,
        effort: 8
      })
    } else {
      pipeline = pipeline.jpeg({ quality: 82, mozjpeg: true })
    }

    const buf = await pipeline.toBuffer()
    if (buf.length < before) {
      await fs.promises.writeFile(file, buf)
      const saved = (((before - buf.length) / before) * 100).toFixed(1)
      console.log(
        `  ${path.relative(process.cwd(), file)}: ${(before / 1024).toFixed(0)}KB -> ${(buf.length / 1024).toFixed(0)}KB (-${saved}%)`
      )
    } else {
      console.log(
        `  ${path.relative(process.cwd(), file)}: skipped (no gain)`
      )
    }
  } catch (e) {
    console.warn(`  ${file}: ${e.message}`)
  }
}

walk(ROOT)
  .then(() => console.log('Done.'))
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
