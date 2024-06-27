import { Box, Flex, Text, Tooltip } from '@chakra-ui/react';
import { TableColumn } from '../Table';
import { formatMoney } from 'src/utils/general';
import { CONSTROAD_COLORS } from 'src/styles/shared';
import { getDate } from 'src/common/utils';

const Summary = (value: number, bgColor?: string) => {
  return (
    <Box
      as={Flex}
      alignItems="center"
      justifyContent="end"
      bgColor={bgColor ?? 'black'}
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
const SummaryAmount = (value: number, bgColor?: string) => {
  return (
    <Box
      as={Flex}
      alignItems="center"
      justifyContent="end"
      bgColor={bgColor ?? 'black'}
      color={bgColor ? 'inherit' : 'white'}
      fontWeight={600}
      fontSize={11}
      height={30}
    >
      {formatMoney(value)}
    </Box>
  );
};

export const generatePedidoColumns = () => {
  const columns: TableColumn[] = [
    {
      key: 'cliente',
      label: 'Cliente',
      width: '15%',
      render: (item) => (
        <Tooltip label={item}>
          <Text noOfLines={1}>{item}</Text>
        </Tooltip>
      ),
    },
    {
      key: 'fechaProgramacion',
      label: 'Fecha',
      width: '5%',
      tdStyles: { px: 0 },
      render: (item, row) => (
        <Flex flexDir="column">
          {getDate(item).slashDate}
        </Flex>
      ),
    },
    {
      key: 'fechaVencimiento',
      label: 'Vence',
      width: '5%',
      tdStyles: { px: 0 },
      render: (item, row) => {
        return (
          <Flex>
            {getDate(item).slashDate}
          </Flex>
        );
      },
    },
    {
      key: 'obra',
      label: 'Obra',
      width: '10%',
      render: (item) => (
        <Tooltip label={item}>
          <Text noOfLines={1}>{item}</Text>
        </Tooltip>
      ),
    },
    {
      key: 'cantidadCubos',
      bgColor: CONSTROAD_COLORS.yellow,
      color: CONSTROAD_COLORS.black,
      label: 'M3 Pedidos',
      width: '5%',
      summary: (value) => Summary(value),
      render: (item) => {
        return <Box textAlign="center">{item}</Box>;
      },
    },
    {
      key: 'precioCubo',
      bgColor: CONSTROAD_COLORS.yellow,
      color: CONSTROAD_COLORS.black,
      label: 'Precio',
      width: '5%',
      tdStyles: {
        p: 0,
      },
      render: (item) => {
        return <Box textAlign="right">S/.{formatMoney(item)}</Box>;
      },
    },
    {
      key: 'totalPedido',
      bgColor: CONSTROAD_COLORS.yellow,
      color: CONSTROAD_COLORS.black,
      label: 'Total',
      width: '5%',
      summary: (value) => Summary(value),
      render: (item) => {
        return <Box textAlign="right">S/.{formatMoney(item)}</Box>;
      },
    },
    {
      key: 'montoAdelanto',
      bgColor: CONSTROAD_COLORS.yellow,
      color: CONSTROAD_COLORS.black,
      label: 'Adelanto',
      width: '5%',
      render: (item) => {
        return <Box textAlign="right">S/.{formatMoney(item)}</Box>;
      },
    },
    {
      key: 'montoPorCobrar',
      bgColor: CONSTROAD_COLORS.yellow,
      color: CONSTROAD_COLORS.black,
      label: 'Debe',
      width: '5%',
      tdStyles: {
        px: 0,
      },
      summary: (value) => Summary(value, 'red'),
      render: (item, row) => {
        return (
          <Box
            height="100%"
            bgColor={row.isPaid ? '#d7ead4' : 'pink'}
            rounded={2}
            textAlign="right"
          >
            {!row.isPaid && <>S/.{formatMoney(item)}</>}
            {row.isPaid && 'Pagado'}
          </Box>
        );
      },
    },
    {
      key: 'm3dispatched',
      label: 'M3 Producidos',
      width: '5%',
      tdStyles: {
        textAlign: 'right',
      },
      summary: (value) => SummaryAmount(value),
    },
    {
      key: 'm3Pending',
      label: 'M3 Pendientes',
      width: '5%',
      tdStyles: {
        textAlign: 'right',
      },
      summary: (value) => SummaryAmount(value),
    },
  ];

  return columns;
};
