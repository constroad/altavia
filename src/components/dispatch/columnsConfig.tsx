import {
  Flex,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  NumberInput,
  NumberInputField,
  Switch,
  Text,
} from '@chakra-ui/react';
import { TableColumn } from '../Table';
import { CONSTROAD_COLORS } from 'src/styles/shared';
import { IDispatchValidationSchema, IDispatchList } from 'src/models/dispatch';
import { AutoComplete } from '../autoComplete';
import { IClientValidationSchema } from 'src/models/client';
import { ITransportValidationSchema } from 'src/models/transport';
import { IOrderValidationSchema } from 'src/models/order';
import { MenuVerticalIcon, TrashIcon, WhatsappIcon } from 'src/common/icons';
import { AddClient } from '../pedidos/AddClient';
import { AddTransport } from './AddTransport';

interface ColumnsProps {
  orderList: IOrderValidationSchema[];
  reloadClient: () => Promise<any>;
  clientList: IClientValidationSchema[];
  reloadTransport: () => Promise<any>;
  transportList: ITransportValidationSchema[];
  updateDispatch: (payload: IDispatchValidationSchema) => void;
  onDelete: (dispatch: IDispatchList) => void;
  onSendVale: (dispatch: IDispatchList) => void;
}
export const generateDispatchColumns = (props: ColumnsProps) => {
  const { orderList, clientList, transportList, updateDispatch } = props;

  const columns: TableColumn[] = [
    {
      key: 'orderId',
      label: '# Pedido',
      width: '15%',
      render: (item, row) => {
        return (
          <AutoComplete
            placeholder="Pedidos por cliente o fecha"
            value={item}
            onSelect={(option) => {
              updateDispatch({ ...row, orderId: option.value });
            }}
            options={orderList.map((order) => ({
              label: `${order.cliente} - ${
                order.fechaProgramacion.split('T')[0]
              } - ${order.cantidadCubos} cubos`,
              value: order._id ?? '',
              filter: `${order.cliente} - ${
                order.fechaProgramacion.split('T')[0]
              } - ${order.cantidadCubos} cubos`,
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
          <Flex flexDir="column" lineHeight={3}>
            <Input
              px={{ base: '5px', md: '3px' }}
              fontSize="inherit"
              lineHeight="14px"
              height="32px"
              width="100%"
              type="date"
              value={item}
              onChange={(e) => updateDispatch({ ...row, date: e.target.value })}
            />
          </Flex>
        );
      },
    },
    {
      key: 'description',
      label: 'Description',
      width: '5%',
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
              inputProps={{ isDisabled: row.orderId }}
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
              renderNoFound={() => (
                <AddClient
                  textNoFound=""
                  onSuccess={() => {
                    props.reloadClient();
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
              value={`${row.plate}-${row.company}`}
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
                label: `${t.driverName}-${t.plate}`,
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
      key: 'guia',
      label: 'Guia - Factura',
      width: '10%',
      render: (item, row) => {
        return (
          <Flex gap={2}>
            <Input
              placeholder="Guia"
              px={{ base: '5px', md: '3px' }}
              fontSize="inherit"
              lineHeight="14px"
              height="32px"
              width="50px"
              defaultValue={item}
              onBlur={(e) => {
                if (e.target.value.toLowerCase() !== item.toLowerCase()) {
                  updateDispatch({ ...row, guia: e.target.value });
                }
              }}
            />
            <Input
              px={{ base: '5px', md: '3px' }}
              placeholder="Factura"
              fontSize="inherit"
              lineHeight="14px"
              height="32px"
              width="50px"
              defaultValue={row.invoice}
              onBlur={(e) => {
                if (
                  e.target.value.toLowerCase() !== row.invoice.toLowerCase()
                ) {
                  updateDispatch({ ...row, invoice: e.target.value });
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
            // multiple
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
              let igv = 0;

              if (e.target.value) {
                quantity = Number(e.target.value);
              }
              const subTotal = row.price * quantity;
              if (row.igvCheck) {
                igv = subTotal * 0.18;
              }
              const total = subTotal + igv;
              updateDispatch({ ...row, quantity, subTotal, total, igv });
            }}
          >
            <NumberInputField fontSize="inherit" paddingInlineEnd={0} />
          </NumberInput>
        );
      },
    },
    {
      key: 'price',
      bgColor: CONSTROAD_COLORS.yellow,
      label: 'Precio',
      width: '4%',
      render: (item, row) => {
        return (
          <NumberInput
            size="xs"
            defaultValue={item}
            onBlur={(e) => {
              if (e.target.value === item.toString()) return;
              let price = 0;
              let igv = 0;
              if (e.target.value) {
                price = Number(e.target.value);
              }
              const subTotal = row.quantity * price;
              if (row.igvCheck) {
                igv = subTotal * 0.18;
              }
              const total = subTotal + igv;
              updateDispatch({ ...row, price, subTotal, total, igv });
            }}
          >
            <NumberInputField fontSize="inherit" paddingInlineEnd={0} />
          </NumberInput>
        );
      },
    },
    {
      key: 'igv',
      bgColor: CONSTROAD_COLORS.yellow,
      label: 'IGV',
      width: '7%',
      render: (item, row) => {
        return (
          <Flex alignItems="center" gap={1}>
            <Switch
              size="sm"
              id="isChecked"
              defaultValue={(row.igvCheck ?? false).toString()}
              isChecked={row.igvCheck ?? false}
              onChange={(value) => {
                const igvCheck = value.target.checked;
                let igvValue = 0;
                if (igvCheck) {
                  igvValue = row.subTotal * 0.18;
                }
                const total = row.subTotal + igvValue;
                updateDispatch({ ...row, igvCheck, igv: igvValue, total });
              }}
            />
            <NumberInput isDisabled size="xs" defaultValue={item.toFixed(2)}>
              <NumberInputField fontSize="inherit" paddingInlineEnd={0} />
            </NumberInput>
          </Flex>
        );
      },
    },
    {
      key: 'total',
      bgColor: CONSTROAD_COLORS.yellow,
      label: 'Total',
      width: '5%',
      render: (item) => {
        return (
          <Text color="red" fontWeight={600} textAlign="right">
            {item}
          </Text>
        );
      },
    },
    {
      key: '_id',
      label: '',
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
              icon={<MenuVerticalIcon />}
              rounded="full"
            />

            <MenuList maxW="170px">
              <MenuItem onClick={() => props.onSendVale(row)} as={Flex} gap={2}>
                <WhatsappIcon />
                Enviar Vale
              </MenuItem>
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

  return columns;
};
