import React, { ChangeEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Box, Button, Flex, Text, useDisclosure } from '@chakra-ui/react'
import {
  ClientType,
  IntranetLayout,
  Modal,
  QuoteForm,
  QuoteModal,
  QuotePDFType,
  QuoteType,
  SearchComponent,
  TableComponent,
  generateMobileQuoteColumns,
  generateQuoteColumns,
  getQuotePrices,
  initialQuote,
  toast
} from 'src/components'
import { PlusIcon } from 'src/common/icons'
import { useAsync, useScreenSize } from 'src/common/hooks'
import { API_ROUTES } from 'src/common/consts'
import { getDate } from 'src/common/utils'

const fetcher = (path: string) => axios.get(path)
const postQuote = (path: string, data: QuoteType) => axios.post(path, data);
const updateQuote = (path: string, data: QuoteType) => axios.put(path, data)
const deleteQuote = (path: string) => axios.delete(path)

const QuotesPage = () => {
  const [clientsDB, setClientsDB] = useState<ClientType[]>([])
  const [clientSelected, setClientSelected] = useState<ClientType | undefined>()

  const [quote, setQuote] = useState<QuoteType>(initialQuote)
  const [quoteSelected, setQuoteSelected] = useState<QuoteType | undefined>()
  const [quoteNotes, setQuoteNotes] = useState<string>('')
  const [quotesDBList, setQuotesDBList] = useState<QuoteType[]>([])
  const [customDate, setCustomDate] = useState('')

  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
  const { isOpen: isOpenForm, onOpen: onOpenForm, onClose: onCloseForm } = useDisclosure()
  const { isOpen: isOpenQuoteModal, onOpen: onOpenQuoteModal, onClose: onCloseQuoteModal } = useDisclosure()
  const { isMobile, isDesktop } = useScreenSize()
  const router = useRouter()
  const date = new Date()

  const { run: runGetClients } = useAsync({
    onSuccess(data) {
      setClientsDB(data.data)
    },
  })
  const { run: runGetQuotes, refetch: refetchQuotes } = useAsync({
    onSuccess(data) {
      setQuotesDBList(data.data)
    }
  })
  const { run: runAddQuote, isLoading: loadingAddQuote  } = useAsync()
  const { run: runAEditQuote, isLoading: loadingEditQuote  } = useAsync()
  const { run: runDeleteQuote, isLoading: loadingDeleteQuote  } = useAsync()

  // Effects
  useEffect(() => {
    if (quoteSelected) {
      const client = clientsDB.filter(cli => cli._id === quoteSelected.clientId)
      setClientSelected(client[0])
    }
  }, [quoteSelected, clientsDB])
  
  useEffect(() => {
    runGetQuotes(fetcher(API_ROUTES.quote), {
      refetch: () => runGetQuotes(fetcher(API_ROUTES.quote))
    })
  }, [])

  useEffect(() => {
    runGetClients(fetcher(API_ROUTES.client), {
      refetch: () => runGetClients(fetcher(API_ROUTES.client))
    })
  }, [])

  const quoteNumber = quoteSelected?.nro ?? 100 + quotesDBList.length + 1
  
  // Handlers
  const handleChangeCustomDate = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCustomDate(value)
  }
  const handleCloseFormModal = () => {
    onCloseForm()
    setClientSelected(undefined)
    setQuote(initialQuote)
    setQuoteSelected(undefined)
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const inputDate = new Date(customDate)
    const addQuoteDate = customDate.length > 0 ? inputDate : date
    const editQuoteDate = customDate.length > 0 ? inputDate.toUTCString() : quoteSelected?.date
    const { shortDate: quoteShortDate } = getDate(addQuoteDate.toUTCString())

    if (!quoteSelected) {
      const {
        formattedSubtotal,
        formattedIGV,
        formattedTotal
      } = getQuotePrices( quote.items[0].quantity, quote.items[0].price )

      const addQuote: QuoteType = {
        clientId: clientSelected?._id as string,
        nro: quoteNumber,
        date: addQuoteDate.toUTCString(),
        items: [{
          description: quote.items[0].description,
          quantity: Number(quote.items[0].quantity.toFixed(2)),
          price: Number(quote.items[0].price.toFixed(2)),
          total: +formattedSubtotal
        }],
        subTotal: +formattedSubtotal,
        igv: +formattedIGV,
        total: +formattedTotal
      }

      runAddQuote(postQuote(API_ROUTES.quote, addQuote), {
        onSuccess: () => {
          refetchQuotes()
          toast.success('Cotización generada con éxito.')
        },
        onError: (err) => {
          console.log('Crate quote error:', err)
          toast.error("Algo salio mal al generar la cotización, contacte al administrador")
        }
      })

    } else {

      const {
        formattedSubtotal,
        formattedIGV,
        formattedTotal
      } = getQuotePrices( quoteSelected.items[0].quantity, quoteSelected.items[0].price )

      const editQuote: QuoteType = {
        clientId: clientSelected?._id as string,
        nro: quoteNumber,
        date: editQuoteDate as string,
        items: [{
          description: quoteSelected.items[0].description,
          quantity: Number(quoteSelected.items[0].quantity.toFixed(2)),
          price: Number(quoteSelected.items[0].price.toFixed(2)),
          total: +formattedSubtotal
        }],
        subTotal: +formattedSubtotal,
        igv: +formattedIGV,
        total: +formattedTotal
      }

      runAEditQuote(updateQuote(`${API_ROUTES.quote}/${quoteSelected._id}`, editQuote), {
        onSuccess: () => {
          refetchQuotes()
          toast.success('Cotización editada con éxito.')
        },
        onError: (err) => {
          console.log('Edit quote error:', err) 
          toast.error("Algo salio mal al editar la cotización, contacte al administrador")
        }
      })
    }

    // Generate PDF
    const pdfData: QuotePDFType = {
      companyName: clientSelected?.name ?? '',
      ruc: clientSelected?.ruc ?? '',
      notes: quoteNotes,
      date: quoteSelected?.date ? editQuoteDate as string : addQuoteDate.toUTCString(),
      nroCubos: quoteSelected?.items[0].quantity.toString() ?? quote.items[0].quantity.toString(),
      unitPrice: quoteSelected?.items[0].price.toString() ?? quote.items[0].price.toString(),
      nroQuote: quoteNumber.toString(),
    }

    const response = await axios.post( API_ROUTES.generateQuotationPDF, { pdfData }, {responseType: 'arraybuffer'} )
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const { shortDate: pdfEditDate } = getDate(editQuoteDate)
    const pdfdate = quoteSelected ? pdfEditDate : quoteShortDate
    const pdfName = `Cotización_${quoteNumber}_${clientSelected?.name}_${pdfdate}.pdf`

    const pdfUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute('download', pdfName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    handleCloseFormModal()
    setCustomDate('')
  };

  const handleSelectClient = (client: ClientType) => {
    setClientSelected(client)
  }

  const handleChangeNotes = (e: ChangeEvent<HTMLInputElement>) => {
    setQuoteNotes(e.target.value)
  }

  const handleEditQuote = (quoteSelected: QuoteType) => {
    onOpenForm()
    setQuoteSelected(quoteSelected)
  }

  const handleDeleteClick = (quoteSelected: QuoteType) => {
    onOpenDelete()
    setQuoteSelected(quoteSelected)
  }

  const handleDeleteQuote = () => {
    runDeleteQuote(deleteQuote(`${API_ROUTES.quote}/${quoteSelected?._id}`), {
      onSuccess: () => {
        refetchQuotes()
        toast.success('Cotizacion eliminada correctamente')
      },
      onError: (err) => {
        console.log('Delete quote error:', err)
        toast.error('Algo salio mal al eliminar la cotización, contacte al administrador')
      }
    })

    onCloseDelete()
  }

  // quote mobile preview
  const handleSelectQuote = (quote: QuoteType) => {
    setQuoteSelected(quote)
    onOpenQuoteModal()
  }
  const handleCloseQuoteModal = () => {
    onCloseQuoteModal()
    setQuoteSelected(undefined)
  }

  const columns = generateQuoteColumns(clientsDB)
  const mobileColumns = generateMobileQuoteColumns(clientsDB, handleSelectQuote)
  const quoteClient = clientsDB.find(cli => cli._id === quoteSelected?.clientId)

  // Renders
  const deleteFooter = (
    <Button
      isLoading={loadingDeleteQuote}
      variant="ghost"
      autoFocus
      colorScheme='red'
      onClick={handleDeleteQuote}
    >
      Confirm
    </Button>
  )

  return (
    <IntranetLayout>
      <Flex
        flexDir='column'
        alignItems={{base: '', md: ''}}
        marginX='auto'
        gap='5px'
      >
        <Text
          fontSize={{ base: 25, md: 36 }}
          fontWeight={700}
          color='black'
          lineHeight={{ base: '28px', md: '39px' }}
          marginX='auto'
        >
          Cotizaciones
        </Text>
        <Box width='100%' textAlign='end' gap={2}>
          <Button
            size='sm'
            width={{base: '120px', md: '200px'}}
            fontSize={{ base: 10, md: 16 }}
            padding={{ base: '5px', md: '12px' }}
            onClick={onOpenForm}
            colorScheme='blue'
            gap={2}
          >
            <Text>Nueva cotización</Text><PlusIcon />
          </Button>
        </Box>

        {isDesktop && (
          <TableComponent
            data={quotesDBList.sort((a,b) => b.nro - a.nro)}
            columns={columns}
            onEdit={handleEditQuote}
            onDelete={handleDeleteClick}
            actions
          />
        )}

        {isMobile && (
          <TableComponent
            data={quotesDBList.sort((a,b) => b.nro - a.nro)}
            columns={mobileColumns}
            onEdit={handleEditQuote}
            onDelete={handleDeleteClick}
            actions
          />
        )}
      </Flex>

      {/* quote form modal */}
      <Modal
        isOpen={isOpenForm}
        onClose={handleCloseFormModal}
        heading={
          !quoteSelected ? `Generar cotización Nro ${quoteNumber}` : `Editar cotización Nro ${quoteNumber}`
        }
        hideCancelButton
      >
        <Flex flexDir='column' gap={2}>
          <Flex width='100%' justifyContent='space-between' alignItems='center'>
            <Box width='80%'>
              <SearchComponent
                placeholder='Buscar cliente por nombre o RUC'
                options={clientsDB}
                propertiesToSearch={['name', 'ruc', 'alias']}
                onSelect={handleSelectClient}
              />
            </Box>

            <Box width='18%'>
              <Button fontSize={10} whiteSpace='normal' gap='2px' px='10px' h='32px' onClick={() => router.push('/admin/clientes')}>
                <Text>Añadir cliente </Text>
                <PlusIcon/>
              </Button>
            </Box>
          </Flex>

          <QuoteForm
            quote={quoteSelected ?? quote}
            quoteNotes={quoteNotes}
            quoteSelected={quoteSelected}
            handleChangeNotes={handleChangeNotes}
            setter={quoteSelected ? setQuoteSelected : setQuote}
            client={clientSelected}
            onChangeDate={handleChangeCustomDate}
            dateValue={customDate}
            isLoading={quoteSelected ? loadingEditQuote : loadingAddQuote}
            handleSubmit={handleSubmit}
          />
        </Flex>
      </Modal>

      {/* delete quote modal */}
      <Modal
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        heading={`¿Estás seguro de eliminar la cotización ${quoteSelected?.nro}?`}
        footer={deleteFooter}
      />

      {quoteSelected && isMobile && (
        <Modal
          isOpen={isOpenQuoteModal}
          heading={quoteClient?.name}
          onClose={handleCloseQuoteModal}
        >
          <QuoteModal quote={quoteSelected} clients={clientsDB} />
        </Modal>
      )}

    </IntranetLayout>
  )
}

export default QuotesPage
