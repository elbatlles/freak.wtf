import type { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/experience',
      permanent: true
    }
  }
}

export default function Projects() {
  return null
}
