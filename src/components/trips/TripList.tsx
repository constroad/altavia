import { useFetch } from 'src/common/hooks/useFetch';
import { TableColumn, TableComponent } from '../Table';
import { API_ROUTES } from 'src/common/consts';
import { Button } from '@chakra-ui/react';

interface TripListProps {}

export const TripList = () => {
  const { data, isLoading, refetch } = useFetch(API_ROUTES.trips);

  const columns: TableColumn[] = [
    { key: 'startDate', label: 'Fecha', width: '10%' },
    {
      key: 'origin',
      label: 'Origen',
      width: '20%',
    },
    { key: 'destination', label: 'Destino', width: '20%' },
    { key: 'status', label: 'Estado', width: '5%' },
    {
      key: '_id',
      label: 'VER',
      width: '5%',
      render: (item, row) => (
        <Button
          // onClick={() => handleSelectClient(row)}
          size="md"
          px="5px"
          minW="30px"
          w="30px"
          maxWidth="30px"
          maxHeight="20px"
          fontSize={12}
          colorScheme="blue"
        >
          Ver
        </Button>
      ),
    },
  ];

  return (
    <>
      <TableComponent data={data ?? []} columns={columns} />
    </>
  );
};
