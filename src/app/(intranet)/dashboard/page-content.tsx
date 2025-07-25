'use client'

import React from 'react'
import { Flex } from '@chakra-ui/react'
import { PageHeader } from '@/components'

export default function DashboardPage() {

  const actions = (<></>)

  return (
    <Flex flexDir='column' width='100%' >
      <PageHeader title='Dashboard' actions={actions} />
      <> Estas en el dashboard de Altavía Perú </>
    </Flex>
  )
}
