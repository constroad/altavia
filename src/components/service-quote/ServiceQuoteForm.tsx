import React, { ChangeEvent } from 'react'
import { Box, Button, Flex, Switch, Text, VStack } from '@chakra-ui/react'
import { ServiceQuoteType } from '.';
import { ClientType } from '../clients';
import { FormInput, FormTextarea } from '../form';
import { PlusIcon } from 'src/common/icons';
import { useRouter } from 'next/router';
import { SearchComponent } from '../Search';
import { ADMIN_ROUTES, CONSTROAD } from 'src/common/consts';
import { ProductType } from '../products';
import { CustomDivider } from '../CustomDivider';
import { CONSTROAD_COLORS } from 'src/styles/shared';
import { getQuotePrices } from '../quotes';
import ServiceQuoteTable from './ServiceQuoteTable';
import ServiceQuoteTexts from './ServiceQuoteTexts';
import { v4 as uuidv4 } from 'uuid';
import { ServiceType } from '../services';

type ServiceQuoteFormProps = {
  quote: ServiceQuoteType;
  quoteSelected?: ServiceQuoteType;
  setter: React.Dispatch<React.SetStateAction<ServiceQuoteType>> | React.Dispatch<React.SetStateAction<ServiceQuoteType | undefined>>;
  client?: ClientType | undefined
  isLoading: boolean;
  onChangeDate: (e: ChangeEvent<HTMLInputElement>) => void;
  dateValue: string;
  addIGV: boolean;
  onChangeAddIGV: () => void;
  handleSubmit: (e: any) => void;
  clientsDB: ClientType[];
  handleSelectClient: (client: ClientType) => void;
  servicesDB: ServiceType[];
  handleSelectService: (prod: ServiceType) => void
  title?: string | undefined
}

