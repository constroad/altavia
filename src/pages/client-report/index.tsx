import React from 'react'
import { Flex } from '@chakra-ui/react'
import { PortalLayout } from 'src/components'

export const ClientReportPage = () => {
  return (
    <PortalLayout>
      <Flex w='100%' mx='30px' justifyContent='center'>
        <Flex fontWeight={600}>ClientReportPage</Flex>
      </Flex>
    </PortalLayout>
  )
}

export default ClientReportPage
