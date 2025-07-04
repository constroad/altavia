import { useFetch } from '@/common/hooks/useFetch';
import { TableColumn, TableComponent } from '../Table';
import { API_ROUTES } from '@/common/consts';
import { formatMoney } from '@/utils/general';
import { Box, Flex } from '@chakra-ui/react';

interface RouteCostSummaryProps {
  origin?: string;
  destination?: string;
}

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

export const RouteCostSummary = (props: RouteCostSummaryProps) => {
  const { origin, destination } = props;
  //API
  const { data, isLoading } = useFetch(API_ROUTES.routeCost, {
    queryParams: {
      origin,
      destination,
    },
  });

  const columns: TableColumn[] = [
    {
      key: 'type',
      label: 'Tipo',
      width: '10%',
    },
    {
      key: 'description',
      label: 'Descripcion',
      textAlign: 'center',
      width: '20%',
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
            height="100%"
            bgColor={row.status === 'paid' ? '#d7ead4' : 'pink'}
            rounded={2}
            textAlign="right"
          >
            {<>S/.{formatMoney(item, 1)}</>}
          </Box>
        );
      },
    },
  ];

  return (
    <TableComponent
      isLoading={isLoading}
      data={data ?? []}
      columns={columns}
      actions
    />
  );
};
