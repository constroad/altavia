import { Button, Flex, Text } from "@chakra-ui/react"
import { TableColumn } from "../Table"
import { ClientType } from "../clients"
import { formatPriceNumber, getDate } from "src/common/utils"
import { QuoteType } from "./utils"

export const generateQuoteColumns = ( clientList: ClientType[] ) => {
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
      width: '5%'
    },
    {
      key:'date',
      label:'Fecha',
      width: '5%',
      render: (item, row) => {
        const { slashDate } = getDate(item)
        return (
          <Text>{slashDate}</Text>
        )
      }
    },
    {
      key: 'items',
      label: 'Productos',
      width: '25%',
      render: (item, row) => (
        item?.length > 0 && (
          <Flex flexDir='column' width='100%' gap='2px' minWidth='230px'>
            {item?.map((i: any, idx: number) => (
              <Flex
                key={idx}
                flexDir='column'
                rounded='6px'
                border='0.5px solid'
                borderColor='gray'
                px='5px'
              >
                <Flex height='11px' alignItems='center' fontWeight={600}>
                  Producto: <Text height='11px' display='flex' alignItems='center' fontWeight={400} ml='5px'>{i?.description}</Text>
                </Flex>
                <Flex height='11px' alignItems='center' fontWeight={600}>
                  Cantidad: <Text height='11px' display='flex' alignItems='center' fontWeight={400} ml='5px'>{i?.quantity}</Text>
                </Flex>
                <Flex height='11px' alignItems='center' fontWeight={600}>
                  Precio U.: <Text height='11px' display='flex' alignItems='center' fontWeight={400} ml='5px'>S/. {i?.price}</Text>
                </Flex>
              </Flex>
            ))}
          </Flex>
        )
      )
    },
    {
      key: 'subTotal',
      label: 'Subtotal',
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
      label: 'IGV',
      width: '10%',
      render: (item, row) => {
        const formattedAmount = formatPriceNumber(item)
        return (
          <Text minWidth='105px'>S/. {formattedAmount}</Text>
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
  ]

  return columns
}


export const generateMobileQuoteColumns = ( clientList: ClientType[], handleSelectQuote: (row: QuoteType) => void ) => {
  const columns: TableColumn[] = [
    {
      key: 'clientId',
      label: 'Cliente',
      width: '100px',
      render: (item, row) => {
        const clientName = clientList.filter(client => client._id === item)
        return (
          <Text minWidth={{ base: '', md: '180px' }} >{clientName?.[0]?.name}</Text>
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
        <Button onClick={() => handleSelectQuote(row)} size='md' maxWidth='40px' maxHeight='25px' fontSize={12} colorScheme="blue">
          Ver
        </Button>
      )
    }
  ]
  return columns
}
