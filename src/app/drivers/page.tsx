'use client'

import React from 'react';
import { Button, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { DashboardLayout } from 'src/components';
import { DriverList } from '@/components/drivers';

export default function Page() {
  const { open, onOpen, onClose } = useDisclosure();

  return (
    <DashboardLayout>
      <Flex
        flexDir='column'
        alignItems={{ base: '', md: '' }}
        width='100%'
        gap='5px'
      >
        <Flex width='100%' justifyContent='space-between' alignItems='center'>
          <Text
            fontSize={{ base: 25, md: 36 }}
            fontWeight={700}
            color='black'
            lineHeight={{ base: '28px', md: '39px' }}
          >
            Conductores
          </Text>

          <Button autoFocus onClick={onOpen} size={{ base: 'xs', md: 'sm' }}>
            Agregar conductor
          </Button>
        </Flex>

        <DriverList open={open} onClose={onClose} onOpen={onOpen} />
      </Flex>
    </DashboardLayout>
  )
}
