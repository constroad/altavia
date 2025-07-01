import { Box, Flex, Input, useDisclosure } from "@chakra-ui/react"
import { TableComponent } from "../Table";
import { Modal } from "../modal";
import { useState } from "react";
import { API_ROUTES } from "@/common/consts";
import { useFetch } from "@/common/hooks/useFetch";
import { useMutate } from "@/common/hooks/useMutate";
import { toast } from "../Toast";
import { IVehicleSchemaValidation } from "@/models/vehicle";
import { VehicleForm } from "./VehicleForm";
import { generateVehicleColumns } from "./columnsConfig";

interface IVehicleList {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const VehicleList = (props: IVehicleList) => {
  const [search, setSearch] = useState('');
  const [vehicleSelected, setVehicleSelected] = useState<IVehicleSchemaValidation>();

  const { data, isLoading, refetch } = useFetch<IVehicleSchemaValidation[]>(
    API_ROUTES.vehicles
  );
  const { mutate } = useMutate(API_ROUTES.vehicles)

  const filteredVehicles: IVehicleSchemaValidation[] = data?.filter(vehicle =>
    vehicle.plate.toLowerCase().includes(search.toLowerCase()) ||
    vehicle.brand?.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const columns = generateVehicleColumns(); 

  const handleCloseVehicleModal = () => {
    props.onClose();
    setVehicleSelected(undefined);
    refetch()
  };

  const handleDeleteVehicle = (vehicle: IVehicleSchemaValidation) => {
    const deletePath = `${API_ROUTES.vehicles}/${vehicle._id}`
    mutate(
      'DELETE',
      {},
      {
        requestUrl: deletePath,
        onSuccess() {
          refetch()
          toast.success('Vehículo eliminado correctamente')
        },
      }
    )
  }
  //API

  return (
    <Flex w='100%'>
      <Flex flexDir='column' gap={2} w='100%'>
        <Input
          placeholder="Buscar por placa o marca"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          maxW={{ base: '100%', md: '30%' }}
          size="xs"
        />
        <Box w="100%">
          <TableComponent
            itemsPerPage={100}
            data={filteredVehicles}
            columns={columns}
            onDelete={(item) => handleDeleteVehicle(item)}
            deleteMessage="Esta seguro de eliminar este vehículo?"
            onEdit={(item) => {
              setVehicleSelected(item);
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
        onClose={handleCloseVehicleModal}
        heading={vehicleSelected ? 'Editar vehículo' : 'Añadir vehículo'}
      >
        <VehicleForm
          vehicle={vehicleSelected}
          closeModal={handleCloseVehicleModal}
        />
      </Modal>
    </Flex>
  )
}