import {
  Box,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Textarea,
  Input,
  Button,
  Flex,
  Select,
  Switch,
  Tag,
  Grid,
  GridItem,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
} from '@chakra-ui/react';
import { IOrderValidationSchema } from 'src/models/order';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAsync, useDispatch } from 'src/common/hooks';
import { API_ROUTES, APP_ROUTES } from 'src/common/consts';
import { toast } from '../Toast';
import { OrderStatus } from '../../models/order';
import { IClientValidationSchema } from 'src/models/client';
import { AutoComplete, IAutocompleteOptions } from '../autoComplete';
import { formatISODate, parseLocalDate } from 'src/utils/general';
import { AddClient } from './AddClient';
import {
  MenuVerticalIcon,
  SaveIcon,
  ShareIcon,
  MoneyIcon,
} from 'src/common/icons';
import { getBaseUrl } from 'src/common/utils';
import { copyToClipboard } from 'src/common/utils/copyToClipboard';

interface PedidoFormProps {
  order?: IOrderValidationSchema;
  onSuccess?: () => void;
  onClose?: () => void;
}
const fetcher = (path: string) => axios.get(path);
const postOrder = (path: string, data: any) => axios.post(path, { data });
const putDisptach = (path: string, data: any) => axios.put(path, data);

export const PedidoForm = (props: PedidoFormProps) => {
  const [searchClient, setSearchClient] = useState(props.order?.cliente ?? '');
  const [order, setOrder] = useState<IOrderValidationSchema>({
    cliente: '',
    tipoMAC: 'Mac 2',
    invoice: '',
    fechaProgramacion: new Date().toISOString(),
    notas: '',
    precioCubo: 480,
    cantidadCubos: 1,
    subTotal: 480,
    totalPedido: 480,
    montoPorCobrar: 0,
    isCredit: false,
    status: OrderStatus.pending,
    isPaid: false,
    igv: 0,
    igvCheck: false,
    payments: [],
  });
  const { listDispatch, runUpdateDispatch, refetchDispatch } = useDispatch({
    query: {
      page: 1,
      limit: 50,
      orderId: props?.order?._id,
    },
  });

  useEffect(() => {
    if (props.order) {
      let fechaVencimiento = '';
      if (props.order.fechaVencimiento) {
        fechaVencimiento = props.order.fechaVencimiento;
      }
      setOrder({
        ...props.order,
        fechaProgramacion: props.order.fechaProgramacion,
        fechaVencimiento,
      });
    }
  }, [props.order]);

  // API
  const {
    run: runGetClients,
    isLoading: loadingClients,
    data: clientResponse,
    refetch,
  } = useAsync<IClientValidationSchema[]>();
  const { run: runAddOrder, isLoading: addingOrder } = useAsync();
  const { run: runUpdateOrder, isLoading: updatingOrder } = useAsync();

  useEffect(() => {
    runGetClients(fetcher(API_ROUTES.client), {
      refetch: () => runGetClients(fetcher(API_ROUTES.client)),
    });
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    let dateValue = order.fechaProgramacion;
    if (name === 'fechaProgramacion' && value) {
      dateValue = parseLocalDate(value).toISOString();
    }
    setOrder({
      ...order,
      [name]: value,
      fechaProgramacion: dateValue,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const { _id, ...payload } = order;
    if (!order.cliente) {
      toast.warning('Selecciona un cliente');
      return;
    }

    if (order.isCredit && !order.fechaVencimiento) {
      toast.warning('Selecciona una fecha de vencimiento');
      return;
    }

    if (_id) {
      const path = `${API_ROUTES.order}/${_id}`;
      runUpdateOrder(
        axios.put(path, {
          ...payload,
          payments: payload.payments.map(({ _id, ...rest }) => rest),
          cantidadCubos: parseFloat(payload.cantidadCubos.toString()),
          precioCubo: parseFloat(payload.precioCubo.toString()),
          totalPedido: parseFloat(payload.totalPedido?.toString() ?? '0'),
        }),
        {
          onSuccess: () => {
            toast.success('Pedido actualizado con éxito!');
            props.onSuccess?.();
          },
          onError: () => {
            toast.error('ocurrio un error actualizando un pedido');
          },
        }
      );
      return;
    }

    runAddOrder(
      postOrder(API_ROUTES.order, {
        ...payload,
        payments: payload.payments.map(({ _id, ...rest }) => rest),
        cantidadCubos: parseFloat(payload.cantidadCubos.toString()),
        precioCubo: parseFloat(payload.precioCubo.toString()),
        totalPedido: parseFloat(payload.totalPedido?.toString() ?? '0'),
      }),
      {
        onSuccess: () => {
          toast.success('Pedido añadido con éxito!');
          props.onSuccess?.();
        },
        onError: () => {
          toast.error('ocurrio un error agregando un pedido');
        },
      }
    );
  };

  const handleSelectClient = (option: IAutocompleteOptions) => {
    setSearchClient(option.label);
    setOrder({
      ...order,
      clienteId: option.value,
      cliente: option.label,
    });
  };

  const onPayOrder = async () => {
    const { _id, ...payload } = order;
    const path = `${API_ROUTES.order}/${_id}`;
    await Promise.all(
      listDispatch.map((item) => {
        const pathUpdateDispatch = `${API_ROUTES.dispatch}/${item?._id ?? ''}`;
        return runUpdateDispatch(
          putDisptach(pathUpdateDispatch, {
            ...item,
            isPaid: true,
            _id: undefined,
          })
        );
      })
    );

    runUpdateOrder(
      axios.put(path, {
        ...payload,
        isPaid: true,
      }),
      {
        onSuccess: () => {
          refetchDispatch();
          toast.success('Deuda del pedido pagada con éxito!');
          props.onSuccess?.();
        },
        onError: () => {
          toast.error('ocurrio un error pagando la deuda del pedido');
        },
      }
    );
  };

  const clientList = clientResponse?.data ?? [];
  const clientFildsToFilter = ['name', 'ruc', 'alias'];

  const onAddPayments = () => {
    const currentPayments = [...order.payments];
    currentPayments.push({
      _id: new Date().toISOString(),
      date: new Date().toISOString(),
      amount: 0,
      notes: '',
    });
    const orderUpdated = { ...order, payments: currentPayments };
    setOrder(orderUpdated);
  };

  const onDeletePayment = (id: string) => {
    const currentPayments = [...order.payments].filter((x) => x._id !== id);
    const orderUpdated = { ...order, payments: currentPayments };
    setOrder(orderUpdated);
  };

  const onUpdatePayment = (id: string, data: any) => {
    const { key, value } = data;
    const currentPayments = order.payments.map((x) => {
      if (x._id === id) {
        return { ...x, [key]: value };
      }
      return x;
    });
    const orderUpdated = { ...order, payments: currentPayments };
    setOrder(orderUpdated);
  };

  const currentPayments =
    order?.payments?.reduce(
      (prev: number, curr: any) => prev + parseFloat(curr.amount),
      0
    ) ?? 0;

  const pendingPayment = order.totalPedido - currentPayments;

  const handleGenerateAndCopyURL = () => {
    const baseUrl = getBaseUrl();
    const clientReportUrl = `${baseUrl}${APP_ROUTES.clientReport}?clientId=${order._id}`;
    const toastMessage = 'Url copiado con éxito';
    copyToClipboard(clientReportUrl, toastMessage);
  };

  // Renders
  return (
    <Box as="form" onSubmit={handleSubmit} mt={5} fontSize="12px">
      <Grid
        templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        gap={2}
      >
        <GridItem w="100%">
          <Box as={Flex} flexDir="column" gap={1}>
            <FormControl>
              <FormLabel fontSize="inherit">Cliente *</FormLabel>
              <AutoComplete
                isLoading={loadingClients}
                placeholder="Buscar cliente por nombre, alias o RUC"
                value={searchClient ?? ''}
                onChange={(value) => setSearchClient(value)}
                onSelect={handleSelectClient}
                options={clientList
                  .filter((client: any) => {
                    return clientFildsToFilter.some((property) => {
                      const value = client[property] as string;
                      const searchValue = value?.toLowerCase();
                      return searchValue?.includes(searchClient.toLowerCase());
                    });
                  })
                  .map((client) => ({
                    label: client.name,
                    value: client._id ?? '',
                  }))}
                renderNoFound={() => (
                  <AddClient
                    onSuccess={() => {
                      refetch();
                      setSearchClient('');
                    }}
                  />
                )}
              />
            </FormControl>
            <Grid templateColumns="repeat(2, 1fr)" gap={2}>
              <GridItem>
                <FormControl>
                  <FormLabel fontSize="inherit">MAC</FormLabel>
                  <Select
                    name="tipoMAC"
                    placeholder="Selecciona"
                    value="Mac 2"
                    onChange={(e) => {
                      setOrder({
                        ...order,
                        tipoMAC: e.target.value,
                      });
                    }}
                    size="xs"
                  >
                    <option value="Mac 1">Mac 1</option>
                    <option value="Mac 2">Mac 2</option>
                    <option value="Mac 3">Mac 3</option>
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel fontSize="inherit">Fecha</FormLabel>
                  <Input
                    size="xs"
                    type="date"
                    name="fechaProgramacion"
                    value={formatISODate(order.fechaProgramacion)}
                    onChange={handleChange}
                  />
                </FormControl>
              </GridItem>
            </Grid>

            <Grid templateColumns="repeat(2, 1fr)" gap={2}>
              <GridItem>
                <FormControl>
                  <FormLabel fontSize="inherit" width="100px">
                    Obra
                  </FormLabel>
                  <Input
                    type="text"
                    size="xs"
                    name="obra"
                    value={order.obra}
                    onChange={handleChange}
                  ></Input>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormLabel fontSize="inherit">Estado:</FormLabel>
                <Select
                  name="tipoMAC"
                  placeholder="Selecciona"
                  value={order.status ?? OrderStatus.pending}
                  onChange={(e) => {
                    setOrder({
                      ...order,
                      status: e.target.value as OrderStatus,
                    });
                  }}
                  size="xs"
                >
                  <option value={OrderStatus.pending}>
                    {OrderStatus.pending}
                  </option>
                  <option value={OrderStatus.dispatched}>
                    {OrderStatus.dispatched}
                  </option>
                  <option value={OrderStatus.rejected}>
                    {OrderStatus.rejected}
                  </option>
                </Select>
              </GridItem>
            </Grid>

            <Grid
              templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
              gap={2}
            >
              <GridItem>
                <FormControl>
                  <FormLabel fontSize="inherit" width="100px">
                    Precio
                  </FormLabel>
                  <NumberInput
                    size="xs"
                    name="precioCubo"
                    value={order.precioCubo}
                    onChange={(value) => {
                      const precioCubo = isNaN(parseFloat(value))
                        ? 0
                        : parseFloat(value);
                      const subTotal = order.cantidadCubos * precioCubo;
                      const igv = order.igvCheck ? subTotal * 0.18 : 0;
                      const total = subTotal + igv;

                      setOrder({
                        ...order,
                        //@ts-ignore
                        precioCubo: value,
                        subTotal,
                        igv,
                        totalPedido: total,
                      });
                    }}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel fontSize="inherit" width="100px">
                    Cantidad
                  </FormLabel>
                  <NumberInput
                    size="xs"
                    name="cantidadCubos"
                    value={order.cantidadCubos}
                    onChange={(value) => {
                      const cantidadCubos = isNaN(parseFloat(value))
                        ? 0
                        : parseFloat(value);
                      const subTotal = cantidadCubos * order.precioCubo;
                      const igv = order.igvCheck ? subTotal * 0.18 : 0;
                      const total = subTotal + igv;

                      setOrder({
                        ...order,
                        //@ts-ignore
                        cantidadCubos: value,
                        subTotal,
                        igv,
                        totalPedido: total,
                      });
                    }}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel fontSize="inherit" width="100px">
                    Igv
                    <Switch
                      size="sm"
                      id="isChecked"
                      defaultValue={(order.igvCheck ?? false).toString()}
                      isChecked={order.igvCheck ?? false}
                      onChange={(value) => {
                        const igvCheck = value.target.checked;
                        const subTotal = order.cantidadCubos * order.precioCubo;
                        const igvValue = igvCheck ? subTotal * 0.18 : 0;
                        const total = subTotal + igvValue;

                        setOrder({
                          ...order,
                          igvCheck,
                          igv: igvValue,
                          totalPedido: total,
                        });
                      }}
                    />
                  </FormLabel>
                  <NumberInput
                    isDisabled
                    size="xs"
                    value={(order.igv ?? 0).toFixed(2)}
                  >
                    <NumberInputField fontSize="inherit" paddingInlineEnd={0} />
                  </NumberInput>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel fontSize="inherit" width="100px">
                    Total S/.
                  </FormLabel>
                  <NumberInput
                    size="xs"
                    name="totalPedido"
                    value={order.totalPedido}
                    onChange={(value) => {
                      const total = isNaN(parseFloat(value))
                        ? 0
                        : parseFloat(value);
                      const igvCheck = order.igvCheck;
                      const igv = igvCheck ? total - total / 1.18 : 0;
                      const subTotal = total - igv;
                      const precio = subTotal / order.cantidadCubos;

                      setOrder({
                        ...order,
                        igvCheck,
                        igv,
                        subTotal,
                        //@ts-ignore
                        totalPedido: value,
                        precioCubo: precio,
                      });
                    }}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
              </GridItem>
            </Grid>
          </Box>
        </GridItem>
        <GridItem w="100%">
          <Grid
            templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
            gap={2}
          >
            <GridItem>
              <FormLabel fontSize="inherit">credito?</FormLabel>
              <Box width="30px">
                <Switch
                  flex={1}
                  width={10}
                  isChecked={order.isCredit}
                  onChange={(value) => {
                    const isCredit = value.target.checked;

                    setOrder({
                      ...order,
                      isCredit,
                      fechaVencimiento: !isCredit
                        ? undefined
                        : order.fechaVencimiento,
                    });
                  }}
                />
              </Box>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel fontSize="inherit">Vencimiento</FormLabel>
                <Input
                  isDisabled={!order.isCredit}
                  size="xs"
                  type="date"
                  name="fechaVencimiento"
                  value={formatISODate(order.fechaVencimiento ?? new Date())}
                  onChange={(e) => {
                    setOrder({
                      ...order,
                      fechaVencimiento: parseLocalDate(
                        e.target.value
                      ).toISOString(),
                    });
                  }}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel fontSize="inherit">Deuda:</FormLabel>
                <NumberInput
                  isDisabled
                  size="xs"
                  value={pendingPayment.toFixed(2)}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel fontSize="inherit">Factura</FormLabel>
                <Input
                  placeholder="Factura"
                  fontSize="inherit"
                  size="xs"
                  width="100px"
                  value={order.invoice}
                  onChange={(e) => {
                    setOrder({ ...order, invoice: e.target.value });
                  }}
                />
              </FormControl>
            </GridItem>
          </Grid>
          <Box flex={1} as={Flex} gap={5} mt={2}>
            <FormControl width={300}>
              <FormLabel fontSize="inherit">Notas</FormLabel>
              <Textarea
                size="xs"
                name="notas"
                value={order.notas}
                onChange={handleChange}
              />
            </FormControl>

            <Flex flexDir="column" fontSize="inherit" flex={1} gap={2}>
              <Flex justifyContent="space-between">
                <Text fontWeight={600}>
                  Pagos: S/.({currentPayments.toFixed(2)})
                </Text>
                <Button size="xs" onClick={onAddPayments}>
                  +
                </Button>
              </Flex>
              <Flex flexDir="column">
                {order.payments?.map((x, idx) => (
                  <Flex
                    key={x._id ?? idx}
                    alignItems="center"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Flex width="90%" gap={1}>
                      <Input
                        size="xs"
                        type="date"
                        width="220px"
                        value={formatISODate(x.date)}
                        onChange={(e) =>
                          onUpdatePayment(x._id!, {
                            key: 'date',
                            value: parseLocalDate(e.target.value).toISOString(),
                          })
                        }
                      />
                      <NumberInput
                        size="xs"
                        name="amount"
                        value={x.amount}
                        paddingInlineStart={0}
                        paddingInlineEnd={0}
                        onChange={(value) => {
                          onUpdatePayment(x._id!, {
                            key: 'amount',
                            value: value,
                          });
                        }}
                        onBlur={(e) => {
                          onUpdatePayment(x._id!, {
                            key: 'amount',
                            value: parseFloat(e.target.value ?? '0'),
                          });
                        }}
                      >
                        <NumberInputField paddingInlineEnd={0} />
                      </NumberInput>
                      <Input
                        size="xs"
                        placeholder="Notas"
                        value={x.notes}
                        onChange={(e) =>
                          onUpdatePayment(x._id!, {
                            key: 'notes',
                            value: e.target.value,
                          })
                        }
                      />
                    </Flex>
                    <Button size="xs" onClick={() => onDeletePayment(x._id!)}>
                      x
                    </Button>
                  </Flex>
                ))}
              </Flex>
            </Flex>
          </Box>
          <Flex alignItems="center" justifyContent="space-between">
            {order.isCredit && (
              <Tag
                fontSize="inherit"
                colorScheme={!order.isPaid ? 'red' : 'green'}
              >
                Estado: {!order.isPaid ? 'Adeuda' : 'Pagado'}
              </Tag>
            )}
          </Flex>
        </GridItem>
      </Grid>

      <Flex
        mt={2}
        alignItems="center"
        width="100%"
        justifyContent="end"
        gap={2}
        wrap="wrap"
      >
        <Button size="xs" onClick={props.onClose}>
          Cancelar
        </Button>
        <Menu data-testid="page-menu" variant="brand">
          <MenuButton
            as={IconButton}
            variant="unstyled"
            minW="auto"
            h="auto"
            aria-label="Page details"
            icon={
              addingOrder || updatingOrder ? <Spinner /> : <MenuVerticalIcon />
            }
            rounded="full"
          />

          <MenuList maxW="170px">
            <MenuItem>
              <Button
                size="xs"
                type="submit"
                variant="ghost"
                isLoading={addingOrder || updatingOrder}
              >
                <SaveIcon />
                Guardar
              </Button>
            </MenuItem>
            <MenuItem
              isDisabled={!order._id}
              onClick={handleGenerateAndCopyURL}
            >
              <ShareIcon />
              Compartir
            </MenuItem>
            <MenuItem isDisabled={!order._id} onClick={onPayOrder}>
              <MoneyIcon />
              Pagar
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
};
