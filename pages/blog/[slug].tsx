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
            <Title title={'Blog'} linkback={'blog'}>
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
}

export async function getStaticProps({ params }: Params) {
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'ogImage',
    'coverImage'
  ])
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

export async function getStaticPaths() {
  const posts = getAllPosts(['slug'])

  return {
    paths: posts.map(post => {
      return {
        params: {
          slug: post.slug
        }
      }
    }),
    fallback: false
  }
}
