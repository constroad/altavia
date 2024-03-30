import React, { useState } from 'react';
import {
  Cylinder,
  IntranetLayout,
} from 'src/components';
import { Flex } from '@chakra-ui/react';

export const ControHighwayPage = () => {
  // tanque1: 8042, diametro: 237
  // tanque2: 3303
  const [volume, setVolume] = useState(150);
  const [usedVolume, setUsedVolume] = useState(1800); // Volumen utilizado del cilindro en galones
  const [usedVolume2, setUsedVolume2] = useState(2000); // Volumen utilizado del cilindro en galones

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };
  return (
    <IntranetLayout>
      <Flex alignItems="flex-end" justifyContent="center" flexWrap="wrap" gap={6}>
        <Cylinder title="PEN Tanque #1" volume={8042} used={usedVolume} />
        <Cylinder title="PEN Tanque #2" volume={3303} used={usedVolume2} />
        <Cylinder title="PEN Tanque #3" volume={3303} used={usedVolume2} />
        <Cylinder title="Aceite termico" volume={146} used={100} bgFluid='blue' />
        <Cylinder title="Info" volume={5612} used={1000} bgFluid='green' />
      </Flex>
    </IntranetLayout>
  );
};

export default ControHighwayPage;
