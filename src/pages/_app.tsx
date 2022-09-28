import { AppProps } from 'next/app';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import '../styles/global.scss';

type MyAppProps = AppProps<{
  session: Session;
}>;

function MyApp({ Component, pageProps: { session, ...pageProps } }: MyAppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      
      <ToastContainer />
    </SessionProvider>
  );
}

export default MyApp
