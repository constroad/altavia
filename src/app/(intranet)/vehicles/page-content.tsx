'use client'

import React from 'react'
import { Button, Flex, useDisclosure } from '@chakra-ui/react';
import { VehicleList } from '@/components/vehicles';
import { PageHeader } from '@/components';
 
export default function VehiclesPage() {
  const { open, onOpen, onClose } = useDisclosure();

  const actions = (
    <Button autoFocus onClick={onOpen} size={{ base: 'xs', md: 'sm' }}>
      Agregar vehículo
    </Button>
  )

  return (
    <Flex flexDir='column' width='100%' >
      <PageHeader title='Vehículos' actions={actions} />
      <VehicleList open={open} onClose={onClose} onOpen={onOpen} /> 
    </Flex>
  )
}
