import { Container, Heading, SimpleGrid } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import Lang from '../lib/utils'
import thumbFishWorkflow from '../public/images/contents/youtube-fish-workflow.jpg'
import { GridItem } from '../components/GridItem/grid-item'
import { getAllPosts } from '../lib/blog/api'
import Post from '../interfaces/post'

type Props = {
  allPosts: Post[]
}

const Posts = ({ allPosts }: Props) => {
  const heroPost = allPosts[0]
  const morePosts = allPosts.slice(1)
  const t = Lang('blog')
  const router = useRouter()
  console.log(router.asPath)
  return (
    <Layout title="Posts">
      <Container>
        <Heading as="h3" fontSize={20} mb={4}>
          {t.commingSoon}
        </Heading>
        <Section delay={0.1}>
          <SimpleGrid marginBottom={'16'} columns={1} gap={6}>
            <GridItem
              key={heroPost.slug}
              title={heroPost.title}
              thumbnail={thumbFishWorkflow}
              href={router.asPath + '/' + heroPost.slug}
            />
          </SimpleGrid>
        </Section>
        <Section delay={0.1}>
          <SimpleGrid columns={[1, 2, 2]} gap={6}>
            {morePosts.map(post => (
              <GridItem
                key={post.slug}
                title={post.title}
                thumbnail={thumbFishWorkflow}
                href={router.asPath + '/' + post.slug}
              />
            ))}
          </SimpleGrid>
        </Section>
      </Container>
    </Layout>
  )
}
export const getStaticProps = async context => {
  console.log(context, 'aaaaae')
  const allPosts = getAllPosts(
    ['title', 'date', 'slug', 'author', 'coverImage', 'excerpt'],
    context.locale
  )

  return {
    props: { allPosts }
  }
}
export default Posts
