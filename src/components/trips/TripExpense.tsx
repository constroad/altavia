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
import { Flex, VStack, Text, Button, useDisclosure } from '@chakra-ui/react';
import { TableColumn, TableComponent } from '../Table';
import { formatUtcDateTime } from '@/utils/general';
import { ImageView } from '../telegramFileView/imageView';
import { IconWrapper } from '../IconWrapper/IconWrapper';
import { RefreshIcon } from '@/common/icons';
import { useMutate } from '@/common/hooks/useMutate';
import { useState } from 'react';
import { toast } from '../Toast';
import { ExpenseModal } from './ExpenseModal';

interface TripExpenseProps {
  trip: ITripSchemaValidation | null;
}

export const TripExpense = (props: TripExpenseProps) => {
  const { trip } = props;
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

  return (
    <VStack align="start" w="100%">
      <Flex w="100%" gap="10px">
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
              m={1}
            >
              <Flex gap={2}>
                <Button
                  size="xs"
                  onClick={() => {
                    onOpen();
                    setExpenseSelected(undefined);
                  }}
                >
                  + Gasto
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
              <Text fontWeight={600}>
                Total:
                {expenses?.reduce((acc, curr) => acc + curr.amount, 0)}
              </Text>
            </Flex>
          }
        />
      </Flex>

      <ExpenseModal
        expense={expenseSelected}
        resourceId={trip?._id!}
        open={open}
        onClose={() => {
          setExpenseSelected(undefined);
          onClose();
          refetchExpenses();
          refetchMedias();
        }}
      />
    </VStack>
  );
};
