'use client'

import React from 'react';
import { Button, Flex, useDisclosure } from '@chakra-ui/react';
import { DriverList } from '@/components/drivers';
import { PageHeader } from '@/components';

export default function DriversPage() {
  const { open, onOpen, onClose } = useDisclosure();

  const actions = (
    <Button size={{ base: 'xs', md: 'sm' }} onClick={onOpen} autoFocus>
      Agregar conductor
    </Button>
  )

  return (
    <Flex flexDir='column' width='100%' >
      <PageHeader title='Conductores' actions={actions} />
      <DriverList open={open} onClose={onClose} onOpen={onOpen} />
    </Flex>
  )
}
