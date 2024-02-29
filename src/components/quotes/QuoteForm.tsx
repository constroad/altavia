import React, { ChangeEvent } from 'react'
import { Box, Button, Flex, FormControl, FormLabel, Input, Text, Textarea, VStack } from '@chakra-ui/react'
import { QuoteType, getQuotePrices } from '.';
import { ClientType } from '../clients';

type QuoteFormProps = {
  quote: QuoteType;
  quoteSelected?: QuoteType;
  setter: React.Dispatch<React.SetStateAction<QuoteType>> | React.Dispatch<React.SetStateAction<QuoteType | undefined>>;
  client?: ClientType | undefined
  isLoading: boolean;
  quoteNotes: string;
  handleChangeNotes: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: any) => void
}

export const QuoteForm = (props: QuoteFormProps) => {
  const { quote, setter, handleSubmit, isLoading, client, quoteSelected } = props

  const { formattedSubtotal, formattedIGV, formattedTotal } = getQuotePrices(
    quote?.items[0].quantity,
    quote.items[0].price,
    true
  )

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
    let value = e.target.value
    const newArr = [...quote.items] 

    if ( setter ) {
      if ( key === 'quantity') {
        newArr[0] = { ...newArr[0], quantity: Number(value) }
        setter({...quote, items: newArr})
  
      } else if ( key === 'price' ) {
        newArr[0] = {...newArr[0], price: Number(value)}
        setter({...quote, items: newArr})
  
      } else if ( key === 'description' ) {
        newArr[0] = {...newArr[0], description: value}
        setter({...quote, items: newArr})
  
      } else {
        setter({...quote, [key]: value})
      }
    }
  }

  return (
    <VStack as="form" onSubmit={handleSubmit} spacing={2.5} mt='5px'>
      <Flex
        flexDir={{base: 'column', md: 'row'}}
        width='100%'
        gap={{base: '16px', md: '8px'}}
        justifyContent={{base: '', md: 'space-between'}}
      >
        <FormControl id="empresa">
          <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>
            Razón social <Text color='red' display='inline-flex'>*</Text>
          </FormLabel>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type="text"
            value={client ? client.name : ''}
            onChange={(e) => handleChangeValue(e, 'companyName')}
            placeholder="Empresa"
            required
            disabled
          />
        </FormControl>

        <FormControl id="ruc">
          <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>
            RUC <Text color='red' fontSize={12} display='inline-flex'>*</Text>
          </FormLabel>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type="number"
            value={client ? client.ruc : ''}
            onChange={(e) => handleChangeValue(e, 'ruc')}
            placeholder="RUC"
            disabled
            required
          />
        </FormControl>
      </Flex>

      <FormControl id='product-description'>
        <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>
          Producto: <Text color='red' display='inline-flex'>*</Text>
          <Input
            fontSize={{ base: 12, md: 14 }}
            lineHeight='14px'
            height='32px'
            type="text"
            value={quote.items[0].description}
            onChange={(e) => handleChangeValue(e, 'description')}
            placeholder="Producto"
            required
          />
        </FormLabel>
      </FormControl>

      <FormControl id="notes">
        <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>
          Notas <Text color='gray' display='inline-flex'>(opcional)</Text>
        </FormLabel>
        <Textarea
          fontSize={{ base: 12, md: 14 }}
          lineHeight='14px'
          value={props.quoteNotes}
          onChange={(e: any) => props.handleChangeNotes(e)}
          placeholder="Escribe detalles sobre tu pedido: fecha, lugar, etc"
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
          value={quote.items[0].quantity !== 0 ? quote.items[0].quantity : ''}
          defaultValue={1}
          onChange={(e) => handleChangeValue(e, 'quantity')}
        />
      </FormControl>

      <FormControl id="precio-unitario">
        <FormLabel mb='6px' fontSize={{ base: 12, md: 14 }}>
          Precio unitario <Text color='gray' fontSize={12} display='inline-flex'>(opcional)</Text>
        </FormLabel>
        <Input
          fontSize={{ base: 12, md: 14 }}
          lineHeight='14px'
          height='32px'
          type='number'
          defaultValue={''}
          value={quote.items[0].price !== 0 ? quote.items[0].price : ''}
          onChange={(e) => handleChangeValue(e, 'price')}
        />
      </FormControl>

      <Flex width='100%' justifyContent='space-between' fontSize={12}>
        <Flex flexDir='column'>
          <Text fontWeight={600}>Subtotal</Text>
          <Box paddingY='2px' paddingX='4px' rounded='4px' border='0.5px solid' borderColor='lightgray'>{formattedSubtotal}</Box>
        </Flex>
        <Flex flexDir='column'>
          <Text fontWeight={600}>IGV</Text>
          <Box paddingY='2px' paddingX='4px' rounded='4px' border='0.5px solid' borderColor='lightgray'>{formattedIGV}</Box>
        </Flex>
        <Flex flexDir='column'>
          <Text fontWeight={600}>Total</Text>
          <Box paddingY='2px' paddingX='4px' rounded='4px' border='0.5px solid' borderColor='lightgray' bg='#ffaf52'>{formattedTotal}</Box>
        </Flex>
      </Flex>

      <Button
        type="submit"
        isLoading={isLoading}
        loadingText="Enviando"
        colorScheme="blue"
      >
        {quoteSelected ? 'Guardar cambios' : 'Generar cotización'}
      </Button>
    </VStack>
  )
}
