'use client'

import { Flex } from '@chakra-ui/react'
import React from 'react'
import { DashboardLayout } from 'src/components'

export default function Page() {
  return (
    <DashboardLayout>
      <Flex w='100%' justifyContent='center' fontSize={30} fontWeight={600} mt='200px'>
        Estas en el módulo de Alertas de Altavía Perú
      </Flex>
    </DashboardLayout>
  )
}
