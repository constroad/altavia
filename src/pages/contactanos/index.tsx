import React, { useState } from 'react'
import axios from 'axios'

import { Flex, Text } from '@chakra-ui/react'

import { CotizacionForm, PortalLayout, initialClient, toast } from 'src/components'
import { useAsync } from 'src/common/hooks'
import { API_ROUTES } from 'src/common/consts'
import { Quotation } from 'src/common/types'

const postEmail = (path: string, data: Quotation) => axios.post(path, data);
const Contactanos = () => {
  const [client, setClient] = useState<Quotation>(initialClient)
  const { run, isLoading } = useAsync({ onSuccess: successFunction })

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    const data = {
      email: client.email,
      name: client.name,
      razonSocial: client.razonSocial,
      ruc: client.ruc,
      message: client.message,
      phone: client.phone,
      nroCubos: client.nroCubos,
      precioUnitario: '',
      nroCotizacion: ''
    }
    await run( postEmail( API_ROUTES.sendEmail, data ) )

    setClient(initialClient)
  };

  function successFunction() {
    toast.success('Cotización solicitada!')
  }

  return (
    <PortalLayout noPaddingTop>
      <Flex width='100%' marginTop='10px'>
        <Flex
          flexDir={{ base: 'column', md: 'row' }}
          width={{ base: '100%', md: '90%' }}
          marginX='auto'
          justifyContent='space-between'
        >
          <Flex
            flexDir='column'
            width={{ base: '100%', md: '42%' }}
            paddingX={{base: '30px', md: '0px'}}
          >
            <Text fontSize={{ base: 25, md: 36 }} fontWeight={700} color='black' lineHeight={{ base: '28px', md: '39px' }} >
              Contáctanos
            </Text>
            
            <CotizacionForm
              client={client}
              setter={setClient}
              isLoading={isLoading}
              handleSubmit={handleSubmit}
            />

          </Flex>

          <Flex
            width={{ base: '100%', md: '55%' }}
            justifyContent={{ base: 'center', md: 'center' }}
            marginTop={{ base: '20px', md: '20px' }}
            alignItems='center'
          >
            <iframe
              className='w-full'
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1473.7431071467945!2d-76.87007512292216!3d-11.989155699516932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c3ef83e0435f%3A0x24252d03799ec7cc!2sCANTERA%20PORTILLLO!5e0!3m2!1ses-419!2spe!4v1706618673840!5m2!1ses-419!2spe"
              width="600"
              height="450"
              loading="lazy"
            />
          </Flex>

        </Flex>
      </Flex>
    </PortalLayout>
  )
}

export default Contactanos
