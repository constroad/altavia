import React, { ChangeEvent } from 'react'
import { Button, Flex, FormControl, FormLabel, Input, Text, Textarea, VStack } from '@chakra-ui/react'
import { User } from 'src/common/types';

type CotizacionFormProps = {
  handleSubmit: (event: { preventDefault: () => void }) => Promise<void>;
  user: User;
  setter: React.Dispatch<React.SetStateAction<User>>;
  isLoading: boolean;
  session?: boolean;
}

export const CotizacionForm = (props: CotizacionFormProps) => {
  const { user, setter, handleSubmit, isLoading, session } = props

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
    const value = e.target.value
    setter({...user, [key]: value})
  }

  const handleNroCubosChange = (event: { target: { value: any } }) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setter({...user, nroCubos: value})
    }
  };

  return (
    <VStack as="form" onSubmit={handleSubmit} spacing={3} mt='20px'>
      <FormControl id="nombre" display={session ? 'none' : 'block'}>
        <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Nombre <Text color='red' display='inline-flex'>*</Text></FormLabel>
        <Input
          fontSize={{ base: 12, md: 14 }}
          lineHeight='14px'
          height='32px'
          type="text"
          value={user.name}
          onChange={(e) => handleChangeValue(e, 'name')}
          placeholder="Nombre"
          required={session ? false : true}
        />
      </FormControl>
      <FormControl id="correo">
        <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>
          Correo electrónico {
            session ?
              <Text color='gray' fontSize={12} display='inline-flex'>(opcional)</Text> :
              <Text color='red' display='inline-flex'>*</Text>
            }
        </FormLabel>
        <Input
          fontSize={{ base: 12, md: 14 }}
          lineHeight='14px'
          height='32px'
          type="email"
          value={user.sender}
          onChange={(e) => handleChangeValue(e, 'sender')}
          placeholder="Correo electrónico"
          required={session ? false : true}
        />
      </FormControl>
      <Flex flexDir={{base: 'column', md: 'row'}} width='100%' gap={{base: '16px', md: '8px'}} justifyContent={{base: '', md: 'space-between'}}>
        <FormControl id="empresa">
          <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Razón social <Text color='red' display='inline-flex'>*</Text></FormLabel>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type="text"
            value={user.razonSocial}
            onChange={(e) => handleChangeValue(e, 'razonSocial')}
            placeholder="Empresa"
            required
          />
        </FormControl>
        <FormControl id="ruc">
          <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>RUC <Text color='gray' fontSize={12} display='inline-flex'>(opcional)</Text></FormLabel>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type="number"
            value={user.ruc}
            onChange={(e) => handleChangeValue(e, 'ruc')}
            placeholder="RUC"
          />
        </FormControl>
      </Flex>
      <FormControl id="telefono" display={session ? 'none' : 'block'}>
        <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Teléfono <Text color='gray' fontSize={12} display='inline-flex'>(opcional)</Text></FormLabel>
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
      <FormControl id="Nro-cubos">
        <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Número de cubos <Text color='gray' fontSize={12} display='inline-flex'>(opcional)</Text></FormLabel>
        <Input
          fontSize={{ base: 12, md: 14 }}
          lineHeight='14px'
          height='32px'
          type='text'
          value={user.nroCubos}
          onChange={handleNroCubosChange}
          placeholder="Número de cubos"
        />
      </FormControl>
      <FormControl id="mensaje" display={session ? 'none' : 'block'}>
        <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Mensaje <Text color='red' display='inline-flex'>*</Text></FormLabel>
        <Textarea
          fontSize={{ base: 12, md: 14 }}
          lineHeight='14px'
          value={user.message}
          onChange={(e) => handleChangeValue(e, 'message')}
          placeholder="Escribe detalles sobre tu pedido: fecha, lugar, etc"
          required={session ? false : true}
        />
      </FormControl>
      <Button
        type="submit"
        isLoading={isLoading}
        loadingText="Enviando"
        colorScheme="blue"
        marginTop={session ? '30px' : ''}
      >
        { session ? 'Generar cotización' : 'Solicitar cotización' }
      </Button>
    </VStack>
  )
}
