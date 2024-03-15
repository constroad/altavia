import { Button, Flex, Text } from "@chakra-ui/react"
import { TableColumn } from "../Table"
import { BankAccountType, ClientType } from "./utils"

export const generateClientColumns = (
  handleSelectBankAccount: (acc: BankAccountType, row: ClientType) => void,
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
      key: 'bankAccounts',
      label: 'Cuentas bancarias',
      width: '10%',
      render: (item, row) => (
        item.length === 0
          ?
        <Flex>
          - - - -
        </Flex>
          :
        <Flex flexDir='column' width='100%' gap='2px'>
          {item.map((acc: any) => (
            <Button
              key={acc.accountNumber}
              width='100%'
              rounded='4px'
              fontSize={10}
              height='16px'
              lineHeight='10px'
              cursor='pointer'
              alignItems='center'
              justifyContent='center'
              colorScheme='blue'
              fontWeight={600}
              onClick={() => handleSelectBankAccount(acc, row)}
            >
              {acc.name}
            </Button>
          ))}
        </Flex>
      )
    },
    {
      key: 'web',
      label: 'VER',
      width: '3%',
      render: (item, row) => (
        <Button onClick={() => handleSelectClient(row)} size='md' maxWidth='40px' maxHeight='25px' fontSize={12} colorScheme="blue">
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
