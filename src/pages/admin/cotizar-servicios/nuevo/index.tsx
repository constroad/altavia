import React, { ChangeEvent, useEffect, useState } from 'react'
import axios from 'axios';
import { Box, Flex, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ADMIN_ROUTES, API_ROUTES, APP_ROUTES } from 'src/common/consts';
import {
  CalculateCosts,
  ClientType,
  IntranetLayout,
  ProdInfoType,
  ProductionInfo,
  ServiceQuoteForm,
  ServiceQuotePDFType,
  ServiceQuoteType,
  ServiceType,
  asphaltRowsArr,
  comparePhase,
  getQuotePrices,
  imprimacionRowsArr,
  initialProductionInfo,
  initialServiceQuote,
  serviceRowsArr,
  thicknessRows,
  toast
} from 'src/components';
import { useAsync, useScreenSize } from 'src/common/hooks';
import { getDate } from 'src/common/utils';
import { useQuote } from 'src/context';

const fetcher = (path: string) => axios.get(path)
const postQuote = (path: string, data: ServiceQuoteType) => axios.post(path, data);
const updateQuote = (path: string, data: ServiceQuoteType) => axios.put(path, data)

export const NewServiceQuotePage = () => {
  const [clientsDB, setClientsDB] = useState<ClientType[]>([])
  const [clientSelected, setClientSelected] = useState<ClientType | undefined>(undefined)
  const [servicesDB, setServicesDB] = useState<ServiceType[]>([])
  
  const { serviceQuoteSelected, setServiceQuoteSelected } = useQuote();

  const [prodInfo, setProdInfo] = useState<ProdInfoType>( serviceQuoteSelected ? serviceQuoteSelected.costs.prodInfo  : initialProductionInfo )
  const [asphaltRows, setAsphaltRows] = useState( serviceQuoteSelected ? serviceQuoteSelected.costs.asphalt : asphaltRowsArr )
  const [serviceRows, setServiceRows] = useState( serviceQuoteSelected ? serviceQuoteSelected.costs.service : serviceRowsArr)
  const [imprimacionRows, setImprimacionRows] = useState( serviceQuoteSelected ? serviceQuoteSelected.costs.imprimacion : imprimacionRowsArr)

  const [quote, setQuote] = useState<ServiceQuoteType>(initialServiceQuote)
  const [quotesDBList, setQuotesDBList] = useState<ServiceQuoteType[]>([])
  const [customDate, setCustomDate] = useState('')
  const [addIGV, setAddIGV] = useState(true)
  const [priceM3, setPriceM3] = useState( serviceQuoteSelected ? serviceQuoteSelected.costs.priceM3 : 480 )
  const [priceM2, setPriceM2] = useState( serviceQuoteSelected ? serviceQuoteSelected.costs.priceM2 : 43 )
  const date = new Date()
  const router = useRouter()
  const { isMobile } = useScreenSize()

  const { run: runGetClients } = useAsync({ onSuccess(data) { setClientsDB(data.data) } })
  const { run: runGetServices } = useAsync({ onSuccess(data) { setServicesDB(data.data) } })
  const { run: runGetQuotes, isLoading, refetch: refetchQuotes } = useAsync({ onSuccess(data) { setQuotesDBList(data.data) } })
  const { run: runAddQuote, isLoading: loadingAddQuote  } = useAsync()
  const { run: runAEditQuote, isLoading: loadingEditQuote  } = useAsync()

  const quoteNumber = serviceQuoteSelected?.nro ?? 100 + quotesDBList.length + 1

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

  useEffect(() => {
    if (serviceQuoteSelected) {
      const client = clientsDB.filter(cli => cli._id === serviceQuoteSelected.clientId)
      setClientSelected(client[0])
    }
  }, [serviceQuoteSelected, clientsDB])
  
  // Handlers
  const handleChangeCustomDate = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCustomDate(value)
  }

  const generateAndDownloadPDF = async(editQuoteDate:string | undefined, addQuoteDate: Date, quoteNumber: number, clientSelected: any, quoteShortDate: string) => {     
    const pdfData: ServiceQuotePDFType = {
      companyName: clientSelected?.name ?? '',
      contactPerson: clientSelected?.contactPerson ?? '',
      ruc: clientSelected?.ruc ?? '',
      nroQuote: quoteNumber.toString(),
      notes: serviceQuoteSelected?.notes ?? quote.notes,
      date: serviceQuoteSelected?.date ? editQuoteDate as string : addQuoteDate.toUTCString(),
      services: serviceQuoteSelected?.items ?? quote.items,
      addIGV: addIGV,
    }

    const response = await axios.post( API_ROUTES.generateServiceQuotationPDF, { pdfData }, {responseType: 'arraybuffer'} )
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const { shortDate: pdfEditDate } = getDate(editQuoteDate)
    const pdfdate = serviceQuoteSelected ? pdfEditDate : quoteShortDate
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
    const editQuoteDate = customDate.length > 0 ? inputDate.toUTCString() : serviceQuoteSelected?.date
    const { shortDate: quoteShortDate } = getDate(addQuoteDate.toUTCString())

    if (!serviceQuoteSelected && clientSelected) {
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
        total: addIGV ? +formattedTotal : +formattedSubtotal,
        costs: {
          prodInfo: prodInfo,
          asphalt: asphaltRows,
          service: serviceRows,
          imprimacion: imprimacionRows,
          priceM3: priceM3,
          priceM2: priceM2
        }
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

    } else if (serviceQuoteSelected) {
      const {
        formattedSubtotal,
        formattedIGV,
        formattedTotal
      } = getQuotePrices( serviceQuoteSelected.items, addIGV )

      const editQuote: ServiceQuoteType = {
        clientId: clientSelected?._id as string,
        nro: quoteNumber,
        date: editQuoteDate as string,
        items: serviceQuoteSelected?.items,
        notes: serviceQuoteSelected?.notes,
        subTotal: +formattedSubtotal,
        igv: addIGV ? +formattedIGV : 0,
        total: addIGV ? +formattedTotal : +formattedSubtotal,
        costs: {
          prodInfo: prodInfo,
          asphalt: asphaltRows,
          service: serviceRows,
          imprimacion: imprimacionRows,
          priceM3: priceM3,
          priceM2: priceM2
        }
      }

      runAEditQuote(updateQuote(`${API_ROUTES.serviceQuote}/${serviceQuoteSelected._id}`, editQuote), {
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

    setCustomDate('')
    setServiceQuoteSelected(undefined)
    router.push(ADMIN_ROUTES.serviceQuote)
  };

  const handleSelectClient = (client: ClientType) => {
    setClientSelected(client)
  }

  const handleSelectService = (service: ServiceType) => {
    const quoteIncludesService = quote.items.includes(service)

   if (!quoteIncludesService) {
      setQuote({ ...quote, items: [...quote.items, service] })
    } else {
      toast.warning('Este servicio ya se encuentra en la cotización')
    }
  }

  const handleChangeAddIGV = () => {
    setAddIGV(!addIGV)
  }

  return (
    <IntranetLayout onBackClick={ () => router.push(ADMIN_ROUTES.serviceQuote)} >
      <Flex
        gap='10px'
        width='100%'
        h='calc(100vh - 151px)'
        position={{ base: 'inherit', md: 'relative' }}
        flexDir={{ base: 'column', md: 'row' }}
      >
        <Flex
          width={{ base: '100%', md: '28%' }}
          gap='5px'
          flexDir={{ base: 'column', md: 'column' }} h='calc(100vh - 151px)'
          position={{ base: 'inherit', md: 'fixed' }}
        >
          <Flex
            w='100%'
            h={{ base: '117px', md: '125px' }}
            minH={{ base: '117px', md: '125px' }}
            rounded='6px'
            flexDir='column'
            py='4px'
            gap='10px'
            bg='#606060'
            color='white'
            flexDirection='column'
            border='0.5px solid'

          >
            <Text px='8px' fontSize={{ base: 10, md: 12 }} fontWeight={800} >DATOS DE PRODUCCIÓN:</Text>
            <ProductionInfo data={prodInfo} setter={setProdInfo} />
          </Flex>
          <Flex w='100%' grow={{ base: 0, md: 1 }} rounded='6px'>
            <CalculateCosts
              priceM3={priceM3}
              priceM2={priceM2}
              priceM3Setter={setPriceM3}
              priceM2Setter={setPriceM2}
              prodInfo={prodInfo}
              asphaltRows={asphaltRows}
              serviceRows={serviceRows}
              imprimacionRows={imprimacionRows}
              asphaltSetter={setAsphaltRows}
              serviceSetter={setServiceRows}
              imprimacionSetter={setImprimacionRows}
              thicknessRows={thicknessRows}
            />
          </Flex>
        </Flex>

        <Flex
          flexDir='column'
          width={{ base: '100%', md: '68%' }}
          ml='auto'
          rounded='6px'
          h='auto'
          mt={{ base: '45px', md: '0px' }}
        >
          <ServiceQuoteForm
            quote={ serviceQuoteSelected ? serviceQuoteSelected : quote}
            quoteSelected={serviceQuoteSelected}
            setter={ serviceQuoteSelected ? setServiceQuoteSelected : setQuote}
            client={clientSelected}
            onChangeDate={handleChangeCustomDate}
            dateValue={customDate}
            isLoading={serviceQuoteSelected ? loadingEditQuote : loadingAddQuote}
            addIGV={addIGV}
            onChangeAddIGV={handleChangeAddIGV}
            handleSubmit={handleSubmit}
            clientsDB={clientsDB}
            handleSelectClient={handleSelectClient}
            servicesDB={servicesDB}
            handleSelectService={handleSelectService}
            title={serviceQuoteSelected ? `Editar cotización Nro ${serviceQuoteSelected.nro}` :`Generar cotización Nro ${quoteNumber}`}
          />
        </Flex>

        {isMobile && (
          <Box h='1px' color='transparent'>HOLA</Box>
        )}
      </Flex>
    </IntranetLayout>
  )
}

export default NewServiceQuotePage;
