import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import { Auth0Provider } from '@auth0/auth0-react';
import appConfig from '../config';
import { useEffect, useState } from 'react';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to client-app!</title>
      </Head>
      <main className="app">
        <Auth0Provider
          domain={appConfig.auth0.domain}
          clientId={appConfig.auth0.clientId}
          redirectUri={appConfig.auth0.redirectUrl}
        >
          <Provider store={store}>
            <Component {...pageProps} />
          </Provider>
        </Auth0Provider>
      </main>
    </>
  );
}

export default CustomApp;
