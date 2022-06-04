import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { Provider } from 'react-redux';
import darkTheme from '../redux/theme/darkTheme';
import createEmotionCache from '../utils/createEmotionCache';
import { SnackbarProvider } from 'notistack';

import Layout from '@/components/Layouts/Layout';
import store from '@/redux/store';
import { ConnectContext, connector } from '@/redux/store/connector';
import { Slide } from '@mui/material';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <Provider store={store}>
        <ConnectContext.Provider value={connector}>
          <CacheProvider value={emotionCache}>
            <ThemeProvider theme={darkTheme}>
              <SnackbarProvider
                maxSnack={3}
                anchorOrigin={{
                  vertical: `bottom`,
                  horizontal: `center`,
                }}
                TransitionComponent={Slide}
              >
                <CssBaseline />
                <Layout title="AlgoWorld Swapper">
                  <Component {...pageProps} />
                </Layout>
              </SnackbarProvider>
            </ThemeProvider>
          </CacheProvider>
        </ConnectContext.Provider>
      </Provider>
    </>
  );
}
