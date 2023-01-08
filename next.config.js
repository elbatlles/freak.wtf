// @ts-check

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    fontLoaders: [
      { loader: '@next/font/google', options: { subsets: ['latin'] } }
    ]
  },
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['en', 'es'],

    defaultLocale: 'es'
  }
}

module.exports = nextConfig
// ,
//   async rewrites() {
//     return [
//       {
//         source: '/works',
//         destination: '/angel'
//       }
//     ]
//   }
