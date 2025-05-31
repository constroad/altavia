import React, { ChangeEvent } from 'react'
import { Button, Flex, Input, Text, Textarea } from '@chakra-ui/react'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { VStack } from '@chakra-ui/layout'
import { ContactFormType } from './utils';
// import { CONSTROAD_COLORS } from 'src/styles/shared';

type ContactFormProps = {
  user: ContactFormType;
  setter: React.Dispatch<React.SetStateAction<ContactFormType>> | React.Dispatch<React.SetStateAction<ContactFormType | undefined>>;
  isLoading: boolean;
  handleSubmit: (e: any) => void
}

export const ContactForm = (props: ContactFormProps) => {
  const { user, setter, handleSubmit, isLoading } = props

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
    const value = e.target.value
    if (setter) {
      setter({...user, [key]: value})
    }
  }

  return (
    <VStack as="form" onSubmit={handleSubmit} spacing={5} mt='10px' className='font-logo' w='100%'>
      <FormControl id="contact-name" w='100%'>
        <Flex alignItems='center' gap='5px' w='100%'>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight={{ base: '12px', md: '14px' }}
            height='32px'
            width='100%'
            type="text"
            value={user.name}
            onChange={(e) => handleChangeValue(e, 'name')}
            placeholder="Nombre"
            required
          />
          <Text fontSize={{ base: 12, md: 18 }} fontWeight={600} mt='4px' color='red' w='8px'>*</Text>
        </Flex>
      </FormControl>

      <FormControl id="contact-email" mt='5px' width='100%'>
        <Flex alignItems='center' gap='5px'>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            width='100%'
            type="email"
            value={user.email}
            onChange={(e) => handleChangeValue(e, 'email')}
            placeholder="Correo electrónico"
            required
          />
          <Text fontSize={{ base: 12, md: 18 }} fontWeight={600} mt='4px' color='red' w='8px'>*</Text>
        </Flex>
      </FormControl>

      <FormControl id="contact-company-name" width='100%'>
        <Flex alignItems='center' gap='5px'>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            width='100%'
            type="text"
            value={user.companyName}
            onChange={(e) => handleChangeValue(e, 'companyName')}
            placeholder="Razón social"
          />
          <Text fontSize={{ base: 12, md: 18 }} fontWeight={600} mt='4px' color='red' w='8px' />
        </Flex>
      </FormControl>

      <FormControl id="contact-ruc" width='100%'>
        <Flex alignItems='center' gap='5px'>  
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            width='100%'
            type="number"
            value={user.ruc}
            onChange={(e) => handleChangeValue(e, 'ruc')}
            placeholder="RUC"
          />
          <Text fontSize={{ base: 12, md: 18 }} fontWeight={600} mt='4px' color='red' w='8px' />
        </Flex>
      </FormControl>

      <FormControl id="contact-message" width='100%'>
        <Flex alignItems='center' gap='5px'>
          <Textarea
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            width='100%'
            value={user.message}
            onChange={(e: any) => handleChangeValue(e, 'message')}
            placeholder="Cuéntanos sobre el tipo de envío..."
          />
          <Text fontSize={{ base: 12, md: 18 }} fontWeight={600} mt='4px' color='red' w='8px' />
        </Flex>
      </FormControl>

      <FormControl id="contact-phone" width='100%'>
        <Flex alignItems='center' gap='5px'>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            width='100%'
            type="number"
            value={user.phone}
            onChange={(e) => handleChangeValue(e, 'phone')}
            placeholder="Celular"
          />
          <Text fontSize={{ base: 12, md: 18 }} fontWeight={600} mt='4px' color='red' w='8px' />
        </Flex>
      </FormControl>

      <FormControl id="contact-city-start" width='100%'>
        <Flex alignItems='center' gap='5px'>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            width='100%'
            type="text"
            value={user.startCity}
            onChange={(e) => handleChangeValue(e, 'startCity')}
            placeholder="Ciudad de partida"
          />
          <Text fontSize={{ base: 12, md: 18 }} fontWeight={600} mt='4px' color='red' w='8px' />
        </Flex>
      </FormControl>

      <FormControl id="contact-city-end" width='100%'>
        <Flex alignItems='center' gap='5px'>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            width='100%'
            type="text"
            value={user.endCity}
            onChange={(e) => handleChangeValue(e, 'endCity')}
            placeholder="Ciudad de destino"
          />
          <Text fontSize={{ base: 12, md: 18 }} fontWeight={600} mt='4px' color='red' w='8px' />
        </Flex>
      </FormControl>

      {/* <FormControl id="nro-cubos" width='100%'>
        <Flex alignItems='center' gap='5px'>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            width='100%'
            type='number'
            value={user.nroCubos}
            onChange={(e) => handleChangeValue(e, 'nroCubos')}
            placeholder="Número de cubos (M3)"
          />
          <Text fontSize={{ base: 12, md: 18 }} fontWeight={600} mt='4px' color='red' w='8px' />
        </Flex>
      </FormControl> */}

      <Button
        type="submit"
        loading={isLoading}
        loadingText="Enviando"
        colorScheme='orange'
        size='sm'
        border='1px solid black'
        className='font-logo'
        fontWeight={600}
        mt='5px'
      >
        Solicitar cotización
      </Button>
    </VStack>
  )
}
