import { Button, Show, Spinner, Text } from '@chakra-ui/react';
import { TableColumn, TableComponent } from '../Table';
import { useFetch } from 'src/common/hooks/useFetch';
import { API_ROUTES, APP_ROUTES } from 'src/common/consts';
import { formatUtcDateTime } from 'src/utils/general';
import { IExpenseSchema } from 'src/models/generalExpense';
import { useRouter } from 'next/navigation';

interface ExpenseListProps {}

export const ExpenseList = (props: ExpenseListProps) => {
  const router = useRouter();
  
  // API
  const { data, isLoading, refetch } = useFetch(API_ROUTES.expenses);

  const handleSelectClient = (expense: IExpenseSchema) => {
    router.push(`${APP_ROUTES.expenses}/${expense._id}`);
  }

  const columns: TableColumn[] = [
    { key: 'date', label: 'Fecha', width: '20%', render: (item) => (
      <Text>{formatUtcDateTime(item)}</Text>
    ) },
    { key: 'description', label: 'Descripcion', width: '20%' },
    {
      key: 'amount',
      label: 'Cantidad',
      width: '10%',
    },
    { key: 'type', label: 'Tipo', width: '20%' },
    {
      key: '_id',
      label: 'VER',
      width: '5%',
      render: (item, row) => (
        <Button
          onClick={() => handleSelectClient(row)}
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
      <Show when={isLoading}>
        <Spinner />
      </Show>
      <Show when={!isLoading}>
        <TableComponent data={data ?? []} columns={columns} />
      </Show>
    </>
  );
};
