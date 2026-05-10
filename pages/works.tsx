import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/experience',
      permanent: true,
    },
  }
}

export default function Works() {
  return null
}
