import { Button, Flex } from "@chakra-ui/react"
import { TableColumn } from "../Table"
import { BankAccountType, ClientType } from "./utils"

export const generateTableColumns = ( handleSelectBankAccount: (acc: BankAccountType, row: ClientType) => void ) => {
  const columns: TableColumn[] = [
    { key: 'name', label: 'Nombre', width: '18%' },
    { key: 'alias', label: 'Alias', width: '10%' },
    { key: 'ruc', label: 'RUC', width: '5%' },
    { key: 'address', label: 'Direccion', width: '15%' },
    { key: 'phone', label: 'Teléfono', width: '10%' },
    { key: 'email', label: 'Email', width: '10%' },
    { key: 'web', label: 'Web', width: '10%' },
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
  ]

  return columns
}
