import { Button, Text } from "@chakra-ui/react"
import { TableColumn } from "../Table"
import { ClientType } from "./utils"

export const generateClientColumns = (
  handleSelectClient: (row: ClientType) => void
) => {
  const columns: TableColumn[] = [
    {
      key: 'name',
      label: 'Razón social',
      width: '30%',
    },
    { key: 'alias', label: 'Alias', width: '10%' },
    { key: 'ruc', label: 'RUC', width: '5%' },
    { key: 'phone', label: 'Teléfono', width: '5%' },
    {
      key: 'web',
      label: 'VER',
      width: '5%',
      render: (item, row) => (
        <Button onClick={() => handleSelectClient(row)} size='md' px='5px' minW='30px' w='30px' maxWidth='30px' maxHeight='20px' fontSize={12} colorScheme="blue">
          Ver
        </Button>
      )
    },
  ]

  return columns
}

export const generateMobileClientColumns = ( handleSelectClient: (row: ClientType) => void ) => {
  const columns: TableColumn[] = [
    {
      key: 'name',
      label: 'Nombre',
      width: '65%',
      render: (item, row) => (
        <Text
          fontSize={10}
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          maxW='185px'
          w='185px'
          minW='185px'
        >
          {item}
        </Text>
      )
    },
    {
      key: 'alias',
      label: 'Ver',
      width: '15%',
      render: (item, row) => (
        <Button onClick={() => handleSelectClient(row)} size='md' px='5px' minW='30px' w='30px' maxWidth='30px' maxHeight='20px' fontSize={12} colorScheme="blue">
          Ver
        </Button>
      )
    }
  ]
  return columns
}
