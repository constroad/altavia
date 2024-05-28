import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';
import { API_ROUTES } from 'src/common/consts';
import { useAsync } from 'src/common/hooks';
import { toast } from '../Toast';

interface AddClientProps {
  textNoFound?: string;
  onSuccess?: () => void;
}

const postClient = (path: string, data: any) => axios.post(path, { data });

export const AddClient = (props: AddClientProps) => {
  const { textNoFound = 'Cliente no encontrado' } = props;
  const [client, setClient] = useState('');
  const [ruc, setRuc] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { run: runAddClient, isLoading: addingClient } = useAsync();

  const handleSaveClient = () => {
    if (!client) {
      toast.warning("Ingrese el nombre del cliente")
      return
    }
    runAddClient(postClient(API_ROUTES.client, { name: client, ruc   }), {
      onSuccess: () => {
        props.onSuccess?.();
        onClose();
      },
    });
  };
  return (
    <Box display="flex" p={2} gap={2} alignItems="center">
      {isOpen ? (
        <Box display="flex" gap={2} alignItems="start" flexDir="column" fontSize={12}>
          <Box display="flex" gap={1} alignItems="center">
            <Text fontSize="inherit" width="100px">Cliente (*):</Text>
            <Input
              placeholder="Nombre"
              size="xs"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              fontSize={{ base: 10, md: 12 }}
              borderColor="#e2e8f0"
              ring="none"
              outline="none"
              _focus={{ outline: 'none', ring: '0px' }}
              _active={{ outline: 'none', ring: '0px' }}
            />
          </Box>
          <Box display="flex" gap={1} alignItems="center">
            <Text fontSize="inherit" width="100px">Ruc:</Text>
            <Input
              placeholder="Nombre"
              size="xs"
              value={ruc}
              onChange={(e) => setRuc(e.target.value)}
              fontSize={{ base: 10, md: 12 }}
              borderColor="#e2e8f0"
              ring="none"
              outline="none"
              _focus={{ outline: 'none', ring: '0px' }}
              _active={{ outline: 'none', ring: '0px' }}
            />
          </Box>
          <Flex gap={2}>
            <Button size="xs" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="blue"
              size="xs"
              onClick={handleSaveClient}
              isLoading={addingClient}
            >
              Guardar
            </Button>
          </Flex>
        </Box>
      ) : (
        <>
          <Text>{textNoFound}</Text>
          <Button  size="xs" onClick={onOpen}>Agregar cliente?</Button>
        </>
      )}
    </Box>
  );
};
