import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';

import { authOptions } from './api/auth/[...nextauth]';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div>
      <h1>Hello World!</h1>

      {!!session && (
        <button type="button" onClick={() => signOut()}>
          Log Out
        </button>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  return {
    props: {}
  };
}
