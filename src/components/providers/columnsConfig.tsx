import { Button, Flex, Text } from "@chakra-ui/react"
import { TableColumn } from "../Table"
import { ProviderType } from "./utils"

export const generateProviderColumns = (
  handleSelectProvider: (row: ProviderType) => void
) => {
  const columns: TableColumn[] = [
    { key: 'name', label: 'Nombre', width: '30%' },
    { key: 'alias', label: 'Alias', width: '10%' },
    { key: 'ruc', label: 'RUC', width: '5%' },
    { key: 'phone', label: 'Teléfono', width: '5%' },
    {
      key: 'description',
      label: 'VER',
      width: '3%',
      render: (item, row) => (
        <Button onClick={() => handleSelectProvider(row)} size='md' px='5px' minW='30px' w='30px' maxWidth='30px' maxHeight='20px' fontSize={12} colorScheme="blue">
          Ver
        </Button>
      )
    },
  ]

  return columns
}


export const generateMobileProvColumns = ( handleSelectProvider: (row: ProviderType) => void ) => {
  const columns: TableColumn[] = [
    {
      key: 'name',
      label: 'Nombre',
      width: '65%',
      render: (item, row) => {
        return (
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
      }
    },
    {
      key: 'alias',
      label: 'Ver',
      width: '15%',
      render: (item, row) => (
        <Button onClick={() => handleSelectProvider(row)} size='md' px='5px' minW='30px' w='30px' maxWidth='30px' maxHeight='20px' fontSize={12} colorScheme="blue">
          Ver
        </Button>
      )
    }
  ]
  return columns
}
