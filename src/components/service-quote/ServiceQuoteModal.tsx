import React from 'react'
import { Button, Flex, Text } from '@chakra-ui/react'
import { ClientType } from '../clients'
import { ServiceQuotePDFType, ServiceQuoteType } from './utils'
import { CONSTROAD_COLORS } from 'src/styles/shared'
import { formatPriceNumber, getDate } from '../../common/utils/index';
import { CustomDivider } from '../CustomDivider'
import axios from 'axios'
import { API_ROUTES } from 'src/common/consts'

interface ServiceQuoteModalProps {
  quote: ServiceQuoteType;
  clients: ClientType[]
}

export const ServiceQuoteModal = (props: ServiceQuoteModalProps) => {
  const { quote, clients } = props;
  const quoteClient = clients.find(cli => cli._id === quote.clientId)
  const { slashDate } = getDate(quote.date)

  const area = quote.costs?.prodInfo?.metrado
  const m3Produced = quote.costs.prodInfo?.m3Produced
  const priceM3 = quote.costs?.priceM3
  const priceM2 = quote.costs?.priceM2

  const asphaltProdCost = quote.costs?.asphalt.reduce((total, item) => total + (+item['Total']), 0)
  const asphaltSellCost = priceM3 * m3Produced
  const serviceCost = quote.costs?.service.reduce((total, item) => total + (+item['Total']), 0)

  const revenue = (priceM2 * area) - (asphaltProdCost + serviceCost)
  
  const detraction = (priceM2 * area) * 0.04

  const generateAndDownloadPDF = async(editQuoteDate:string | undefined, addQuoteDate: Date, quoteNumber: number, clientSelected: any, quoteShortDate: string) => {     
    const pdfData: ServiceQuotePDFType = {
      companyName: clientSelected?.name ?? '',
      contactPerson: clientSelected?.contactPerson ?? '',
      ruc: clientSelected?.ruc ?? '',
      nroQuote: quoteNumber.toString(),
      notes: quote.notes,
      date: addQuoteDate.toUTCString(),
      services: quote.items,
      addIGV: quote.igv === 0 ? false : true,
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

  const handleDownloadPDF = () => {
    const quoteDate = new Date(quote.date)
    const { shortDate: quoteShortDate } = getDate(quoteDate.toUTCString())
    generateAndDownloadPDF(undefined, quoteDate, quote.nro, quoteClient, quoteShortDate)
  }

  return (
    <Flex flexDir='column' gap='5px' fontSize={{ base: 11, md: 12 }} position='relative'>
      <Button size='xs' position='absolute' right='0' colorScheme='blue' onClick={handleDownloadPDF}>
        Descargar PDF
      </Button>

      <Flex gap='2px'>
        <Text fontWeight={600} minW='88px'>Cliente:</Text>
        <Text>{quoteClient?.name}</Text>
      </Flex>

      <Flex gap='2px'>
        <Text fontWeight={600} minW='88px'>Nro.:</Text>
        <Text>{quote.nro}</Text>
      </Flex>

      <Flex gap='2px'>
        <Text fontWeight={600} minW='88px'>Fecha:</Text>
        <Text>{slashDate}</Text>
      </Flex>

      <Flex gap='2px' flexDir='column'>
        <Text fontWeight={600}>Productos: ({quote.items.length})</Text>
        <Flex flexDir='row' gap='3px' flexWrap='wrap'>
          {quote.items.map((prod, idx) => (
            <Flex
              key={idx}
              flexDir='column'
              rounded='6px'
              border='0.5px solid'
              borderColor='gray'
              px='5px'
              width='100%'
              fontSize={{ base: 10, md: 11 }}
            >
              <Flex gap='2px'>
                <Text fontWeight={600} minW='74px'>Producto:</Text>
                <Text>{prod?.description}</Text>
              </Flex>
              <Flex gap='2px'>
                <Text fontWeight={600} minW='74px'>Unidad:</Text>
                <Text>{prod?.unit}</Text>
              </Flex>
              <Flex gap='2px'>
                <Text fontWeight={600} minW='74px'>Pulgadas:</Text>
                <Text>{prod?.inches}</Text>
              </Flex>
              <Flex gap='2px'>
                <Text fontWeight={600} minW='74px'>Flete:</Text>
                <Text>{prod?.flete}</Text>
              </Flex>
              <Flex gap='2px'>
                <Text fontWeight={600} minW='74px'>Cantidad:</Text>
                <Text>{prod?.quantity}</Text>
              </Flex>
              <Flex gap='2px'>
                <Text fontWeight={600} minW='74px'>Precio U.:</Text>
                <Text>S/. {formatPriceNumber(prod?.unitPrice)}</Text>
              </Flex>
              <Flex gap='2px'>
                <Text fontWeight={600} minW='74px'>Total:</Text>
                <Text>S/. {formatPriceNumber(prod?.unitPrice * prod?.quantity)}</Text>
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Flex>

      <Flex gap='5px' flexDir='column' mt='5px'>
        <Flex gap='2px'>
          <Text fontWeight={600} minW='88px'>Subtotal:</Text>
          <Text>S/. {formatPriceNumber(quote.subTotal)}</Text>
        </Flex>

        <Flex gap='2px'>
          <Text fontWeight={600} minW='88px'>IGV:</Text>
          <Text>S/. {formatPriceNumber(quote.igv)}</Text>
        </Flex>

        <Flex gap='2px'>
          <Text fontWeight={600} minW='88px'>Total:</Text>
          <Text bg={CONSTROAD_COLORS.orange} rounded='3px' px='2px'>S/. {formatPriceNumber(quote.total)}</Text>
        </Flex>
      </Flex>

      {quote.costs?.asphalt.length !== 0 && (
        <Flex flexDir='column'>
          <CustomDivider label='Costos' marginY='5px' />

          <Flex gap={2} color='black' px='4px' rounded='4px' border='0.5px solid' bg={CONSTROAD_COLORS.lightGray} mt='2px' width='fit-content'>
            <Text>Área (M2):</Text>
            <Text textAlign='end' fontWeight={700}>{area}</Text>
          </Flex>
          <Flex gap={2} color='black' width='fit-content' px='4px' rounded='4px' border='0.5px solid' bg={CONSTROAD_COLORS.lightGray} mt='4px'>
            <Text>Cubos de asfalto (M3):</Text>
            <Text textAlign='end' fontWeight={700}>{m3Produced}</Text>
          </Flex>
          <Flex gap={2} alignItems='center' mt='4px'>
            <Text px='2px'>Dias de trabajo:</Text>
            <Text textAlign='end' fontWeight={700}>{quote.costs?.prodInfo.days}</Text>
          </Flex>
          <Flex gap={2} alignItems='center'>
            <Text px='2px'>Costo de producción por m3:</Text>
            <Text textAlign='end' fontWeight={700}>s/. {asphaltProdCost/m3Produced}</Text>
          </Flex>

          <Flex border='0.5px solid' alignItems='center' mt='10px'>
            <Text px='2px' w='60%' borderRight='0.5px solid'>Costo de venta de asfalto (m3 * s/. {priceM3}):</Text>
            <Text w='20%' textAlign='end' borderRight='0.5px solid' px='2px'>0</Text>
            <Text w='20%' textAlign='end' px='2px'>{formatPriceNumber(asphaltSellCost)}</Text>
          </Flex>
          <Flex border='0.5px solid' alignItems='center' borderTop='none'>
            <Text px='2px' w='60%' borderRight='0.5px solid'>Costo de producción de asfalto (m3 * s/. {asphaltProdCost/m3Produced}):</Text>
            <Text px='2px' w='20%' borderRight='0.5px solid' textAlign='end'>{formatPriceNumber(asphaltProdCost)}</Text>
            <Text px='2px' w='20%' textAlign='end'>0</Text>
          </Flex>
          <Flex border='0.5px solid' borderTop='none' alignItems='center' >
            <Text px='2px' w='60%' borderRight='0.5px solid'>Costo de servicios:</Text>
            <Text px='2px' w='20%' borderRight='0.5px solid' textAlign='end'>{formatPriceNumber(serviceCost)}</Text>
            <Text px='2px' w='20%' textAlign='end'>{formatPriceNumber(serviceCost)}</Text>
          </Flex>
          <Flex border='0.5px solid' borderTop='none' alignItems='center' >
            <Text px='2px' w='60%' borderRight='0.5px solid' bg={CONSTROAD_COLORS.lightGray}>Costo total de asfalto + servicio:</Text>
            <Text px='2px' w='20%' borderRight='0.5px solid' textAlign='end' bg='#FFFA94'>{formatPriceNumber(serviceCost + asphaltProdCost)}</Text>
            <Text px='2px' w='20%' textAlign='end' bg={CONSTROAD_COLORS.orange} >{formatPriceNumber(serviceCost + asphaltSellCost)}</Text>
          </Flex>

          <Flex gap={2} mt='10px'>
            <Text>costo m2:</Text>
            <Text fontWeight={700}>s/. { (((m3Produced * 480) + serviceCost) / quote.costs?.prodInfo?.metrado).toFixed(2) }</Text>
          </Flex>
          <Flex gap={2}>
            <Text>Precio m2 cotizado:</Text>
            <Text fontWeight={700}>s/. {formatPriceNumber(priceM2)}</Text>
          </Flex>

          <CustomDivider label='Ganancias' marginY='5px' />

          <Flex border='0.5px solid' alignItems='center' >
            <Text px='2px' w='30%' borderRight='0.5px solid' bg={CONSTROAD_COLORS.lightGray} textAlign='center' fontWeight={700}>{quote.costs?.prodInfo?.metrado} m2</Text>
            <Text px='2px' w='30%' borderRight='0.5px solid black' textAlign='center' bg={CONSTROAD_COLORS.lightGray} color='red' fontWeight={600}>{formatPriceNumber(priceM2)}</Text>
            <Text px='2px' w='40%' textAlign='end' bg={CONSTROAD_COLORS.lightGray} fontWeight={700}>{formatPriceNumber(priceM2 * quote.costs?.prodInfo?.metrado)}</Text>
          </Flex>
          <Flex border='0.5px solid' borderTop='none' alignItems='center' >
            <Text px='2px' w='60%' borderRight='0.5px solid'>Costo total de asfalto + servicio:</Text>
            <Text px='2px' w='40%' textAlign='end' bg='#FFFA94'>{formatPriceNumber(serviceCost + asphaltProdCost)}</Text>
          </Flex>
          <Flex border='0.5px solid' borderTop='none' alignItems='center' >
            <Text px='2px' w='60%' borderRight='0.5px solid'>Ganancia</Text>
            <Text px='2px' w='40%' textAlign='end' >{formatPriceNumber( revenue )}</Text>
          </Flex>
          <Flex border='0.5px solid' borderTop='none' alignItems='center' >
            <Text px='2px' w='60%' borderRight='0.5px solid' color='red'>Detracción</Text>
            <Text px='2px' w='40%' textAlign='end' color='red'>{formatPriceNumber(detraction)}</Text>
          </Flex>
          <Flex border='0.5px solid' borderTop='none' alignItems='center' >
            <Text px='2px' w='60%' borderRight='0.5px solid' bg={CONSTROAD_COLORS.lightGray}>Ganancia sin detracción</Text>
            <Text px='2px' w='40%' textAlign='end' bg={CONSTROAD_COLORS.orange} fontWeight={700}>{formatPriceNumber(revenue - detraction)}</Text>
          </Flex>
        </Flex>
      )}

    </Flex>
  )
}

export default ServiceQuoteModal;