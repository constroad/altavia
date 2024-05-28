import { Box, Button, useDisclosure, Text } from '@chakra-ui/react';
import { TransportForm } from '../transport';

interface AddTransportProps {
  textNoFound?: string;
  onSuccess?: () => void;
}

export const AddTransport = (props: AddTransportProps) => {
  const { textNoFound = 'Transporte no encontrado' } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box display="flex" p={2} gap={2} alignItems="center">
      {!isOpen && (
        <>
          <Text>{textNoFound}</Text>
          <Button size="xs" onClick={onOpen}>
            Agregar transporte?
          </Button>
        </>
      )}

      {isOpen && (
        <TransportForm
          onClose={onClose}
          onSuccess={() => {
            props.onSuccess?.();
            onClose()
          }}
        />
      )}
    </Box>
  );
};
