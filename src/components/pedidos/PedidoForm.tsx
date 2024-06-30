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
} from '@chakra-ui/react';
import { IOrderValidationSchema } from 'src/models/order';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAsync, useDispatch } from 'src/common/hooks';
import { API_ROUTES } from 'src/common/consts';
import { toast } from '../Toast';
import { OrderStatus } from '../../models/order';
import { IClientValidationSchema } from 'src/models/client';
import { AutoComplete, IAutocompleteOptions } from '../autoComplete';
import { formatISODate, parseLocalDate } from 'src/utils/general';
import { AddClient } from './AddClient';

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
    // fechaProgramacion: formatISODate(new Date().toDateString()),
    fechaProgramacion: new Date().toISOString(),
    notas: '',
    precioCubo: 480,
    cantidadCubos: 1,
    subTotal: 480,
    totalPedido: 480,
    montoAdelanto: 0,
    montoPorCobrar: 0,
    isCredit: false,
    status: OrderStatus.pending,
    isPaid: false,
    igv: 0,
    igvCheck: false,
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
        fechaVencimiento = props.order.fechaVencimiento.split('T')[0];
      }
      setOrder({
        ...props.order,
        fechaProgramacion: props.order.fechaProgramacion.split('T')[0],
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

  const handleNumberChange = (name: string, value: string) => {
    let totalPedido = '';
    let montoPorCobrar = '';
    let totalPedidoValue = 0;
    let totalMontoCobrar = 0;

    if (name === 'cantidadCubos') {
      totalPedido = 'totalPedido';
      totalPedidoValue = parseFloat(value) * order.precioCubo;
      if (order.isCredit) {
        montoPorCobrar = 'montoPorCobrar';
        totalMontoCobrar = order.totalPedido - (order.montoAdelanto ?? 0);
      }
    }
    if (name === 'precioCubo') {
      totalPedido = 'totalPedido';
      totalPedidoValue = order.cantidadCubos * parseFloat(value);
      if (order.isCredit) {
        montoPorCobrar = 'montoPorCobrar';
        totalMontoCobrar = order.totalPedido - (order.montoAdelanto ?? 0);
      }
    }
    if (name === 'montoAdelanto') {
      montoPorCobrar = 'montoPorCobrar';
      totalMontoCobrar = order.totalPedido - parseFloat(value);
    }
    setOrder({
      ...order,
      [name]: value,
      [totalPedido]: isNaN(totalPedidoValue) ? 0 : totalPedidoValue,
      [montoPorCobrar]: isNaN(totalMontoCobrar) ? 0 : totalMontoCobrar,
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
          cantidadCubos: parseFloat(payload.cantidadCubos.toString()),
          precioCubo: parseFloat(payload.precioCubo.toString()),
          montoAdelanto: parseFloat(payload.montoAdelanto?.toString() ?? '0'),
        }),
        {
          onSuccess: () => {
            toast.success('Pedido actualizado con éxito!');
            props.onSuccess?.();
            props.onClose?.();
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
        cantidadCubos: parseFloat(payload.cantidadCubos.toString()),
        precioCubo: parseFloat(payload.precioCubo.toString()),
        montoAdelanto: parseFloat(payload.montoAdelanto?.toString() ?? '0'),
      }),
      {
        onSuccess: () => {
          toast.success('Pedido añadido con éxito!');
          props.onSuccess?.();
          props.onClose?.();
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
                      const montoPorCobrar = order.isCredit
                        ? total - order.montoAdelanto
                        : 0;
                      setOrder({
                        ...order,
                        //@ts-ignore
                        precioCubo: value,
                        subTotal,
                        igv,
                        totalPedido: total,
                        montoPorCobrar,
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
                      const montoPorCobrar = order.isCredit
                        ? total - order.montoAdelanto
                        : 0;
                      setOrder({
                        ...order,
                        //@ts-ignore
                        cantidadCubos: value,
                        subTotal,
                        igv,
                        totalPedido: total,
                        montoPorCobrar,
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
                        const montoPorCobrar = order.isCredit
                          ? total - (order.montoAdelanto ?? 0)
                          : 0;
                        setOrder({
                          ...order,
                          igvCheck,
                          igv: igvValue,
                          totalPedido: total,
                          montoPorCobrar,
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
                      const montoPorCobrar = order.isCredit
                        ? total - (order.montoAdelanto ?? 0)
                        : 0;

                      setOrder({
                        ...order,
                        igvCheck,
                        igv,
                        subTotal,
                        //@ts-ignore
                        totalPedido: value,
                        precioCubo: precio,
                        montoPorCobrar,
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
                    const montoAdelanto = isCredit ? order.montoAdelanto : 0;
                    const montoPorCobrar = isCredit
                      ? order.totalPedido - (order.montoAdelanto ?? 0)
                      : 0;
                    setOrder({
                      ...order,
                      isCredit,
                      montoPorCobrar,
                      montoAdelanto,
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
                <FormLabel fontSize="inherit">Adelanto</FormLabel>
                <NumberInput
                  isDisabled={!order.isCredit}
                  size="xs"
                  name="montoAdelanto"
                  value={order.montoAdelanto}
                  onChange={(value) => {
                    const montoAdelanto = isNaN(parseFloat(value))
                      ? 0
                      : parseFloat(value);
                    const montoPorCobrar = order.totalPedido - montoAdelanto;
                    setOrder({
                      ...order,
                      //@ts-ignore
                      montoAdelanto: value,
                      montoPorCobrar,
                    });
                  }}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel fontSize="inherit">Adeuda</FormLabel>
                <NumberInput
                  isDisabled
                  size="xs"
                  name="montoPorCobrar"
                  value={order.montoPorCobrar}
                  onChange={(value) =>
                    handleNumberChange('montoPorCobrar', value)
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
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
                      fechaVencimiento: parseLocalDate(e.target.value).toISOString(),
                    });
                  }}
                />
              </FormControl>
            </GridItem>
          </Grid>
          <Box flex={1} as={Flex} flexDir="column" gap={2}>
            <FormControl>
              <FormLabel fontSize="inherit">Notas</FormLabel>
              <Textarea
                size="sm"
                name="notas"
                value={order.notas}
                onChange={handleChange}
              />
            </FormControl>
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
          </Box>
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
        <Button
          size="xs"
          type="submit"
          colorScheme="yellow"
          isLoading={addingOrder || updatingOrder}
        >
          Guardar
        </Button>
        {order._id && (
          <Button
            size="xs"
            isDisabled={!order.isCredit || order.isPaid}
            colorScheme="yellow"
            isLoading={updatingOrder}
            onClick={onPayOrder}
          >
            Pagar deuda
          </Button>
        )}
      </Flex>
    </Box>
  );
};