export const ServiceQuoteForm = (props: ServiceQuoteFormProps) => {
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
    servicesDB,
    handleSelectService,
  } = props
  const router = useRouter()

  const { formattedSubtotal, formattedIGV, formattedTotal } = getQuotePrices(quote.items, true, true)

  const handleChangeNotes = (value: string, noteIdx: number, textIdx: number) => {
    const updatedNotes = quote.notes.map((note, idx) => {
      if (idx === noteIdx) {
        return {
          ...note,
          texts: note.texts.map((text, tIdx) =>
            tIdx === textIdx ? {...text, value: value.toLowerCase()} : text
          )
        };
      }
      return note;
    });
  
    setter({ ...quote, notes: updatedNotes });
  };

  const handleAddNewText = (noteIdx: number) => {
    const updatedNotes = quote.notes.map((note, idx) => {
      if (idx === noteIdx) {
        return { ...note, texts: [...note.texts, { id: uuidv4(), value: '' }] };
      }
      return note;
    });

    setter({ ...quote, notes: updatedNotes });
  };

  const handleDeleteText = (noteIdx: number, textIdx: number) => {
    const updatedNotes = quote.notes.map((note, idx) => {
      if (idx === noteIdx) {
        return { ...note, texts: note.texts.filter((text, tIdx) => tIdx !== textIdx) };
      }
      return note;
    });

    setter({ ...quote, notes: updatedNotes });
  };
  
  return (
    <VStack
      as="form"
      onSubmit={handleSubmit}
      spacing={2.5}
      my='0px'
      pb={{ base: '10px', md: '20px' }}
      px='10px'
      border={props. title ? '1px solid' : ''}
      rounded='8px'
      borderColor={CONSTROAD_COLORS.lightGray}
    >
      {props.title && (
        <Text
          fontSize={{ base: 20, md: 30 }}
          fontWeight={700}
          color='black'
          lineHeight={{ base: '28px', md: '39px' }}
          marginX='auto'
        >
          {props.title}
        </Text>
      )}

      <CustomDivider label='Cliente' />
       
      {/* client search */}
      <Flex width='100%' justifyContent='space-between' alignItems='center'>
        <Box width={{ base: '75%', md: '85%' }}>
          <SearchComponent
            placeholder='Buscar cliente por nombre, alias o RUC'
            options={clientsDB}
            propertiesToSearch={['name', 'ruc', 'alias']}
            onSelect={handleSelectClient}
          />
        </Box>

        <Box width={{ base: '23%', md: '13%' }} textAlign='end'>
          <Button
            fontSize={10}
            whiteSpace='normal'
            gap='2px'
            px='10px'
            h='32px'
            onClick={() => {
              router.push({
                pathname: ADMIN_ROUTES.clients,
                query: { prevRoute: ADMIN_ROUTES.serviceQuote }
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
        />
      </Flex>

      <CustomDivider label='Servicios' marginTop='40px' />

      {/* Service search */}
      <Flex width='100%' justifyContent='space-between' alignItems='center'>
        <Box width={{ base: '75%', md: '85%' }}>
          <SearchComponent
            placeholder='Buscar servicio por nombre, fase o alias'
            options={servicesDB}
            propertiesToSearch={['description', 'alias', 'phase']}
            onSelect={handleSelectService}
            isService
          />
        </Box>

        <Box width={{ base: '23%', md: '13%' }} textAlign='end'>
          <Button
            fontSize={10}
            whiteSpace='normal'
            gap='2px'
            px='10px'
            h='32px'
            onClick={() => {
              router.push({
                pathname: ADMIN_ROUTES.services,
                query: { prevRoute: ADMIN_ROUTES.serviceQuote }
              }
            )}}
          >
            <Text>Añadir servicio </Text>
            <PlusIcon/>
          </Button>
        </Box>
      </Flex>

      {/* TABLE */}
      <Box width='100%' marginTop='0px'>
        <ServiceQuoteTable quote={quote} setter={setter} servicesDB={servicesDB} /> 
      </Box>

      <Box width='100%' textAlign='start' mt='5px'>
        <Text fontSize={{ base: 10, md: 12 }} fontWeight={600} >¿Aplicar IGV?</Text>
        <Flex gap='10px' alignItems='center' marginTop='3px'>
          <Switch size="md" onChange={props.onChangeAddIGV} isChecked={props.addIGV} />
          <Text fontSize={{ base: 10, md: 12 }} fontWeight={600}>{props.addIGV ? 'Sí' : 'No'}</Text>
        </Flex>
      </Box>

      <Flex width='100%' gap='4px' fontSize={{ base: 10, md: 12 }} alignItems='end' justifyContent='end' flexDir='column'>
        <Flex gap='10px'>
          <Text fontWeight={600}>Subtotal</Text>
          <Box
            paddingY='2px'
            paddingX='4px'
            rounded='4px'
            border='0.5px solid'
            borderColor='lightgray'
            minW={{ base: '100px', md: '150px' }}
            textAlign='end'
          >
            {formattedSubtotal}
          </Box>
        </Flex>

        <Flex gap='10px'>
          <Text fontWeight={600}>IGV</Text>
          <Box
            paddingY='2px'
            paddingX='4px'
            rounded='4px'
            border='0.5px solid'
            borderColor='lightgray'
            minW={{ base: '100px', md: '150px' }}
            textAlign='end'
          >
            { props.addIGV ? formattedIGV : '0.00' }
          </Box>
        </Flex>

        <Flex gap='10px'>
          <Text fontWeight={600}>Total</Text>
          <Box
            paddingY='2px'
            paddingX='4px'
            rounded='4px'
            border='0.5px solid'
            borderColor='gray.800'
            bg={CONSTROAD_COLORS.orange}
            minW={{ base: '100px', md: '150px' }}
            textAlign='end'
          >
            { props.addIGV ? formattedTotal : formattedSubtotal }
          </Box>
        </Flex>
      </Flex>

      <Flex flexDir='column' mt='0px' w='100%'>
        <Flex fontSize={{ base: 14, md: 16 }} fontWeight={600} mt='10px' w='100%'>NOTAS</Flex>

        {/* NOTAS */}
        <ServiceQuoteTexts
          title='FORMA DE PAGO'
          noteType='payment method'
          notes={quote.notes}
          onChangeNote={handleChangeNotes}
          onAddClick={handleAddNewText}
          onDeleteClick={handleDeleteText}
        />
        <ServiceQuoteTexts
          title='EQUIPO DE TRABAJO'
          noteType='work team'
          notes={quote.notes}
          onChangeNote={handleChangeNotes}
          onAddClick={handleAddNewText}
          onDeleteClick={handleDeleteText}
        />
        <ServiceQuoteTexts
          title='NOTAS'
          noteType='note'
          notes={quote.notes}
          onChangeNote={handleChangeNotes}
          onAddClick={handleAddNewText}
          onDeleteClick={handleDeleteText}
        />
        <ServiceQuoteTexts
          title='EQUIPOS Y HERRAMIENTAS'
          noteType='equipment and tools'
          notes={quote.notes}
          onChangeNote={handleChangeNotes}
          onAddClick={handleAddNewText}
          onDeleteClick={handleDeleteText}
        />
        <ServiceQuoteTexts
          title='LOS TRABAJOS A REALIZAR CONTEMPLAN'
          noteType='the work to be done contemplates'
          notes={quote.notes}
          onChangeNote={handleChangeNotes}
          onAddClick={handleAddNewText}
          onDeleteClick={handleDeleteText}
        />
        <ServiceQuoteTexts
          title='LA PROPUESTA ECONÓMICA INCLUYE'
          noteType='proposal includes'
          notes={quote.notes}
          onChangeNote={handleChangeNotes}
          onAddClick={handleAddNewText}
          onDeleteClick={handleDeleteText}
        />
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
