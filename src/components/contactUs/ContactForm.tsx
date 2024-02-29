import React, { ChangeEvent } from 'react'
import { Button, Flex, FormControl, FormLabel, Input, Text, Textarea, VStack } from '@chakra-ui/react'
import { ContactFormType } from './utils';

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
    <VStack as="form" onSubmit={handleSubmit} spacing={2.5} mt='10px'>
      <FormControl id="contact-name" >
        <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>
          Nombre <Text color='gray' display='inline-flex'>(opcional)</Text>
        </FormLabel>
        <Input
          fontSize={{ base: 12, md: 14 }}
          lineHeight='14px'
          height='32px'
          type="text"
          value={user.name}
          onChange={(e) => handleChangeValue(e, 'name')}
          placeholder="Nombre"
        />
      </FormControl>

      <FormControl id="contact-email">
        <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>
          Correo electrónico <Text color='red' display='inline-flex'>*</Text>
        </FormLabel>
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
      </FormControl>

      <Flex
        flexDir={{base: 'column', md: 'row'}}
        width='100%'
        gap={{base: '16px', md: '8px'}}
        justifyContent={{base: '', md: 'space-between'}}
      >
        <FormControl id="contact-company-name">
          <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>
            Razón social <Text color='red' display='inline-flex'>*</Text>
          </FormLabel>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type="text"
            value={user.companyName}
            onChange={(e) => handleChangeValue(e, 'companyName')}
            placeholder="Razón social"
            required
          />
        </FormControl>

        <FormControl id="contact-ruc">
          <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>
            RUC <Text color='red' fontSize={12} display='inline-flex'>*</Text>
          </FormLabel>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type="number"
            value={user.ruc}
            onChange={(e) => handleChangeValue(e, 'ruc')}
            placeholder="RUC"
            required
          />
        </FormControl>
      </Flex>

      <FormControl id="contact-message">
        <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>
          Mensaje <Text color='gray' display='inline-flex'>(opcional)</Text>
        </FormLabel>
        <Textarea
          fontSize={{ base: 12, md: 14 }}
          lineHeight='14px'
          value={user.message}
          onChange={(e: any) => handleChangeValue(e, 'message')}
          placeholder="Escribe detalles sobre tu pedido: fecha, lugar, etc"
        />
      </FormControl>

      <FormControl id="contact-phone" >
        <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>
          Teléfono <Text color='gray' fontSize={12} display='inline-flex'>(opcional)</Text>
        </FormLabel>
        <Input
          fontSize={{ base: 12, md: 14 }}
          lineHeight='14px'
          height='32px'
          type="number"
          value={user.phone}
          onChange={(e) => handleChangeValue(e, 'phone')}
          placeholder="Celular"
        />
      </FormControl>

      <FormControl id="nro-cubos">
        <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>
          Número de cubos <Text color='gray' fontSize={12} display='inline-flex'>(opcional)</Text>
        </FormLabel>
        <Input
          fontSize={{ base: 12, md: 14 }}
          lineHeight='14px'
          height='32px'
          type='number'
          value={user.nroCubos}
          defaultValue={1}
          onChange={(e) => handleChangeValue(e, 'quantity')}
        />
      </FormControl>

      <Button
        type="submit"
        isLoading={isLoading}
        loadingText="Enviando"
        colorScheme="blue"
      >
        Solicitar cotización
      </Button>
    </VStack>
  )
}
