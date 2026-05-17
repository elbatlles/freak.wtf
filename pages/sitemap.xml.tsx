import type { GetServerSideProps } from 'next'
import { getAllPosts } from '../lib/blog/api'

const SITE_URL = 'https://freak.wtf'
const DEFAULT_LOCALE = 'es'
const LOCALES = ['es', 'en'] as const

const STATIC_PATHS: Array<{ path: string; priority: number; changefreq: string }> = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/projects', priority: 0.9, changefreq: 'monthly' },
  { path: '/timeline', priority: 0.7, changefreq: 'monthly' },
  { path: '/blog', priority: 0.9, changefreq: 'weekly' },
  { path: '/posts', priority: 0.5, changefreq: 'monthly' }
]

const WORK_SLUGS = [
  'pideme',
  'media',
  'personalweb',
  'kumux',
  'appKumux',
  'aqdindustrial',
  'littlebox',
  'avocadoshop',
  'weatherapp',
  'cryptoTracker',
  'scrapper',
  'solidary'
]

const buildUrl = (locale: string, path: string) => {
  const cleanPath = path === '/' ? '' : path
  return locale === DEFAULT_LOCALE
    ? `${SITE_URL}${cleanPath || '/'}`
    : `${SITE_URL}/${locale}${cleanPath}`
}

const escapeXml = (s: string) =>
  s.replace(/[<>&'"]/g, c =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]!)
  )

const generateSitemap = () => {
  const urls: string[] = []

  const allPaths = [
    ...STATIC_PATHS,
    ...WORK_SLUGS.map(slug => ({
      path: `/projects/${slug}`,
      priority: 0.7,
      changefreq: 'monthly'
    }))
  ]

  // Blog posts (per locale, since translations may differ)
  const blogEntries: Array<{ path: string; priority: number; changefreq: string }> = []
  for (const locale of LOCALES) {
    try {
      const posts = getAllPosts(locale)
      for (const p of posts) {
        blogEntries.push({
          path: `/blog/${p.slug}`,
          priority: 0.6,
          changefreq: 'monthly'
        })
      }
    } catch {
      // ignore
    }
  }

  const seenBlog = new Set<string>()
  const uniqueBlog = blogEntries.filter(e => {
    if (seenBlog.has(e.path)) return false
    seenBlog.add(e.path)
    return true
  })

  for (const entry of [...allPaths, ...uniqueBlog]) {
    const loc = buildUrl(DEFAULT_LOCALE, entry.path)
    const alternates = LOCALES.map(
      l =>
        `<xhtml:link rel="alternate" hreflang="${l}" href="${escapeXml(
          buildUrl(l, entry.path)
        )}" />`
    ).join('')
    urls.push(
      `<url><loc>${escapeXml(loc)}</loc><changefreq>${entry.changefreq}</changefreq><priority>${entry.priority}</priority>${alternates}<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(buildUrl(DEFAULT_LOCALE, entry.path))}" /></url>`
    )
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const sitemap = generateSitemap()
  res.setHeader('Content-Type', 'application/xml')
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=43200'
  )
  res.write(sitemap)
  res.end()
  return { props: {} }
}

export default function Sitemap() {
  return null
}
