import React, { useEffect, useMemo, useState } from 'react';
import { Button, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { IntranetLayout, Modal, TableComponent, toast } from 'src/components';
import axios from 'axios';
import { IDispatchValidationSchema } from 'src/models/dispatch';
import { useAsync } from 'src/common/hooks';
import { API_ROUTES } from 'src/common/consts';
import { DispatchForm, generateDispatchColumns } from 'src/components/dispatch';
import { IClientValidationSchema } from 'src/models/client';
import { ITransportValidationSchema } from 'src/models/transport';

const fetcher = (path: string) => axios.get(path);
const deleteDispatch = (path: string) => axios.delete(path);

interface IDispatchList extends IDispatchValidationSchema {
  client: string;
  clientRuc: string;
  company: string;
  plate: string;
}

const DispatchPage = () => {
  const [dispatchSelected, setDispatchSelected] =
    useState<IDispatchValidationSchema>();
  const { onClose, isOpen, onOpen } = useDisclosure();
  const {
    onClose: onCloseDelete,
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
  } = useDisclosure();

  // API
  const {
    run: runGetDispatchs,
    data: dispatchResponse,
    isLoading,
    refetch,
  } = useAsync<IDispatchValidationSchema[]>();
  const {
    run: runGetClients,
    data: clientResponse,
    refetch: refetchClients,
  } = useAsync<IClientValidationSchema[]>();
  const {
    run: runGetTransports,
    data: responseTransport,
    refetch: refetchTransport,
  } = useAsync<ITransportValidationSchema[]>();
  const { run: runDeleteDispatch, isLoading: deletingDispatch } = useAsync();

  useEffect(() => {
    runGetDispatchs(fetcher(API_ROUTES.dispatch), {
      refetch: () => runGetDispatchs(fetcher(API_ROUTES.dispatch)),
    });

    runGetClients(fetcher(API_ROUTES.client), {
      refetch: () => runGetClients(fetcher(API_ROUTES.client)),
    });

    runGetTransports(fetcher(API_ROUTES.transport), {
      refetch: () => runGetTransports(fetcher(API_ROUTES.transport)),
    });
  }, []);

  // handlers
  const handleCloseDispatchModal = () => {
    onClose();
    setDispatchSelected(undefined);
  };
  const handleDeleteDispatch = () => {
    runDeleteDispatch(
      deleteDispatch(`${API_ROUTES.dispatch}/${dispatchSelected?._id}`),
      {
        onSuccess: () => {
          toast.success(
            `Eliminaste el pedido ${dispatchSelected?.description}`
          );
          refetch();
          refetchTransport();
          refetchClients();
          setDispatchSelected(undefined);
          onCloseDelete();
        },
      }
    );
  };

  const columns = generateDispatchColumns();
  const listDispatch = useMemo((): IDispatchList[] => {
    if (!dispatchResponse) return [];

    return dispatchResponse.data.map((item) => {
      const transport = responseTransport?.data?.find(
        (x) => x._id === item.transportId
      );
      const client = clientResponse?.data?.find((x) => x._id === item.clientId);
      return {
        ...item,
        client: client?.name ?? '',
        clientRuc: client?.ruc ?? '',
        company: transport?.company ?? '',
        plate: transport?.plate ?? '',
      };
    });
  }, [dispatchResponse, clientResponse, responseTransport]);

  const deleteFooter = (
    <Button
      isLoading={deletingDispatch}
      variant="ghost"
      autoFocus
      colorScheme="red"
      onClick={handleDeleteDispatch}
    >
      Confirm
    </Button>
  );

  return (
    <IntranetLayout>
      <Flex
        flexDir="column"
        alignItems={{ base: '', md: '' }}
        gap="15px"
        mt={5}
      >
        <Flex width="100%" justifyContent="space-between">
          <Text
            fontSize={{ base: 25, md: 30 }}
            fontWeight={700}
            color="black"
            lineHeight={{ base: '28px', md: '39px' }}
            marginTop="10px"
            textAlign="center"
          >
            CONTROL DE DESPACHOS
          </Text>

          {!isOpen && (
            <Button autoFocus onClick={onOpen}>
              Agregar Despacho
            </Button>
          )}
        </Flex>
        {isOpen && (
          <DispatchForm
            onSuccess={() => {
              refetch();
              refetchClients();
              refetchTransport();
            }}
            dispatch={dispatchSelected}
            onClose={handleCloseDispatchModal}
          />
        )}

        {!isOpen && (
          <TableComponent
            isLoading={isLoading}
            data={listDispatch}
            columns={columns}
            onDelete={(item) => {
              setDispatchSelected(item);
              onOpenDelete();
            }}
            onEdit={(item) => {
              setDispatchSelected(item);
              onOpen();
            }}
            pagination
            actions
          />
        )}
      </Flex>

      {/* delete dispatch modal */}
      <Modal
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        heading={`¿Estás seguro de eliminar este Pedido ${dispatchSelected?.description}?`}
        footer={deleteFooter}
      />
    </IntranetLayout>
  );
};

export default DispatchPage;
