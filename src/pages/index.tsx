import Head from 'next/head';
import Home from './home'

const Inicio = () => {
  return (
    <>
      <Head>
        <title>Constroad | Planta de asfalto</title>
        <meta name="description" content="Mezcla asfáltica en caliente | Colocación de mezcla asfáltica | Transporte de carga por carretera<" />
      </Head>

      <Home />
    </>
  )
}

export default Inicio