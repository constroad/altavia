import { Flex, Spinner } from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ADMIN_ROUTES, API_ROUTES } from 'src/common/consts';
import { useAsync } from 'src/common/hooks';
import { IntranetLayout } from 'src/components';
import { PedidoForm } from 'src/components/pedidos';
import { AddDispatch } from 'src/components/pedidos/AddDispatch';
import { IOrderValidationSchema } from 'src/models/order';

const fetcher = (path: string) => axios.get(path);

const Pedido = () => {
  const router = useRouter();
  const orderId = router.query?.id;
  const isNew = orderId === 'new';

  // API
  const {
    run: runGetOrder,
    isLoading,
    refetch,
    data: orderResponse,
  } = useAsync<IOrderValidationSchema>();

  useEffect(() => {
    if (orderId && !isNew) {
      const path = `${API_ROUTES.order}/${orderId}`;
      runGetOrder(fetcher(path), {
        refetch: () => runGetOrder(fetcher(path)),
      });
    }
  }, [orderId]);

  //handlers
  const handleBackToOrders = () => {
    router.push(ADMIN_ROUTES.orders);
  };


  const order = orderResponse?.data

  return (
    <IntranetLayout onBackClick={handleBackToOrders} title="Pedido">
      {isLoading ? (
        <Spinner />
      ) : (
        <Flex flexDir="column" gap={5}>
          <PedidoForm
            order={order}
            onClose={handleBackToOrders}
            onSuccess={refetch}
          />

          {/* Listado de Despachos */}
          <AddDispatch orderId={order?._id} />
        </Flex>
      )}
    </IntranetLayout>
  );
};

export default Pedido;
