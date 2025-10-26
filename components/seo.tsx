import Head from 'next/head'
import { useRouter } from 'next/router'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  type?: string
  noindex?: boolean
}

const SEO: React.FC<SEOProps> = ({
  title = 'Angel Batlles - Full Stack Developer',
  description = 'Full-stack developer specialized in React, Node.js, and modern web technologies. Explore my portfolio, timeline, and blog with insights about software development.',
  image = 'https://freak.wtf/card.png',
  type = 'website',
  noindex = false
}) => {
  const router = useRouter()
  const url = `https://freak.wtf${router.asPath}`

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Angel Batlles - Developer Portfolio" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="es_ES" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@abatlles" />
      <meta name="twitter:creator" content="@abatlles" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Head>
  )
}

export default SEO