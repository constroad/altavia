import { IDriverSchemaValidation } from '@/models/driver'
import { IVehicleSchemaValidation } from '@/models/vehicle';
import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

interface IDriverPopover {
  drivers?: IDriverSchemaValidation[];
  vehicles?: IVehicleSchemaValidation[];
}

export const DriverPopover = (props: IDriverPopover) => {
  const { drivers = [], vehicles = [] } = props;

  if (!Array.isArray(drivers) || !Array.isArray(vehicles)) return null;

  return (
    <Flex flexDir='column' fontWeight='light' fontSize={10} lineHeight='14px' gapY={2.5}>
      {drivers.length > 0 && (
        <Box>
          <Text mb='3px' fontWeight={600}>Conductor(es):</Text>
          {drivers.map((x, index) => (
            <Flex key={index} flexDir='column' gap={0.3} mb='8px'>
              <Flex w='100%'> 
                <Text minW='70px'>Nombre:</Text>
                <Text>{x?.name ?? '-'}</Text>
              </Flex>
              <Flex w='100%'> 
                <Text minW='70px'>DNI:</Text>
                <Text>{x?.dni ?? '-'}</Text>
              </Flex>
              <Flex w='100%'> 
                <Text minW='70px'>Licencia:</Text>
                <Text>{x?.licenseNumber ?? '-'}</Text>
              </Flex>
            </Flex>
          ))}
        </Box>
      )}
      {vehicles.length > 0 && (
        <Box>
          <Text mb='3px' fontWeight={600}>Vehículo(s):</Text>
          {vehicles.map((x, index) => (
            <Flex key={index} flexDir='column' gap={0.3} mb='8px'>
              <Flex w='100%'> 
                <Text minW='70px'>Placa:</Text>
                <Text>{x?.plate ?? '-'}</Text>
              </Flex>
              <Flex w='100%'> 
                <Text minW='70px'>Marca:</Text>
                <Text>{x?.brand ?? '-'}</Text>
              </Flex>
              <Flex w='100%'> 
                <Text minW='70px'>TUCE:</Text>
                <Text>{x?.tuce ?? '-'}</Text>
              </Flex>
            </Flex>
          ))}
        </Box>
      )}
    </Flex>
  );
};
