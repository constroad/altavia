'use client'

import React from 'react'
import { Button, Flex, useDisclosure } from '@chakra-ui/react';
import { AlertList } from '@/components/alerts/AlertsList';
import { PageHeader } from '@/components';
 
export default function AlertsPage() {
  const { open, onOpen, onClose } = useDisclosure();

  const actions = (
    <Button autoFocus onClick={onOpen} size={{ base: 'xs', md: 'sm' }}>
      Agregar alerta
    </Button>
  )

  return (
    <Flex flexDir='column' width='100%' >
      <PageHeader title='Alertas' actions={actions} />
      <AlertList open={open} onClose={onClose} onOpen={onOpen} />
    </Flex>
  )
}
