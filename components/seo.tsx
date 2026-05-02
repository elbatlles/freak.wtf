import Head from 'next/head'
import { useRouter } from 'next/router'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  type?: string
  noindex?: boolean
}

const SITE_URL = 'https://freak.wtf'
const DEFAULT_LOCALE = 'es'

const buildLocalizedUrl = (locale: string, asPath: string) => {
  const path = asPath === '/' ? '' : asPath
  return locale === DEFAULT_LOCALE
    ? `${SITE_URL}${path || '/'}`
    : `${SITE_URL}/${locale}${path}`
}

const SEO: React.FC<SEOProps> = ({
  title = 'Angel Batlles - Full Stack Developer',
  description = 'Full-stack developer specialized in React, Node.js, and modern web technologies. Explore my portfolio, timeline, and blog with insights about software development.',
  image = 'https://freak.wtf/card.png',
  type = 'website',
  noindex = false
}) => {
  const router = useRouter()
  const { locale = DEFAULT_LOCALE, locales = [DEFAULT_LOCALE], asPath } = router
  const cleanPath = asPath.split('?')[0].split('#')[0]
  const url = buildLocalizedUrl(locale, cleanPath)

  // Ensure absolute URL for images
  const absoluteImage = image.startsWith('http') ? image : `${SITE_URL}${image}`

  // Map locale to Open Graph format
  const ogLocale = locale === 'es' ? 'es_ES' : 'en_US'
  const alternateLocale = locale === 'es' ? 'en_US' : 'es_ES'

  // hreflang alternates (one per locale + x-default)
  const alternateUrls = locales.map(l => ({
    locale: l,
    url: buildLocalizedUrl(l, cleanPath)
  }))

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: 'Angel Batlles',
        url: SITE_URL,
        image: `${SITE_URL}/images/angel.jpg`,
        jobTitle: 'Full Stack Developer',
        sameAs: [
          'https://github.com/elbatlles',
          'https://twitter.com/abatlles'
        ]
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Angel Batlles',
        description,
        inLanguage: locale,
        publisher: { '@id': `${SITE_URL}/#person` }
      },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: title,
        description,
        inLanguage: locale,
        isPartOf: { '@id': `${SITE_URL}/#website` }
      }
    ]
  }

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex ? (
        <meta name="robots" content="noindex,nofollow" />
      ) : (
        <meta name="robots" content="index,follow,max-image-preview:large" />
      )}

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
      <link
        rel="alternate"
        hrefLang="x-default"
        href={buildLocalizedUrl(DEFAULT_LOCALE, cleanPath)}
      />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  )
}

export default SEO