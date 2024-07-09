import { Flex, Text } from '@chakra-ui/react';
import { PortalLayout } from 'src/components';
import { Concavo } from 'src/components/cubicar/Concavo';
import { Cuadrado } from 'src/components/cubicar/Cuadrado';
import { useState } from 'react';

interface CubicarProps {}
type TruckType = 'Concavo' | 'Cuadrado' | 'None';
const TruckComponent: Record<TruckType, JSX.Element> = {
  None: <Flex alignItems="center" justifyContent="center">Seleccione Tipo de volquete</Flex>,
  Concavo: <Concavo />,
  Cuadrado: <Cuadrado />,
};
const Cubicar = () => {
  const [truckType, setTruckType] = useState<TruckType>('None');
  return (
    <PortalLayout>
      <Flex
        w="100%"
        px={{ base: '20px', md: '100px' }}
        flexDir={{ base: 'column', md: 'row' }}
        gap={5}
      >
        <Flex flexDir="column" gap={5} width={{ base: '100%', md: '25%' }}>
          <Text fontSize={25} fontWeight={600} textAlign="start">
            Cubica tu Volquete
          </Text>
          <Flex
            gap={1}
            flexDir={{ base: 'row', md: 'column' }}
            justifyContent="space-between"
          >
            <Flex
              cursor="pointer"
              px={5}
              border={1}
              bgColor="whitesmoke"
              height={50}
              alignItems="center"
              justifyContent="center"
              fontWeight={600}
              onClick={() => setTruckType('Cuadrado')}
            >
              Cuadrado
            </Flex>
            <Flex
              cursor="pointer"
              fontWeight={600}
              px={5}
              border={1}
              bgColor="whitesmoke"
              height={50}
              alignItems="center"
              justifyContent="center"
              onClick={() => setTruckType('Concavo')}
            >
              Concavo
            </Flex>
          </Flex>
        </Flex>
        {TruckComponent[truckType]}
      </Flex>
    </PortalLayout>
  );
};

export default Cubicar;
