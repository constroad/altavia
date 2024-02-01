import Home from './home'
import Head from 'next/head';

const Inicio = () => {
  return (
    <>
      <Head>
          <title>Constroad | Planta de asfalto</title>
          <meta name="description" content="Mezcla asfáltica en caliente | Colocación de mazcla asfáltica | Transporte de carga por carretera<" />
      </Head>
      <Home />
    </>
  )
}

export default Inicio