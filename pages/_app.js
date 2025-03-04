import Head from 'next/head';
import '../public/styles/global.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Vinschool - Get Password Random</title>
        <meta name="description" content="Tool nội bộ random password cho hệ thống Vinschool." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/img/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
