// import { useSearchParams } from "react-router-dom";

import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ADMIN_ROUTES, API_ROUTES } from 'src/common/consts';
import { useAsync } from 'src/common/hooks';
import { IntranetLayout } from 'src/components';
import { PedidoForm } from 'src/components/pedidos';
import { IOrderValidationSchema } from 'src/models/order';

const fetcher = (path: string) => axios.get(path);

const Pedido = () => {
  const router = useRouter();
  const orderId = router.query?.id;
  console.log('query', { query: router.query, orderId });

  // API
  const {
    run: runGetOrder,
    isLoading,
    refetch,
    data: orderResponse,
  } = useAsync<IOrderValidationSchema>();

  useEffect(() => {
    if (orderId && orderId !== "new") {
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

  if (isLoading) {
    return 'Loading...';
  }

  return (
    <IntranetLayout onBackClick={handleBackToOrders}>
      <PedidoForm
        order={orderResponse?.data}
        onClose={handleBackToOrders}
        onSuccess={refetch}
      />
    </IntranetLayout>
  );
  // const [searchParams] = useSearchParams()
};

export default Pedido;
