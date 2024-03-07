import React, { ChangeEvent } from 'react'
import { Box, Button, Flex, Text, VStack } from '@chakra-ui/react'
import { QuoteType, getQuotePrices } from '.';
import { ClientType } from '../clients';
import { FormInput } from '../form';

type QuoteFormProps = {
  quote: QuoteType;
  quoteSelected?: QuoteType;
  setter: React.Dispatch<React.SetStateAction<QuoteType>> | React.Dispatch<React.SetStateAction<QuoteType | undefined>>;
  client?: ClientType | undefined
  isLoading: boolean;
  quoteNotes?: string | undefined;
  onChangeDate: (e: ChangeEvent<HTMLInputElement>) => void;
  dateValue: string;
  handleChangeNotes?: (e: ChangeEvent<HTMLInputElement>) => void | undefined;
  handleSubmit: (e: any) => void
}

export const QuoteForm = (props: QuoteFormProps) => {
  const { quote, setter, handleSubmit, isLoading, client, quoteSelected, dateValue } = props

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
      <Flex width='100%' justifyContent='start'>
        <Box width='49%'>
          <FormInput
            id='quote-date'
            label='Fecha'
            value={dateValue}
            placeholder='YYYY/MM/DD'
            onChange={(e) => props.onChangeDate(e)}
            type='date'
          />
        </Box>
      </Flex>

      <Flex
        flexDir={{base: 'column', md: 'row'}}
        width='100%'
        gap={{base: '10px', md: '8px'}}
        justifyContent={{base: '', md: 'space-between'}}
      >
        <FormInput
          id='quote-company-name'
          label='Razón social'
          value={client?.name ?? ''}
          placeholder='Elige un cliente para llenar este campo'
          required
        />

        <FormInput
          id='quote-company-ruc'
          label='RUC'
          value={client?.ruc ?? ''}
          placeholder='Elige un cliente para llenar este campo'
          required
        />
      </Flex>

      <FormInput
        id='quote-product-name'
        label='Producto'
        value={quote.items[0].description}
        placeholder='Nombre del producto'
        onChange={(e) => handleChangeValue(e, 'description')}
        required
      />

      <FormInput
        id='quote-nro-cubos'
        label='Número de cubos'
        value={quote.items[0].quantity !== 0 ? quote.items[0].quantity : ''}
        onChange={(e) => handleChangeValue(e, 'quantity')}
      />

      <FormInput
        id='quote-unit-price'
        label='Precio unitario'
        value={quote.items[0].price !== 0 ? quote.items[0].price : ''}
        onChange={(e) => handleChangeValue(e, 'price')}
      />

      <Flex width='100%' justifyContent='space-between' fontSize={{ base: 10, md: 12 }}>
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
        size='sm'
        fontSize={{ base: 10, md: 12 }}
      >
        {quoteSelected ? 'Guardar cambios' : 'Generar cotización'}
      </Button>
    </VStack>
  )
}
