import React, { ChangeEvent } from 'react'
import { Button, Flex, FormControl, FormLabel, Input, Text, Textarea, VStack } from '@chakra-ui/react'
import { Quotation } from 'src/common/types';

type CotizacionFormProps = {
  handleSubmit: (event: { preventDefault: () => void }) => Promise<void>;
  client: Quotation;
  setter: React.Dispatch<React.SetStateAction<Quotation>>;
  isLoading: boolean;
  session?: boolean;
}

export const CotizacionForm = (props: CotizacionFormProps) => {
  const { client, setter, handleSubmit, isLoading, session } = props

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
    const value = e.target.value
    setter({...client, [key]: value})
  }

  const handleNroCubosChange = (event: { target: { value: any } }) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setter({...client, nroCubos: value})
    }
  };

  return (
    <VStack as="form" onSubmit={handleSubmit} spacing={3} mt='10px'>
      <FormControl id="nro-cotizacion" display={session ? 'block' : 'none'}>
        <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Cotizacion Nro. <Text color='red' display='inline-flex'>*</Text></FormLabel>
        <Input
          fontSize={{ base: 12, md: 14 }}
          lineHeight='14px'
          height='32px'
          type="number"
          value={client.nroCotizacion}
          placeholder="108"
          onChange={(e) => handleChangeValue(e, 'nroCotizacion')}
          required={session ? true : false}
        />
      </FormControl>
      <FormControl id="nombre" display={session ? 'none' : 'block'}>
        <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Nombre <Text color='red' display='inline-flex'>*</Text></FormLabel>
        <Input
          fontSize={{ base: 12, md: 14 }}
          lineHeight='14px'
          height='32px'
          type="text"
          value={client.name}
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
          value={client.email}
          onChange={(e) => handleChangeValue(e, 'email')}
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
            value={client.razonSocial}
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
            value={client.ruc}
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
          value={client.phone}
          onChange={(e) => handleChangeValue(e, 'phone')}
          placeholder="Celular"
        />
      </FormControl>
      <FormControl id="nro-cubos">
        <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Número de cubos <Text color='gray' fontSize={12} display='inline-flex'>(opcional)</Text></FormLabel>
        <Input
          fontSize={{ base: 12, md: 14 }}
          lineHeight='14px'
          height='32px'
          type='text'
          value={client.nroCubos}
          onChange={handleNroCubosChange}
        />
      </FormControl>
      <FormControl id="precio-unitario" display={session ? 'block' : 'none'}>
        <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Precio unitario <Text color='gray' fontSize={12} display='inline-flex'>(opcional)</Text></FormLabel>
        <Input
          fontSize={{ base: 12, md: 14 }}
          lineHeight='14px'
          height='32px'
          type='number'
          value={client.precioUnitario}
          onChange={(e) => handleChangeValue(e, 'precioUnitario')}
        />
      </FormControl>
      <FormControl id="mensaje" display={session ? 'none' : 'block'}>
        <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Mensaje <Text color='red' display='inline-flex'>*</Text></FormLabel>
        <Textarea
          fontSize={{ base: 12, md: 14 }}
          lineHeight='14px'
          value={client.message}
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
        marginTop={session ? '20px' : ''}
      >
        { session ? 'Generar cotización' : 'Solicitar cotización' }
      </Button>
    </VStack>
  )
}
