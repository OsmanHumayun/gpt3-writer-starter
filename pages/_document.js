import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <meta property="og:title" content="Khutbah Generator" key="title"/>
        <meta property="og:description" content="Generate a Khutbah" key="description"/>
        <meta
          property="og:image"
          content="https://imgur.com/QhaMRdB"
        />
        <meta name="twitter:card" content="summary_large_image"></meta>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
