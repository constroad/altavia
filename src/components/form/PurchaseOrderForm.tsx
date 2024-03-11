import React, { ChangeEvent } from 'react'
import { Box, Button, Flex, FormControl, FormLabel, Input, Switch, Text, Textarea, VStack } from '@chakra-ui/react'
import { PurchaseOrder } from 'src/common/types';
import ProductTable from '../pruchaseOrder/ProductTable';

type PurchaseOrderFormProps = {
  handleSubmit: (event: { preventDefault: () => void }) => Promise<void>;
  order: PurchaseOrder;
  setter: React.Dispatch<React.SetStateAction<PurchaseOrder>>;
  isLoading: boolean;
  session?: boolean;
}

export const PurchaseOrderForm = (props: PurchaseOrderFormProps) => {
  const { order, setter, handleSubmit, isLoading, session } = props

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
    const value = e.target.value
    setter({...order, [key]: value})
  }

  return (
    <VStack as="form" onSubmit={handleSubmit} spacing={3} mt='10px' width={{ base: '100%', md: '80%' }} mx='auto'>
      <Flex flexDir={{base: 'column', md: 'row'}} width='100%' gap={{base: '16px', md: '8px'}} justifyContent={{base: '', md: 'space-between'}}>
        <FormControl id="nro-order">
          <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Nro. de orden: <Text color='red' display='inline-flex'>*</Text></FormLabel>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type="number"
            value={order.nroOrder}
            placeholder="108"
            onChange={(e) => handleChangeValue(e, 'nroOrder')}
            required
          />
        </FormControl>
        <FormControl id="company-name">
          <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Razón social: <Text color='red' display='inline-flex'>*</Text></FormLabel>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type="text"
            value={order.companyName}
            onChange={(e) => handleChangeValue(e, 'companyName')}
            placeholder="Empresa"
            required
          />
        </FormControl>
      </Flex>

      <Flex flexDir={{base: 'column', md: 'row'}} width='100%' gap={{base: '16px', md: '8px'}} justifyContent={{base: '', md: 'space-between'}}>
        <FormControl id="ruc">
          <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>RUC: <Text color='red' fontSize={12} display='inline-flex'>*</Text></FormLabel>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type="number"
            value={order.ruc}
            onChange={(e) => handleChangeValue(e, 'ruc')}
            placeholder="RUC"
            required
          />
        </FormControl>
        <FormControl id="address">
          <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Dirección: <Text color='gray' fontSize={12} display='inline-flex'>(opcional)</Text></FormLabel>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type="text"
            value={order.address}
            onChange={(e) => handleChangeValue(e, 'address')}
            placeholder="Av. placeholder..."
          />
        </FormControl>
      </Flex>

      <Flex flexDir={{base: 'column', md: 'row'}} width='100%' gap={{base: '16px', md: '8px'}} justifyContent={{base: '', md: 'space-between'}}>
        <FormControl id="payment-method">      
          <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Forma de pago: <Text color='red' fontSize={12} display='inline-flex'>*</Text></FormLabel>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type='text'
            value={order.paymentMethod}
            onChange={(e) => handleChangeValue(e, 'paymentMethod')}
            placeholder="Crédito (x días) - Contado - ..."
            required
          />
        </FormControl>
        <FormControl id="currency">      
          <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Moneda: <Text color='red' fontSize={12} display='inline-flex'>*</Text></FormLabel>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type='text'
            value={order.currency}
            onChange={(e) => handleChangeValue(e, 'currency')}
            required
          />
        </FormControl>
      </Flex>

      <FormControl id="proyect">
        <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Project: <Text color='gray' fontSize={12} display='inline-flex'>(opcional)</Text></FormLabel>
        <Input
          fontSize={{ base: 12, md: 14 }}
          lineHeight='14px'
          height='32px'
          type='text'
          value={order.proyect}
          onChange={(e) => handleChangeValue(e, 'proyect')}
          placeholder='Nombre del proyecto'
        />
      </FormControl>

      {/* TABLE */}
      <Box width='100%' marginTop='5px'>
        <ProductTable order={order} setter={setter} />
      </Box>

      <FormControl id="observations">
        <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>Observaciones: <Text color='gray' fontSize={12} display='inline-flex'>(opcional)</Text></FormLabel>
        <Textarea
          fontSize={{ base: 12, md: 14 }}
          lineHeight='14px'
          height='32px'
          value={order.observations}
          onChange={(e) => handleChangeValue(e, 'observations')}
        />
      </FormControl>


      <Box width='100%' textAlign='start' marginTop='0px'>
        <Text fontSize={{ base: 12, md: 14 }} fontWeight={600} >¿Adjuntar firma digital?</Text>
        <Flex gap='10px' alignItems='center' marginTop='3px'>
          <Switch size="md" onChange={() => setter({...order, attachSignature: !order.attachSignature })} isChecked={order.attachSignature} />
          <Text fontSize={{ base: 12, md: 14 }} fontWeight={600}>{order.attachSignature ? 'Sí' : 'No'}</Text>
        </Flex>
      </Box>

      <Button
        type="submit"
        isLoading={isLoading}
        loadingText="Enviando"
        colorScheme="blue"
        marginTop={session ? '20px' : ''}
      >
        Generar orden de compra
      </Button>
    </VStack>
  )
}
