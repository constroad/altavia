import { useFetch } from 'src/common/hooks/useFetch';
import { TableColumn, TableComponent } from '../Table';
import { API_ROUTES, APP_ROUTES } from 'src/common/consts';
import { Box, Button, Flex, Show, Text } from '@chakra-ui/react';
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
import { FormComboBox } from '../form/FormComboBox';
import { useUbigeos } from '@/common/hooks/useUbigeos';

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
      {formatMoney(value, 1)}
    </Box>
  );
};

export const TripList = () => {
  const { dateTo, dateFrom } = getDateStringRange(60);
  const [startDate, setStartDate] = useState(dateFrom);
  const [endDate, setEndDate] = useState(dateTo);
  const [status, setStatus] = useState('');
  const [client, setClient] = useState('');
  const [origin, setOrigin] = useState('');

  const router = useRouter();
  // loading by default whatsApp contacts
  useWhatsapp({ page: 'TripList' });

  //API
  const { data, isLoading, refetch } = useFetch(API_ROUTES.trips, {
    queryParams: {
      startDate: parseLocalDate(startDate).toDateString(),
      endDate: parseLocalDate(endDate).toDateString(),
      status,
      client,
      origin,
    },
  });
  const { data: clients, isLoading: loadingClients } = useFetch(
    API_ROUTES.clients
  );
  const { mutate, isMutating } = useMutate(API_ROUTES.trips);
  const { regions } = useUbigeos();

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

  const clientsMap = Object.fromEntries(
    (clients ?? []).map((x: any) => [x._id, x])
  );
  const statusMap = {
    Pending: 'yellow.300',
    InProgress: 'orange.300',
    Completed: 'green.500',
    Deleted: 'red.400',
  };
  const columns: TableColumn<ITripSchemaValidation>[] = [
    {
      key: 'client',
      label: 'Cliente',
      width: '20%',
      render: (item) => <Text>{clientsMap[item]?.name ?? ''}</Text>,
    },
    {
      key: 'startDate',
      label: 'Fecha',
      width: '3%',
      textAlign: 'center',
      render: (item) => <Text>{formatUtcDateTime(item)}</Text>,
    },
    // {
    //   key: 'origin',
    //   label: 'Ruta',
    //   textAlign: 'center',
    //   width: '10%',
    //   render: (item, row) => {
    //     return <>{`${item} -> ${row.destination}`}</>;
    //   },
    // },
    {
      key: 'kmTravelled',
      label: 'Ruta',
      // bgColor: 'gray.600',
      bgColor: 'primary.600',
      color: 'white',
      width: '12%',
      textAlign: 'start',
      summary: (value) => Summary(value, 'gray.500'),
      render: (value, row) => {
        return <>{`${row.origin} -> ${row.destination} (${value}km)`}</>;
      },
    },
    { key: 'notes', label: 'Nota', width: '20%' },
    {
      key: 'status',
      label: 'Estado',
      width: '5%',
      textAlign: 'center',
      render: (item, row) => {
        return (
          <Text rounded={4} bgColor={statusMap[row.status ?? 'Pending']}>
            {item}
          </Text>
        );
      },
    },
    {
      key: 'Income',
      label: 'TOTAL S/',
      bgColor: 'gray.300',
      color: 'black',
      width: '5%',
      textAlign: 'end',
      summary: (value) => Summary(value),
    },
    {
      key: 'amountDue',
      label: 'DEBE S/',
      bgColor: 'gray.300',
      color: 'black',
      width: '5%',
      textAlign: 'end',
      summary: (value) => Summary(value * -1, 'red.500'),
      render: (value) => {
        return (
          <Box
            height="100%"
            bgColor={value < 0 ? 'pink' : '#d7ead4'}
            rounded={2}
            textAlign="right"
            gap={1}
          >
            <Show when={value >= 0}>Pagado</Show>
            <Show when={value < 0}>S/.{formatMoney(value * -1, 1)}</Show>
          </Box>
        );
      },
    },
    {
      key: 'expenses',
      label: 'GASTO S/',
      bgColor: 'gray.300',
      color: 'black',
      width: '5%',
      textAlign: 'end',
      summary: (value) => Summary(value),
      render: (value) => <>S/.{formatMoney(value, 1)}</>,
    },
    {
      key: 'revenue',
      label: 'Rent S/.',
      bgColor: 'primary.600',
      width: '5%',
      textAlign: 'end',
      summary: (value) => Summary(value),
      render: (value) => {
        return (
          <Box
            height="100%"
            bgColor={value < 0 ? 'pink' : '#d7ead4'}
            rounded={2}
            textAlign="right"
            gap={1}
          >
            S/.{formatMoney(value, 1)}
          </Box>
        );
      },
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
          <FormComboBox
            controlled
            name="client"
            label="Cliente"
            placeholder="Buscar cliente"
            loading={loadingClients}
            options={
              clients?.map((x: any) => ({
                value: x._id,
                label: x.name,
              })) ?? []
            }
            value={client}
            onChange={([value]: string[]) => setClient(value)}
          />
          <FormComboBox
            controlled
            name="origin"
            label="Origen"
            placeholder="Buscar Origen"
            options={
              regions?.map((r: any) => ({
                value: r,
                label: r,
              })) ?? []
            }
            value={origin}
            onChange={([value]: string[]) => setOrigin(value)}
          />
          <SelectField
            controlled
            size="xs"
            label="Estado"
            name="status"
            options={statusArr}
            width="120px"
            value={status}
            onChange={setStatus}
          />
          <Button onClick={refetch} size="xs">
            <IconWrapper icon={RefreshIcon} size="18px" />
          </Button>
        </Flex>
      </Flex>
      <Box className="scrollbar-fino">
        <TableComponent
          isLoading={isLoading || isMutating}
          data={sortedData}
          columns={columns}
          onSelectRow={handleSelectTrip}
          pagination
        />
      </Box>
    </>
  );
};
