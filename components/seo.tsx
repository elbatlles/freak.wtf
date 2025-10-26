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
  const { locale, locales, asPath } = router
  const url = `https://freak.wtf${asPath}`
  
  // Ensure absolute URL for images
  const absoluteImage = image.startsWith('http') ? image : `https://freak.wtf${image}`
  
  // Map locale to Open Graph format
  const ogLocale = locale === 'es' ? 'es_ES' : 'en_US'
  const alternateLocale = locale === 'es' ? 'en_US' : 'es_ES'
  
  // Generate alternate language URLs
  const alternateUrls = locales?.filter(l => l !== locale).map(l => ({
    locale: l,
    url: `https://freak.wtf/${l}${asPath}`
  })) || []

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
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:image:secure_url" content={absoluteImage} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="Angel Batlles - Developer Portfolio" />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:locale:alternate" content={alternateLocale} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@abatlles" />
      <meta name="twitter:creator" content="@abatlles" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />
      <meta name="twitter:image:alt" content={title} />
      
      {/* Language alternates for SEO */}
      {alternateUrls.map(alt => (
        <link
          key={alt.locale}
          rel="alternate"
          hrefLang={alt.locale}
          href={alt.url}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`https://freak.wtf${asPath}`} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Head>
  )
}

export default SEO