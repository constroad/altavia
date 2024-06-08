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
} from '@chakra-ui/react';
import { IOrderValidationSchema } from 'src/models/order';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAsync } from 'src/common/hooks';
import { API_ROUTES } from 'src/common/consts';
import { toast } from '../Toast';
import { OrderStatus } from '../../models/order';
import { IClientValidationSchema } from 'src/models/client';
import { AutoComplete, IAutocompleteOptions } from '../autoComplete';
import { formatISODate } from 'src/utils/general';
import { AddClient } from './AddClient';

interface PedidoFormProps {
  order?: IOrderValidationSchema;
  onSuccess?: () => void;
  onClose?: () => void;
}
const fetcher = (path: string) => axios.get(path);
const postOrder = (path: string, data: any) => axios.post(path, { data });

export const PedidoForm = (props: PedidoFormProps) => {
  const [searchClient, setSearchClient] = useState(props.order?.cliente ?? '');
  const [order, setOrder] = useState<IOrderValidationSchema>({
    cliente: '',
    tipoMAC: 'Mac 2',
    fechaProgramacion: formatISODate(new Date().toDateString()),
    notas: '',
    precioCubo: 480,
    cantidadCubos: 1,
    totalPedido: 480,
    montoAdelanto: 0,
    montoPorCobrar: 0,
    isCredit: false,
    status: OrderStatus.paid,
  });

  useEffect(() => {
    if (props.order) {
      let fechaVencimiento =''
      if (props.order.fechaVencimiento) {        
        fechaVencimiento= props.order.fechaVencimiento.split('T')[0]
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
      dateValue = value;
    }
    setOrder({
      ...order,
      [name]: value,
      fechaProgramacion: dateValue,
    });
  };

  const handleNumberChange = (name: string, value: string) => {
    console.log('number', { name, value });
    let totalPedido = '';
    let montoPorCobrar = '';
    let totalPedidoValue = 0;
    let totalMontoCobrar = 0;

    if (name === 'cantidadCubos') {
      totalPedido = 'totalPedido';
      totalPedidoValue = parseFloat(value) * order.precioCubo;

      montoPorCobrar = 'montoPorCobrar';
    }
    if (name === 'precioCubo') {
      totalPedido = 'totalPedido';
      totalPedidoValue = order.cantidadCubos * parseFloat(value);

      montoPorCobrar = 'montoPorCobrar';
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

    if (_id) {
      const path = `${API_ROUTES.order}/${_id}`;
      runUpdateOrder(
        axios.put(path, {
          ...payload,
          cantidadCubos: parseFloat(payload.cantidadCubos.toString()),
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

  const clientList = clientResponse?.data ?? [];
  const clientFildsToFilter = ['name', 'ruc', 'alias'];

  // Renders
  return (
    <Box as="form" onSubmit={handleSubmit} mt={5} fontSize="12px">
      <Flex gap={5}>
        <Box width="48%" as={Flex} flexDir="column" gap={1}>
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
          <Flex>
            <FormControl>
              <FormLabel fontSize="inherit">MAC</FormLabel>
              <Select
                name="tipoMAC"
                placeholder="Selecciona"
                defaultValue="Mac 2"
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
            <FormControl>
              <FormLabel fontSize="inherit">Fecha</FormLabel>
              <Input
                size="xs"
                type="date"
                name="fechaProgramacion"
                value={order.fechaProgramacion}
                onChange={handleChange}
              />
            </FormControl>
          </Flex>

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
          <Flex gap={2} flexDir={{ base: 'column', md: 'row' }}>
            <FormControl>
              <FormLabel fontSize="inherit" width="100px">
                Precio
              </FormLabel>
              <NumberInput
                size="xs"
                name="precioCubo"
                value={order.precioCubo}
                onChange={(value) => handleNumberChange('precioCubo', value)}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <FormControl>
              <FormLabel fontSize="inherit" width="100px">
                Cantidad
              </FormLabel>
              <NumberInput
                size="xs"
                name="cantidadCubos"
                value={order.cantidadCubos}
                onChange={(value) => {
                  handleNumberChange('cantidadCubos', value);
                }}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <FormControl>
              <FormLabel fontSize="inherit" width="100px">
                Total S/.
              </FormLabel>
              <NumberInput
                isDisabled
                size="xs"
                name="totalPedido"
                value={order.totalPedido}
                onChange={(value) => handleNumberChange('totalPedido', value)}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
          </Flex>
        </Box>
        {/* Second Column */}
        <Box flex={1} as={Flex} flexDir="column" gap={2}>
          <Flex gap={2}>
            <FormLabel fontSize="inherit">Es al credito?</FormLabel>
            <Switch
              id="isChecked"
              flex={1}
              isChecked={order.isCredit}
              onChange={(value) => {
                const isCredit = value.target.checked;
                setOrder({
                  ...order,
                  isCredit,
                  status: isCredit ? OrderStatus.pending : OrderStatus.paid,
                });
              }}
            />
          </Flex>
          <Flex gap={2} flexDir={{ base: 'column', md: 'row' }}>
            <FormControl>
              <FormLabel fontSize="inherit">Adelanto</FormLabel>
              <NumberInput
                isDisabled={!order.isCredit}
                size="xs"
                name="montoAdelanto"
                value={order.montoAdelanto}
                onChange={(value) => handleNumberChange('montoAdelanto', value)}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
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
            <FormControl>
              <FormLabel fontSize="inherit">Vencimiento</FormLabel>
              <Input
                isDisabled={!order.isCredit}
                size="xs"
                type="date"
                name="fechaVencimiento"
                value={order.fechaVencimiento ?? ''}
                onChange={handleChange}
              />
            </FormControl>
          </Flex>

          <FormControl>
            <FormLabel fontSize="inherit">Notas</FormLabel>
            <Textarea
              size="sm"
              name="notas"
              value={order.notas}
              onChange={handleChange}
            />
          </FormControl>
        </Box>
      </Flex>
      <Flex
        mt={5}
        alignItems="center"
        width="100%"
        justifyContent="end"
        gap={2}
      >
        <Button size="sm" onClick={props.onClose}>
          Cancelar
        </Button>
        <Button
          size="sm"
          type="submit"
          colorScheme="yellow"
          isLoading={addingOrder || updatingOrder}
        >
          Guardar
        </Button>
        <Button
          size="sm"
          isDisabled
          // type="submit"
          colorScheme="yellow"
          isLoading={updatingOrder}
        >
          Cancelar deuda
        </Button>
      </Flex>
    </Box>
  );
};
