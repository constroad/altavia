import React, { useState } from 'react'
import axios from 'axios'

import { Flex } from '@chakra-ui/react'

import { ContactForm, ContactFormType, PortalLayout, SubtitleComponent, initialContactForm, toast } from 'src/components'
import { useAsync, useScreenSize } from 'src/common/hooks'
import { API_ROUTES } from 'src/common/consts'

const postEmail = (path: string, data: ContactFormType) => axios.post(path, data);
const Contactanos = () => {
  const [formData, setFormData] = useState<ContactFormType>(initialContactForm)
  const { run, isLoading } = useAsync({ onSuccess: successFunction })
  const { isMobile } = useScreenSize()

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    const data = {
      email: formData.email,
      name: formData.name,
      companyName: formData.companyName,
      ruc: formData.ruc,
      message: formData.message,
      phone: formData.phone,
      nroCubos: formData.nroCubos,
      unitPrice: '',
      nroQuote: ''
    }
    await run( postEmail( API_ROUTES.sendEmail, data ) )

    setFormData(initialContactForm)
  };

  function successFunction() {
    toast.success('Cotización solicitada!')
  }

  return (
    <PortalLayout noPaddingTop>
      <Flex width='100%' marginTop='10px' mb='20px'>
        <Flex
          flexDir={{ base: 'column', md: 'row' }}
          width={{ base: '100%', md: '100%' }}
          marginX='auto'
          justifyContent='space-between'
          px={{ base: '30px', md: '120px' }}
        >
          <Flex
            flexDir='column'
            width={{ base: '100%', md: '39%' }}
            marginTop='20px'
          >
            <SubtitleComponent text='CONTÁCTANOS' />
            
            <ContactForm
              user={formData}
              setter={setFormData}
              isLoading={isLoading}
              handleSubmit={handleSubmit}
            />

          </Flex>

          <Flex
            width={{ base: '100%', md: '59%' }}
            justifyContent={{ base: 'center', md: 'center' }}
            marginTop={{ base: '20px', md: '20px' }}
            alignItems='center'
          >
            <iframe
              className='w-full'
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3902.784458000577!2d-76.87262702479192!3d-11.989411040835808!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c300705538cf%3A0xdb0d06d91ffcf2a3!2sconstroad!5e0!3m2!1ses-419!2spe!4v1709245188866!5m2!1ses-419!2spe"
              width="600"
              height={ isMobile ? "350px" : "450px"}
              loading="lazy"
            />
          </Flex>

        </Flex>
      </Flex>
    </PortalLayout>
  )
}

export default Contactanos
