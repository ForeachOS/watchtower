import { AppProps } from 'next/app';

import '../styles/globals.scss';
import '../App.scss';
import '../components/AddLinkModal.scss';
import '../components/Toggle.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
