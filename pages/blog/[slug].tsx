'use client'
import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import { getPostBySlug, getAllPosts } from '../../lib/blog/api'
import markdownToHtml from '../../lib/blog/markdownToHtml'
import type PostType from '../../interfaces/post'
import { Container } from '@chakra-ui/react'

import Layout from '../../components/layouts/article'
import { Title } from '../../components/title'

type Props = {
  post: PostType
  morePosts: PostType[]
  preview?: boolean
}

export default function Post({ post }: Props) {
  const router = useRouter()

  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <Layout title={post.title}>
      <Container maxWidth={'container.xl'}>
        {router.isFallback ? (
          <p>Loading…</p>
        ) : (
          <>
            <Title title={'Blog'} linkback={'blog/'}>
              {post.title}
            </Title>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </>
        )}
      </Container>
    </Layout>
  )
}

type Params = {
  params: {
    slug: string
  }
  locale: string
}

export async function getStaticProps({ params, locale }: Params) {
  console.log(locale)
  console.log('ange')
  const post = getPostBySlug(
    params.slug,
    ['title', 'date', 'slug', 'author', 'content', 'ogImage', 'coverImage'],
    locale
  )
  const content = await markdownToHtml(post.content || '')

  return {
    props: {
      post: {
        ...post,
        content
      }
    }
  }
}

export async function getStaticPaths({ locales }) {
  console.log(locales, 'static')
  const posts = getAllPosts(['slug'], 'es')
  const ola = posts.map(post => {
    const prova = locales.map(locale => {
      return {
        params: {
          slug: post.slug
        },
        locale: locale
      }
    })

    return prova
  })

  return {
    paths: ola.flat(1),
    fallback: false
  }
}
// paths: posts.map(post => {
//   for (const locale of locales) {
//     return {
//       params: {
//         slug: post.slug,
//         locale: locale
//       }
//     }
//   }
// }
