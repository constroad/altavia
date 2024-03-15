import React, { ChangeEvent, useEffect, useState } from 'react'
import { Box, Button, Flex, Text, useDisclosure } from '@chakra-ui/react'
import axios from 'axios'
import {
  ClientType,
  IntranetLayout,
  Modal,
  ProductType,
  QuoteForm,
  QuoteModal,
  QuotePDFType,
  QuoteType,
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
  const [clientSelected, setClientSelected] = useState<ClientType | undefined>(undefined)
  const [productsDB, setProductsDB] = useState<ProductType[]>([])

  const [quote, setQuote] = useState<QuoteType>(initialQuote)
  const [quoteSelected, setQuoteSelected] = useState<QuoteType | undefined>()
  const [quotesDBList, setQuotesDBList] = useState<QuoteType[]>([])
  const [customDate, setCustomDate] = useState('')
  const [addIGV, setAddIGV] = useState(true)

  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
  const { isOpen: isOpenForm, onOpen: onOpenForm, onClose: onCloseForm } = useDisclosure()
  const { isOpen: isOpenQuoteModal, onOpen: onOpenQuoteModal, onClose: onCloseQuoteModal } = useDisclosure()
  const { isMobile, isDesktop } = useScreenSize()
  const date = new Date()

  const { run: runGetClients } = useAsync({ onSuccess(data) { setClientsDB(data.data) } })
  const { run: runGetProducts } = useAsync({ onSuccess(data) { setProductsDB(data.data) } })
  const { run: runGetQuotes, isLoading, refetch: refetchQuotes } = useAsync({ onSuccess(data) { setQuotesDBList(data.data) } })
  const { run: runAddQuote, isLoading: loadingAddQuote  } = useAsync()
  const { run: runAEditQuote, isLoading: loadingEditQuote  } = useAsync()
  const { run: runDeleteQuote, isLoading: loadingDeleteQuote  } = useAsync()

  useEffect(() => {
    if (quoteSelected) {
      const client = clientsDB.filter(cli => cli._id === quoteSelected.clientId)
      setClientSelected(client[0])
    }
  }, [quoteSelected, clientsDB])

  useEffect(() => {
    const fetchQuoteProductClientData = async () => {
      
      const quotePromise = runGetQuotes(fetcher(API_ROUTES.quote), {
        refetch: () => runGetQuotes(fetcher(API_ROUTES.quote)),
        cacheKey: API_ROUTES.quote
      });

      const productsPromise = runGetProducts(fetcher(API_ROUTES.products), {
        cacheKey: `${API_ROUTES.products}-quote`
      });

      const clientsPromise = runGetClients(fetcher(API_ROUTES.client), {
        cacheKey: `${API_ROUTES.client}-quote`
      });
  
      await Promise.all([quotePromise, productsPromise, clientsPromise]);
    };
  
    fetchQuoteProductClientData();
  }, []);

  const quoteNumber = quoteSelected?.nro ?? 100 + quotesDBList.length + 1
  
  // Handlers
  const handleChangeCustomDate = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCustomDate(value)
  }

  // form manage
  const handleCloseFormModal = () => {
    onCloseForm()
    setClientSelected(undefined)
    setQuote(initialQuote)
    setQuoteSelected(undefined)
    setAddIGV(true)
  }
  const handleOpenFormModal = () => {
    const mac = productsDB.filter(prod => prod.alias === 'ASFALTO MAC2')
    setQuote({...quote, items: mac })
    onOpenForm()
  }

  // generate and download pdf
  const generateAndDownloadPDF = async(editQuoteDate:string | undefined, addQuoteDate: Date, quoteNumber: number, clientSelected: any, quoteShortDate: string) => {     
     const pdfData: QuotePDFType = {
      companyName: clientSelected?.name ?? '',
      ruc: clientSelected?.ruc ?? '',
      nroQuote: quoteNumber.toString(),
      notes: quoteSelected?.notes ?? quote.notes,
      date: quoteSelected?.date ? editQuoteDate as string : addQuoteDate.toUTCString(),
      products: quoteSelected?.items ?? quote.items,
      addIGV: addIGV,
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
  }

  // add or edit quotes
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const inputDate = new Date(customDate)
    const addQuoteDate = customDate.length > 0 ? inputDate : date
    const editQuoteDate = customDate.length > 0 ? inputDate.toUTCString() : quoteSelected?.date
    const { shortDate: quoteShortDate } = getDate(addQuoteDate.toUTCString())

    if (!quoteSelected && clientSelected) {
      const {
        formattedSubtotal,
        formattedIGV,
        formattedTotal
      } = getQuotePrices( quote.items, addIGV )

      const addQuote: QuoteType = {
        clientId: clientSelected?._id as string ?? '',
        nro: quoteNumber,
        date: addQuoteDate.toUTCString(),
        items: quote.items,
        notes: quote.notes,
        subTotal: +formattedSubtotal,
        igv: addIGV ? +formattedIGV : 0,
        total: addIGV ? +formattedTotal : +formattedSubtotal
      }

      runAddQuote(postQuote(API_ROUTES.quote, addQuote), {
        onSuccess: () => {
          refetchQuotes()
          toast.success('Cotización generada con éxito.')
          generateAndDownloadPDF(editQuoteDate, addQuoteDate, quoteNumber, clientSelected, quoteShortDate)
        },
        onError: (err) => {
          console.log(err)
          toast.error("Algo salio mal al generar la cotización, contacte al administrador")
        }
      })

    } else if (quoteSelected){

      const {
        formattedSubtotal,
        formattedIGV,
        formattedTotal
      } = getQuotePrices( quoteSelected.items, addIGV )

      const editQuote: QuoteType = {
        clientId: clientSelected?._id as string,
        nro: quoteNumber,
        date: editQuoteDate as string,
        items: quoteSelected?.items,
        notes: quoteSelected.notes,
        subTotal: +formattedSubtotal,
        igv: addIGV ? +formattedIGV : 0,
        total: addIGV ? +formattedTotal : +formattedSubtotal
      }

      runAEditQuote(updateQuote(`${API_ROUTES.quote}/${quoteSelected._id}`, editQuote), {
        onSuccess: () => {
          refetchQuotes()
          toast.success('Cotización editada con éxito.')
          generateAndDownloadPDF(editQuoteDate, addQuoteDate, quoteNumber, clientSelected, quoteShortDate)
        },
        onError: (err) => {
          console.log(err) 
          toast.error("Algo salio mal al editar la cotización, contacte al administrador")
        }
      })
    }

    handleCloseFormModal()
    setCustomDate('')
  };

  const handleSelectClient = (client: ClientType) => {
    setClientSelected(client)
  }
  const handleSelectProduct = (prod: ProductType) => {
    if (quoteSelected) {
      setQuoteSelected({ ...quoteSelected, items: [...quoteSelected.items, prod] })
    } else {
      setQuote({ ...quote, items: [...quote.items, prod] })
    }
  }

  const handleEditQuote = (quote: QuoteType) => {
    onOpenForm()
    setQuoteSelected(quote)
    if (quote.subTotal < quote.total) setAddIGV(true)
    else setAddIGV(false)
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
        console.log(err)
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
    setClientSelected(undefined)
    onCloseQuoteModal()
    setQuoteSelected(undefined)
  }

  const handleChangeAddIGV = () => {
    setAddIGV(!addIGV)
  }

  const columns = generateQuoteColumns(clientsDB, handleSelectQuote)
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
            onClick={handleOpenFormModal}
            colorScheme='blue'
            height='25px'
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
            isLoading={isLoading}
            pagination
            actions
          />
        )}

        {isMobile && (
          <TableComponent
            data={quotesDBList.sort((a,b) => b.nro - a.nro)}
            columns={mobileColumns}
            onEdit={handleEditQuote}
            onDelete={handleDeleteClick}
            isLoading={isLoading}
            pagination
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
        width={isMobile ? '' : '800px'}
      >
        <Flex flexDir='column' gap={2}>
          <QuoteForm
            quote={quoteSelected ?? quote}
            quoteSelected={quoteSelected}
            setter={quoteSelected ? setQuoteSelected : setQuote}
            client={clientSelected}
            onChangeDate={handleChangeCustomDate}
            dateValue={customDate}
            isLoading={quoteSelected ? loadingEditQuote : loadingAddQuote}
            addIGV={addIGV}
            onChangeAddIGV={handleChangeAddIGV}
            handleSubmit={handleSubmit}
            clientsDB={clientsDB}
            handleSelectClient={handleSelectClient}
            productsDB={productsDB}
            handleSelectProduct={handleSelectProduct}
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

      {quoteSelected && (
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
