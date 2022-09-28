import { AppProps } from 'next/app';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { VideosListProvider } from '../contexts/VideoListContext';

import { Layout } from '../components/Layout';

import '../styles/global.scss';

type MyAppProps = AppProps<{
  session: Session;
}>;

function MyApp({ Component, pageProps: { session, ...pageProps } }: MyAppProps) {
  return (
    <SessionProvider session={session}>
      <VideosListProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        
        <ToastContainer />
      </VideosListProvider>
    </SessionProvider>
  );
}

export default MyApp
