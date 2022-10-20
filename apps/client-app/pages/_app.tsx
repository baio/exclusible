import { Auth0Provider } from '@auth0/auth0-react';
import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import appConfig from '../config';
import './styles.css';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <section className="hero">
      <div className="hero-head">
        <h1 className="title has-text-centered">BTC/USD Rates</h1>
      </div>
      <div className="hero-body">
        <Auth0Provider
          domain={appConfig.auth0.domain}
          clientId={appConfig.auth0.clientId}
          redirectUri={appConfig.auth0.redirectUrl}
          audience={`https://${appConfig.auth0.domain}/api/v2/`}
        >
          <Provider store={store}>
            <Component {...pageProps} />
          </Provider>
        </Auth0Provider>
      </div>
    </section>
  );
}

export default CustomApp;
