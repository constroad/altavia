import { Box, Button, Flex, useDisclosure, Text } from '@chakra-ui/react';
import { IntranetLayout, Modal, TableComponent, toast } from 'src/components';
import {
  TransportForm,
  generateTransportColumns,
} from 'src/components/transport';
import axios from 'axios';
import { useAsync } from 'src/common/hooks';
import { ITransportValidationSchema } from 'src/models/transport';
import { useEffect, useMemo, useState } from 'react';
import { API_ROUTES } from 'src/common/consts';

const fetcher = (path: string) => axios.get(path);
const deleteTransport = (path: string) => axios.delete(path);

const Transport = () => {
  const [transportSelected, setTransportSelected] = useState<ITransportValidationSchema | undefined>()
  const { onClose, isOpen, onOpen } = useDisclosure();
  const {
    onClose: onCloseDelete,
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
  } = useDisclosure();

  // API
  const {
    run: runGetTransports,
    isLoading,
    data: responseTransport,
    refetch,
  } = useAsync<ITransportValidationSchema[]>();
  const { run: runDeleteTransport, isLoading: deletingTransport } = useAsync();


  useEffect(() => {
    runGetTransports(fetcher(API_ROUTES.transport), {
      refetch: () => runGetTransports(fetcher(API_ROUTES.transport)),
      cacheKey: API_ROUTES.transport,
    });
  }, []);

    // handlers
    const handleDeleteTransport = () => {
      runDeleteTransport(deleteTransport(`${API_ROUTES.transport}/${transportSelected?._id}`), {
        onSuccess: () => {
          toast.success(`Eliminaste el pedido ${transportSelected?.plate}`)
          refetch()
          setTransportSelected(undefined)
          onCloseDelete()
        }
      })
    };

    const handleCloseTransportModal = () => {
      onClose()
      setTransportSelected(undefined)
    }
  

  const columns = generateTransportColumns();
  const listTransportOrdered = useMemo(() => {
    if (!responseTransport) return [];

    return responseTransport.data;
  }, [responseTransport]);

  const deleteFooter = (
    <Button
      isLoading={deletingTransport}
      variant="ghost"
      autoFocus
      colorScheme="red"
      onClick={handleDeleteTransport}
    >
      Confirm
    </Button>
  );

  return (
    <IntranetLayout>
      <Flex flexDir="column" width="100%" gap={2} mt={5}>
        <Flex width="100%" justifyContent="space-between">
          <Text
            fontSize={{ base: 25, md: 36 }}
            fontWeight={700}
            color="black"
            lineHeight={{ base: '28px', md: '39px' }}
          >
            Transporte
          </Text>

          <Button autoFocus onClick={onOpen}>
            Agregar Transporte
          </Button>
        </Flex>

        <Box w="100%">
          <TableComponent
            data={listTransportOrdered}
            columns={columns}
            onDelete={(item) => {
              setTransportSelected(item)
              onOpenDelete()
            }}
            onEdit={(item) => {
              setTransportSelected(item)
              onOpen()
            }}
            isLoading={isLoading}
            pagination
            actions
          />
        </Box>
      </Flex>

      {/* transport form modal */}
      <Modal
        hideCancelButton
        isOpen={isOpen}
        onClose={handleCloseTransportModal}
        heading={transportSelected ? 'Editar Transporte' : 'Añadir Transporte'}
      >
        <TransportForm
          transport={transportSelected}
          onClose={handleCloseTransportModal}
          onSuccess={refetch}
        />
      </Modal>

      {/* delete transport modal */}
      <Modal
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        heading={`¿Estás seguro de eliminar este transporte ${transportSelected?.plate}?`}
        footer={deleteFooter}
      />
    </IntranetLayout>
  );
};

export default Transport;
