import { Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { IClientSchemaValidation } from '@/models/client'

interface IClientPopover {
  client: IClientSchemaValidation
}

export const ClientPopover = (props: IClientPopover) => {
  return (
    <Flex flexDir='column' fontWeight='light' fontSize={10} lineHeight='14px'>
      <Flex flexDir='column' gap={0.5}>
        <Flex w='100%'> 
          <Text minW='70px'>Ruc:</Text>
          <Text>{props.client.ruc}</Text>
        </Flex>
        <Flex w='100%'> 
          <Text minW='70px'>Nombre:</Text>
          <Text>{props.client.name}</Text>
        </Flex>
        <Flex w='100%'> 
          <Text minW='70px'>Dirección:</Text>
          <Text>{props.client.address ?? ''}</Text>
        </Flex>
      </Flex>
    </Flex>
  )
}
