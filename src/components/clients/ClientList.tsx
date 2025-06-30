import { Box, Flex, Input, useDisclosure } from "@chakra-ui/react"
import { TableComponent } from "../Table";
import { Modal } from "../modal";
import { ClientForm } from "./ClientForm";
import { useState } from "react";
import { IClientSchemaValidation } from "@/models/client";
import { API_ROUTES } from "@/common/consts";
import { useFetch } from "@/common/hooks/useFetch";
import { useMutate } from "@/common/hooks/useMutate";
import { generateClientColumns } from "./columnsConfig";
import { toast } from "../Toast";

interface IClientList {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const ClientList = (props: IClientList) => {
  const [search, setSearch] = useState('');
  const [clientSelected, setClientSelected] = useState<IClientSchemaValidation>();

  const { data, isLoading, refetch } = useFetch<IClientSchemaValidation[]>(
    API_ROUTES.clients
  );
  const { mutate } = useMutate(API_ROUTES.clients)

  const filteredClients: IClientSchemaValidation[] = data?.filter(client =>
    client.name.toLowerCase().includes(search.toLowerCase()) ||
    (client.ruc?.includes(search))
  ) ?? [];

  const columns = generateClientColumns(); 

  const handleCloseClientModal = () => {
    props.onClose();
    setClientSelected(undefined);
    refetch()
  };

  const handleDeleteClient = (client: IClientSchemaValidation) => {
    const deletePath = `${API_ROUTES.clients}/${client._id}`
    mutate(
      'DELETE',
      {},
      {
        requestUrl: deletePath,
        onSuccess() {
          refetch()
          toast.success('Cliente eliminado correctamente')
        },
      }
    )
  }
  //API

  return (
    <Flex w='100%'>
      <Flex flexDir='column' gap={2} w='100%'>
        <Input
          placeholder="Buscar por nombre o RUC"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          maxW={{ base: '100%', md: '30%' }}
          size="xs"
        />
        <Box w="100%">
          <TableComponent
            itemsPerPage={100}
            data={filteredClients}
            columns={columns}
            onDelete={(item) => handleDeleteClient(item)}
            onEdit={(item) => {
              setClientSelected(item);
              props.onOpen();
            }}
            isLoading={isLoading}
            pagination
            actions
            /> 
        </Box>
      </Flex>

      <Modal
        hideCancelButton
        isOpen={props.open}
        onClose={handleCloseClientModal}
        heading={clientSelected ? 'Editar cliente' : 'Añadir cliente'}
      >
        <ClientForm
          client={clientSelected}
          closeModal={handleCloseClientModal}
        />
      </Modal>
    </Flex>
  )
}