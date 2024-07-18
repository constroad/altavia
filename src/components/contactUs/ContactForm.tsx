import React, { ChangeEvent } from 'react'
import { Button, Flex, FormControl, FormLabel, Input, Text, Textarea, VStack } from '@chakra-ui/react'
import { ContactFormType } from './utils';
import { CONSTROAD_COLORS } from 'src/styles/shared';

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
    <VStack as="form" onSubmit={handleSubmit} spacing={2.5} mt='10px' className='font-logo'>
      <FormControl id="contact-name" >
        <Flex alignItems='center' gap='5px'>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight={{ base: '12px', md: '14px' }}
            height='32px'
            type="text"
            value={user.name}
            onChange={(e) => handleChangeValue(e, 'name')}
            placeholder="Nombre"
            required
          />
          <Text fontSize={{ base: 12, md: 18 }} fontWeight={600} mt='4px' color='red' w='8px'>*</Text>
        </Flex>
      </FormControl>

      <FormControl id="contact-email" mt='5px'>
        <Flex alignItems='center' gap='5px'>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type="email"
            value={user.email}
            onChange={(e) => handleChangeValue(e, 'email')}
            placeholder="Correo electrónico"
            required
          />
          <Text fontSize={{ base: 12, md: 18 }} fontWeight={600} mt='4px' color='red' w='8px'>*</Text>
        </Flex>
      </FormControl>

      <FormControl id="contact-company-name">
        <Flex alignItems='center' gap='5px'>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type="text"
            value={user.companyName}
            onChange={(e) => handleChangeValue(e, 'companyName')}
            placeholder="Razón social"
          />
          <Text fontSize={{ base: 12, md: 18 }} fontWeight={600} mt='4px' color='red' w='8px' />
        </Flex>
      </FormControl>

      <FormControl id="contact-ruc">
        <Flex alignItems='center' gap='5px'>  
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type="number"
            value={user.ruc}
            onChange={(e) => handleChangeValue(e, 'ruc')}
            placeholder="RUC"
          />
          <Text fontSize={{ base: 12, md: 18 }} fontWeight={600} mt='4px' color='red' w='8px' />
        </Flex>
      </FormControl>

      <FormControl id="contact-message">
        <Flex alignItems='center' gap='5px'>
          <Textarea
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            value={user.message}
            onChange={(e: any) => handleChangeValue(e, 'message')}
            placeholder="Escribe detalles sobre tu pedido: fecha, lugar, etc"
          />
          <Text fontSize={{ base: 12, md: 18 }} fontWeight={600} mt='4px' color='red' w='8px' />
        </Flex>
      </FormControl>

      <FormControl id="contact-phone" >
        <Flex alignItems='center' gap='5px'>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type="number"
            value={user.phone}
            onChange={(e) => handleChangeValue(e, 'phone')}
            placeholder="Celular 987654321"
          />
          <Text fontSize={{ base: 12, md: 18 }} fontWeight={600} mt='4px' color='red' w='8px' />
        </Flex>
      </FormControl>

      <FormControl id="nro-cubos">
        <Flex alignItems='center' gap='5px'>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type='number'
            value={user.nroCubos}
            onChange={(e) => handleChangeValue(e, 'nroCubos')}
            placeholder="Número de cubos (M3)"
          />
          <Text fontSize={{ base: 12, md: 18 }} fontWeight={600} mt='4px' color='red' w='8px' />
        </Flex>
      </FormControl>

      <Button
        type="submit"
        isLoading={isLoading}
        loadingText="Enviando"
        colorScheme='orange'
        size='sm'
        border='1px solid black'
        className='font-logo'
      >
        Solicitar cotización
      </Button>
    </VStack>
  )
}
