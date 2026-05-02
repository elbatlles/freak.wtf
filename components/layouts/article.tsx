import { motion } from 'framer-motion'
import Head from 'next/head'
import { GridItemStyle } from '../GridItem/grid-item'

export const variants = {
  hidden: { opacity: 0, x: 0, y: 20 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: -0, y: 20 }
}

const MotionArticle = motion.article

type Props = {
  title?: string
  children: React.ReactNode
}
const Layout: React.FC<Props> = ({ children, title }) => (
  <MotionArticle
    initial="hidden"
    animate="enter"
    exit="exit"
    variants={variants}
    transition={{ duration: 0.4, ease: 'easeInOut' }}
    style={{ position: 'relative' }}
  >
    <>
      {title && (
        <Head>
          <title>{title + ' - Angel Batlles'}</title>
          <meta name="twitter:title" content={title} />
          <meta property="og:title" content={title} />
        </Head>
      )}
      {children}

      <GridItemStyle />
    </>
  </MotionArticle>
)

export default Layout
