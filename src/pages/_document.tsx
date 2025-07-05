// pages/_document.tsx
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          {/* Favicon links */}
          <link rel='icon' href='@/app/public/favicon.ico' sizes='any' /> {/* Basic .ico */}
          <link rel="icon" href="/icon.svg" type="image/svg+xml" /> {/* SVG for crispness */}
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" /> {/* Apple Touch Icon */}
          <link rel="manifest" href="/site.webmanifest" /> {/* For PWA features */}

          {/* You might add other favicon sizes if needed, e.g.: */}
          {/* <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" /> */}
          {/* <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" /> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;