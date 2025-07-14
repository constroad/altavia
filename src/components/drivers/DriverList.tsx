'use client';

import { Box, Flex, Input } from "@chakra-ui/react";
import { TableComponent } from "../Table";
import { Modal } from "../modal";
import { useState } from "react";
import { API_ROUTES } from "@/common/consts";
import { useFetch } from "@/common/hooks/useFetch";
import { useMutate } from "@/common/hooks/useMutate";
import { toast } from "../Toast";
import { generateDriverColumns } from "./columnsConfig";
import { IDriverSchemaValidation } from "@/models/driver";
import { DriverForm } from "./DriverForm";

interface IDriverList {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const DriverList = (props: IDriverList) => {
  const [search, setSearch] = useState('');
  const [driverSelected, setDriverSelected] = useState<IDriverSchemaValidation>();

  const { data, isLoading, refetch } = useFetch<IDriverSchemaValidation[]>(
    API_ROUTES.drivers,
    { enabled: true }
  );

  const { mutate } = useMutate(API_ROUTES.drivers);

  const filteredDrivers: IDriverSchemaValidation[] = data?.filter(driver =>
    driver.name.toLowerCase().includes(search.toLowerCase()) ||
    driver.dni?.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const columns = generateDriverColumns();

  const handleDeleteDriver = (driver: IDriverSchemaValidation) => {
    const deletePath = `${API_ROUTES.drivers}/${driver._id}`;
    mutate('DELETE', {}, {
      requestUrl: deletePath,
      onSuccess: () => {
        toast.success('Conductor eliminado correctamente');
        setDriverSelected(undefined);
        refetch();
      },
      onError: () => {
        toast.error('Error al eliminar el conductor');
      }
    });
  };

  const handleCloseDriverModal = () => {
    props.onClose();
    setDriverSelected(undefined);
    refetch();
  };

  return (
    <Flex w='100%'>
      <Flex flexDir='column' gap={2} w='100%'>
        <Input
          placeholder="Buscar por nombre o DNI"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          maxW={{ base: '100%', md: '30%' }}
          size="xs"
        />

        <Box w="100%">
          <TableComponent
            itemsPerPage={100}
            data={filteredDrivers}
            columns={columns}
            onDelete={handleDeleteDriver}
            deleteMessage="¿Está seguro de eliminar este conductor?"
            onEdit={(item) => {
              setDriverSelected(item);
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
        onClose={handleCloseDriverModal}
        heading={driverSelected ? 'Editar conductor' : 'Añadir conductor'}
      >
        <DriverForm
          driver={driverSelected}
          closeModal={handleCloseDriverModal}
        />
      </Modal>
    </Flex>
  );
};
