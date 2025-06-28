import { useFetch } from 'src/common/hooks/useFetch';
import { TableColumn, TableComponent } from '../Table';
import { API_ROUTES, APP_ROUTES } from 'src/common/consts';
import { Text } from '@chakra-ui/react';
import { formatUtcDateTime } from '@/utils/general';
import { useMutate } from '@/common/hooks/useMutate';
import { ITripSchemaValidation } from '@/models/trip';
import { useRouter } from 'next/navigation';
import { toast } from 'src/components';

interface TripListProps {}

export const TripList = () => {
  const { data, isLoading, refetch } = useFetch(API_ROUTES.trips);
  const router = useRouter();

  //API
  const { mutate, isMutating } = useMutate(API_ROUTES.trips);

  // handlers
  const handleDeletetrip = (trip: ITripSchemaValidation) => {
    mutate(
      'DELETE',
      {},
      {
        requestUrl: `${API_ROUTES.trips}/${trip._id}`,
        onSuccess: () => {
          toast.success('Gasto eliminado');
          refetch();
        },
      }
    );
  };
  const handleSelectTrip = (trip: ITripSchemaValidation) => {
    router.push(`${APP_ROUTES.trips}/${trip._id}`);
  };

  const columns: TableColumn[] = [
    {
      key: 'startDate',
      label: 'Fecha',
      width: '10%',
      render: (item) => <Text>{formatUtcDateTime(item)}</Text>,
    },
    {
      key: 'origin',
      label: 'Origen',
      width: '20%',
    },
    { key: 'destination', label: 'Destino', width: '20%' },
    { key: 'status', label: 'Estado', width: '5%' },
  ];

  return (
    <>
      <TableComponent
        isLoading={isLoading || isMutating}
        data={data ?? []}
        columns={columns}
        onEdit={handleSelectTrip}
        onDelete={handleDeletetrip}
      />
    </>
  );
};
