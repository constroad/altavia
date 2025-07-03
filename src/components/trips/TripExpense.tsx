'use client';

import { API_ROUTES } from '@/common/consts';
import { useFetch } from '@/common/hooks/useFetch';
import {
  EXPENSE_STATUS_MAP,
  EXPENSE_STATUS_TYPE,
  IExpenseSchema,
} from '@/models/generalExpense';
import { IMediaValidationSchema } from '@/models/media';
import { ITripSchemaValidation } from '@/models/trip';
import {
  Flex,
  VStack,
  Text,
  Button,
  useDisclosure,
  Box,
  Tabs,
  Show
} from '@chakra-ui/react';
import { TableColumn, TableComponent } from '../Table';
import { formatUtcDateTime } from '@/utils/general';
import { ImageView } from '../telegramFileView/imageView';
import { IconWrapper } from '../IconWrapper/IconWrapper';
import { RefreshIcon } from '@/common/icons';
import { useMutate } from '@/common/hooks/useMutate';
import { useState } from 'react';
import { toast } from '../Toast';
import { ExpenseModal } from './ExpenseModal';
import { TripDocuments } from './TripDocuments';
import { TripTracking } from './TripTracking';

interface TripExpenseProps {
  trip: ITripSchemaValidation | null;
}

export const TripExpense = (props: TripExpenseProps) => {
  const { trip } = props;
  const [tabSelected, setTabSelected] = useState<string | null>('Gastos');
  const [expenseSelected, setExpenseSelected] = useState<
    IExpenseSchema | undefined
  >();
  const { open, onOpen, onClose } = useDisclosure();

  //API
  const { mutate: mutateExpense } = useMutate(API_ROUTES.expenses);
  const {
    data: expenses,
    isLoading: isLoadingExpenses,
    refetch: refetchExpenses,
  } = useFetch<IExpenseSchema[]>(API_ROUTES.expenses, {
    queryParams: {
      tripId: trip?._id,
    },
    enabled: trip?._id !== undefined,
  });
  const { data: medias, refetch: refetchMedias } = useFetch<
    IMediaValidationSchema[]
  >(API_ROUTES.media, {
    queryParams: {
      resourceId: trip?._id,
    },
    enabled: trip?._id !== undefined,
  });

  const isValidTrip = trip && trip._id !== 'new';
  const columns: TableColumn[] = [
    {
      key: 'date',
      label: 'Fecha',
      width: '20%',
      textAlign: 'center',
      render: (item) => <Text>{formatUtcDateTime(item)}</Text>,
    },
    { key: 'description', label: 'Descripcion', width: '20%' },
    {
      key: 'amount',
      label: 'Cantidad',
      textAlign: 'center',
      width: '10%',
    },
    {
      key: 'status',
      label: 'Estado',
      textAlign: 'center',
      width: '20%',
      render: (item) => {
        return <>{EXPENSE_STATUS_MAP[item as EXPENSE_STATUS_TYPE]}</>;
      },
    },
    {
      key: '_id',
      label: 'Imagenes',
      textAlign: 'center',
      width: '20%',
      render: (item, row) => {
        const expenseMedias =
          medias?.filter?.((x) => x.metadata.expenseId === row._id) ?? [];
        return (
          <Flex gap={1} alignItems="center" width="100%">
            {expenseMedias.map?.((m) => (
              <ImageView width="60px" height="60px" key={m._id} media={m} />
            ))}
          </Flex>
        );
      },
    },
  ];

  const handleDeleteExpense = (expense: IExpenseSchema) => {
    mutateExpense(
      'DELETE',
      {},
      {
        requestUrl: `${API_ROUTES.expenses}/${expense._id}`,
        onSuccess: () => {
          toast.success('Gasto eliminado');
          refetchExpenses();
        },
      }
    );
  };

  const handleSelectExpense = (expense: IExpenseSchema) => {
    setExpenseSelected(expense);
    onOpen();
  };

  const totalToPay =
    expenses
      ?.filter((x) => x.status === 'to_pay')
      ?.reduce((acc, curr) => acc + curr.amount, 0) ?? 0;
  const totalExpenses =
    expenses?.reduce((acc, curr) => acc + curr.amount, 0) ?? 0;
  const totalRevenue = (trip?.Income ?? 0) - totalExpenses;

  return (
    <VStack align="start" w="100%">
      <Tabs.Root
        defaultValue="Gastos"
        width="100%"
        value={tabSelected}
        onValueChange={(e) => setTabSelected(e.value)}
      >
        <Tabs.List>
          <Tabs.Trigger value="Gastos">Gastos</Tabs.Trigger>
          <Tabs.Trigger value="Sunat" disabled={!isValidTrip}>Sunat</Tabs.Trigger>
          <Tabs.Trigger value="Tracking" disabled={!isValidTrip}>Tracking</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="Gastos" padding={0}>
          <Show when={tabSelected === 'Gastos'}>
            <TableComponent
              isLoading={isLoadingExpenses}
              data={expenses ?? []}
              columns={columns}
              actions
              onEdit={handleSelectExpense}
              onDelete={handleDeleteExpense}
              toolbar={
                <Flex
                  alignItems="center"
                  justifyContent="space-between"
                  fontSize="12px"
                >
                  <Flex flexDir="column">
                    <Flex>
                      <Box bg="primary.500" color="white" width="80px">
                        Gastos:
                      </Box>
                      <Box
                        bg="gray.300"
                        width={{ base: '80px', md: '100px' }}
                        textAlign="right"
                      >
                        S/.{totalExpenses}
                      </Box>
                    </Flex>
                    <Flex>
                      <Box bg="primary.500" color="white" width="80px">
                        Rentabilidad:
                      </Box>
                      <Box
                        bg="gray.300"
                        width={{ base: '80px', md: '100px' }}
                        textAlign="right"
                        fontWeight={600}
                      >
                        S/.{totalRevenue.toFixed(2)}
                      </Box>
                    </Flex>
                  </Flex>
                  <Flex gap={1} alignItems="end">
                    <Flex
                      color="red"
                      fontWeight={500}
                      flexDir={{ base: 'column', md: 'row' }}
                    >
                      <Text>Deuda:</Text>
                      <Text>S/.{totalToPay}</Text>
                    </Flex>
                    <Button
                      size="xs"
                      onClick={() => {
                        onOpen();
                        setExpenseSelected(undefined);
                      }}
                      disabled={!isValidTrip}
                    >
                      +
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        refetchExpenses();
                        refetchMedias();
                      }}
                      size="xs"
                    >
                      <IconWrapper icon={RefreshIcon} size="18px" />
                    </Button>
                  </Flex>
                </Flex>
              }
            />
          </Show>
        </Tabs.Content>
        <Tabs.Content value="Sunat">
          <Show when={tabSelected === 'Sunat'}>
            <TripDocuments trip={trip} />
          </Show>
        </Tabs.Content>
        <Tabs.Content value="Tracking">
          <Show when={tabSelected === 'Tracking'}>
            <TripTracking trip={trip} />
          </Show>
        </Tabs.Content>
      </Tabs.Root>

      <ExpenseModal
        trip={trip}
        expense={expenseSelected}
        resourceId={trip?._id!}
        open={open}
        onRefresh={() => {
          refetchExpenses();
          refetchMedias();
        }}
        onClose={() => {
          setExpenseSelected(undefined);
          onClose();
        }}
      />
    </VStack>
  );
};
