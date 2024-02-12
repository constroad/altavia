import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta name="theme-color" content="#000000" />
        <meta name="keywords" content="Planta de asfalto, asfalto peru, peru, cotiza, venta de asfalto, asfalto"/>
        <meta name="author" content="Constroad"/>

        <meta name="robots" content="index,follow" />
        <link rel="icon" href="/constroad.ico" />

        {/* Etiquetas Open Graph */}
        <meta property="og:title" content="Constroad | Planta de asfalto" />
        <meta property="og:description" content="Mezcla asfáltica en caliente | Colocación de mezcla asfáltica | Transporte de carga por carretera" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://constroad.com" />
        <meta property="og:image" content="/img/constroad_logo.jpeg" />
        {/* Etiquetas Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Constroad | Planta de asfalto" />
        <meta name="twitter:description" content="Mezcla asfáltica en caliente | Colocación de mezcla asfáltica | Transporte de carga por carretera" />
        <meta name="twitter:image" content="/img/constroad_logo.jpeg" />

        {/* fonts */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anek+Devanagari:wght@400;600;800&display=swap" />

        <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=AW-16451484138"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'AW-16451484138');
          `,
        }}
      />
      </Head>
      <body className="min-h-[100vh] w-full flex flex-col">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}