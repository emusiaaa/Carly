import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Home() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setSeconds(old => old + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <title>{seconds} s passed.</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/ColoredLogo.svg" />
      </Head>
      <main>
        <div>
          <p>
            Nothing here.
            <br />
            <Link href="/samples">Go back.</Link>
          </p>
        </div>
      </main>
    </>
  )
}
