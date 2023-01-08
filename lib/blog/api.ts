import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

const postsDirectory = join(process.cwd(), '_posts/')

export function GetPostSlugs(locale) {
  return fs.readdirSync(postsDirectory + locale + '/')
}

export function getPostBySlug(
  slug: string,
  fields: string[] = [],
  locale: string
) {
  const realSlug = slug.replace(/\.md$/, '')
  console.log(slug, 'dins')
  const fullPath = join(postsDirectory, locale, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  type Items = {
    [key: string]: string
  }

  const items: Items = {}

  // Ensure only the minimal needed data is exposed
  fields.forEach(field => {
    if (field === 'slug') {
      items[field] = realSlug
    }
    if (field === 'content') {
      items[field] = content
    }

    if (typeof data[field] !== 'undefined') {
      items[field] = data[field]
    }
  })

  return items
}

export function getAllPosts(fields: string[] = [], locale) {
  const slugs = GetPostSlugs(locale)
  console.log(locale, 'aaa')
  const posts = slugs
    .map(slug => getPostBySlug(slug, fields, locale))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  return posts
}
