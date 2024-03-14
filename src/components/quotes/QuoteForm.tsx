import React, { ChangeEvent } from 'react'
import { Box, Button, Flex, Switch, Text, VStack } from '@chakra-ui/react'
import { QuoteProductTable, QuoteType, getQuotePrices } from '.';
import { ClientType } from '../clients';
import { FormInput } from '../form';
import { PlusIcon } from 'src/common/icons';
import { useRouter } from 'next/router';
import { SearchComponent } from '../Search';
import { ADMIN_ROUTES } from 'src/common/consts';
import { ProductType } from '../products';
import { CustomDivider } from '../CustomDivider';

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
  addIGV: boolean;
  onChangeAddIGV: () => void;
  handleSubmit: (e: any) => void;
  clientsDB: ClientType[];
  handleSelectClient: (client: ClientType) => void;
  productsDB: ProductType[];
  handleSelectProduct: (prod: ProductType) => void
}

export const QuoteForm = (props: QuoteFormProps) => {
  const {
    quote,
    setter,
    handleSubmit,
    isLoading,
    client,
    quoteSelected,
    dateValue,
    clientsDB,
    handleSelectClient,
    productsDB,
    handleSelectProduct,
  } = props
  const router = useRouter()

  const { formattedSubtotal, formattedIGV, formattedTotal } = getQuotePrices(quote.items, true, true)
  
  return (
    <VStack as="form" onSubmit={handleSubmit} spacing={2.5} mt='5px'>
      <CustomDivider label='Cliente' />
       
      {/* client search */}
      <Flex width='100%' justifyContent='space-between' alignItems='center'>
        <Box width='80%'>
          <SearchComponent
            placeholder='Buscar cliente por nombre, alias o RUC'
            options={clientsDB}
            propertiesToSearch={['name', 'ruc', 'alias']}
            onSelect={handleSelectClient}
          />
        </Box>

        <Box width='18%'>
          <Button
            fontSize={10}
            whiteSpace='normal'
            gap='2px'
            px='10px'
            h='32px'
            onClick={() => {
              router.push({
                pathname: ADMIN_ROUTES.clients,
                query: { prevRoute: ADMIN_ROUTES.generateQuotation }
              }
            )}}
          >
            <Text>Añadir cliente </Text>
            <PlusIcon/>
          </Button>
        </Box>
      </Flex>

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
          onChange={() => null}
          required
        />

        <FormInput
          id='quote-company-ruc'
          label='RUC'
          value={client?.ruc ?? ''}
          placeholder='Elige un cliente para llenar este campo'
          onChange={() => null}
          required
        />
      </Flex>

      <CustomDivider label='Productos' marginTop='15px' />

      {/* product search */}
      <Flex width='100%' justifyContent='space-between' alignItems='center'>
        <Box width='80%'>
          <SearchComponent
            placeholder='Buscar producto por nombre o alias'
            options={productsDB}
            propertiesToSearch={['description', 'alias']}
            onSelect={handleSelectProduct}
          />
        </Box>

        <Box width='18%'>
          <Button
            fontSize={10}
            whiteSpace='normal'
            gap='2px'
            px='10px'
            h='32px'
            onClick={() => {
              router.push({
                pathname: ADMIN_ROUTES.products,
                query: { prevRoute: ADMIN_ROUTES.generateQuotation }
              }
            )}}
          >
            <Text>Añadir producto </Text>
            <PlusIcon/>
          </Button>
        </Box>
      </Flex>

      {/* TABLE */}
      <Box width='100%' marginTop='5px'>
        <QuoteProductTable quote={quote} setter={setter} />
      </Box>

      <Box width='100%' textAlign='start' marginTop='10px'>
        <Text fontSize={{ base: 10, md: 12 }} fontWeight={600} >¿Aplicar IGV?</Text>
        <Flex gap='10px' alignItems='center' marginTop='3px'>
          <Switch size="md" onChange={props.onChangeAddIGV} isChecked={props.addIGV} />
          <Text fontSize={{ base: 10, md: 12 }} fontWeight={600}>{props.addIGV ? 'Sí' : 'No'}</Text>
        </Flex>
      </Box>

      <Flex width='100%' justifyContent='space-between' fontSize={{ base: 10, md: 12 }} mt='10px'>
        <Flex flexDir='column'>
          <Text fontWeight={600}>Subtotal</Text>
          <Box paddingY='2px' paddingX='4px' rounded='4px' border='0.5px solid' borderColor='lightgray'>{formattedSubtotal}</Box>
        </Flex>
        <Flex flexDir='column'>
          <Text fontWeight={600}>IGV</Text>
          <Box
            paddingY='2px'
            paddingX='4px'
            rounded='4px'
            border='0.5px solid'
            borderColor='lightgray'
          >
            { props.addIGV ? formattedIGV : '0.00' }
          </Box>
        </Flex>
        <Flex flexDir='column'>
          <Text fontWeight={600}>Total</Text>
          <Box
            paddingY='2px'
            paddingX='4px'
            rounded='4px'
            border='0.5px solid'
            borderColor='lightgray'
            bg='#ffaf52'
          >
            { props.addIGV ? formattedTotal : formattedSubtotal }
          </Box>
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
