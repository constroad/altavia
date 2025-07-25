'use client'

import { PageHeader } from '@/components';
import { ClientList } from '@/components/clients/ClientList';
import { Button, Flex, useDisclosure } from '@chakra-ui/react'

export default function ClientsPage() {
  const { open, onOpen, onClose } = useDisclosure();

  const actions = (
    <Button size={{ base: 'xs', md: 'sm' }} onClick={onOpen} autoFocus>
      Agregar cliente
    </Button>
  );

  return (
    <Flex flexDir='column' width='100%'>
      <PageHeader title='Clientes' actions={actions} />
      <ClientList open={open} onClose={onClose} onOpen={onOpen} />
    </Flex>
  )
}
