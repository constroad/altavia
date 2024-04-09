import { Button, Flex, Text, useDisclosure } from '@chakra-ui/react';
import axios from 'axios';
import React, { ChangeEvent, useEffect, useState } from 'react'
import { ADMIN_ROUTES, API_ROUTES } from 'src/common/consts';
import { useAsync, useScreenSize } from 'src/common/hooks';
import {
  ClientType,
  IntranetLayout,
  ServiceQuotePDFType,
  ServiceQuoteType,
  initialServiceQuote,
  getQuotePrices,
  toast,
  generateServiceQuoteColumns,
  generateMobileServiceQuoteColumns,
  TableComponent,
  Modal,
  ServiceQuoteForm,
  ServiceQuoteModal,
  ServiceType,
  comparePhase,
} from 'src/components';
import { getDate } from 'src/common/utils'
import { PlusIcon } from 'src/common/icons';
import { useRouter } from 'next/router';

const fetcher = (path: string) => axios.get(path)
const postQuote = (path: string, data: ServiceQuoteType) => axios.post(path, data);
const updateQuote = (path: string, data: ServiceQuoteType) => axios.put(path, data)
const deleteQuote = (path: string) => axios.delete(path)

export const ServiceQuotePage = () => {
  const [clientsDB, setClientsDB] = useState<ClientType[]>([])
  const [clientSelected, setClientSelected] = useState<ClientType | undefined>(undefined)
  const [servicesDB, setServicesDB] = useState<ServiceType[]>([])

  const [quote, setQuote] = useState<ServiceQuoteType>(initialServiceQuote)
  const [quoteSelected, setQuoteSelected] = useState<ServiceQuoteType | undefined>()
  const [quotesDBList, setQuotesDBList] = useState<ServiceQuoteType[]>([])
  const [customDate, setCustomDate] = useState('')
  const [addIGV, setAddIGV] = useState(true)

  const { isOpen: isOpenForm, onOpen: onOpenForm, onClose: onCloseForm } = useDisclosure()
  const { isOpen: isOpenQuoteModal, onOpen: onOpenQuoteModal, onClose: onCloseQuoteModal } = useDisclosure()
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
  const { isMobile, isDesktop } = useScreenSize()
  const date = new Date()
  const router = useRouter();

  const { run: runGetClients } = useAsync({ onSuccess(data) { setClientsDB(data.data) } })
  const { run: runGetServices } = useAsync({ onSuccess(data) { setServicesDB(data.data) } })
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
    const fetchQuoteServicesClientData = async () => {
      
      const quotePromise = runGetQuotes(fetcher(API_ROUTES.serviceQuote), {
        refetch: () => runGetQuotes(fetcher(API_ROUTES.serviceQuote)),
        cacheKey: API_ROUTES.serviceQuote
      });

      const servicesPromise = runGetServices(fetcher(API_ROUTES.services), {
        cacheKey: `${API_ROUTES.services}--service-quote`
      });

      const clientsPromise = runGetClients(fetcher(API_ROUTES.client), {
        cacheKey: `${API_ROUTES.client}-service-quote`
      });
  
      await Promise.all([quotePromise, servicesPromise, clientsPromise]);
    };
  
    fetchQuoteServicesClientData();
  }, []);

  const quoteNumber = quoteSelected?.nro ?? 100 + quotesDBList.length + 1
  const aliasesToFilter = ['OBRAS PRELIMINARES', 'MOVIMIENTO DE TIERRA', 'PAVIMENTACION'];

  // Handlers
  const handleChangeCustomDate = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCustomDate(value)
  }

  // form manage
  const handleCloseFormModal = () => {
    setClientSelected(undefined)
    setQuoteSelected(undefined)
    setQuote(initialServiceQuote)
    setAddIGV(true)
    onCloseForm()
  }
  const handleOpenFormModal = () => {
    const quoteServices = servicesDB.filter(service => aliasesToFilter.includes(service.phase!));
    const sortedArray = quoteServices.slice().sort(comparePhase);
    const newQuoteWithServices = { ...initialServiceQuote, items: sortedArray }
    setQuote(newQuoteWithServices)
    onOpenForm()
  }
  const handleNewQuoteClick = () => {
    router.push(ADMIN_ROUTES.newServiceQuote)
  }

  const generateAndDownloadPDF = async(editQuoteDate:string | undefined, addQuoteDate: Date, quoteNumber: number, clientSelected: any, quoteShortDate: string) => {     
    const pdfData: ServiceQuotePDFType = {
      companyName: clientSelected?.name ?? '',
      ruc: clientSelected?.ruc ?? '',
      nroQuote: quoteNumber.toString(),
      notes: quoteSelected?.notes ?? quote.notes,
      date: quoteSelected?.date ? editQuoteDate as string : addQuoteDate.toUTCString(),
      services: quoteSelected?.items ?? quote.items,
      addIGV: addIGV,
    }

    const response = await axios.post( API_ROUTES.generateServiceQuotationPDF, { pdfData }, {responseType: 'arraybuffer'} )
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

      const addQuote: ServiceQuoteType = {
        clientId: clientSelected?._id as string ?? '',
        nro: quoteNumber,
        date: addQuoteDate.toUTCString(),
        items: quote.items,
        notes: quote.notes,
        subTotal: +formattedSubtotal,
        igv: addIGV ? +formattedIGV : 0,
        total: addIGV ? +formattedTotal : +formattedSubtotal
      }

      runAddQuote(postQuote(API_ROUTES.serviceQuote, addQuote), {
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

      const editQuote: ServiceQuoteType = {
        clientId: clientSelected?._id as string,
        nro: quoteNumber,
        date: editQuoteDate as string,
        items: quoteSelected?.items,
        notes: quoteSelected.notes,
        subTotal: +formattedSubtotal,
        igv: addIGV ? +formattedIGV : 0,
        total: addIGV ? +formattedTotal : +formattedSubtotal
      }

      runAEditQuote(updateQuote(`${API_ROUTES.serviceQuote}/${quoteSelected._id}`, editQuote), {
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
  const handleSelectService = (service: ServiceType) => {
    const quoteSelectedIncludesService = quoteSelected?.items.includes(service)
    const quoteIncludesService = quote.items.includes(service)

    if (quoteSelected && !quoteSelectedIncludesService ) {
      setQuoteSelected({ ...quoteSelected, items: [...quoteSelected.items, service] })
    } else if (!quoteSelected && !quoteIncludesService) {
      setQuote({ ...quote, items: [...quote.items, service] })
    } else {
      toast.warning('Este servicio ya se encuentra en la cotización')
    }
  }

  const handleEditQuote = (quote: ServiceQuoteType) => {
    onOpenForm()
    setQuoteSelected(quote)
    if (quote.subTotal < quote.total) setAddIGV(true)
    else setAddIGV(false)
  }

  // delete client
  const handleCloseDeleteModal = () => {
    setQuoteSelected(undefined)
    setClientSelected(undefined)
    onCloseDelete()
  }
  const handleDeleteClick = (quoteSelected: ServiceQuoteType) => {
    setQuoteSelected(quoteSelected)
    onOpenDelete()
  }
  const handleDeleteQuote = () => {
    runDeleteQuote(deleteQuote(`${API_ROUTES.serviceQuote}/${quoteSelected?._id}`), {
      onSuccess: () => {
        refetchQuotes()
        toast.success('Cotizacion eliminada correctamente')
      },
      onError: (err) => {
        console.log(err)
        toast.error('Algo salio mal al eliminar la cotización, contacte al administrador')
      }
    })

    handleCloseDeleteModal()
  }

  // quote mobile preview
  const handleSelectQuote = (quote: ServiceQuoteType) => {
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

  const columns = generateServiceQuoteColumns(clientsDB, handleSelectQuote)
  const mobileColumns = generateMobileServiceQuoteColumns(clientsDB, handleSelectQuote)
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
          fontSize={{ base: 20, md: 30 }}
          fontWeight={700}
          color='black'
          lineHeight={{ base: '28px', md: '39px' }}
          marginX='auto'
        >
          Cotizaciones de servicio
        </Text>
        <Flex width='100%' justifyContent='end' gap='4px'>
          <Button
            size='sm'
            width={{base: '120px', md: '200px'}}
            fontSize={{ base: 10, md: 16 }}
            padding={{ base: '5px', md: '12px' }}
            onClick={handleNewQuoteClick}
            colorScheme='blue'
            height='25px'
            gap={2}
          >
            <Text>Nueva cotización</Text><PlusIcon fontSize={ isMobile ? 10 : 14 }/>
          </Button>
        </Flex>

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

      {/* quote form modal - EDIT */}
      <Modal
        isOpen={isOpenForm}
        onClose={handleCloseFormModal}
        heading={
          !quoteSelected ? `Generar cotización Nro ${quoteNumber}` : `Editar cotización Nro ${quoteNumber}`
        }
        hideCancelButton
        width={isMobile ? '' : '1000px'}
      >
        <Flex flexDir='column' gap={2}>
          <ServiceQuoteForm
            quote={quoteSelected ? quoteSelected : quote}
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
            servicesDB={servicesDB}
            handleSelectService={handleSelectService}
          /> 
        </Flex>
      </Modal>

      {/* delete quote modal */}
      <Modal
        isOpen={isOpenDelete}
        onClose={handleCloseDeleteModal}
        heading={`¿Estás seguro de eliminar la cotización ${quoteSelected?.nro}?`}
        footer={deleteFooter}
      />

      {quoteSelected && (
        <Modal
          isOpen={isOpenQuoteModal}
          heading={quoteClient?.name}
          onClose={handleCloseQuoteModal}
        >
          <ServiceQuoteModal quote={quoteSelected} clients={clientsDB} />
        </Modal>
      )}

    </IntranetLayout>
  )
}

export default ServiceQuotePage;
