import { Box, Button, Flex, FormControl, FormLabel, Input, Text, VStack } from '@chakra-ui/react'
import React from 'react'

interface DispathFormProps {
  handleSubmit?: (event: { preventDefault: () => void }) => Promise<void>;
}

export const DispatchForm = (props: DispathFormProps) => {
  const { handleSubmit } = props
  return (
    <>
      <Flex as="form" onSubmit={handleSubmit} mt='5px' display='flex' gap='4px'>
        <FormControl id="nro-cotizacion">
          <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Cotizacion Nro.</FormLabel>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type="number"
            // value={client.nroCotizacion}
            placeholder="108"
            // onChange={(e) => handleChangeValue(e, 'nroCotizacion')}
            // required={session ? true : false}
          />
        </FormControl>
        <FormControl id="nombre" >
          <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Nombre</FormLabel>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type="text"
            // value={client.name}
            // onChange={(e) => handleChangeValue(e, 'name')}
            placeholder="Nombre"
            // required={session ? false : true}
          />
        </FormControl>
        <FormControl id="correo">
          <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>
            Correo electrónico 
          </FormLabel>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type="email"
            // value={client.email}
            // onChange={(e) => handleChangeValue(e, 'email')}
            placeholder="Correo electrónico"
            // required={session ? false : true}
          />
        </FormControl>
        {/* <Flex flexDir={{base: 'column', md: 'row'}} width='100%' gap={{base: '16px', md: '8px'}} justifyContent={{base: '', md: 'space-between'}}>
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
        </Flex> */}
        <FormControl id="telefono">
          <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Teléfono </FormLabel>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type="number"
            // value={client.phone}
            // onChange={(e) => handleChangeValue(e, 'phone')}
            placeholder="Celular"
          />
        </FormControl>
        <FormControl id="nro-cubos">
          <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Número de cubos </FormLabel>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type='number'
            // value={client.nroCubos}
            // onChange={(e) => handleChangeValue(e, 'nroCubos')}
          />
        </FormControl>
        <FormControl id="precio-unitario" >
          <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Precio unitario </FormLabel>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type='number'
            // value={client.precioUnitario}
            // onChange={(e) => handleChangeValue(e, 'precioUnitario')}
          />
        </FormControl>
        {/* <Flex width='100%' justifyContent='space-between' fontSize={12}>
          <Flex flexDir='column'>
            <Text fontWeight={600}>Subtotal</Text>
            <Box paddingY='2px' paddingX='4px' rounded='4px' border='0.5px solid' borderColor='lightgray'></Box>
          </Flex>
          <Flex flexDir='column'>
            <Text fontWeight={600}>IGV</Text>
            <Box paddingY='2px' paddingX='4px' rounded='4px' border='0.5px solid' borderColor='lightgray'></Box>
          </Flex>
          <Flex flexDir='column'>
            <Text fontWeight={600}>Total</Text>
            <Box paddingY='2px' paddingX='4px' rounded='4px' border='0.5px solid' borderColor='lightgray' bg='#ffaf52'>{formattedTotal}</Box>
          </Flex>
        </Flex> */}
        {/* <FormControl id="mensaje" display={session ? 'none' : 'block'}>
          <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Mensaje <Text color='red' display='inline-flex'>*</Text></FormLabel>
          <Textarea
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            value={client.message}
            onChange={(e) => handleChangeValue(e, 'message')}
            placeholder="Escribe detalles sobre tu pedido: fecha, lugar, etc"
            required={session ? false : true}
          />
        </FormControl> */}
       
      </Flex>

      <Box>
        <Button
          type="submit"
          // isLoading={isLoading}
          loadingText="Enviando"
          colorScheme="blue"
          // marginTop={session ? '10px' : ''}
        >
          {/* { session ? 'Generar cotización' : 'Solicitar cotización' } */}
          submit
        </Button>
      </Box>
    </>
  )
}

export default DispatchForm
