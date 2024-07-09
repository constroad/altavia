import { Box, Image, Flex, Text } from '@chakra-ui/react';
import { PortalLayout } from 'src/components';

interface CubicarProps {}

const Cubicar = () => {
  return (
    <PortalLayout>
      <Flex
        w="100%"
        px={{ base: '20px', md: '100px' }}
        flexDir={{ base: 'column', md: 'row' }}
        gap={5}
        // justifyContent="space-between"
      >
        <Flex
          flexDir="column"
          gap={5}
          width={{ base: '100%', md: '30%' }}
        >
          <Text fontSize={25} fontWeight={600} textAlign="center">
            Seleccione Tipo de Volquete
          </Text>
          <Flex
            gap={1}
            flexDir={{ base: 'row', md: 'column' }}
            justifyContent="space-between"
          >
            <Flex
              px={5}
              border={1}
              bgColor="whitesmoke"
              height={50}
              alignItems="center"
              justifyContent="center"
              fontWeight={600}
            >
              Cuadrado
            </Flex>
            <Flex
              fontWeight={600}
              px={5}
              border={1}
              bgColor="whitesmoke"
              height={50}
              alignItems="center"
              justifyContent="center"
            >
              Concavo
            </Flex>
          </Flex>
        </Flex>
        <Flex
          flexDir={{ base: 'column', md: 'row' }}
          alignItems="start"
          bgColor="green"
          // justifyContent="center"
        >
          <Image
            src="/img/cubicar/volquete-concavo.png"
            width="40%"
            alt="volquete-logo"
            rounded="4px"
          />
          <Flex width={300}>sss</Flex>
        </Flex>
      </Flex>
    </PortalLayout>
  );
};

export default Cubicar;
