import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
} from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';
import { useAsync } from 'src/common/hooks';
import { ITransportValidationSchema } from 'src/models/transport';
import { toast } from '../Toast';
import { API_ROUTES } from 'src/common/consts';

interface TransportFormProps {
  transport?: ITransportValidationSchema;
  onClose: () => void;
  onSuccess: () => void;
}

const defaultValue = {
  company: '',
  plate: '',
  driverName: '',
  driverCard: '',
  phone: '',
};
const postTransport = (path: string, data: any) => axios.post(path, { data });
const putTransport = (path: string, data: any) => axios.put(path, data);

export const TransportForm = (props: TransportFormProps) => {
  const [transport, setTransport] = useState<ITransportValidationSchema>(
    props.transport ?? defaultValue
  );

  // API

  const { run: runAddTransport, isLoading: addingTransport } = useAsync();
  const { run: runUpdateTransport, isLoading: updatingTransport } = useAsync();

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const { _id, ...payload } = transport;
    if (!transport.company || !transport.plate) {
      toast.warning('Ingrese los datos obligatorios');
      return;
    }
    //Update
    if (_id) {
      const path = `${API_ROUTES.transport}/${_id}`;
      runUpdateTransport(putTransport(path, payload), {
        onSuccess: () => {
          toast.success('Tranposte actualizado con éxito!');
          props.onSuccess?.();
          props.onClose?.();
        },
        onError: () => {
          toast.error('ocurrio un error actualizando un transporte');
        },
      });
      return;
    }

    //Adding
    runAddTransport(postTransport(API_ROUTES.transport, transport), {
      onSuccess: () => {
        toast.success('Transporte añadido con éxito!');
        props.onSuccess?.();
        props.onClose?.();
      },
      onError: () => {
        toast.error('ocurrio un error agregando un transporte');
      },
    });
  };

  console.log('transport', transport);
  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <FormControl as={Flex}>
          <FormLabel width="100px">Empresa(*)</FormLabel>
          <Input
            value={transport.company}
            onChange={(e) =>
              setTransport({ ...transport, company: e.target.value })
            }
          />
        </FormControl>
        <FormControl as={Flex}>
          <FormLabel width="100px">Placa(*)</FormLabel>
          <Input
            value={transport.plate}
            onChange={(e) =>
              setTransport({ ...transport, plate: e.target.value })
            }
          />
        </FormControl>
        <FormControl as={Flex}>
          <FormLabel width="100px">Conductor</FormLabel>
          <Input
            value={transport.driverName}
            onChange={(e) =>
              setTransport({ ...transport, driverName: e.target.value })
            }
          />
        </FormControl>
        <FormControl as={Flex}>
          <FormLabel width="100px">Licencia</FormLabel>
          <Input
            value={transport.driverCard}
            onChange={(e) =>
              setTransport({ ...transport, driverCard: e.target.value })
            }
          />
        </FormControl>
        <FormControl as={Flex}>
          <FormLabel width="100px">Celular</FormLabel>
          <Input
            value={transport.phone}
            onChange={(e) =>
              setTransport({ ...transport, phone: e.target.value })
            }
          />
        </FormControl>

        <Flex alignItems="center" width="100%" justifyContent="end" gap={2}>
          <Button onClick={props.onClose}>Cancelar</Button>
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={addingTransport || updatingTransport}
          >
            Guardar
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
};
