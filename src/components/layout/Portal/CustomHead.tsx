import React from 'react'
import Head from 'next/head';

export const CustomHead = () => {
  return (
    <Head>
      <title>Altavía Perú | Tranporte de carga</title>
      <meta name="description" content="Transporte de carga por carretera" />
      <meta name="robots" content="index,follow" />
      {/* Etiquetas Open Graph */}
      <meta property="og:title" content="Altavía Perú | Transporte de carga" />
      <meta property="og:description" content="Transporte de carga por carretera" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://altaviaperu.com" />
      <meta property="og:image" content="/img/logos/altavia-peru.png" />
      {/* Etiquetas Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Altavía Perú | Transporte de carga" />
      <meta name="twitter:description" content="Transporte de carga por carretera" />
      <meta name="twitter:image" content="/img/logos/altavia-peru.png" />
    </Head>
  )
}
