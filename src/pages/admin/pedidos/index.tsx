import { Flex, useDisclosure, Text, Button, Box } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { API_ROUTES } from 'src/common/consts';
import { useAsync } from 'src/common/hooks';
import { AdministrationLayout, Modal, TableComponent, toast } from 'src/components';
import { PedidoForm, generatePedidoColumns } from 'src/components/pedidos';
import { IOrderValidationSchema } from 'src/models/order';

const fetcher = (path: string) => axios.get(path);
const deleteOrder = (path: string) => axios.delete(path);

const Pedidos = () => {
  const [orderSelected, setOrderSelected] = useState<
    IOrderValidationSchema | undefined
  >();
  const [orderList, setOrderList] = useState<IOrderValidationSchema[]>([]);
  const { onClose, isOpen, onOpen } = useDisclosure();
  const {
    onClose: onCloseDelete,
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
  } = useDisclosure();

  // API
  const {
    run: runGetClients,
    isLoading,
    refetch,
  } = useAsync({
    onSuccess(response) {
      setOrderList(response.data);
    },
  });
  const { run: runDeleteOrder, isLoading: deletingOrder } = useAsync();

  useEffect(() => {
    runGetClients(fetcher(API_ROUTES.order), {
      refetch: () => runGetClients(fetcher(API_ROUTES.order)),
      cacheKey: API_ROUTES.order,
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

  // handlers
  const handleDeleteOrder = () => {
    runDeleteOrder(deleteOrder(`${API_ROUTES.order}/${orderSelected?._id}`), {
      onSuccess: () => {
        toast.success(`Eliminaste el pedido ${orderSelected?.cliente}`)
        refetch()
        setOrderSelected(undefined)
        onCloseDelete()
      }
    })
  };

  const columns = generatePedidoColumns();

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
    <AdministrationLayout>
      <Flex flexDir="column" width="100%" gap={2}>
        <Flex width="100%" justifyContent="space-between">
          <Text
            fontSize={{ base: 25, md: 36 }}
            fontWeight={700}
            color="black"
            lineHeight={{ base: '28px', md: '39px' }}
          >
            Pedidos
          </Text>

          <Button autoFocus onClick={onOpen}>
            Agregar Pedido
          </Button>
        </Flex>

        <Box w="100%">
          <TableComponent
            data={orderListSorted}
            columns={columns}
            onDelete={(item) => {
              setOrderSelected(item)
              onOpenDelete()
            }}
            onEdit={(item) => {
              setOrderSelected(item)
              onOpen()
            }}
            isLoading={isLoading}
            pagination
            actions
          />
        </Box>
      </Flex>

      {/* client form modal */}
      <Modal
        hideCancelButton
        isOpen={isOpen}
        onClose={onClose}
        heading={orderSelected ? 'Editar pedido' : 'Añadir pedido'}
      >
        <PedidoForm
          order={orderSelected}
          onClose={onClose}
          onSuccess={refetch}
        />
      </Modal>

      {/* delete client modal */}
      <Modal
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        heading={`¿Estás seguro de eliminar este Pedido ${orderSelected?.cliente}?`}
        footer={deleteFooter}
      />
    </AdministrationLayout>
  );
};

export default Pedidos;
