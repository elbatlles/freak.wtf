---
title: "Building Responsive Web Apps with Next.js 15"
date: "2024-11-28"
excerpt: "Explore the latest features in Next.js 15 including Turbopack, improved performance, and modern development patterns for scalable web applications."
category: "nextjs"
tags: ["nextjs", "react", "javascript", "performance", "turbopack"]
author: "Angel Batlles"
---

# Building Responsive Web Apps with Next.js 15

Next.js 15 has arrived with significant improvements in performance, developer experience, and new features that make building modern web applications even better.

## What's New in Next.js 15

### Turbopack (Stable)
Turbopack is now stable and provides up to 53% faster local iteration and 94% faster initial builds compared to Webpack.

### React 19 Support
Full support for React 19 features including:
- Server Components
- Concurrent features
- New hooks like `use()`

### Improved Caching
Better caching strategies with more granular control over cache invalidation.

## Setting Up Next.js 15

Create a new Next.js 15 project:

```bash
npx create-next-app@latest my-app
cd my-app
npm run dev
```

### Key Configuration Options

Update your `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
  },
}

module.exports = nextConfig
```

## Building Responsive Components

### Using CSS Grid and Flexbox

```jsx
// components/Layout.jsx
import styles from './Layout.module.css'

export default function Layout({ children }) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          {/* Navigation items */}
        </nav>
      </header>
      <main className={styles.main}>
        {children}
      </main>
      <footer className={styles.footer}>
        {/* Footer content */}
      </footer>
    </div>
  )
}
```

```css
/* Layout.module.css */
.container {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header {
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main {
  padding: 2rem 0;
}

.footer {
  padding: 1rem 0;
  border-top: 1px solid #eee;
  text-align: center;
}

@media (max-width: 768px) {
  .container {
    padding: 0 0.5rem;
  }
  
  .nav {
    flex-direction: column;
    gap: 1rem;
  }
}
```

### Server Components for Better Performance

```jsx
// app/blog/page.jsx (App Router)
import { getPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'

export default async function BlogPage() {
  const posts = await getPosts()
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
```

## Optimized Images and Performance

```jsx
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative h-screen">
      <Image
        src="/hero-bg.jpg"
        alt="Hero background"
        fill
        style={{ objectFit: 'cover' }}
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
        <h1 className="text-4xl md:text-6xl text-white font-bold text-center">
          Welcome to Our Site
        </h1>
      </div>
    </section>
  )
}
```

## Dynamic Routing and API Routes

```jsx
// app/blog/[slug]/page.jsx
import { getPost } from '@/lib/posts'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map(post => ({
    slug: post.slug
  }))
}

export default async function PostPage({ params }) {
  const post = await getPost(params.slug)
  
  if (!post) {
    notFound()
  }
  
  return (
    <article className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}
```

## Best Practices for Next.js 15

1. **Use Server Components by default**: Only use Client Components when needed
2. **Implement Incremental Static Regeneration**: For dynamic content that doesn't change frequently
3. **Optimize images**: Always use the Next.js Image component
4. **Implement proper error boundaries**: Handle errors gracefully
5. **Use TypeScript**: Better development experience and type safety

## Deployment Considerations

### Vercel Deployment
```bash
npm install -g vercel
vercel
```

### Docker Deployment
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## Conclusion

Next.js 15 provides an excellent foundation for building modern, responsive web applications. With Turbopack's improved performance and React 19 support, development has never been smoother.

The combination of Server Components, optimized images, and smart caching makes Next.js 15 a powerful choice for any web project.

Start building today! 🚀