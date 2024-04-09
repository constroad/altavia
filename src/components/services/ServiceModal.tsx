import React from 'react'
import { ServiceType } from './utils'
import { Flex, Text } from '@chakra-ui/react';
import { formatPriceNumber } from 'src/common/utils';

interface ServiceModalProps {
  service: ServiceType
}

export const ServiceModal = (props: ServiceModalProps) => {
  const { service } = props;
  return (
    <Flex flexDir='column' gap='10px' fontSize={12}>
      <Flex gap='2px'>
        <Text fontWeight={600} minW='80px'>Alias:</Text>
        <Text>{service.alias}</Text>
      </Flex>
      <Flex gap='2px'>
        <Text fontWeight={600} minW='80px'>Fase:</Text>
        <Text>{service.phase}</Text>
      </Flex>
      <Flex gap='2px'>
        <Text fontWeight={600} minW='80px'>Unidad:</Text>
        <Text>{service.unit}</Text>
      </Flex>
      <Flex gap='2px'>
        <Text fontWeight={600} minW='80px'>Cantidad:</Text>
        <Text>{service.quantity}</Text>
      </Flex>
      <Flex gap='2px'>
        <Text fontWeight={600} minW='80px'>Precio:</Text>
        <Text>{formatPriceNumber(service.unitPrice)}</Text>
      </Flex>
    </Flex>
  )
}

export default ServiceModal;
