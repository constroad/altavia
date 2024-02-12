import { Button, Flex, Text } from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { API_ROUTES, APP_ROUTES } from 'src/common/consts'
import { useAsync } from 'src/common/hooks'
import { Client } from 'src/common/types'
import { CotizacionForm, IntranetLayout, initialClient, toast } from 'src/components'
import axios from 'axios'
import { b64toBlob } from 'src/common/utils'

const postPDF = (path: string, data: Client) => axios.post(path, data);
const CotizacionPage = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const [client, setClient] = useState<Client>(initialClient)
  const [isLoading, setIsLoading] = useState(false)
  // const { data, run, isLoading } = useAsync({ onSuccess: successFunction })

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setIsLoading(true)

    const data = {
      email: client.email,
      name: client.name,
      razonSocial: client.razonSocial,
      ruc: client.ruc,
      message: client.message,
      phone: client.phone,
      nroCubos: client.nroCubos,
      precioUnitario: client.precioUnitario,
      nroCotizacion: client.nroCotizacion
    }

    try {
      const response = await axios.post( API_ROUTES.generatePDF, { data }, {responseType: 'arraybuffer'} )
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const pdfName = `Cotización ${client.nroCotizacion}_ConstRoad.pdf`

      const pdfUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', pdfName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setClient(initialClient)
      successFunction()
      setIsLoading(false)

    } catch (error) {
      console.error("Error generating PDF:", error);

      setIsLoading(false)
      toast.error('Hubo un error al generar la cotización');
    }
  };

  function successFunction() {
    toast.success('Cotización generada con éxito')
  }

  return (
    <IntranetLayout>
      {session && (
        <Flex
          flexDir='column'
          width={{base: '100%', md: '45%'}}
          paddingX={{ base: '30px', md: '30px' }}
          alignItems={{base: '', md: ''}}
          marginX='auto'
          gap='20px'
        >
          <Text fontSize={{ base: 25, md: 36 }} fontWeight={700} color='black' lineHeight={{ base: '28px', md: '39px' }} marginX='auto'>
            Generar cotización
          </Text>
          <CotizacionForm
            client={client}
            setter={setClient}
            isLoading={isLoading}
            handleSubmit={handleSubmit}
            session
          />
        </Flex>
      )}

      {!session && (
        <Flex flexDir='column' gap='10px' justifyContent='center' alignItems='center' marginTop='100px'>
          <Text>Debes iniciar sesión para generar cotizaciones</Text>
          <Button onClick={() => router.push(APP_ROUTES.home)}>Ir al inicio</Button>
        </Flex>
      )}
    </IntranetLayout>
  )
}

export default CotizacionPage
