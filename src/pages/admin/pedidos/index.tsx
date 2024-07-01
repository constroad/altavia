import {
  Flex,
  useDisclosure,
  Button,
  Box,
  Text,
  Select,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import { ADMIN_ROUTES, API_ROUTES, APP_ROUTES } from 'src/common/consts';
import { useAsync } from 'src/common/hooks';
import {
  Modal,
  TableComponent,
  toast,
  IntranetLayout,  
} from 'src/components';
import { generatePedidoColumns } from 'src/components/pedidos';
import { IOrderGetAll, IOrderValidationSchema } from 'src/models/order';
import { IClientValidationSchema } from 'src/models/client';
import { SearchIcon, ShareIcon } from 'src/common/icons';
import { copyToClipboard } from '../../../common/utils/copyToClipboard';
import { getBaseUrl } from 'src/common/utils';
import { getDateStringRange, parseLocalDate } from 'src/utils/general';

const fetcher = (path: string) => axios.get(path);
const deleteOrder = (path: string) => axios.delete(path);

const Pedidos = () => {
  const { dateTo, dateFrom } = getDateStringRange(30);
  const [orderSelected, setOrderSelected] = useState<
    IOrderValidationSchema | undefined
  >();
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [clientId, setClientId] = useState('');
  const [isPaid, setIsPaid] = useState('');
  const [startDate, setStartDate] = useState(dateFrom);
  const [endDate, setEndDate] = useState(dateTo);

  const {
    onClose: onCloseDelete,
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
  } = useDisclosure();
  const router = useRouter();

  // API
  const { run: runGetClients, data: clientResponse } =
    useAsync<IClientValidationSchema[]>();
  const {
    run: runGetOrders,
    data: orderResponse,
    isLoading,
    refetch,
  } = useAsync<IOrderGetAll>();
  const { run: runDeleteOrder, isLoading: deletingOrder } = useAsync();

  useEffect(() => {
    onSearch()
    runGetClients(fetcher(API_ROUTES.client), {
      cacheKey: API_ROUTES.client,
      refetch: () => runGetClients(fetcher(API_ROUTES.client)),
    });
  }, []);

  // handlers
  const handleDeleteOrder = () => {
    runDeleteOrder(deleteOrder(`${API_ROUTES.order}/${orderSelected?._id}`), {
      onSuccess: () => {
        toast.success(`Eliminaste el pedido ${orderSelected?.cliente}`);
        refetch();
        setOrderSelected(undefined);
        onCloseDelete();
      },
    });
  };
  const onSearch = () => {
    const queryParams = new URLSearchParams({});
    if (isPaid !== '') {
      queryParams.append('isPaid', isPaid);
    }
    if (clientId) {
      queryParams.append('clientId', clientId);
    }
    if (startDate) {
      queryParams.append('startDate', parseLocalDate(startDate).toISOString());
    }
    if (endDate) {
      queryParams.append('endDate', parseLocalDate(endDate).toISOString());
    }
    const path = `${API_ROUTES.order}?${queryParams.toString()}`;
    runGetOrders(fetcher(path), {
      refetch: () => runGetOrders(fetcher(path)),
    });
  };
  const handleGoToOrder = (id: string) => {
    router.push(`${ADMIN_ROUTES.orders}/${id}`);
  };

  const onTableActions = (action: string, row: IOrderValidationSchema) => {
    if (action === 'delete') {
      setOrderSelected(row);
      onOpenDelete();
    }
    if (action === 'edit') {
      handleGoToOrder(row?._id ?? '');
    }
  };
  const columns = generatePedidoColumns({
    onAction: onTableActions,
  });

  const clientList = clientResponse?.data ?? [];
  const orderList = orderResponse?.data?.orders ?? [];

  const handleGenerateAndCopyURL = (clientId: string) => {
    const baseUrl = getBaseUrl();
    const clientReportUrl = `${baseUrl}${APP_ROUTES.clientReport}?clientId=${clientId}`;
    const toastMessage = 'Url copiado con éxito';
    copyToClipboard(clientReportUrl, toastMessage);
  };

  // Renders
  const deleteFooter = (
    <Button
      isLoading={deletingOrder}
      variant="ghost"
      autoFocus
      colorScheme="red"
      onClick={handleDeleteOrder}
    >
      Confirm
    </Button>
  );

  return (
    <IntranetLayout title="Listado de Pedidos">
      <Flex flexDir="column" gap={2} mt={5}>
        <Flex
          justifyContent="space-between"
          alignItems="end"
          fontSize="inherit"
        >
          <Flex wrap="wrap" width="100%" alignItems="end" gap={1}>
            <Flex flexDir="column" fontSize="inherit">
              <Text fontSize={{ base: 12 }}>Cliente:</Text>
              <Select
                defaultValue=""
                size="sm"
                width={{ base: '90px', md: '200px' }}
                onChange={(e) => setClientId(e.target.value)}
                fontSize={12}
                value={clientId}
              >
                <option value="">Todos</option>
                {clientList.map((client) => (
                  <option key={`filter-${client._id}`} value={client._id}>
                    {client.name}
                  </option>
                ))}
              </Select>
            </Flex>
            <Flex flexDir="column" fontSize="inherit">
              <Text fontSize={{ base: 12 }}>Condicion:</Text>
              <Select
                defaultValue=""
                size="sm"
                width={{ base: '90px', md: '110px' }}
                onChange={(e) => setIsPaid(e.target.value)}
                fontSize={12}
                value={isPaid}
              >
                <option value="">Todos</option>
                <option value="true">Pagado</option>
                <option value="false">Pendiente</option>
              </Select>
            </Flex>
            <Box>
              <FormLabel mb="6px" fontSize={{ base: 12 }}>
                Desde:
              </FormLabel>
              <Input
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                }}
                paddingInlineEnd={1}
                paddingInlineStart={1}
                fontSize={{ base: 12 }}
                height="32px"
                type="date"
                width="100px"
              />
            </Box>
            <Box>
              <FormLabel mb="6px" fontSize={{ base: 12 }}>
                Hasta
              </FormLabel>
              <Input
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                paddingInlineEnd={1}
                paddingInlineStart={1}
                fontSize={{ base: 12 }}
                height="32px"
                type="date"
                width="100px"
              />
            </Box>
            <Button autoFocus onClick={onSearch} size="sm">
              <SearchIcon size="18px" />
            </Button>
          </Flex>

          <Button
            size="sm"
            colorScheme="yellow"
            autoFocus
            onClick={() => handleGoToOrder('new')}
          >
            + Agregar
          </Button>
        </Flex>

        <Box w="100%">
          <TableComponent
            toolbar={
              <Flex
                alignItems="center"
                justifyContent="space-between"
                fontSize="12px"
                m={1}
              >
                <Box>
                  {clientId && (
                    <Button
                      size="sm"
                      fontSize={{ base: 12, md: 14 }}
                      onClick={() => handleGenerateAndCopyURL(clientId)}
                      gap={2}
                    >
                      <ShareIcon fontSize={12} />
                      <Text>Compartir con cliente</Text>
                    </Button>
                  )}
                </Box>
                <Box>
                  <Text fontWeight={600}>Pedidos: {orderList.length}</Text>
                </Box>
              </Flex>
            }
            data={orderList}
            columns={columns}
            isLoading={isLoading}
          />
        </Box>
      </Flex>

      {/* delete client modal */}
      <Modal
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        heading={`¿Estás seguro de eliminar este Pedido ${orderSelected?.cliente}?`}
        footer={deleteFooter}
      />
    </IntranetLayout>
  );
};

export default Pedidos;
