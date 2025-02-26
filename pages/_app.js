import Head from 'next/head';
//import '@/styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Vinschool - Get Password Random</title>
        <meta name="description" content="Tool nội bộ random password cho hệ thống Vinschool." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="../public/img/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
