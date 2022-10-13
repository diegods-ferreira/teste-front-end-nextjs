import { AppProps } from 'next/app';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components';

import 'react-toastify/dist/ReactToastify.css';

import { VideosListProvider } from '../contexts/VideoListContext';

import { usePreserveScroll } from '../hooks/preserve-scroll';

import { Layout } from '../components/Layout';

import { GlobalStyle } from '../styles/GlobalStyles';
import { theme } from '../styles/theme';

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
  usePreserveScroll();

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <VideosListProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
            
            <ToastContainer />
          </VideosListProvider>

          <GlobalStyle theme={theme} />
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default MyApp
