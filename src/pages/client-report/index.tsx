import React, { useEffect, useState } from 'react';
import { Box, Flex, Spinner, Text, useDisclosure } from '@chakra-ui/react';
import {
  ClientType,
  Modal,
  PortalLayout,
  TableComponent,
  generateReportClientColumns,
  generateDispatchColumns,
} from 'src/components';
import { useRouter } from 'next/router';
import { useAsync, useDispatch, useScreenSize } from 'src/common/hooks';
import { API_ROUTES } from 'src/common/consts';
import axios from 'axios';
import { capitalizeText } from 'src/common/utils';

const fetcher = (path: string) => axios.get(path);

export const ClientReportPage = () => {
  const [client, setClient] = useState<ClientType>();
  const [orders, setOrders] = useState<any>();
  const [orderSelected, setOrderSelected] = useState<any>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isMobile } = useScreenSize();

  const router = useRouter();
  const clientId = router.query.clientId as string;

  const { run: runGetClient, isLoading: isLoadingClient } = useAsync({
    onSuccess(data) {
      setClient(data?.data);
    },
  });

  const { run: runGetOrder, isLoading } = useAsync({
    onSuccess(data) {
      const response = data?.data.orders;
      const pendingOrders = response.filter(
        (order: any) => order?.isPaid === false
      );
      setOrders(pendingOrders);
    },
  });

  const { dispatchResponse, listDispatch } = useDispatch({
    query: {
      page: 1,
      limit: 50,
      clientId: clientId ?? '',
      orderId: orderSelected?.orderId ?? '',
    },
  });

  const listDispatchUpdated = listDispatch.filter(
    (disp) => disp.orderId === orderSelected?._id
  );

  useEffect(() => {
    if (clientId) {
      const clientPath = `${API_ROUTES.client}/${clientId}`;
      runGetClient(fetcher(clientPath));

      const orderPath = `${API_ROUTES.order}?clientId=${clientId}`;
      runGetOrder(fetcher(orderPath), {
        refetch: () => runGetOrder(fetcher(orderPath)),
      });
    }
  }, [clientId]);

  const handleDispatchesView = () => {
    onOpen();
  };

  const handleDownloadPDF = () => {
    // descargar reporte como pdf
  };

  const handleDownloadCertificates = () => {};

  const handleClickMenuButton = (row: any) => {
    setOrderSelected(row);
  };

  const dispatchColums = generateDispatchColumns();
  const columns = generateReportClientColumns(
    handleDispatchesView,
    handleDownloadPDF,
    handleDownloadCertificates,
    handleClickMenuButton,
    isMobile
  );

  return (
    <PortalLayout>
      <Flex w="100%" px={{ base: '20px', md: '70px' }} flexDir="column">
        <Flex w="100%" justifyContent="center">
          <Text fontWeight={900} fontSize="24px">
            Reporte de Pedidos
          </Text>
        </Flex>
        {isLoading || (isLoadingClient && <Spinner />)}
        <Flex flexDir="column" w="100%" alignItems="center" mt="8px">
          {client && (
            <Flex w="100%" justifyContent="start" fontWeight={600}>
              Cliente: {capitalizeText(client.name)}
            </Flex>
          )}
          {orders && (
            <Box w="100%" mt="5px">
              <TableComponent data={orders} columns={columns} actions />
            </Box>
          )}
          {orders && orderSelected && (
            <Modal isOpen={isOpen} onClose={onClose} heading="Despachos">
              <Flex fontWeight={600} fontSize={12}>
                Obra: {orderSelected.obra}
              </Flex>
              <Flex fontWeight={600} fontSize={12} mb="4px">
                M3: {orderSelected.m3dispatched}
              </Flex>
              <TableComponent
                isLoading={isLoading || isLoadingClient}
                data={listDispatchUpdated}
                columns={dispatchColums}
                pagination
              />
            </Modal>
          )}
        </Flex>
      </Flex>
    </PortalLayout>
  );
};

export default ClientReportPage;
