import { useSession } from 'next-auth/react';

import { Header } from '../Header';

export function Layout({ children }) {
  const { data: session } = useSession();

  return (
    <>
      {!!session && <Header />}

      {children}
    </>
  );
}