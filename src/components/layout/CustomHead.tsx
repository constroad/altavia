import React from 'react'
import Head from 'next/head';

export const CustomHead = () => {
  return (
    <Head>
      <title>Constroad | Planta de asfalto</title>
      <meta name="description" content="Mezcla asfáltica en caliente | Colocación de mezcla asfáltica | Transporte de carga por carretera" />
      <meta name="robots" content="index,follow" />
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
    </Head>
  )
}
