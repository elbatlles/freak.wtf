// @ts-check
 
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    
  reactStrictMode: true,
 
  swcMinify: true,
  i18n: {
    locales: ['en', 'es'],

    defaultLocale: 'es'
  }
}

export default nextConfig