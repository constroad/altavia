import { Button, Flex } from "@chakra-ui/react"
import { TableColumn } from "../Table"
import { ProviderType } from "./utils"
import { BankAccountType } from "../clients"
import { Tag } from "../tag"

export const generateProviderColumns = (
  handleSelectBankAccount: (acc: BankAccountType, row: ProviderType) => void,
  handleShowDesOrNote: (type: string, row: ProviderType) => void,
) => {
  const columns: TableColumn[] = [
    { key: 'name', label: 'Nombre', width: '18%' },
    { key: 'alias', label: 'Alias', width: '10%' },
    { key: 'ruc', label: 'RUC', width: '5%' },
    { key: 'address', label: 'Direccion', width: '17%' },
    { key: 'phone', label: 'Teléfono', width: '5%' },
    { key: 'email', label: 'Email', width: '5%' },
    { key: 'web', label: 'Web', width: '5%' },
    {
      key: 'bankAccounts',
      label: 'Cuentas bancarias',
      width: '10%',
      render: (item, row) => (
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
      key:'tags',
      label: 'Tags',
      width: '10%',
      render: (item, row) => (
        <Flex width='100%' flexWrap='wrap' gap='5px'>
          {item.map((tag: any) => (
            <Tag key={tag} tag={tag} />
          ))}
        </Flex>
      )
    },
    {
      key: 'description',
      label: 'Desc.',
      width: '5%',
      render: (item, row) => (
        item !== '' && (
        <Button onClick={() => handleShowDesOrNote('description', row)} size='md' maxWidth='40px' maxHeight='25px' fontSize={12} colorScheme="blue">
          Ver
        </Button>
        )
      )
    },
    {
      key: 'notes',
      label: 'Notas',
      width: '5%',
      render: (item, row) => (
        item !== '' && (
          <Button onClick={() => handleShowDesOrNote('note', row)} size='md' maxWidth='40px' maxHeight='25px' fontSize={12} colorScheme="blue">
            Ver
          </Button>
        )
      )
    },
  ]

  return columns
}


export const generateMobileProvColumns = ( handleSelectProvider: (row: ProviderType) => void ) => {
  const columns: TableColumn[] = [
    { key: 'name', label: 'Nombre', width: '65%' },
    {
      key: 'alias',
      label: 'Ver',
      width: '15%',
      render: (item, row) => (
        <Button onClick={() => handleSelectProvider(row)} size='md' maxWidth='40px' maxHeight='25px' fontSize={12} colorScheme="blue">
          Ver
        </Button>
      )
    }
  ]
  return columns
}
