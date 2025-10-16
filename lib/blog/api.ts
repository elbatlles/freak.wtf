import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import readingTime from 'reading-time'

const postsDirectory = join(process.cwd(), 'content/blog')

export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  readingTime: string
  tags: string[]
  category: string
  lang: 'en' | 'es'
  author: string
  image: string | null
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }
  const files = fs.readdirSync(postsDirectory)
  // Extraer slugs únicos removiendo el idioma y extensión
  const slugs = [
    ...new Set(
      files
        .filter(file => file.endsWith('.md'))
        .map(file => file.replace(/\.(en|es)\.md$/, ''))
    )
  ]
  return slugs
}

export function getPostBySlug(
  slug: string,
  lang: 'en' | 'es'
): BlogPost | null {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(postsDirectory, `${realSlug}.${lang}.md`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const stats = readingTime(content)

  return {
    slug: realSlug,
    title: data.title || '',
    date: data.date || '',
    excerpt: data.excerpt || '',
    content,
    readingTime: stats.text,
    tags: data.tags || [],
    category: data.category || 'development',
    lang,
    author: data.author || 'Angel Batlles',
    image: data.image || null
  }
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown)
  return result.toString()
}

export function getAllPosts(lang: 'en' | 'es'): BlogPost[] {
  const slugs = getPostSlugs()
  const posts = slugs
    .map(slug => getPostBySlug(slug, lang))
    .filter((post): post is BlogPost => post !== null)
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))

  return posts
}

export function getPostsByCategory(
  category: string,
  lang: 'en' | 'es'
): BlogPost[] {
  return getAllPosts(lang).filter(post => post.category === category)
}

export function getAllCategories(lang: 'en' | 'es'): string[] {
  const posts = getAllPosts(lang)
  const categories = [...new Set(posts.map(post => post.category))]
  return categories
}

export function getAllTags(lang: 'en' | 'es'): string[] {
  const posts = getAllPosts(lang)
  const tags = [...new Set(posts.flatMap(post => post.tags))]
  return tags
}
