import {
  Box,
  Flex,
  Grid,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  GridItem,
  Text,
} from '@chakra-ui/react';
import { TableColumn } from '../Table';
import { CONSTROAD_COLORS } from 'src/styles/shared';
import { formatMoney } from 'src/utils/general';
import { MenuVerticalIcon, ViewIcon } from 'src/common/icons';
import { getDate } from 'src/common/utils';

const Summary = (value: number, symbol = 'S/.', bgColor?: string) => {
  return (
    <Box
      bgColor={bgColor ?? 'black'}
      color="white"
      textAlign={symbol === '' ? 'center' : 'right'}
      fontWeight={600}
      fontSize={12}
    >
      {symbol}
      {symbol === '' ? value : formatMoney(value)}
    </Box>
  );
};

export const generateReportClientColumns = (
  onViewDispatches: () => void,
  onDownloadPDF: () => void,
  onDownloadCertificates: () => void,
  handleClickMenuButton: (row: any) => void,
  isMobile?: boolean
) => {
  if (!isMobile) {
    const columns: TableColumn[] = [
      {
        key: 'fechaProgramacion',
        label: 'Fecha',
        width: '5%',
        render: (item, row) => (
          <Flex flexDir="column" alignItems="center">
            {getDate(item).slashDate}
          </Flex>
        ),
      },
      {
        key: 'fechaVencimiento',
        label: 'Vence',
        width: '5%',
        textAlign: 'center',
        render: (item, row) => {
          if (item) {
            return (
              <Flex justifyContent="center">{getDate(item).slashDate}</Flex>
            );
          }
          return <>-</>
        },
      },
      {
        key: 'obra',
        label: 'Obra',
        width: '30%',
        render: (item, row) => {
          return <Flex>{item}</Flex>;
        },
      },
      {
        key: 'cantidadCubos',
        bgColor: CONSTROAD_COLORS.yellow,
        color: CONSTROAD_COLORS.black,
        label: 'M3 Pedidos',
        width: '7%',
        summary: (value) => Summary(value, ''),
        render: (item) => {
          return <Box textAlign="center">{item}</Box>;
        },
      },
      {
        key: 'm3dispatched',
        bgColor: CONSTROAD_COLORS.yellow,
        color: CONSTROAD_COLORS.black,
        label: 'M3 Despachados',
        width: '7%',
        summary: (value) => Summary(value, ''),
        render: (item) => {
          return <Box textAlign="center">{item}</Box>;
        },
      },
      {
        key: 'm3Pending',
        bgColor: CONSTROAD_COLORS.yellow,
        color: CONSTROAD_COLORS.black,
        label: 'Diferencia',
        width: '7%',
        summary: (value) => Summary(value, ''),
        render: (item) => {
          return <Box textAlign="center">{item}</Box>;
        },
      },
      {
        key: 'montoAdelanto',
        bgColor: CONSTROAD_COLORS.yellow,
        color: CONSTROAD_COLORS.black,
        label: 'Adelanto',
        width: '7%',
        render: (item) => {
          return <Box textAlign="right">S/.{formatMoney(item)}</Box>;
        },
      },
      {
        key: 'm3Value',
        bgColor: CONSTROAD_COLORS.yellow,
        color: CONSTROAD_COLORS.black,
        label: 'Total',
        width: '7%',
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
        width: '7%',
        tdStyles: {
          px: 0,
        },
        summary: (value) => Summary(value, 'S/.', 'red'),
        render: (item, row) => {
          return (
            <Box
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
        render: (item, row) => {
          return (
            <Flex
              width="inherit"
              alignItems="center"
              justifyContent="space-between"
            >
              <Menu data-testid="page-menu" variant="brand">
                <MenuButton
                  as={IconButton}
                  variant="unstyled"
                  minW="auto"
                  h="auto"
                  aria-label="Page details"
                  icon={<MenuVerticalIcon />}
                  onClick={() => handleClickMenuButton(row)}
                  rounded="full"
                />

                <MenuList maxW="170px">
                  <MenuItem
                    onClick={() => onViewDispatches()}
                    as={Flex}
                    gap={2}
                  >
                    <ViewIcon />
                    Ver despachos
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          );
        },
      },
    ];

    return columns;
  } else {
    const columns: TableColumn[] = [
      {
        key: 'montoPorCobrar',
        label: 'Item',
        width: '100%',
        summary: (value, row) => Summary(value, 'S/.', 'red'),
        render: (item, row) => (
          <Grid templateColumns="repeat(2, 1fr)" gap={2} my={2} px={0}>
            <GridItem px="0px" pl={2}>
              <Flex flexDir="column">
                <Flex justifyContent="start" gap="2px">
                  <Text
                    w="85px"
                    fontWeight={600}
                    h="12px"
                    textAlign="start"
                    lineHeight="10px"
                  >
                    F. producción:
                  </Text>
                  <Flex h="12px" lineHeight="10px" textAlign="start">
                    {new Date(row.fechaProgramacion).toLocaleDateString(
                      'es-PE'
                    )}
                  </Flex>
                </Flex>

                <Flex justifyContent="start" gap="2px">
                  <Text
                    w="85px"
                    fontWeight={600}
                    h="12px"
                    textAlign="start"
                    lineHeight="10px"
                  >
                    F. vencimiento:
                  </Text>
                  <Flex h="12px" textAlign="start" lineHeight="10px">
                    {row.fechaVencimiento &&
                      new Date(row.fechaVencimiento).toLocaleDateString(
                        'es-PE'
                      )}
                  </Flex>
                </Flex>

                <Flex justifyContent="start" gap="2px">
                  <Text
                    minW="30px"
                    w="85px"
                    fontWeight={600}
                    h="12px"
                    textAlign="start"
                    lineHeight="10px"
                  >
                    Obra:
                  </Text>
                  <Flex minH="12px" textAlign="start" lineHeight="10px">
                    {row.obra}
                  </Flex>
                </Flex>

                <Flex justifyContent="start" gap="2px">
                  <Text
                    w="85px"
                    fontWeight={600}
                    h="12px"
                    textAlign="start"
                    lineHeight="10px"
                  >
                    M3 Pedidos:
                  </Text>
                  <Flex h="12px" textAlign="start" lineHeight="10px">
                    {row.cantidadCubos}{' '}
                  </Flex>
                </Flex>

                <Flex justifyContent="start" gap="2px">
                  <Text
                    w="85px"
                    fontWeight={600}
                    h="12px"
                    textAlign="start"
                    lineHeight="10px"
                  >
                    M3 Despachado:
                  </Text>
                  <Flex h="12px" textAlign="start" lineHeight="10px">
                    {' '}
                    {row.m3dispatched}{' '}
                  </Flex>
                </Flex>
              </Flex>
            </GridItem>
            <GridItem>
              <Flex flexDir="column">
                <Flex justifyContent="start" gap="2px">
                  <Text
                    w="50px"
                    fontWeight={600}
                    h="12px"
                    textAlign="start"
                    lineHeight="10px"
                  >
                    Total:
                  </Text>
                  <Flex h="12px" textAlign="start" lineHeight="10px">
                    {' '}
                    S/.{formatMoney(row.m3Value)}{' '}
                  </Flex>
                </Flex>

                <Flex justifyContent="start" gap="2px">
                  <Text
                    w="50px"
                    fontWeight={600}
                    h="12px"
                    textAlign="start"
                    lineHeight="10px"
                  >
                    Pagos:
                  </Text>
                  <Flex h="12px" textAlign="start" lineHeight="10px">
                    S/.
                    {formatMoney(
                      row.payments.reduce(
                        (prev: number, curr: any) => prev + curr.amount,
                        0
                      )
                    )}
                  </Flex>
                </Flex>

                <Flex justifyContent="start" gap="2px">
                  <Text
                    w="50px"
                    fontWeight={600}
                    h="12px"
                    textAlign="start"
                    lineHeight="10px"
                  >
                    Debe:
                  </Text>
                  <Box
                    h="12px"
                    bgColor={row.isPaid ? '#d7ead4' : 'pink'}
                    rounded={2}
                    textAlign="start"
                    lineHeight="10px"
                  >
                    {!row.isPaid && <>S/.{formatMoney(row.montoPorCobrar)}</>}
                    {row.isPaid && 'Pagado'}
                  </Box>
                </Flex>
              </Flex>
            </GridItem>
          </Grid>
        ),
      },
      {
        key: 'clienteId',
        label: '',
        width: '2%',
        render: (item, row) => {
          return (
            <Flex
              width="inherit"
              alignItems="center"
              justifyContent="space-between"
            >
              <Menu data-testid="page-menu" variant="brand">
                <MenuButton
                  as={IconButton}
                  variant="unstyled"
                  minW="auto"
                  h="auto"
                  aria-label="Page details"
                  icon={<MenuVerticalIcon />}
                  onClick={() => handleClickMenuButton(row)}
                  rounded="full"
                />

                <MenuList maxW="170px">
                  <MenuItem
                    onClick={() => onViewDispatches()}
                    as={Flex}
                    gap={2}
                  >
                    <ViewIcon />
                    Ver despachos
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          );
        },
      },
    ];

    return columns;
  }
};

export const generateDispatchColumns = () => {
  const columns: TableColumn[] = [
    {
      key: 'date',
      label: 'Fecha',
      width: '3%',
      render: (item, row) => (
        <Flex flexDir="column" alignItems="center">
          {getDate(item).slashDate}
        </Flex>
      ),
    },
    {
      key: 'plate',
      label: 'Placa',
      width: '5%',
      render: (item, row) => (
        <Flex flexDir="column" alignItems="center">
          {item}
        </Flex>
      ),
    },
    {
      key: 'driverName',
      label: 'Chofer',
      width: '5%',
      render: (item, row) => (
        <Flex flexDir="column" alignItems="center">
          {item}
        </Flex>
      ),
    },
    {
      key: 'hour',
      label: 'Hora',
      width: '3%',
      render: (item, row) => (
        <Flex flexDir="column" alignItems="center">
          {item}
        </Flex>
      ),
    },
    {
      key: 'note',
      label: 'Nota',
      width: '15%',
      render: (item, row) => (
        <Flex flexDir="column" alignItems="center">
          {item}
        </Flex>
      ),
    },
    {
      key: 'quantity',
      label: 'M3',
      width: '3%',
      render: (item, row) => (
        <Flex flexDir="column" alignItems="center">
          {item}
        </Flex>
      ),
    },
  ];

  return columns;
};
