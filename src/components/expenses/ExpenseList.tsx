import { Flex, Text, Button, Box } from '@chakra-ui/react';
import { TableColumn, TableComponent } from '../Table';
import { useFetch } from 'src/common/hooks/useFetch';
import { API_ROUTES, APP_ROUTES } from 'src/common/consts';
import {
  formatMoney,
  formatUtcDateTime,
  getDateStringRange,
  parseLocalDate,
} from 'src/utils/general';
import {
  EXPENSE_STATUS,
  EXPENSE_STATUS_MAP,
  EXPENSE_STATUS_TYPE,
  EXPENSE_TYPE,
  IExpenseSchema,
} from 'src/models/generalExpense';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { InputField } from '../form/InputField';
import { RefreshIcon } from 'src/common/icons';
import { EXPENSE_TYPES_MAP } from '../../models/generalExpense';
import { useMutate } from 'src/common/hooks/useMutate';
import { toast } from '..';
import { SelectField } from '../form/SelectField';
import { IconWrapper } from '../IconWrapper/IconWrapper';

interface ExpenseListProps {}
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
      S/.
      {formatMoney(value)}
    </Box>
  );
};

export const ExpenseList = (props: ExpenseListProps) => {
  const { dateTo, dateFrom } = getDateStringRange(30);
  const [startDate, setStartDate] = useState(dateFrom);
  const [endDate, setEndDate] = useState(dateTo);
  const [status, setStatus] = useState('');

  const router = useRouter();

  // API
  const { data, isLoading, refetch } = useFetch<IExpenseSchema[]>(
    API_ROUTES.expenses,
    {
      queryParams: {
        startDate: parseLocalDate(startDate).toDateString(),
        endDate: parseLocalDate(endDate).toDateString(),
        status,
      },
    }
  );
  const { mutate, isMutating } = useMutate(API_ROUTES.expenses);

  // handlers
  const handleDeleteExpense = (expense: IExpenseSchema) => {
    mutate(
      'DELETE',
      {},
      {
        requestUrl: `${API_ROUTES.expenses}/${expense._id}`,
        onSuccess: () => {
          toast.success('Gasto eliminado');
          refetch();
        },
      }
    );
  };

  const handleSelectExpense = (expense: IExpenseSchema) => {
    router.push(`${APP_ROUTES.expenses}/${expense._id}`);
  };

  const columns: TableColumn[] = [
    {
      key: 'date',
      label: 'Fecha',
      width: '20%',
      render: (item) => <Text>{formatUtcDateTime(item)}</Text>,
    },
    { key: 'description', label: 'Descripcion', width: '20%' },  
    {
      key: 'type',
      label: 'Tipo',
      width: '20%',
      render: (item) => {
        return <>{EXPENSE_TYPES_MAP[item as EXPENSE_TYPE]}</>;
      },
    },
    {
      key: 'status',
      label: 'Tipo',
      textAlign: 'center',
      width: '20%',
      render: (item) => {
        return <>{EXPENSE_STATUS_MAP[item as EXPENSE_STATUS_TYPE]}</>;
      },
    },
    {
      key: 'amount',
      label: 'Monto',
      textAlign: 'end',
      bgColor: 'primary.600',
      width: '10%',
      summary: (value) => Summary(value),
      render: (item, row) => {
        return (
          <Box
          p={1}
          height="100%"
          bgColor={row.status === 'paid' ? '#d7ead4' : 'pink'}
          rounded={2}
          textAlign="right"
        >
          {<>S/.{formatMoney(item, 1)}</>}          
        </Box>
        )
      }
    },
  ];
  const statusList = ['', ...EXPENSE_STATUS];

  const totalToPay =
    data
      ?.reduce((acc, curr) => acc + curr.amount, 0) ?? 0;

  return (
    <>
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
          options={statusList.map((status) => ({
            value: status,
            //@ts-ignore
            label: EXPENSE_STATUS_MAP[status],
          }))}
          width="150px"
          value={status}
          onChange={setStatus}
        />
        <Button onClick={refetch} size="xs">
          <IconWrapper icon={RefreshIcon} size="18px" />
        </Button>
      </Flex>

      <TableComponent
        isLoading={isLoading || isMutating}
        data={data ?? []}
        columns={columns}
        actions
        onEdit={handleSelectExpense}
        onDelete={handleDeleteExpense}
        toolbar={
          <Flex justifyContent="end" p={1}>
            <Flex
              gap={1}
              fontWeight={500}
              flexDir={{ base: 'column', md: 'row' }}
            >
              <Text>Nro Gastos:</Text>
              <Text>{data?.length ?? 0}</Text>
            </Flex>
          </Flex>
        }
      />
    </>
  );
};
