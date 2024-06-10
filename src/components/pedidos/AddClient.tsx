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
  const { run: runAddClient, isLoading: addingClient, cache } = useAsync();

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
    <Box display="flex" p={2} gap={2} alignItems="center" width="inherit" fontSize="inherit">
      {isOpen ? (
        <Box display="flex" alignItems="start" flexDir="column" width="inherit">
          <Box display="flex" flexDir="column">
            <Text fontSize="inherit">Cliente (*):</Text>
            <Input
              placeholder="Nombre"
              size="xs"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              borderColor="#e2e8f0"
              ring="none"
              outline="none"
              _focus={{ outline: 'none', ring: '0px' }}
              _active={{ outline: 'none', ring: '0px' }}
            />
          </Box>
          <Box display="flex" flexDir="column">
            <Text fontSize="inherit">Ruc:</Text>
            <Input
              placeholder="Nombre"
              size="xs"
              value={ruc}
              onChange={(e) => setRuc(e.target.value)}
              borderColor="#e2e8f0"
              ring="none"
              outline="none"
              _focus={{ outline: 'none', ring: '0px' }}
              _active={{ outline: 'none', ring: '0px' }}
            />
          </Box>
          <Flex gap={2} mt={2}>
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
          <Button width="100%" size="xs" onClick={onOpen} wordBreak="break-word">Agregar</Button>
        </>
      )}
    </Box>
  );
};
