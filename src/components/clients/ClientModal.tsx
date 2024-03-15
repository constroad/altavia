import React from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { BankAccountCard, ClientType } from '../clients'

interface ClientModalProps {
  client: ClientType
}

export const ClientModal = (props: ClientModalProps) => {
  const { client } = props;
  return (
    <Flex flexDir='column' gap='10px' fontSize={12}>
      <Flex gap='2px'>
        <Text fontWeight={600} minW='80px'>Alias:</Text>
        <Text>{client.alias}</Text>
      </Flex>
      <Flex gap='2px'>
        <Text fontWeight={600} minW='80px'>RUC:</Text>
        <Text>{client.ruc}</Text>
      </Flex>
      <Flex gap='2px'>
        <Text fontWeight={600} minW='80px'>Contacto:</Text>
        <Text>{client.contactPerson}</Text>
      </Flex>
      <Flex gap='2px'>
        <Text fontWeight={600} minW='80px'>Teléfono:</Text>
        <Text>{client.phone}</Text>
      </Flex>
      <Flex gap='2px'>
        <Text fontWeight={600} minW='80px'>Dirección:</Text>
        <Text>{client.address}</Text>
      </Flex>
      <Flex gap='2px'>
        <Text fontWeight={600} minW='80px'>Correo:</Text>
        <Text>{client.email}</Text>
      </Flex>
      <Flex gap='2px'>
        <Text fontWeight={600} minW='80px'>Web:</Text>
        <Text>{client.web}</Text>
      </Flex>
      <Flex gap='2px' flexDir='column'>
        <Text fontWeight={600}>Cuentas bancarias: ({client.bankAccounts.length})</Text>
        <Flex flexDir='column' gap='2px'>
          {client.bankAccounts.map((acc) => (
            <BankAccountCard key={acc.accountNumber} bankAccount={acc} isMobile/>
          ))}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default ClientModal
