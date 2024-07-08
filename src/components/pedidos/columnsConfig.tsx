import {
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { TableColumn } from '../Table';
import { formatMoney } from 'src/utils/general';
import { CONSTROAD_COLORS } from 'src/styles/shared';
import { getDate } from 'src/common/utils';
import { EditIcon, MenuVerticalIcon, TrashIcon } from 'src/common/icons';
import { IOrderValidationSchema } from 'src/models/order';

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

const getMonthNames = (data: any[], locale = 'es-PE') => {
  const monthNamesFormatter = new Intl.DateTimeFormat(locale, {
    month: 'long',
  });

  const monthNamesSet = new Set();

  data.forEach((item) => {
    const date = new Date(item.fechaProgramacion);
    const monthName = monthNamesFormatter.format(date);
    monthNamesSet.add(monthName);
  });

  return Array.from(monthNamesSet);
};

interface ColumnProps {
  onAction?: (action: string, order: IOrderValidationSchema) => void;
}

export const generatePedidoColumns = (props: ColumnProps) => {
  const columns: TableColumn[] = [
    {
      key: 'cliente',
      label: 'Cliente',
      width: '15%',
      bgColor: CONSTROAD_COLORS.darkGray,
      render: (item) => (
        <Tooltip label={item}>
          <Text noOfLines={1}>{item}</Text>
        </Tooltip>
      ),
    },
    {
      key: 'fechaProgramacion',
      label: 'Fecha',
      width: '4%',
      thStyles: { alignItems: 'center', justifyContent: 'center', gap: 1 },
      tdStyles: { px: 0, textAlign: 'center' },
      bgColor: CONSTROAD_COLORS.darkGray,
      sorter: (status, a, b) => {
        if (status === 'descending') {
          return (
            new Date(b.fechaProgramacion).getTime() -
            new Date(a.fechaProgramacion).getTime()
          );
        }
        if (status === 'ascending') {
          return (
            new Date(a.fechaProgramacion).getTime() -
            new Date(b.fechaProgramacion).getTime()
          );
        }
        return false;
      },
      render: (item) => <>{getDate(item).slashDate}</>,
    },
    {
      key: 'fechaVencimiento',
      label: 'Vence',
      width: '4%',
      tdStyles: { px: 0, textAlign: 'center' },
      bgColor: CONSTROAD_COLORS.darkGray,
      render: (item, row) => {
        return <>{getDate(item).slashDate}</>;
      },
    },
    {
      key: 'obra',
      label: 'Obra',
      width: '15%',
      bgColor: CONSTROAD_COLORS.darkGray,
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
      width: '4%',
      summary: (value) => SummaryAmount(value),
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
      width: '4%',
      summary: (value) => Summary(value),
      tdStyles: { bgColor: 'whitesmoke' },
      render: (item) => {
        return <Box textAlign="right">S/.{formatMoney(item)}</Box>;
      },
    },
    {
      key: 'm3dispatched',
      label: 'M3 Prod',
      width: '3%',
      tdStyles: { textAlign: 'center' },
      summary: (value) => SummaryAmount(value),
    },
    {
      key: 'm3Pending',
      label: 'M3 Pend',
      width: '3%',
      tdStyles: { textAlign: 'center' },
      summary: (value) => SummaryAmount(value),
      render: (item) => <Text color={`${item <0 ? 'red' : 'black' }`}>{item}</Text>
    },
    {
      key: 'm3Value',
      label: 'Total Real',
      width: '4%',
      tdStyles: { textAlign: 'right' },
      summary: (value) => Summary(value),
      render: (value, row) => {
        return <>{formatMoney(value)}</>;
      },
    },
    {
      key: 'montoAdelanto',
      bgColor: CONSTROAD_COLORS.yellow,
      color: CONSTROAD_COLORS.black,
      label: 'Adelanto',
      width: '4%',
      summary: (value) => Summary(value),
      render: (item) => {
        return <Box textAlign="right">S/.{formatMoney(item)}</Box>;
      },
    },
    {
      key: 'montoPorCobrar',
      bgColor: CONSTROAD_COLORS.yellow,
      color: CONSTROAD_COLORS.black,
      label: 'Debe',
      width: '4%',
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
      key: '_id',
      label: '',
      width: '2%',
      render: (_, row) => (
        <Flex
          width="inherit"
          alignItems="center"
          justifyContent="space-between"
        >
          <Menu variant="brand">
            <MenuButton
              as={IconButton}
              variant="unstyled"
              minW="auto"
              h="auto"
              aria-label="Page details"
              icon={<MenuVerticalIcon />}
              rounded="full"
            />

            <MenuList maxW="170px">
              <MenuItem
                onClick={() => props.onAction?.('edit', row)}
                as={Flex}
                gap={2}
              >
                <EditIcon />
                Editar
              </MenuItem>
              <MenuItem
                onClick={() => props.onAction?.('delete', row)}
                color="red"
                as={Flex}
                gap={2}
              >
                <TrashIcon />
                Eliminar
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      ),
    },
  ];

  return columns;
};
