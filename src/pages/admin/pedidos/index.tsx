import {
  Flex,
  useDisclosure,
  Button,
  Box,
  Text,
  Select,
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
  TableAction,
  TablePagination,
} from 'src/components';
import { generatePedidoColumns } from 'src/components/pedidos';
import { IOrderGetAll, IOrderValidationSchema } from 'src/models/order';
import { IClientValidationSchema } from 'src/models/client';
import { SearchIcon } from 'src/common/icons';
import { copyToClipboard } from '../../../common/utils/copyToClipboard';
import { getBaseUrl } from 'src/common/utils';

const fetcher = (path: string) => axios.get(path);
const deleteOrder = (path: string) => axios.delete(path);

const Pedidos = () => {
  const [orderSelected, setOrderSelected] = useState<
    IOrderValidationSchema | undefined
  >();
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [clientId, setClientId] = useState('');
  const [isPaid, setIsPaid] = useState('');

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
    const path = API_ROUTES.order;
    runGetOrders(fetcher(path), {
      refetch: () => runGetOrders(fetcher(path)),
    });
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
    const path = `${API_ROUTES.order}?${queryParams.toString()}`;
    runGetOrders(fetcher(path), {
      refetch: () => runGetOrders(fetcher(path)),
    });
  };
  const handleGoToOrder = (id: string) => {
    router.push(`${ADMIN_ROUTES.orders}/${id}`);
  };

  const columns = generatePedidoColumns();

  const clientList = clientResponse?.data ?? [];
  const orderList = orderResponse?.data?.orders ?? [];
  const pagination = orderResponse?.data?.pagination ?? {};

  const handleOnTableChange = (
    action: TableAction,
    pagination: TablePagination
  ) => {
    if (action === 'paginate') {
      setPage(pagination.page);
      setItemsPerPage(pagination.itemsPerPage);
    }
  };

  const handleGenerateAndCopyURL = (clientId: string) => {
    const baseUrl = getBaseUrl()
    const clientReportUrl = `${baseUrl}${APP_ROUTES.clientReport}?clientId=${clientId}`
    const toastMessage = 'Url copiado con éxito'
    copyToClipboard( clientReportUrl, toastMessage )
  }

  // const generateDispatchReport = async() => {
  //   const mockData = {
  //     client: 'Renato',
  //     proyect: 'Pampilla',
  //     date: 'dd/mm/yy',
  //     total: 235,
  //     dispatchs: [
  //       { driverName: 'conductor1', driverCard: 'abc-123', quantity: 200, hour: '08:55 AM'  },
  //       { driverName: 'conductor2', driverCard: 'abc-124', quantity: 35, hour: '09:37 AM'  },
  //     ]
  //   }

  //   const response = await axios.post(
  //     API_ROUTES.generateDispatchReportPDF,
  //     { mockData },
  //     { responseType: 'arraybuffer' }
  //   );
  //   const blob = new Blob([response.data], { type: 'application/pdf' });
  //   const pdfName = `Reporte_Despachos_${mockData.client}_${mockData.date}.pdf`;

  //   const pdfUrl = URL.createObjectURL(blob);
  //   const link = document.createElement('a');
  //   link.href = pdfUrl;
  //   link.setAttribute('download', pdfName);
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // }

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
            <Button
              autoFocus
              onClick={onSearch}
              size="sm"
              isLoading={isLoading}
            >
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
            data={orderList}
            columns={columns}
            onDelete={(item) => {
              setOrderSelected(item);
              onOpenDelete();
            }}
            onEdit={(item) => {
              handleGoToOrder(item._id);
            }}
            onShare={(item) => {
              handleGenerateAndCopyURL(item.clienteId)
            }}
            isLoading={isLoading}
            // pagination
            // currentPage={page}
            // onChange={handleOnTableChange}
            // itemsPerPage={itemsPerPage}
            // totalPages={pagination?.totalPages ?? 0}
            // totalRecords={orderListSorted.length}
            actions
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
