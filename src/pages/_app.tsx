import { AppProps } from 'next/app';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import 'react-toastify/dist/ReactToastify.css';

import { VideosListProvider } from '../contexts/VideoListContext';

import { Layout } from '../components/Layout';

import { GlobalStyle } from '../styles/global';

type MyAppProps = AppProps<{
  session: Session;
}>;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
      retry: 3
    }
  }
});

function MyApp({ Component, pageProps: { session, ...pageProps } }: MyAppProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <VideosListProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          
          <ToastContainer />
        </VideosListProvider>

        <GlobalStyle />
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default MyApp
