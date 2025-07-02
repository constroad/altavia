import { useFetch } from 'src/common/hooks/useFetch';
import { TableColumn, TableComponent } from '../Table';
import { API_ROUTES, APP_ROUTES } from 'src/common/consts';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import {
  formatMoney,
  formatUtcDateTime,
  getDateStringRange,
  parseLocalDate,
} from '@/utils/general';
import { useMutate } from '@/common/hooks/useMutate';
import { ITripSchemaValidation } from '@/models/trip';
import { useRouter } from 'next/navigation';
import { InputField, SelectField, toast } from 'src/components';
import { useState } from 'react';
import { IconWrapper } from '../IconWrapper/IconWrapper';
import { RefreshIcon } from '@/common/icons';
import { useWhatsapp } from '@/common/hooks/useWhatsapp';

interface TripListProps {}

const Summary = (value: number, bgColor?: string) => {
  return (
    <Box
      as={Flex}
      alignItems="center"
      justifyContent="end"
      bgColor={bgColor ?? 'primary.600'}
      color={'white'}
      fontWeight={600}
      fontSize={11}
      height={30}
    >      
      {formatMoney(value, 1)}km
    </Box>
  );
};

export const TripList = () => {
  const { dateTo, dateFrom } = getDateStringRange(30);
  const [startDate, setStartDate] = useState(dateFrom);
  const [endDate, setEndDate] = useState(dateTo);
  const [status, setStatus] = useState('');

  const router = useRouter();
  // loading by default whatsApp contacts
  useWhatsapp({ page: 'TripList' });

  //API
  const { data, isLoading, refetch } = useFetch(API_ROUTES.trips, {
    queryParams: {
      startDate: parseLocalDate(startDate).toDateString(),
      endDate: parseLocalDate(endDate).toDateString(),
      status,
    },
  });
  const { mutate, isMutating } = useMutate(API_ROUTES.trips);

  // handlers
  const handleDeleteTrip = (trip: ITripSchemaValidation) => {
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
      width: '10%',
    },
    { key: 'destination', label: 'Destino', width: '10%' },
    { key: 'notes', label: 'Nota', width: '20%' },
    { key: 'status', label: 'Estado', width: '5%' },
    {
      key: 'kmTravelled',
      label: 'Recorrido',
      bgColor: 'primary.600',
      width: '5%',
      textAlign: 'end',
      summary: (value) => Summary(value),
    },
  ];

  const statusArr = [
    { label: 'Todos', value: '' },
    { label: 'Pendiente', value: 'Pending' },
    { label: 'En Ruta', value: 'InProgress' },
    { label: 'Completado', value: 'Completed' },
  ];

  const sortedData = [...(data ?? [])].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  return (
    <>
      <Flex>
        <Flex gap={1} alignItems="end" width="fit-content" mb={4}>
          <InputField
            width="120px"
            size="xs"
            controlled
            name="startDate"
            label="Desde:"
            type="date"
            value={startDate}
            onChange={(value) => {
              setStartDate(value as string);
            }}
          />
          <InputField
            width="120px"
            size="xs"
            controlled
            name="endDate"
            label="Hasta:"
            type="date"
            value={endDate}
            onChange={(value) => {
              setEndDate(value as string);
            }}
          />
          <SelectField
            controlled
            size="xs"
            label="Estado"
            name="status"
            options={statusArr}
            width="150px"
            value={status}
            onChange={setStatus}
          />
          <Button onClick={refetch} size="xs">
            <IconWrapper icon={RefreshIcon} size="18px" />
          </Button>
        </Flex>
      </Flex>
      <TableComponent
        isLoading={isLoading || isMutating}
        data={sortedData}
        columns={columns}
        onEdit={handleSelectTrip}
        onDelete={handleDeleteTrip}
      />
    </>
  );
};
