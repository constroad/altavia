'use client'

import React from 'react'
import { Flex } from '@chakra-ui/react'
import { PageHeader } from '@/components'

export default function ConfigurationPage() {

  const actions = (<></>)

  return (
    <>
      <PageHeader title='Configuración' actions={actions} />
      <Flex w='100%' justifyContent='center' fontSize={30} fontWeight={600} mt='200px'>
        Estas en el módulo de Configuración de Altavía Perú
      </Flex>
    </>
  )
}
