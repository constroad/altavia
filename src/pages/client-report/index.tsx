import React, { useEffect, useState } from 'react'
import { Box, Flex, useDisclosure } from '@chakra-ui/react'
import { ClientType, Modal, PortalLayout, TableComponent, generateReportClientColumns, generateDispatchColumns } from 'src/components'
import { useRouter } from 'next/router'
import { useAsync, useDispatch, useScreenSize } from 'src/common/hooks'
import { API_ROUTES } from 'src/common/consts'
import axios from 'axios'
import { capitalizeText } from 'src/common/utils'

const fetcher = (path: string) => axios.get(path);

export const ClientReportPage = () => {
  const [client, setClient] = useState<ClientType>()
  const [order, setOrder] = useState<any>()
  const [proyectOrder, setProyectOrder] = useState('')
  const [quantityOrder, setQuantityOrder] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  // const { isMobile } = useScreenSize()

  const router = useRouter()
  const clientId = router.query.clientId as string
  
  const { run: runGetClient } = useAsync({
    onSuccess(data) {
      setClient(data?.data)
    },
  })
  const { run: runGetOrder } = useAsync({
    onSuccess(data) {
      setOrder(data?.data.orders)
    },
  })

  const {
    dispatchResponse,
    listDispatch,
  } = useDispatch({
    query: {
      page: 1,
      limit: 20,
      clientId: clientId ?? '',
    },
  });
  
  useEffect(() => {
    if (clientId) {
      const clientPath = `${API_ROUTES.client}/${clientId}`
      runGetClient(fetcher(clientPath))

      const orderPath = `${API_ROUTES.order}?clientId=${clientId}`;
      runGetOrder(fetcher(orderPath), {
        refetch: () => runGetOrder(fetcher(orderPath)),
      });
    }
  }, [clientId])

  const handleDispatchesView = (order: any) => {
    onOpen()
    setProyectOrder(order.obra)
    setQuantityOrder(order.m3dispatched)
  }

  const handleDownloadPDF = () => {

  }

  const handleDownloadCertificates = () => {

  }
  
  const dispatchColums = generateDispatchColumns()
  const columns = generateReportClientColumns(
    handleDispatchesView,
    handleDownloadPDF,
    handleDownloadCertificates
  );

  return (
    <PortalLayout>
      <Flex w='100%' px={{base: '5px', md: '70px'}}>
        <Flex flexDir='column' w='100%' alignItems='center'>
          {client && (
            <Flex w='100%' justifyContent='start' fontWeight={600}>Cliente: {capitalizeText(client.name)}</Flex>
          )}
          {order && (
            <Box w="100%">
              <TableComponent
                data={order}
                columns={columns}
              
                actions
              />
            </Box>
          )}
          {order && (
            <Modal isOpen={isOpen} onClose={onClose} heading='Despachos'>
              <Flex fontWeight={600} fontSize={12}>Obra: {proyectOrder}</Flex>
              <Flex fontWeight={600} fontSize={12} mb='4px'>M3: {quantityOrder}</Flex>
              <TableComponent
                data={listDispatch}
                columns={dispatchColums}
                pagination
              />
            </Modal>
          )}
        </Flex>
      </Flex>
    </PortalLayout>
  )
}

export default ClientReportPage
