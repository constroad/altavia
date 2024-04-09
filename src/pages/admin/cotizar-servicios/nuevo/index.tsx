import React, { ChangeEvent, useEffect, useState } from 'react'
import axios from 'axios';
import { Box, Flex, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ADMIN_ROUTES, API_ROUTES } from 'src/common/consts';
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

const fetcher = (path: string) => axios.get(path)
const postQuote = (path: string, data: ServiceQuoteType) => axios.post(path, data);

// export type ProdInfoType = {
//   clientName: string;
//   metrado: number;
//   thickness: number;
//   waste: number;
//   m3Produced: number;
//   m3Daily: number;
//   days: number;
// }

// const initialProductionInfo: ProdInfoType = {
//   clientName: '',
//   metrado: 1000,
//   thickness: 0.065,
//   waste: 0.10,
//   m3Produced: 65,
//   days: 1,
//   m3Daily: 65,
// }

// const asphaltRowsArr = [
//   { id: 1, 'Insumo': 'Arena', 'Dosis': 0.30, 'M3/GLS': 0, 'Precio': 39, 'Total': 0 },
//   { id: 2, 'Insumo': 'Piedra', 'Dosis': 0.70, 'M3/GLS': 0, 'Precio': 52, 'Total': 0 },
//   { id: 3, 'Insumo': 'Petroleo', 'Dosis': 1, 'M3/GLS': 0, 'Precio': 15.30, 'Total': 0 },
//   { id: 4, 'Insumo': 'PEN', 'Dosis': 24, 'M3/GLS': 0, 'Precio': 12.90, 'Total': 0 },
//   { id: 5, 'Insumo': 'Gasohol', 'Dosis': 2.9, 'M3/GLS': 0, 'Precio': 5.65, 'Total': 0 },
//   { id: 6, 'Insumo': 'Gas', 'Dosis': 0.01, 'M3/GLS': 0, 'Precio': 195, 'Total': 0 },
//   { id: 7, 'Insumo': 'Alq. Planta', 'Dosis': 1, 'M3/GLS': 0, 'Precio': 30, 'Total': 0 },
// ]
// const serviceRowsArr = [
//   { id: 1, 'Item': 'Camabaja', 'Cantidad': 1, 'Precio': 2000, 'Total': 0 },
//   { id: 2, 'Item': 'Maquinaria', 'Cantidad': 1, 'Precio': 3400, 'Total': 0 },
//   { id: 3, 'Item': 'Petroleo Maq.', 'Cantidad': 1, 'Precio': 120, 'Total': 0 },
//   { id: 4, 'Item': 'Operadores', 'Cantidad': 1, 'Precio': 350, 'Total': 0 },
//   { id: 5, 'Item': 'Transporte', 'Cantidad': 34.5, 'Precio': 30, 'Total': 0 },
//   { id: 6, 'Item': 'Personal', 'Cantidad': 1, 'Precio': 2500, 'Total': 0 },
//   { id: 7, 'Item': 'Caja', 'Cantidad': 1, 'Precio': 150, 'Total': 0 },
//   { id: 8, 'Item': 'EPP', 'Cantidad': 1, 'Precio': 0, 'Total': 0 },
//   { id: 9, 'Item': 'Sindicato', 'Cantidad': 1, 'Precio': 0, 'Total': 0 },
//   { id: 10, 'Item': 'Laboratorio', 'Cantidad': 1, 'Precio': 400, 'Total': 0 },
//   { id: 11, 'Item': 'Samuel', 'Cantidad': 1, 'Precio': 0, 'Total': 0 },
//   { id: 12, 'Item': 'Viaticos', 'Cantidad': 1, 'Precio': 0, 'Total': 0 },
// ]
// const imprimacionRowsArr = [
//   { id: 1, 'Item': 'Imprimación', 'Cantidad': 0, 'Precio': 3, 'Total': 0 },
//   { id: 2, 'Item': '', 'Cantidad': 0, 'Precio': 0, 'Total': 0 },
//   { id: 3, 'Item': 'Ayudantes', 'Cantidad': 0, 'Precio': 0, 'Total': 0 },
//   { id: 4, 'Item': 'Compresora', 'Cantidad': 0, 'Precio': 0, 'Total': 0 },
// ]
// const thicknessRows = [
//   { id: 1, 'Pulgadas': 1, 'Centimetros': 0.035 },
//   { id: 2, 'Pulgadas': 1.5, 'Centimetros': 0.048 },
//   { id: 3, 'Pulgadas': 2, 'Centimetros': 0.065 },
//   { id: 4, 'Pulgadas': 2.5, 'Centimetros': 0.083 },
//   { id: 5, 'Pulgadas': 3, 'Centimetros': 0.095 },
// ]

