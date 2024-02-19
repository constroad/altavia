import { Box, Button, Flex, FormControl, FormLabel, Grid, Input, Text, VStack } from '@chakra-ui/react'
import React from 'react'

interface DispathFormProps {
  handleSubmit?: (event: { preventDefault: () => void }) => Promise<void>;
}

export const DispatchForm = (props: DispathFormProps) => {
  const { handleSubmit } = props
  return (
    <>
      <Grid
        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(10, 1fr)" }}
        gap={2}
      >
        <FormControl id="material">
          <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Material</FormLabel>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type="text"
            // value={client.nroCotizacion}
            placeholder=""
            // onChange={(e) => handleChangeValue(e, 'nroCotizacion')}
            // required={session ? true : false}
          />
        </FormControl>
        <FormControl id="plate" >
          <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Placa</FormLabel>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type="text"
            // value={client.name}
            // onChange={(e) => handleChangeValue(e, 'name')}
            placeholder=""
            // required={session ? false : true}
          />
        </FormControl>
        <FormControl id="invoice">
          <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Factura</FormLabel>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type="text"
            // value={client.email}
            // onChange={(e) => handleChangeValue(e, 'email')}
            placeholder=""
            // required={session ? false : true}
          />
        </FormControl>
        <FormControl id="guide">
          <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Guia</FormLabel>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type="text"
            // value={client.phone}
            // onChange={(e) => handleChangeValue(e, 'phone')}
            placeholder=""
          />
        </FormControl>
        <FormControl id="nro-cubos">
          <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>M3 </FormLabel>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type='number'
            // value={client.nroCubos}
            // onChange={(e) => handleChangeValue(e, 'nroCubos')}
          />
        </FormControl>
        <FormControl id="client" >
          <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Cliente</FormLabel>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type='text'
            // value={client.precioUnitario}
            // onChange={(e) => handleChangeValue(e, 'precioUnitario')}
          />
        </FormControl>
        <FormControl id="proyect" >
          <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Obra</FormLabel>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type='text'
            // value={client.precioUnitario}
            // onChange={(e) => handleChangeValue(e, 'precioUnitario')}
          />
        </FormControl>
        <FormControl id="carrier" >
          <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Transportista</FormLabel>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type='text'
            // value={client.precioUnitario}
            // onChange={(e) => handleChangeValue(e, 'precioUnitario')}
          />
        </FormControl>
        <FormControl id="price" >
          <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Precio</FormLabel>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type='number'
            // value={client.precioUnitario}
            // onChange={(e) => handleChangeValue(e, 'precioUnitario')}
          />
        </FormControl>
        <FormControl id="payment-done" >
          <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Pagos</FormLabel>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type='text'
            // value={client.precioUnitario}
            // onChange={(e) => handleChangeValue(e, 'precioUnitario')}
          />
        </FormControl>
      </Grid>

      <Box>
        <Button
          type="submit"
          // isLoading={isLoading}
          loadingText="Enviando"
          colorScheme="blue"
          onClick={handleSubmit}
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
