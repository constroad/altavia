import React, { useEffect, useState } from 'react';
import { Cylinder, CylinderForm, IntranetLayout, Modal, toast } from 'src/components';
import { Box, Button, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { PlusIcon } from 'src/common/icons';
import axios, { AxiosResponse } from 'axios';
import { useAsync } from 'src/common/hooks';
import { API_ROUTES } from 'src/common/consts';
import { IFluidValidationSchema } from 'src/models/fluids';
import CylinderDetail from 'src/components/control-fluid/CylinderDetail';

const fetcher = (path: string) => axios.get(path);
const postFluid = (path: string, data: any) => axios.post(path, { data });
const deleteClient = (path: string) => axios.delete(path);

export const ControlFluid = () => {
  // // tanque1: 8042, diametro: 237
  // // tanque2: 3303
  // const [volume, setVolume] = useState(150);
  // const [usedVolume, setUsedVolume] = useState(1800); // Volumen utilizado del cilindro en galones
  // const [usedVolume2, setUsedVolume2] = useState(2000); // Volumen utilizado del cilindro en galones

  // const handleVolumeChange = (newVolume: number) => {
  //   setVolume(newVolume);
  // };

  const [fluidList, setFluidList] = useState<IFluidValidationSchema[]>([]);
  const [fluidSelected, setFluidSelected] = useState<IFluidValidationSchema>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    run: runGetAllFluids,
    data: responseGet,
    isLoading,
    refetch,
  } = useAsync({ onSuccess: successGetFluid });
  const { run: runAddFluid, isLoading: addingFluid } = useAsync();
  const { run: runDeleteFluid, isLoading: deletingFluid } = useAsync();
  const { run: runEditFluid, isLoading: editingFluid } = useAsync();

  useEffect(() => {
    runGetAllFluids(fetcher(API_ROUTES.fluid), {
      refetch: () => runGetAllFluids(fetcher(API_ROUTES.fluid)),
      cacheKey: API_ROUTES.fluid,
    });
  }, []);

  function successGetFluid(response: AxiosResponse) {
    setFluidList(response.data);
  }


  // handlers
  const handleSelectFluid = (fluid: IFluidValidationSchema) => {
    setFluidSelected(fluid);
    onOpen();
  };
  const handleSave = (fluid: IFluidValidationSchema) => {
    if (fluidSelected) {
      // edit mode
      const path = `${API_ROUTES.fluid}/${fluidSelected._id}`
      runEditFluid(axios.put(path, fluid), {
        onSuccess: () => {
          toast.success("Tanque actualizado")
          refetch()
          onClose()
        }
      })
      return
    }

    runAddFluid(postFluid(API_ROUTES.fluid, fluid), {
      onSuccess: () => {
        toast.success("Tanque agregado")
        refetch()
        onClose()
      }
    })

  };

  // renders
  return (
    <IntranetLayout>
      <Flex flexDir="column" gap={5}>
        <Box width="100%" textAlign="right">
          <Button
            size="sm"
            width={{ base: '120px', md: '200px' }}
            fontSize={{ base: 10, md: 16 }}
            padding={{ base: '5px', md: '12px' }}
            colorScheme="blue"
            height="25px"
            gap={2}
            onClick={() => {
              onOpen()
              setFluidSelected(undefined)
            }}
          >
            <Text>Agregar Tanque</Text>
            <PlusIcon />
          </Button>
        </Box>
        <Flex
          alignItems="flex-end"
          justifyContent="center"
          flexWrap="wrap"
          gap={6}
        >
          {fluidList.map((fluid) => (
            <Cylinder
              key={fluid._id}
              fluid={fluid}
              onSelect={handleSelectFluid}
            />
          ))}
          {/* <Cylinder title="PEN Tanque #1" volume={8042} used={1899} />
          <Cylinder title="PEN Tanque #2" volume={3303} used={1500} />
          <Cylinder title="PEN Tanque #3" volume={3303} used={1500} />
          <Cylinder
            title="Aceite termico"
            volume={146}
            used={100}
            bgFluid="blue"
          />
          <Cylinder title="Info" volume={5612} used={1000} bgFluid="green" /> */}
        </Flex>
      </Flex>

      {/* fluid form modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        heading={fluidSelected ? 'Editar Tanque' : 'Añadir Tanque'}
        // footer={footer}
        hideCancelButton
      >
        <CylinderForm fluid={fluidSelected} onSave={handleSave} onClose={onClose}/>
      </Modal>
    </IntranetLayout>
  );
};

export default ControlFluid;
