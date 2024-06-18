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

import { ADMIN_ROUTES, API_ROUTES } from 'src/common/consts';
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
import { IOrderGetAll, IOrderList, IOrderValidationSchema } from 'src/models/order';
import { IClientValidationSchema } from 'src/models/client';
import { SearchIcon } from 'src/common/icons';

const fetcher = (path: string) => axios.get(path);
const deleteOrder = (path: string) => axios.delete(path);

const Pedidos = () => {
  const [orderSelected, setOrderSelected] = useState<
    IOrderValidationSchema | undefined
  >();
  // const [orderList, setOrderList] = useState<IOrderValidationSchema[]>([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [clientId, setClientId] = useState('');

  const {
    onClose: onCloseDelete,
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
  } = useDisclosure();
  const router = useRouter();

  // API
  const {
    run: runGetClients,
    data: clientResponse,
    refetch: refetchClients,
  } = useAsync<IClientValidationSchema[]>();
  const {
    run: runGetOrders,
    data: orderResponse,
    isLoading,
    refetch,
  } = useAsync<IOrderGetAll>();
  const { run: runDeleteOrder, isLoading: deletingOrder } = useAsync();

  useEffect(() => {
    runGetClients(fetcher(API_ROUTES.client), {
      cacheKey: API_ROUTES.client,
      refetch: () => runGetClients(fetcher(API_ROUTES.client)),
    });
    runGetOrders(fetcher(API_ROUTES.order), {
      refetch: () => runGetOrders(fetcher(API_ROUTES.order)),
    });
  }, []);

  // function getListPerPage(
  //   data: any[],
  //   filesPerPage: number,
  //   actualPage: number
  // ) {
  //   const startIndex = (actualPage - 1) * filesPerPage;
  //   const endIndex = actualPage * filesPerPage;
  //   return data.slice(startIndex, endIndex);
  // }

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
  const handleGoToOrder = (id: string) => {
    router.push(`${ADMIN_ROUTES.orders}/${id}`);
  };

  const columns = generatePedidoColumns();

  // const totalPages = Math.ceil(orderListSorted.length / itemsPerPage);
  // const dataPerPage = getListPerPage(
  //   orderListSorted,
  //   itemsPerPage,
  //   currentPage
  // );

  const clientList = clientResponse?.data ?? [];
  const orderList = orderResponse?.data?.orders ?? []
  const pagination = orderResponse?.data?.pagination ?? {}

  const handleOnTableChange = (
    action: TableAction,
    pagination: TablePagination
  ) => {
    if (action === 'paginate') {
      setPage(pagination.page);
      setItemsPerPage(pagination.itemsPerPage);
    }
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
              <Text fontSize={{ base: 12 }}>
                Cliente:
              </Text>
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
              <Text fontSize={{ base: 12 }}>
                Condicion:
              </Text>
              <Select
                defaultValue=""
                size="sm"
                width={{ base: '90px', md: '110px' }}
                onChange={(e) => setClientId(e.target.value)}
                fontSize={12}
                value={clientId}
              >
                <option value="">Todos</option>
                <option value="true">Pagado</option>
                <option value="false">Pendiente</option>
              </Select>
            </Flex>
            <Button
              autoFocus
              // onClick={onSearch}
              size="sm"
              // isLoading={props.isSearching}
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
