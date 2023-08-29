import { Button } from '@mui/material';
import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';

import { MdInsertDriveFile } from 'react-icons/md'

export default function Home() {
  const router = useRouter(); // Use router object to navigate between pages.

  return (
    <>
      <Head>
        <title>Index Sample Page</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/ColoredLogo.svg" />
      </Head>
      <main>
        <div>
          <p>
            There are two ways to load another page.
          </p>
          <strong>
            1. Use Link component from <code>next/link</code>
          </strong>
          <br />
          <Link href="/samples/page">Classic link.</Link>
          <br />
          <strong>
            2. Use <code>router.push()</code> method - This can be used inside buttons.
          </strong>
          <br />
          <Button
            variant="contained"
            startIcon={<MdInsertDriveFile />}
            onClick={() => router.push("/samples/thisIsID")}
          >
            Go to website
          </Button>
          <br />
          Info: See the <code>startIcon</code> property? We have a nice collection of icons to use. Go to <Link href="https://react-icons.github.io/react-icons/icons?name=md">React Icons</Link> to find one and use it like above.
        </div>
      </main>
    </>
  )
}