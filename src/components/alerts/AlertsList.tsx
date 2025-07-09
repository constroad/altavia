import { Box, Flex, Input } from "@chakra-ui/react"
import { TableComponent } from "../Table";
import { Modal } from "../modal";
import { useState } from "react";
import { API_ROUTES } from "@/common/consts";
import { useFetch } from "@/common/hooks/useFetch";
import { useMutate } from "@/common/hooks/useMutate";
import { toast } from "../Toast";
import { IAlertSchemaValidation } from "@/models/alert";
import { AlertForm } from "./AlertForm";
import { generateAlertColumns } from "./columnsConfig";

interface IAlertList {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const AlertList = (props: IAlertList) => {
  const [search, setSearch] = useState('');
  const [alertSelected, setAlertSelected] = useState<IAlertSchemaValidation>();

  const { data, isLoading, refetch } = useFetch<IAlertSchemaValidation[]>(
    API_ROUTES.alerts
  );
  const { mutate } = useMutate(API_ROUTES.alerts)

  const filteredAlerts: IAlertSchemaValidation[] = data?.filter(alert =>
    alert.name.toLowerCase().includes(search.toLowerCase()) ||
    alert.type?.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const columns = generateAlertColumns();

  const handleCloseAlertModal = () => {
    props.onClose();
    setAlertSelected(undefined);
    refetch()
  };

  const handleDeleteAlert = (alert: IAlertSchemaValidation) => {
    const deletePath = `${API_ROUTES.alerts}/${alert._id}`
    mutate(
      'DELETE',
      {},
      {
        requestUrl: deletePath,
        onSuccess() {
          refetch()
          toast.success('Alerta eliminada correctamente')
        },
      }
    )
  }

  return (
    <Flex w='100%'>
      <Flex flexDir='column' gap={2} w='100%'>
        <Input
          placeholder="Buscar por nombre o tipo"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          maxW={{ base: '100%', md: '30%' }}
          size="xs"
        />
        <Box w="100%">
          <TableComponent
            itemsPerPage={100}
            data={filteredAlerts}
            columns={columns}
            onDelete={(item) => handleDeleteAlert(item)}
            deleteMessage="Esta seguro de eliminar esta alerta?"
            onEdit={(item) => {
              setAlertSelected(item);
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
        onClose={handleCloseAlertModal}
        heading={alertSelected ? 'Editar alerta' : 'Añadir alerta'}
      >
        <AlertForm
          alert={alertSelected}
          closeModal={handleCloseAlertModal}
        />
      </Modal>
    </Flex>
  )
}