import { AppProps } from 'next/app';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
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

function MyApp({ Component, pageProps: { session, ...pageProps } }: MyAppProps) {
  usePreserveScroll();

  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
        <VideosListProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          
          <ToastContainer />
        </VideosListProvider>

        <GlobalStyle theme={theme} />
      </ThemeProvider>
    </SessionProvider>
  );
}

export default MyApp
