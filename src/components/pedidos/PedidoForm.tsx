import {
  Box,
  Stack,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Textarea,
  Input,
  Button,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Select,
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
import { Certificate } from './Certificates';

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
    certificados: [],
    consumos: {
      galonesPEN: 0,
      galonesIFO: 0,
      galonesPetroleo: 0,
      m3Arena: 0,
      m3Piedra: 0,
    },
    precioCubo: 480,
    cantidadCubos: 1,
    totalPedido: 480,
    montoAdelanto: 0,
    montoPorCobrar: 0,
    status: OrderStatus.pending,
  });

  useEffect(() => {
    if (props.order) {
      setOrder({
        ...props.order,
        fechaProgramacion: props.order.fechaProgramacion.split('T')[0],
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
    let totalPedido = '';
    let montoPorCobrar = '';
    let totalPedidoValue = 0;
    let totalMontoCobrar = 0;

    if (name === 'cantidadCubos' || name === 'precioCubo') {
      totalPedido = 'totalPedido';
      totalPedidoValue = order.cantidadCubos * order.precioCubo;
    }
    if (name === 'montoAdelanto') {
      montoPorCobrar = 'montoPorCobrar';
      totalMontoCobrar = order.totalPedido - Number(value);
    }
    setOrder({
      ...order,
      [name]: parseFloat(value || '0'),
      [totalPedido]: totalPedidoValue,
      [montoPorCobrar]: totalMontoCobrar,
    });
  };
  const handleObjectChange = (name: string, value: any) => {
    setOrder({
      ...order,
      [name]: value,
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
      runUpdateOrder(axios.put(path, payload), {
        onSuccess: () => {
          toast.success('Pedido actualizado con éxito!');
          props.onSuccess?.();
          props.onClose?.();
        },
        onError: () => {
          toast.error('ocurrio un error agregando un pedido');
        },
      });
      return;
    }

    runAddOrder(postOrder(API_ROUTES.order, payload), {
      onSuccess: () => {
        toast.success('Pedido añadido con éxito!');
        props.onSuccess?.();
        props.onClose?.();
      },
      onError: () => {
        toast.error('ocurrio un error agregando un pedido');
      },
    });
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

  console.log('order', order);

  // Renders
  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <FormControl>
          <FormLabel>Cliente *</FormLabel>
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
            <FormLabel>Tipo de MAC</FormLabel>
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
            >
              <option value="Mac 1">Mac 1</option>
              <option value="Mac 2">Mac 2</option>
              <option value="Mac 3">Mac 3</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Fecha</FormLabel>
            <Input
              type="date"
              name="fechaProgramacion"
              value={order.fechaProgramacion}
              onChange={handleChange}
            />
          </FormControl>
        </Flex>

        <FormControl as={Flex}>
          <FormLabel width="100px">Precio m3</FormLabel>
          <NumberInput
            name="precioCubo"
            value={order.precioCubo}
            onChange={(value) => handleNumberChange('precioCubo', value)}
          >
            <NumberInputField />
          </NumberInput>
        </FormControl>
        <FormControl as={Flex}>
          <FormLabel width="100px">Cantidad m3</FormLabel>
          <NumberInput
            name="cantidadCubos"
            value={order.cantidadCubos}
            onChange={(value) => {
              handleNumberChange('cantidadCubos', value);
            }}
          >
            <NumberInputField />
          </NumberInput>
        </FormControl>
        <FormControl as={Flex}>
          <FormLabel width="100px">Total S/.</FormLabel>
          <NumberInput
            name="totalPedido"
            value={order.totalPedido}
            onChange={(value) => handleNumberChange('totalPedido', value)}
          >
            <NumberInputField />
          </NumberInput>
        </FormControl>
        <Flex>
          <FormControl>
            <FormLabel>Adelanto S/.</FormLabel>
            <NumberInput
              name="montoAdelanto"
              value={order.montoAdelanto}
              onChange={(value) => handleNumberChange('montoAdelanto', value)}
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>
          <FormControl>
            <FormLabel>Monto por Cobrar</FormLabel>
            <NumberInput
              isDisabled
              name="montoPorCobrar"
              value={order.montoPorCobrar}
              onChange={(value) => handleNumberChange('montoPorCobrar', value)}
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>
        </Flex>

        <Accordion allowMultiple>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  Consumos
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} bgColor="purple" color="white">
              <FormControl as={Flex} alignItems="center">
                <FormLabel width={20}>PEN</FormLabel>
                <NumberInput
                  name="galonesPEN"
                  value={order.consumos?.galonesPEN}
                  onChange={(value) =>
                    handleObjectChange('consumos', {
                      ...order.consumos,
                      galonesPEN: parseFloat(value),
                    })
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl as={Flex} alignItems="center">
                <FormLabel width={20}>IFO</FormLabel>
                <NumberInput
                  name="galonesPEN"
                  value={order.consumos?.galonesIFO}
                  onChange={(value) =>
                    handleObjectChange('consumos', {
                      ...order.consumos,
                      galonesIFO: parseFloat(value),
                    })
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl as={Flex} alignItems="center">
                <FormLabel width={20}>Petroleo</FormLabel>
                <NumberInput
                  name="galonesPEN"
                  value={order.consumos?.galonesPetroleo}
                  onChange={(value) =>
                    handleObjectChange('consumos', {
                      ...order.consumos,
                      galonesPetroleo: parseFloat(value),
                    })
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl as={Flex} alignItems="center">
                <FormLabel width={20}>M3 Arena</FormLabel>
                <NumberInput
                  name="galonesPEN"
                  value={order.consumos?.m3Arena}
                  onChange={(value) =>
                    handleObjectChange('consumos', {
                      ...order.consumos,
                      m3Arena: parseFloat(value),
                    })
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl as={Flex} alignItems="center">
                <FormLabel width={20}>M3 Piedra</FormLabel>
                <NumberInput
                  name="galonesPEN"
                  value={order.consumos?.m3Piedra}
                  onChange={(value) =>
                    handleObjectChange('consumos', {
                      ...order.consumos,
                      m3Piedra: parseFloat(value),
                    })
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  Certificados
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Certificate
                list={order.certificados}
                onSave={(certificados) => {
                  setOrder({ ...order, certificados });
                }}
              />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <FormControl>
          <FormLabel>Notas</FormLabel>
          <Textarea name="notas" value={order.notas} onChange={handleChange} />
        </FormControl>

        <Flex alignItems="center" width="100%" justifyContent="end" gap={2}>
          <Button onClick={props.onClose}>Cancelar</Button>
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={addingOrder || updatingOrder}
          >
            Guardar
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
};
