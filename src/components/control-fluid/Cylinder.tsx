import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import CylinderDetail from './CylinderDetail';
import { IFluidValidationSchema } from 'src/models/fluids';

interface CylinderProps {
  fluid: IFluidValidationSchema;
  onSelect: (fluid: IFluidValidationSchema) => void
}

const getCylinderHeight = (volume: number) => {
  if (volume >= 8000) return 150;
  if (volume >= 3000 && volume < 8000) return 75;
  if (volume < 3000) return 40;

  return 40;
};

// 8000 galons => 150 px
// 3303 galons => 150 px
// const CYLINDER_HEIGHT = 150
const CYLINDER_FACTOR = 53;
const MAX_GALLONS_CYLINDER = 8042;
const MAX_CYLINDER_HEIGHT = 150;
const BG_FLUID = 'yellowgreen';
export const Cylinder = (props: CylinderProps) => {
  const { fluid } = props;
  const { name, volume, volumeInStock, levelCentimeter, bgColor } = fluid;
  // const { isOpen, onOpen, onClose } = useDisclosure();

  const cylinderHeight = getCylinderHeight(volume);
  const usedPercent = (volumeInStock * 100) / volume;
  const usedHeight = cylinderHeight * (usedPercent / 100);

  return (
    <>
      <Flex
        flexDir="column"
        alignItems="center"
        onClick={() => props.onSelect(fluid)}
        cursor="pointer"
      >
        <Tooltip
          label={
            <CylinderDetail
              title={name}
              volume={volume}
              used={volumeInStock}
              cm={levelCentimeter}
            />
          }
        >
          <Box position="relative" width="fit-content">
            <Box
              bgColor={bgColor ?? BG_FLUID}
              position="absolute"
              bottom={0}
              width="60%"
              height={`${usedHeight}px`}
              opacity={0.6}
              left="20%"
              rounded={3}
            />
            <img
              src={'/img/cylinder/cylinder.png'}
              alt="cylinder"
              style={{
                height: cylinderHeight,
                width: 200,
              }}
            />
          </Box>
        </Tooltip>
        <Box position="absolute" fontSize="10px" color="white">
          <Text>stock:{volumeInStock.toFixed(2)} gls</Text>
        </Box>
        <Text color="gray" fontSize="small">
          {name.toUpperCase()}
        </Text>
      </Flex>

      {/* <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tanque Detalle</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CylinderDetail title={name} volume={volume} used={volumeInStock} cm={levelCentimeter} />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}
    </>
  );
};
