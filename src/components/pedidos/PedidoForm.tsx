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
} from '@chakra-ui/react';
import { IOrderValidationSchema } from 'src/models/order';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAsync } from 'src/common/hooks';
import { API_ROUTES } from 'src/common/consts';
import { toast } from '../Toast';
import { OrderStatus } from '../../models/order';

interface PedidoFormProps {
  order?: IOrderValidationSchema;
  onSuccess?: () => void;
  onClose?: () => void;
}
const postOrder = (path: string, data: any) => axios.post(path, { data });

function formatISODate(isoString: string) {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const PedidoForm = (props: PedidoFormProps) => {
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
        fechaProgramacion: props.order.fechaProgramacion.split("T")[0],
      });
    }
  }, [props.order]);
  const { run: runAddOrder, isLoading: addingOrder } = useAsync();
  const { run: runUpdateOrder, isLoading: updatingOrder } = useAsync();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    let dateValue = order.fechaProgramacion
    if (name === "fechaProgramacion" && value) {
      dateValue = value
    }
    setOrder({
      ...order,
      [name]: value,
      "fechaProgramacion": dateValue
    });
  };

  const handleNumberChange = (name: string, value: string) => {
    let totalPedido = '';
    let totalPedidoValue = 0;

    if (name === 'cantidadCubos' || name === 'precioCubo') {
      totalPedido = 'totalPedido';
      totalPedidoValue = order.cantidadCubos * order.precioCubo;
    }
    setOrder({
      ...order,
      [name]: parseFloat(value),
      [totalPedido]: totalPedidoValue,
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

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>Cliente</FormLabel>
          <Input name="cliente" value={order.cliente} onChange={handleChange} />
        </FormControl>
        <Flex>
          <FormControl>
            <FormLabel>Tipo de MAC</FormLabel>
            <Input
              type="text"
              name="tipoMAC"
              value={order.tipoMAC}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Fecha de Programación</FormLabel>
            <Input
              type="date"
              name="fechaProgramacion"
              value={order.fechaProgramacion}
              onChange={handleChange}
            />
          </FormControl>
        </Flex>

        <FormControl as={Flex}>
          <FormLabel width="150px">Precio por Cubo</FormLabel>
          <NumberInput
            name="precioCubo"
            value={order.precioCubo}
            onChange={(value) => handleNumberChange('precioCubo', value)}
          >
            <NumberInputField />
          </NumberInput>
        </FormControl>
        <FormControl as={Flex}>
          <FormLabel width="150px">Cantidad de Cubos</FormLabel>
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
          <FormLabel width="150px">Total del Pedido</FormLabel>
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
            <FormLabel>Monto Adelanto</FormLabel>
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
              name="montoPorCobrar"
              value={order.montoPorCobrar}
              onChange={(value) => handleNumberChange('montoPorCobrar', value)}
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>
        </Flex>
        <FormControl>
          <FormLabel>Notas</FormLabel>
          <Textarea name="notas" value={order.notas} onChange={handleChange} />
        </FormControl>

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
            <AccordionPanel pb={4}></AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Flex alignItems="center" width="100%" justifyContent="end" gap={2}>
          <Button onClick={props.onClose}>Cancelar</Button>
          <Button type="submit" colorScheme="blue" isLoading={addingOrder || updatingOrder}>
            Guardar
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
};
