import { Box, Flex, Text } from '@chakra-ui/react';

interface CylinderDetailProps {
  title: string;
  volume: number;
  used: number;
  cm: number;
}

const CylinderDetail = (props: CylinderDetailProps) => {
  const { volume, used, cm, title } = props;
  return (
    <Flex flexDir="column" gap={3}>
      <Box as={Flex} alignItems="center" justifyContent="center">
        <Text fontWeight="bold">{title}</Text>
      </Box>
      <Box>
        <Box as={Flex}>
          <Text>Capacidad:</Text>
          <Text>{volume} galones</Text>
        </Box>
        <Box as={Flex}>
          <Text>Medida:</Text>
          <Text>{cm} cm</Text>
        </Box>
        <Box as={Flex}>
          <Text>Stock:</Text>
          <Text>{used} galones</Text>
        </Box>
      </Box>
    </Flex>
  );
};

export default CylinderDetail;
