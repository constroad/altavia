

import React, { useState } from 'react'
import axios from 'axios'

import { Button, Flex, FormControl, FormLabel, Input, Text, Textarea, VStack } from '@chakra-ui/react'

import { WebLayout, toast } from 'src/components'
import { useAsync } from 'src/common/hooks'
import { API_ROUTES } from 'src/common/consts'

const postEmail = (path: string, data: any) => axios.post(path, data);
const Contactanos = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('')
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('')
  const [nroCubos, setNroCubos] = useState('')
  const { run, isLoading } = useAsync({ onSuccess: successFunction })

  const handleNroCubosChange = (event: { target: { value: any } }) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setNroCubos(value);
    }
  };

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    const data = {
      sender: email,
      name,
      company,
      message,
      phone,
      nroCubos
    }
    await run( postEmail( API_ROUTES.sendEmail, data ) )

    setName('')
    setEmail('')
    setCompany('')
    setMessage('')
    setPhone('')
    setNroCubos('')
  };

  function successFunction() {
    toast.success('Correo enviado con éxito')
  }

  return (
    <WebLayout>
      <Flex width='100%'>
        <Flex
          flexDir={{ base: 'column', md: 'row' }}
          width={{ base: '100%', md: '90%' }}
          marginX='auto'
          justifyContent='space-between'
        >
          <Flex
            flexDir='column'
            width={{ base: '100%', md: '30%' }}
            paddingX={{base: '30px', md: '0px'}}
          >
            <Text fontSize={{ base: 25, md: 36 }} fontWeight={700} color='black' lineHeight={{ base: '28px', md: '39px' }} >
              Contáctanos
            </Text>
            
            <VStack as="form" onSubmit={handleSubmit} spacing={4} mt='20px' fontSize={14}>
              <FormControl id="nombre">
                  <FormLabel mb='6px' fontSize={14}>Nombre <Text color='red' display='inline-flex'>*</Text></FormLabel>
                  <Input fontSize={14} lineHeight='14px' height='32px' type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" required />
              </FormControl>
              <FormControl id="correo">
                  <FormLabel mb='6px' fontSize={14}>Correo electrónico <Text color='red' display='inline-flex'>*</Text></FormLabel>
                  <Input fontSize={14} lineHeight='14px' height='32px' type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo electrónico" required />
              </FormControl>
              <FormControl id="empresa">
                  <FormLabel mb='6px' fontSize={14}>Empresa <Text color='red' display='inline-flex'>*</Text></FormLabel>
                  <Input fontSize={14} lineHeight='14px' height='32px' type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Empresa" required />
              </FormControl>
              <FormControl id="telefono">
                  <FormLabel mb='6px' fontSize={14}>Teléfono <Text color='gray' fontSize={12} display='inline-flex'>(opcional)</Text></FormLabel>
                  <Input fontSize={14} lineHeight='14px' height='32px' type="number" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Celular" />
              </FormControl>
              <FormControl id="Nro-cubos">
                  <FormLabel mb='6px' fontSize={14}>Número de cubos <Text color='gray' fontSize={12} display='inline-flex'>(opcional)</Text></FormLabel>
                  <Input fontSize={14} lineHeight='14px' height='32px' type='text' value={nroCubos || ''} onChange={handleNroCubosChange} placeholder="Número de cubos" />
              </FormControl>
              <FormControl id="mensaje">
                  <FormLabel mb='6px' fontSize={14}>Mensaje <Text color='red' display='inline-flex'>*</Text></FormLabel>
                  <Textarea fontSize={14} lineHeight='14px' value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Escribe detalles sobre tu pedido: fecha, lugar, etc" required />
              </FormControl>
              <Button type="submit" isLoading={isLoading} loadingText="Enviando" colorScheme="blue">Solicitar cotización</Button>
              {/* {error && <p>{error}</p>} */}
            </VStack>


          </Flex>

          <Flex
            width={{ base: '100%', md: '68%' }}
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
    </WebLayout>
  )
}

export default Contactanos
