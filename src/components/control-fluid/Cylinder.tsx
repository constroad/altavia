import {
  Box,
  Flex,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import React from 'react';
import CylinderDetail from './CylinderDetail';
import { IFluidValidationSchema } from 'src/models/fluids';

interface CylinderProps {
  fluid: IFluidValidationSchema;
  onSelect: (fluid: IFluidValidationSchema) => void
}

const getCylinderHeight = (volume: number) => {
  if (volume >= 8000) return 250;
  if (volume >= 3000 && volume < 8000) return 125;
  if (volume < 3000) return 80;

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
  const { name, volume: volumeOriginal, volumeInStock: volumeInStockOriginal, levelCentimeter, bgColor } = fluid;

  const volume = volumeOriginal - 106

  const volumeInStock = () => {
    if (name === 'PEN #2' || name === 'PEN #3') {
      if (volumeInStockOriginal > 683) return volumeInStockOriginal
      else if (volumeInStockOriginal > 416) return volumeInStockOriginal - 106
      else if (volumeInStockOriginal > 192) return volumeInStockOriginal - 60
      else if (volumeInStockOriginal > 33) return volumeInStockOriginal - 20
      else  return volumeInStockOriginal

    } else return volumeInStockOriginal
  }

  const cylinderHeight = getCylinderHeight(volume);
  const usedPercent = (volumeInStock() * 100) / volume;
  const usedHeight = cylinderHeight * (usedPercent / 100);

  const unusedMaterial =
    name === 'PEN #1' ? '21cm' :
    name === 'PEN #2' ? '13cm' :
    name === 'PEN #3' ? '13cm' :
    name === 'GASOHOL' ? '50cm' :
    name === 'ACEITE TÉRMICO' ? '0cm' : '0cm'

  const unusedGalons =
    name === 'PEN #1' ? 363 :
    name === 'PEN #2' ? 123 :
    name === 'PEN #3' ? 123 :
    name === 'GASOHOL' ? 1130 :
    name === 'ACEITE TÉRMICO' ? 0 : 0

  const availableGalons = volumeInStock() - unusedGalons

  const cubes =
    name.includes('PEN') ? +(availableGalons/24).toFixed(2) :
    name === 'GASOHOL' ? +(availableGalons/2).toFixed(2) :
    +availableGalons.toFixed(2)

  return (
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
              used={volumeInStock()}
              cm={levelCentimeter}
            />
          }
        >
          <Box position="relative" width="fit-content">
            <Box
              bgColor={bgColor || BG_FLUID}
              position="absolute"
              bottom={0}
              width="60%"
              height={`${usedHeight}px`}
              opacity={0.8}
              left="20%"
              rounded={3}
            />
            <img
              src={'/img/cylinder/cylinder.png'}
              alt="cylinder"
              style={{
                height: cylinderHeight,
                width: 250,
              }}
            />
          </Box>
        </Tooltip>
        <Box position="absolute" fontSize="10px" color="white" top="10px" fontWeight={600}>
          <Text>stock:{volumeInStock().toFixed(2)} gls</Text>
          <Text>No sale ({unusedMaterial}): {unusedGalons} gls</Text>
          <Text fontWeight={900}>Para producir:{availableGalons.toFixed(2)} gls</Text>
          {name !== 'ACEITE TÉRMICO' && (
            <Text fontWeight={900}>Cubos:{cubes < 0 ? 0 : cubes} gls</Text>
          )}
          <Text fontWeight={900}>nivel:{levelCentimeter}cm</Text>
        </Box>
        <Text color="gray" fontSize="small">
          {name.toUpperCase()}
        </Text>
      </Flex>
  );
};
