import React, { useEffect, useState } from 'react';
import {
  Cylinder,
  CylinderForm,
  IntranetLayout,
  Modal,
  toast,
} from 'src/components';
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { PlusIcon } from 'src/common/icons';
import axios, { AxiosResponse } from 'axios';
import { useAsync } from 'src/common/hooks';
import { API_ROUTES } from 'src/common/consts';
import { IFluidValidationSchema } from 'src/models/fluids';

const fetcher = (path: string) => axios.get(path);
const postFluid = (path: string, data: any) => axios.post(path, { data });
const deleteClient = (path: string) => axios.delete(path);

export const ControlFluid = () => {
  const [fluidList, setFluidList] = useState<IFluidValidationSchema[]>([]);
  const [fluidSelected, setFluidSelected] = useState<IFluidValidationSchema>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    run: runGetAllFluids,
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
      const path = `${API_ROUTES.fluid}/${fluidSelected._id}`;
      runEditFluid(axios.put(path, fluid), {
        onSuccess: () => {
          toast.success('Tanque actualizado');
          refetch();
          onClose();
        },
      });
      return;
    }

    runAddFluid(postFluid(API_ROUTES.fluid, fluid), {
      onSuccess: () => {
        toast.success('Tanque agregado');
        refetch();
        onClose();
      },
    });
  };

  if (isLoading) {
    return <Spinner />;
  }

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
              onOpen();
              setFluidSelected(undefined);
            }}
          >
            <Text>Agregar Tanque</Text>
            <PlusIcon />
          </Button>
        </Box>
        <Grid templateColumns={{base: "repeat(2, 1fr)", md: "repeat(4, 1fr)"}} gap={6} alignItems="flex-end" as={Flex}>
          {fluidList.map((fluid) => (
            <GridItem key={fluid._id} w="100%" h="fit-content" position="relative">
              <Cylinder                
                fluid={fluid}
                onSelect={handleSelectFluid}
              />
            </GridItem>
          ))}
        </Grid>

      </Flex>

      {/* fluid form modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        heading={fluidSelected ? 'Editar Tanque' : 'Añadir Tanque'}
        hideCancelButton
      >
        <CylinderForm
          isLoading={addingFluid || editingFluid}
          fluid={fluidSelected}
          onSave={handleSave}
          onClose={onClose}
        />
      </Modal>
    </IntranetLayout>
  );
};

export default ControlFluid;
