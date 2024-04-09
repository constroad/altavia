import { Button, Text } from "@chakra-ui/react"
import { TableColumn } from "../Table"
import { ClientType } from "../clients"
import { formatPriceNumber, getDate } from "src/common/utils"
import { ServiceQuoteType } from "./utils"

export const generateServiceQuoteColumns = ( clientList: ClientType[], handleSelectQuote: (row: ServiceQuoteType) => void ) => {
  const columns: TableColumn[] = [
    {
      key: 'clientId',
      label: 'Cliente',
      width: '35%',
      render: (item, row) => {
        const clientName = clientList.filter(client => client._id === item)
        return (
          <Text minWidth='180px'>{clientName?.[0]?.name}</Text>
        )
      }
    },
    {
      key: 'nro',
      label: 'Nro Cotizacion',
      width: '10%'
    },
    {
      key:'date',
      label:'Fecha',
      width: '10%',
      render: (item, row) => {
        const { slashDate } = getDate(item)
        return (
          <Text>{slashDate}</Text>
        )
      }
    },
    {
      key: 'total',
      label: 'Total',
      width: '10%',
      render: (item, row) => {
        const formattedAmount = formatPriceNumber(item)
        return (
          <Text minWidth='105px'>S/. {formattedAmount}</Text>
        )
      }
    },
    {
      key: 'igv',
      label: 'Ver',
      width: '5%',
      render: (item, row) => (
        <Button onClick={() => handleSelectQuote(row)} size='md' maxWidth='40px' maxHeight='25px' fontSize={12} colorScheme="blue">
          Ver
        </Button>
      )
    },
  ]

  return columns
}


export const generateMobileServiceQuoteColumns = ( clientList: ClientType[], handleSelectQuote: (row: ServiceQuoteType) => void ) => {
  const columns: TableColumn[] = [
    {
      key: 'clientId',
      label: 'Cliente',
      width: '100px',
      render: (item, row) => {
        const clientName = clientList.filter(client => client._id === item)
        return (
          <Text
            fontSize={10}
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            maxW='115px'
            w='115px'
            minW='115px'
          >
            {clientName?.[0]?.name}
          </Text>
        )
      }
    },
    { key: 'nro', label: 'Nro', width: '5%' },
    {
      key: 'date',
      label: 'Fecha',
      width: '5%',
      render: (item, row) => {
        const { slashDate } = getDate(item)
        return (
          <Text>{slashDate}</Text>
        )
      }
    },
    {
      key: 'subTotal',
      label: 'Ver',
      width: '10%',
      render: (item, row) => (
        <Button onClick={() => handleSelectQuote(row)} size='md' px='5px' minW='30px' w='30px' maxWidth='30px' maxHeight='20px' fontSize={{base: 10, md:12}} colorScheme="blue">
          Ver
        </Button>
      )
    }
  ]
  return columns
}
