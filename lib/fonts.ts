import { Inter } from 'next/font/google'

// Optimized font loading with Next.js
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
})

// For better Core Web Vitals
export const interClassName = inter.className