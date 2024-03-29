/* eslint-disable @typescript-eslint/quotes */
/**
 * AlgoWorld Swapper
 * Copyright (C) 2022 AlgoWorld
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import 'react-toastify/dist/ReactToastify.css';
import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import PropTypes from 'prop-types';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { Provider } from 'react-redux';
import darkTheme from '../redux/theme/darkTheme';
import createEmotionCache from '../utils/createEmotionCache';
import Layout from '@/components/Layouts/Layout';
import store from '@/redux/store';
import { GoogleAnalytics } from 'nextjs-google-analytics';
import {
  WalletProvider,
  PROVIDER_ID,
  useInitializeProviders,
} from '@txnlab/use-wallet';

import { ToastContainer } from 'react-toastify';
import { DeflyWalletConnect } from '@blockshake/defly-connect';
import { DaffiWalletConnect } from '@daffiwallet/connect';
import { PeraWalletConnect } from '@perawallet/connect';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const walletProviders = useInitializeProviders({
    providers: [
      { id: PROVIDER_ID.PERA, clientStatic: PeraWalletConnect },
      { id: PROVIDER_ID.DEFLY, clientStatic: DeflyWalletConnect },
      { id: PROVIDER_ID.EXODUS },
      { id: PROVIDER_ID.DAFFI, clientStatic: DaffiWalletConnect },
    ],
  });

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta
          name="description"
          content="⚡️ Free and trustless ASA swapper, powered by Algorand"
        />
        <meta
          name="keywords"
          content="Algorand, AlgoWorld, Swapper, ASA, NFT, Blockchain"
        />
        <title>AlgoWorld Swapper</title>

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@algoworld_nft" />
        <meta name="twitter:title" content="AlgoWorld Swapper" />
        <meta
          name="twitter:description"
          content="⚡️ Free and trustless ASA swapper, powered by Algorand"
        />
        <meta name="twitter:image" content="https://imgur.com/Sv4A6cq.png" />

        <meta property="og:title" content="AlgoWorld Swapper" />
        <meta
          property="og:description"
          content="⚡️ Free and trustless ASA swapper, powered by Algorand"
        />
        <meta property="og:image" content="https://imgur.com/Sv4A6cq.png" />
        <meta property="og:url" content="https://swapper.algoworld.io" />
        <meta property="og:type" content="website" />

        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <Provider store={store}>
        <WalletProvider value={walletProviders}>
          <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Layout title="AlgoWorld Swapper">
              <>
                <GoogleAnalytics />
                <Component {...pageProps} />
              </>
            </Layout>
            <ToastContainer
              autoClose={15000}
              position="bottom-center"
              hideProgressBar
              draggable={false}
              theme={`dark`}
            />
          </ThemeProvider>
        </WalletProvider>
      </Provider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
