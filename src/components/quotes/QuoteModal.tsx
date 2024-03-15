import React from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { ClientType } from '../clients'
import { QuoteType, getQuotePrices } from './utils'
import { CONSTROAD_COLORS } from 'src/styles/shared'
import { formatPriceNumber, getDate } from '../../common/utils/index';

interface QuoteModalProps {
  quote: QuoteType
  clients: ClientType[]
}

export const QuoteModal = (props: QuoteModalProps) => {
  const { quote, clients } = props;
  const quoteClient = clients.find(cli => cli._id === quote.clientId)
  const { slashDate } = getDate(quote.date)

  return (
    <Flex flexDir='column' gap='10px' fontSize={12}>
      <Flex gap='2px'>
        <Text fontWeight={600} width='80px'>Cliente:</Text>
        <Text>{quoteClient?.name}</Text>
      </Flex>

      <Flex gap='2px'>
        <Text fontWeight={600} width='80px'>Nro.:</Text>
        <Text>{quote.nro}</Text>
      </Flex>

      <Flex gap='2px'>
        <Text fontWeight={600} width='80px'>Fecha:</Text>
        <Text>{slashDate}</Text>
      </Flex>

      <Flex gap='2px' flexDir='column'>
        <Text fontWeight={600}>Productos: ({quote.items.length})</Text>
        <Flex flexDir='row' gap='2px' flexWrap='wrap'>
          {quote.items.map((prod, idx) => (
            <Flex
              key={idx}
              flexDir='column'
              rounded='6px'
              border='0.5px solid'
              borderColor='gray'
              px='5px'
              width='100%'
            >
              <Flex gap='2px'>
                <Text fontWeight={600} width='74px'>Producto:</Text>
                <Text>S/. {prod?.description}</Text>
              </Flex>
              <Flex gap='2px'>
                <Text fontWeight={600} width='74px'>Unidad:</Text>
                <Text>{prod?.unit}</Text>
              </Flex>
              <Flex gap='2px'>
                <Text fontWeight={600} width='74px'>Cantidad:</Text>
                <Text>{prod?.quantity}</Text>
              </Flex>
              <Flex gap='2px'>
                <Text fontWeight={600} width='74px'>Precio U.:</Text>
                <Text>S/. {formatPriceNumber(prod?.unitPrice)}</Text>
              </Flex>
              <Flex gap='2px'>
                <Text fontWeight={600} width='74px'>Total:</Text>
                <Text>S/. {formatPriceNumber(prod?.unitPrice * prod?.quantity)}</Text>
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Flex>

      <Flex gap='2px'>
        <Text fontWeight={600} width='80px' lineHeight='14px'>Forma de pago:</Text>
        <Text>{quote.notes}</Text>
      </Flex>

      <Flex gap='4px' flexDir='column' mt='10px'>
        <Flex gap='2px'>
          <Text fontWeight={600} width='80px'>Subtotal:</Text>
          <Text>S/. {formatPriceNumber(quote.subTotal)}</Text>
        </Flex>

        <Flex gap='2px'>
          <Text fontWeight={600} width='80px'>IGV:</Text>
          <Text>S/. {formatPriceNumber(quote.igv)}</Text>
        </Flex>

        <Flex gap='2px'>
          <Text fontWeight={600} width='80px'>Total:</Text>
          <Text bg={CONSTROAD_COLORS.orange} rounded='3px' px='2px'>S/. {formatPriceNumber(quote.total)}</Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default QuoteModal