export const NewServiceQuotePage = () => {
  const [clientsDB, setClientsDB] = useState<ClientType[]>([])
  const [clientSelected, setClientSelected] = useState<ClientType | undefined>(undefined)
  const [servicesDB, setServicesDB] = useState<ServiceType[]>([])
  const [showCreateQuote, setShowCreateQuote] = useState(false)
  const [prodInfo, setProdInfo] = useState<ProdInfoType>(initialProductionInfo)
  const [asphaltRows, setAsphaltRows] = useState(asphaltRowsArr)
  const [serviceRows, setServiceRows] = useState(serviceRowsArr)
  const [imprimacionRows, setImprimacionRows] = useState(imprimacionRowsArr)

  const [quote, setQuote] = useState<ServiceQuoteType>(initialServiceQuote)
  const [quotesDBList, setQuotesDBList] = useState<ServiceQuoteType[]>([])
  const [customDate, setCustomDate] = useState('')
  const [addIGV, setAddIGV] = useState(true)
  const date = new Date()
  const router = useRouter()
  const { isMobile } = useScreenSize()

  const { run: runGetClients } = useAsync({ onSuccess(data) { setClientsDB(data.data) } })
  const { run: runGetServices } = useAsync({ onSuccess(data) { setServicesDB(data.data) } })
  const { run: runGetQuotes, isLoading, refetch: refetchQuotes } = useAsync({ onSuccess(data) { setQuotesDBList(data.data) } })
  const { run: runAddQuote, isLoading: loadingAddQuote  } = useAsync()

  const quoteNumber = 100 + quotesDBList.length + 1

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
  
  // Handlers
  const handleChangeCustomDate = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCustomDate(value)
  }

  const generateAndDownloadPDF = async(editQuoteDate:string | undefined, addQuoteDate: Date, quoteNumber: number, clientSelected: any, quoteShortDate: string) => {     
    const pdfData: ServiceQuotePDFType = {
      companyName: clientSelected?.name ?? '',
      ruc: clientSelected?.ruc ?? '',
      nroQuote: quoteNumber.toString(),
      notes: quote.notes,
      date: addQuoteDate.toUTCString(),
      services: quote.items,
      addIGV: addIGV,
    }

    const response = await axios.post( API_ROUTES.generateServiceQuotationPDF, { pdfData }, {responseType: 'arraybuffer'} )
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const { shortDate: pdfEditDate } = getDate(editQuoteDate)
    const pdfdate = quoteShortDate
    const pdfName = `Cotización_${quoteNumber}_${clientSelected?.name}_${pdfdate}.pdf`

    const pdfUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute('download', pdfName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const handleCloseFormModal = () => {
    setClientSelected(undefined)
    setQuote(initialServiceQuote)
    setAddIGV(true)
  }

  // add or edit quotes
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const inputDate = new Date(customDate)
    const addQuoteDate = customDate.length > 0 ? inputDate : date
    const { shortDate: quoteShortDate } = getDate(addQuoteDate.toUTCString())

    if (clientSelected) {
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
          generateAndDownloadPDF(undefined, addQuoteDate, quoteNumber, clientSelected, quoteShortDate)
        },
        onError: (err) => {
          console.log(err)
          toast.error("Algo salio mal al generar la cotización, contacte al administrador")
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
              prodInfo={prodInfo}
              asphaltRows={asphaltRows}
              serviceRows={serviceRows}
              imprimacionRows={imprimacionRows}
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
            quote={quote}
            setter={setQuote}
            client={clientSelected}
            onChangeDate={handleChangeCustomDate}
            dateValue={customDate}
            isLoading={loadingAddQuote}
            addIGV={addIGV}
            onChangeAddIGV={handleChangeAddIGV}
            handleSubmit={handleSubmit}
            clientsDB={clientsDB}
            handleSelectClient={handleSelectClient}
            servicesDB={servicesDB}
            handleSelectService={handleSelectService}
            title={`Generar cotización Nro ${quoteNumber}`}
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
