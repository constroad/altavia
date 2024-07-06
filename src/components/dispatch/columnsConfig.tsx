import {
  Box,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  NumberInput,
  NumberInputField,
  Spinner,
  Switch,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { TableColumn } from '../Table';
import { CONSTROAD_COLORS } from 'src/styles/shared';
import { IDispatchList } from 'src/models/dispatch';
import { AutoComplete } from '../autoComplete';
import { IClientValidationSchema } from 'src/models/client';
import { ITransportValidationSchema } from 'src/models/transport';
import { IOrderValidationSchema } from 'src/models/order';
import {
  MenuVerticalIcon,
  CircleIcon,
  TrashIcon,
  WhatsappIcon,
} from 'src/common/icons';
import { AddClient } from '../pedidos/AddClient';
import { AddTransport } from './AddTransport';
import { parseStringDateWithTime, formatISODate } from 'src/utils/general';

type TableView = 'Dispatch' | 'Order';
const orderViewColumns = [
  'date',
  'company',
  'driverName',
  'guia',
  'note',
  'quantity',
  'price',
  'igv',
  'total',
  '_id',
  'hour',
];
interface ColumnsProps {
  view?: TableView;
  isLoading?: boolean;
  isMobile?: boolean;
  orderList: IOrderValidationSchema[];
  reloadClient?: () => Promise<any>;
  clientList: IClientValidationSchema[];
  reloadTransport: () => Promise<any>;
  transportList: ITransportValidationSchema[];
  updateDispatch: (payload: IDispatchList) => void;
  onDelete: (dispatch: IDispatchList) => void;
  onSendVale: (dispatch: IDispatchList) => void;
}
export const generateDispatchColumns = (props: ColumnsProps) => {
  const { orderList, clientList, transportList, updateDispatch, isMobile } =
    props;
  const isOrderView = props.view === 'Order';
  const columns: TableColumn<IDispatchList>[] = [
    {
      key: 'orderId',
      label: '# Pedido',
      width: '15%',
      render: (item, row) => {
        return (
          <AutoComplete
            placeholder="Pedidos por cliente o fecha"
            value={row.order}
            onSelect={(option) => {
              const order = orderList.find((x) => x._id === option.value);
              const orderText = `${order?.cliente} - ${order?.fechaProgramacion} - ${order?.cantidadCubos} cubos`;
              updateDispatch({
                ...row,
                order: orderText,
                orderId: option.value,
                clientId: order?.clienteId ?? '',
                client: order?.cliente ?? '',
                obra: order?.obra ?? '',
              });
            }}
            options={orderList.map((order) => ({
              label: `${order.cliente} - ${new Date(
                order.fechaProgramacion
              ).toLocaleDateString('es-PE')} - ${order.cantidadCubos} cubos`,
              value: order._id ?? '',
              filter: `${order.cliente} - ${new Date(
                order.fechaProgramacion
              ).toLocaleDateString('es-PE')} - ${order.cantidadCubos} cubos`,
            }))}
          />
        );
      },
    },
    {
      key: 'date',
      label: 'Fecha',
      width: '3%',
      render: (item, row) => {
        return (
          <Tooltip label={row?.date?.toString()}>
            <Flex flexDir="column" lineHeight={3}>
              <Input
                px={{ base: '5px', md: '3px' }}
                fontSize="inherit"
                lineHeight="14px"
                height="32px"
                width="100%"
                type="date"
                value={formatISODate(item)}
                onChange={(e) => {
                  updateDispatch({
                    ...row,
                    date: parseStringDateWithTime(e.target.value),
                  });
                }}
              />
            </Flex>
          </Tooltip>
        );
      },
    },
    {
      key: 'description',
      label: 'Description',
      width: '3%',
      render: (item, row) => {
        return (
          <Input
            px={{ base: '5px', md: '3px' }}
            fontSize="inherit"
            lineHeight="14px"
            height="32px"
            width="100%"
            defaultValue={item}
            onBlur={(e) => {
              if (e.target.value.toLowerCase() !== item.toLowerCase()) {
                updateDispatch({ ...row, description: e.target.value });
              }
            }}
          />
        );
      },
    },
    {
      key: 'client',
      label: 'Cliente',
      width: '10%',
      render: (item, row) => {
        return (
          <Flex flexDir="column">
            <AutoComplete
              inputProps={{ isDisabled: !!row.orderId }}
              placeholder="Buscar cliente por nombre, alias o RUC"
              value={item}
              onSelect={(option) => {
                updateDispatch({ ...row, clientId: option.value });
              }}
              options={clientList.map((client) => ({
                label: client.name,
                value: client._id ?? '',
                filter: `${client.name}-${client.ruc}-${client.alias}`,
              }))}
              renderNoFound={({ onClose }) => (
                <AddClient
                  textNoFound=""
                  onSuccess={() => {
                    onClose();
                    props.reloadClient?.();
                  }}
                />
              )}
            />
          </Flex>
        );
      },
    },
    {
      key: 'obra',
      label: 'Obra',
      width: '5%',
      render: (item, row) => {
        return (
          <Input
            isDisabled={!!row.orderId}
            px={{ base: '5px', md: '3px' }}
            fontSize="inherit"
            lineHeight="14px"
            height="32px"
            width="100%"
            defaultValue={item}
            onBlur={(e) => {
              if (e.target.value.toLowerCase() !== item.toLowerCase()) {
                updateDispatch({ ...row, obra: e.target.value });
              }
            }}
          />
        );
      },
    },
    {
      key: 'company',
      label: 'Placa',
      width: '10%',
      render: (_, row) => {
        return (
          <Flex flexDir="column" lineHeight={3}>
            <AutoComplete
              placeholder="Buscar transportista"
              value={row.plate}
              onSelect={(option) => {
                const transportId = option.value;
                const transport = transportList.find(
                  (x) => x._id === transportId
                );
                updateDispatch({
                  ...row,
                  quantity: transport?.m3 ?? 0,
                  plate: transport?.plate ?? '',
                  transportId,
                  driverName: transport?.driverName ?? '',
                  driverCard: transport?.driverCard ?? '',
                  phoneNumber: transport?.phone ?? '',
                });
              }}
              options={transportList.map((t) => ({
                label: t.plate ?? '',
                value: t._id ?? '',
                filter: `${t.company}-${t.driverName}-${t.plate}`,
              }))}
              renderNoFound={({ onClose }) => (
                <AddTransport
                  textNoFound=""
                  onSuccess={() => {
                    onClose();
                    props.reloadTransport();
                  }}
                />
              )}
            />
          </Flex>
        );
      },
    },
    {
      key: 'driverName',
      label: 'Chofer',
      width: '10%',
      render: (item, row) => {
        return (
          <Input
            px={{ base: '5px', md: '3px' }}
            fontSize="inherit"
            lineHeight="14px"
            height="32px"
            width="100%"
            defaultValue={item}
            onBlur={(e) => {
              if (e.target.value.toLowerCase() !== item.toLowerCase()) {
                updateDispatch({ ...row, driverName: e.target.value });
              }
            }}
          />
        );
      },
    },
    {
      key: 'hour',
      label: 'Hora',
      width: '5%',
      render: (item, row) => {
        return (
          <Input
            px={{ base: '5px', md: '3px' }}
            fontSize="inherit"
            lineHeight="14px"
            height="32px"
            width="100%"
            type="time"
            defaultValue={item}
            onBlur={(e) => {
              if (e.target.value.toLowerCase() !== item?.toLowerCase()) {
                updateDispatch({ ...row, hour: e.target.value });
              }
            }}
          />
        );
      },
    },
    {
      key: 'guia',
      label: 'Guia',
      width: '5%',
      render: (item, row) => {
        return (
          <Flex gap={2}>
            <Input
              placeholder="Guia"
              px={{ base: '5px', md: '3px' }}
              fontSize="inherit"
              lineHeight="14px"
              height="32px"
              width="80px"
              defaultValue={item}
              onBlur={(e) => {
                if (e.target.value.toLowerCase() !== item.toLowerCase()) {
                  updateDispatch({ ...row, guia: e.target.value });
                }
              }}
            />
          </Flex>
        );
      },
    },
    {
      key: 'note',
      label: 'Notas',
      width: '10%',
      render: (item, row) => {
        return (
          <Input
            fontSize="inherit"
            name="notas"
            height="32px"
            defaultValue={item}
            onBlur={(e) => {
              if (e.target.value.toLowerCase() !== item.toLowerCase()) {
                updateDispatch({ ...row, note: e.target.value });
              }
            }}
          />
        );
      },
    },
    {
      key: 'quantity',
      bgColor: CONSTROAD_COLORS.yellow,
      label: 'M3',
      width: '4%',
      render: (item, row) => {
        return (
          <NumberInput
            size="xs"
            defaultValue={item}
            onBlur={(e) => {
              if (e.target.value === item.toString()) return;
              let quantity = 0;
              if (e.target.value) {
                quantity = Number(e.target.value);
              }
              updateDispatch({
                ...row,
                quantity,
              });
            }}
          >
            <NumberInputField fontSize="inherit" paddingInlineEnd={0} />
          </NumberInput>
        );
      },
    },
    {
      key: '_id',
      label: () => <>{props.isLoading && <Spinner size="xs" />}</>,
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
                icon={
                  row.status !== undefined ? (
                    <CircleIcon color="green" />
                  ) : (
                    <MenuVerticalIcon />
                  )
                }
                rounded="full"
              />

              <MenuList maxW="170px">
                {!row.status && (
                  <MenuItem
                    onClick={() => props.onSendVale(row)}
                    as={Flex}
                    gap={2}
                  >
                    <WhatsappIcon />
                    Enviar Vale
                  </MenuItem>
                )}
                <MenuItem
                  onClick={() => props.onDelete(row)}
                  color="red"
                  as={Flex}
                  gap={2}
                >
                  <TrashIcon />
                  Eliminar despacho
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        );
      },
    },
  ];
  if (!isMobile && isOrderView) {
    return columns.filter((x) => orderViewColumns.includes(x.key));
  }
  if (!isMobile) {
    return columns;
  }
  const mobileColumns: TableColumn<IDispatchList>[] = [
    {
      key: '_id',
      label: 'Item',
      width: '70%',
      render: (item, row) => {
        return (
          <Grid templateColumns="repeat(2, 1fr)" gap={2} my={4}>
            {!isOrderView && (
              <GridItem colSpan={2}>
                <AutoComplete
                  placeholder="Pedidos por cliente o fecha"
                  value={row.order}
                  onSelect={(option) => {
                    updateDispatch({ ...row, orderId: option.value });
                  }}
                  options={orderList.map((order) => ({
                    label: `${order.cliente} - ${new Date(
                      order.fechaProgramacion
                    ).toLocaleDateString('es-PE')} - ${
                      order.cantidadCubos
                    } cubos`,
                    value: order._id ?? '',
                    filter: `${order.cliente} - ${new Date(
                      order.fechaProgramacion
                    ).toLocaleDateString('es-PE')} - ${
                      order.cantidadCubos
                    } cubos`,
                  }))}
                />
              </GridItem>
            )}
            <GridItem>
              <Input
                px={{ base: '5px', md: '3px' }}
                fontSize="inherit"
                lineHeight="14px"
                height="32px"
                type="date"
                value={formatISODate(row.date)}
                onChange={(e) =>
                  updateDispatch({
                    ...row,
                    date: parseStringDateWithTime(e.target.value),
                  })
                }
              />
            </GridItem>
            <GridItem>
              <Input
                px={{ base: '5px', md: '3px' }}
                fontSize="inherit"
                lineHeight="14px"
                height="32px"
                width="100%"
                type="time"
                defaultValue={row.hour}
                onBlur={(e) => {
                  if (
                    e.target.value.toLowerCase() !== row.hour?.toLowerCase()
                  ) {
                    updateDispatch({ ...row, hour: e.target.value });
                  }
                }}
              />
            </GridItem>
            <GridItem>
              <Input
                placeholder="Material"
                px={{ base: '5px', md: '3px' }}
                fontSize="inherit"
                lineHeight="14px"
                height="32px"
                width="100%"
                defaultValue={row.description}
                onBlur={(e) => {
                  if (
                    e.target.value.toLowerCase() !==
                    row.description.toLowerCase()
                  ) {
                    updateDispatch({ ...row, description: e.target.value });
                  }
                }}
              />
            </GridItem>
            {!isOrderView && (
              <>
                <GridItem>
                  <AutoComplete
                    inputProps={{ isDisabled: !!row.orderId }}
                    placeholder="Buscar cliente por nombre, alias o RUC"
                    value={row.client}
                    onSelect={(option) => {
                      const order = orderList.find(
                        (x) => x._id === option.value
                      );
                      updateDispatch({
                        ...row,
                        orderId: option.value,
                        clientId: order?.clienteId ?? '',
                        obra: order?.obra ?? '',
                      });
                    }}
                    options={clientList.map((client) => ({
                      label: client.name,
                      value: client._id ?? '',
                      filter: `${client.name}-${client.ruc}-${client.alias}`,
                    }))}
                    renderNoFound={() => (
                      <AddClient
                        textNoFound=""
                        onSuccess={() => {
                          props.reloadClient?.();
                        }}
                      />
                    )}
                  />
                </GridItem>
                <GridItem>
                  <Input
                    placeholder="Obra"
                    isDisabled={!!row.orderId}
                    px={{ base: '5px', md: '3px' }}
                    fontSize="inherit"
                    lineHeight="14px"
                    height="32px"
                    width="100%"
                    defaultValue={row.obra}
                    onBlur={(e) => {
                      if (
                        e.target.value.toLowerCase() !== row.obra?.toLowerCase()
                      ) {
                        updateDispatch({ ...row, obra: e.target.value });
                      }
                    }}
                  />
                </GridItem>
              </>
            )}
            <GridItem>
              <AutoComplete
                placeholder="Buscar transportista"
                value={`${row.plate}${row.company}`}
                onSelect={(option) => {
                  const transportId = option.value;
                  const transport = transportList.find(
                    (x) => x._id === transportId
                  );
                  updateDispatch({
                    ...row,
                    transportId,
                    driverName: transport?.driverName ?? '',
                    driverCard: transport?.driverCard ?? '',
                    phoneNumber: transport?.phone ?? '',
                  });
                }}
                options={transportList.map((t) => ({
                  label: `${t.company}-${t.driverName}-${t.plate}`,
                  value: t._id ?? '',
                  filter: `${t.company}-${t.driverName}-${t.plate}`,
                }))}
                renderNoFound={() => (
                  <AddTransport
                    textNoFound=""
                    onSuccess={() => {
                      props.reloadTransport();
                    }}
                  />
                )}
              />
            </GridItem>
            <GridItem>
              <Input
                placeholder="Chofer"
                px={{ base: '5px', md: '3px' }}
                fontSize="inherit"
                lineHeight="14px"
                height="32px"
                width="100%"
                defaultValue={row.driverName}
                onBlur={(e) => {
                  if (
                    e.target.value.toLowerCase() !==
                    row.driverName?.toLowerCase()
                  ) {
                    updateDispatch({ ...row, driverName: e.target.value });
                  }
                }}
              />
            </GridItem>
            <GridItem>
              <Flex gap={2} alignItems="center">
                <Input
                  placeholder="Guia"
                  px={{ base: '5px', md: '3px' }}
                  fontSize="inherit"
                  lineHeight="14px"
                  height="32px"
                  width="49%"
                  defaultValue={row.guia}
                  onBlur={(e) => {
                    if (
                      e.target.value.toLowerCase() !== row.guia?.toLowerCase()
                    ) {
                      updateDispatch({ ...row, guia: e.target.value });
                    }
                  }}
                />
                <Flex>
                  M3:
                  <NumberInput
                    size="sm"
                    defaultValue={row.quantity}
                    onBlur={(e) => {
                      if (e.target.value === row.quantity.toString()) return;
                      let quantity = 0;

                      if (e.target.value) {
                        quantity = Number(e.target.value);
                      }
                      updateDispatch({
                        ...row,
                        quantity,
                      });
                    }}
                  >
                    <NumberInputField fontSize="inherit" paddingInlineEnd={0} />
                  </NumberInput>
                </Flex>
              </Flex>
            </GridItem>
            <GridItem colSpan={2}>
              <Input
                placeholder="Notas"
                fontSize="inherit"
                name="notas"
                height="32px"
                defaultValue={row.note}
                onBlur={(e) => {
                  if (
                    e.target.value.toLowerCase() !== row.note?.toLowerCase()
                  ) {
                    updateDispatch({ ...row, note: e.target.value });
                  }
                }}
              />
            </GridItem>
          </Grid>
        );
      },
    },
    {
      key: '_id',
      label: () => <>{props.isLoading && <Spinner size="xs" />}</>,
      width: '5%',
      render: (item, row) => {
        return (
          <Menu data-testid="page-menu" variant="brand">
            <MenuButton
              as={IconButton}
              variant="unstyled"
              minW="auto"
              h="auto"
              aria-label="Page details"
              icon={
                row.status !== undefined ? (
                  <CircleIcon color="green" />
                ) : (
                  <MenuVerticalIcon />
                )
              }
              rounded="full"
            />

            <MenuList maxW="170px">
              {!row.status && (
                <MenuItem
                  onClick={() => props.onSendVale(row)}
                  as={Flex}
                  gap={2}
                >
                  <WhatsappIcon />
                  Enviar Vale
                </MenuItem>
              )}
              <MenuItem
                onClick={() => props.onDelete(row)}
                color="red"
                as={Flex}
                gap={2}
              >
                <TrashIcon />
                Eliminar despacho
              </MenuItem>
            </MenuList>
          </Menu>
        );
      },
    },
  ];

  return mobileColumns;
};
