import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }

  render() {
    return (
      <Html lang="nl">
        <Head>
          <link
            href="https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
          <div id="#root"></div>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
