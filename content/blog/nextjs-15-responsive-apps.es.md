---
title: "Construyendo Apps Web Responsivas con Next.js 15"
date: "2024-11-28"
excerpt: "Explora las últimas características de Next.js 15 incluyendo Turbopack, rendimiento mejorado y patrones de desarrollo modernos para aplicaciones web escalables."
category: "nextjs"
tags: ["nextjs", "react", "javascript", "rendimiento", "turbopack"]
author: "Angel Batlles"
---

# Construyendo Apps Web Responsivas con Next.js 15

Next.js 15 ha llegado con mejoras significativas en rendimiento, experiencia del desarrollador y nuevas características que hacen que construir aplicaciones web modernas sea aún mejor.

## Qué hay de nuevo en Next.js 15

### Turbopack (Estable)
Turbopack ahora es estable y proporciona hasta 53% más rápido en iteración local y 94% más rápido en builds iniciales comparado con Webpack.

### Soporte para React 19
Soporte completo para características de React 19 incluyendo:
- Server Components
- Características concurrentes
- Nuevos hooks como `use()`

### Caché Mejorado
Mejores estrategias de cache con control más granular sobre la invalidación de cache.

## Configurando Next.js 15

Crea un nuevo proyecto de Next.js 15:

```bash
npx create-next-app@latest mi-app
cd mi-app
npm run dev
```

### Opciones de Configuración Clave

Actualiza tu `next.config.js`:

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

## Construyendo Componentes Responsivos

### Usando CSS Grid y Flexbox

```jsx
// components/Layout.jsx
import styles from './Layout.module.css'

export default function Layout({ children }) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          {/* Elementos de navegación */}
        </nav>
      </header>
      <main className={styles.main}>
        {children}
      </main>
      <footer className={styles.footer}>
        {/* Contenido del footer */}
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

### Server Components para Mejor Rendimiento

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

## Imágenes Optimizadas y Rendimiento

```jsx
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative h-screen">
      <Image
        src="/hero-bg.jpg"
        alt="Fondo del hero"
        fill
        style={{ objectFit: 'cover' }}
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
        <h1 className="text-4xl md:text-6xl text-white font-bold text-center">
          Bienvenido a Nuestro Sitio
        </h1>
      </div>
    </section>
  )
}
```

## Rutas Dinámicas y API Routes

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

## Mejores Prácticas para Next.js 15

1. **Usa Server Components por defecto**: Solo usa Client Components cuando sea necesario
2. **Implementa Incremental Static Regeneration**: Para contenido dinámico que no cambia frecuentemente
3. **Optimiza imágenes**: Siempre usa el componente Image de Next.js
4. **Implementa error boundaries apropiados**: Maneja errores con gracia
5. **Usa TypeScript**: Mejor experiencia de desarrollo y seguridad de tipos

## Consideraciones de Despliegue

### Despliegue en Vercel
```bash
npm install -g vercel
vercel
```

### Despliegue con Docker
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

## Conclusión

Next.js 15 proporciona una excelente base para construir aplicaciones web modernas y responsivas. Con el rendimiento mejorado de Turbopack y el soporte para React 19, el desarrollo nunca ha sido más fluido.

La combinación de Server Components, imágenes optimizadas y cache inteligente hace de Next.js 15 una opción poderosa para cualquier proyecto web.

¡Empieza a construir hoy! 🚀