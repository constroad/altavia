import React from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { BankAccountCard } from '../clients'
import { Tag } from '../tag'
import { ProviderType } from './utils'

interface ProviderModalProps {
  provider: ProviderType
}

export const ProviderModal = (props: ProviderModalProps) => {
  const { provider } = props;
  return (
    <Flex flexDir='column' gap='10px' fontSize={12}>
      <Flex gap='2px'>
        <Text fontWeight={600} width='80px' minW='80px'>Alias:</Text>
        <Text>{provider.alias}</Text>
      </Flex>
      <Flex gap='2px'>
        <Text fontWeight={600} width='80px' minW='80px'>RUC:</Text>
        <Text>{provider.ruc}</Text>
      </Flex>
      <Flex gap='2px'>
        <Text fontWeight={600} width='80px' minW='80px'>Dirección:</Text>
        <Text>{provider.address}</Text>
      </Flex>
      <Flex gap='2px'>
        <Text fontWeight={600} width='80px' minW='80PX'>Teléfono:</Text>
        <Text>{provider.phone}</Text>
      </Flex>
      <Flex gap='2px'>
        <Text fontWeight={600} width='80px' minW='80px'>Correo:</Text>
        <Text>{provider.email}</Text>
      </Flex>
      <Flex gap='2px'>
        <Text fontWeight={600} width='80px' minW='80px'>Web:</Text>
        <Text>{provider.web}</Text>
      </Flex>
      <Flex gap='2px'>
        <Text fontWeight={600} width='80px' minWidth='80px' lineHeight='12px'>Notas:</Text>
        <Text lineHeight='12px'>{provider.notes}</Text>
      </Flex>
      <Flex gap='2px'>
        <Text fontWeight={600} width='80px' minWidth='80px'>Descripción:</Text>
        <Text>{provider.description}</Text>
      </Flex>
      <Flex gap='2px' flexDir='column'>
        <Text fontWeight={600}>Etiquetas: ({provider.tags.length})</Text>
        <Flex flexDir='row' gap='2px' flexWrap='wrap'>
          {provider.tags.map((tag) => (
            <Tag key={tag} tag={tag} />
          ))}
        </Flex>
      </Flex>
      <Flex gap='2px' flexDir='column'>
        <Text fontWeight={600}>Cuentas bancarias: ({provider.bankAccounts.length})</Text>
        <Flex flexDir='column' gap='2px'>
          {provider.bankAccounts.map((acc) => (
            <BankAccountCard key={acc.accountNumber} bankAccount={acc} isMobile/>
          ))}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default ProviderModal
