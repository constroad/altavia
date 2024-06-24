import React, { useEffect, useState } from 'react';
import {
  Cylinder,
  CylinderForm,
  IntranetLayout,
  Modal,
  PenCalculator,
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
import { CalculatorIcon, PlusIcon } from 'src/common/icons';
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
  const { isOpen: isOpenCalculator, onOpen: onOpenCalculator, onClose: onCloseCalculator } = useDisclosure();
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

  const handleOpenCalculator = () => {
    onOpenCalculator()
  }

  const penToProduce = fluidList.reduce((accumulator, item) => {
    if (item.name === 'PEN #1') {
      // 363gl no salen por la altura de la llave - 50gl por tubos de calentamiento
      accumulator += item.volumeInStock - (363 + 50)

    } else if (item.name === 'PEN #2') {
      // 121gl no salen por la altura de la llave - 50gl no salen por tubos de calentamiento
      if (item.volumeInStock > 683) accumulator += item.volumeInStock - (121)
      else if (item.volumeInStock > 416) accumulator += item.volumeInStock  - (50 + 121)
      else if (item.volumeInStock > 192) accumulator += item.volumeInStock - (30 + 121)
      else if (item.volumeInStock > 33) accumulator += item.volumeInStock - (10 + 121)

    } else if (item.name === 'PEN #3') {
      // 121gl no salen por la altura de la llave - 106gl no salen por tubos de calentamiento
      if (item.volumeInStock > 683) accumulator += item.volumeInStock - (123)
      else if (item.volumeInStock > 416) accumulator += item.volumeInStock  - (106 + 123)
      else if (item.volumeInStock > 192) accumulator += item.volumeInStock - (60 + 123)
      else if (item.volumeInStock > 33) accumulator += item.volumeInStock - (20 + 123)
    }
    return accumulator;
  }, 0);
  
  const penInStock = fluidList.reduce((accumulator, item) => {
    if (item.name === 'PEN #1') {
      accumulator += item.volumeInStock
    } else if (item.name === 'PEN #2' || item.name === 'PEN #3') {
      accumulator += item.volumeInStock
    }
    return accumulator
  }, 0);


  if (isLoading) {
    return <Spinner />;
  }

  // renders
  return (
    <IntranetLayout>
      <Flex flexDir="column" gap={5}>
        <Flex width="100%" justifyContent='right' gap='4px'>
          <Button
            size="sm"
            width={{ base: '80px', md: '200px' }}
            fontSize={{ base: 10, md: 16 }}
            padding={{ base: '5px', md: '12px' }}
            colorScheme="blue"
            height={{base: "25px", md: "30px"}}
            gap={2}
            onClick={handleOpenCalculator}
          >
            <Text>Calcular</Text>
            <CalculatorIcon/>
          </Button>
          <Button
            size="sm"
            width={{ base: '120px', md: '200px' }}
            fontSize={{ base: 10, md: 16 }}
            padding={{ base: '5px', md: '12px' }}
            colorScheme="blue"
            height={{base: "25px", md: "30px"}}
            gap={2}
            onClick={() => {
              onOpen();
              setFluidSelected(undefined);
            }}
          >
            <Text>Agregar Tanque</Text>
            <PlusIcon />
          </Button>
        </Flex>
        <Grid templateColumns={{base: "repeat(1, 1fr)", md: "repeat(4, 1fr)"}} gap={6} alignItems="flex-end" as={Flex}>
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

      {/* calculator */}
      <Modal
        isOpen={isOpenCalculator}
        onClose={onCloseCalculator}
        heading='Calculadora de PEN'
        hideCancelButton
      >
        <PenCalculator penInStock={penInStock} penToProduce={penToProduce} />
      </Modal>
    </IntranetLayout>
  );
};

export default ControlFluid;
