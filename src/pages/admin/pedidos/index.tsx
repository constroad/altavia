import { Flex, useDisclosure, Button, Box } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import { ADMIN_ROUTES, API_ROUTES } from 'src/common/consts';
import { useAsync } from 'src/common/hooks';
import { Modal, TableComponent, toast, IntranetLayout, TableAction, TablePagination } from 'src/components';
import { generatePedidoColumns } from 'src/components/pedidos';
import { IOrderValidationSchema } from 'src/models/order';

const fetcher = (path: string) => axios.get(path);
const deleteOrder = (path: string) => axios.delete(path);

const Pedidos = () => {
  const [orderSelected, setOrderSelected] = useState<
    IOrderValidationSchema | undefined
  >();
  const [orderList, setOrderList] = useState<IOrderValidationSchema[]>([]);
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)

  const {
    onClose: onCloseDelete,
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
  } = useDisclosure();
  const router = useRouter();

  // API
  const {
    run: runGetOrders,
    isLoading,
    refetch,
  } = useAsync({
    onSuccess(response) {
      setOrderList(response.data);
    },
  });
  const { run: runDeleteOrder, isLoading: deletingOrder } = useAsync();

  useEffect(() => {
    runGetOrders(fetcher(API_ROUTES.order), {
      refetch: () => runGetOrders(fetcher(API_ROUTES.order)),
    });
  }, []);

  const orderListSorted = useMemo(() => {
    const sortedList = [...orderList].sort((a, b) => {
      const dateA = new Date(a.createdAt!);
      const dateB = new Date(b.createdAt!);
      if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0;
      return dateB.getTime() - dateA.getTime();
    });
    return sortedList;
  }, [orderList]);

  function getListPerPage(data: any[], filesPerPage: number, actualPage: number) {
    const startIndex = (actualPage - 1) * filesPerPage;
    const endIndex = actualPage * filesPerPage;
    return data.slice(startIndex, endIndex);
  }

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

  const totalPages = Math.ceil(orderListSorted.length / itemsPerPage);
  const dataPerPage = getListPerPage(orderListSorted, itemsPerPage, currentPage)

  const handleOnTableChange = (
    action: TableAction,
    pagination: TablePagination
  ) => {
    if (action === 'paginate') {
      setCurrentPage(pagination.page);
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
    <IntranetLayout title='Listado de Pedidos'>
      <Flex flexDir="column" width="100%" gap={2} mt={5}>
        <Flex width="100%" justifyContent="end">

          <Button size="sm"    colorScheme="yellow" autoFocus onClick={() => handleGoToOrder('new')}>
            + Agregar
          </Button>
        </Flex>

        <Box w="100%">
          <TableComponent
            data={dataPerPage}
            columns={columns}
            onDelete={(item) => {
              setOrderSelected(item);
              onOpenDelete();
            }}
            onEdit={(item) => {
              handleGoToOrder(item._id);
            }}
            isLoading={isLoading}
            pagination
            currentPage={currentPage}
            onChange={handleOnTableChange}
            itemsPerPage={itemsPerPage}
            totalPages={totalPages}
            totalRecords={orderListSorted.length}
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
