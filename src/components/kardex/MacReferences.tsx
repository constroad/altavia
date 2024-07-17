import { Flex, Grid, GridItem, Text } from '@chakra-ui/react';
interface MacReferencesProps {}

export const MacReferences = () => {
  return (
    <Flex flexDir="column" fontSize={10} gap={5}>
      <Text fontSize={15} fontWeight={700}>
        Referencias MAC
      </Text>
      <Grid templateColumns="repeat(2, 1fr)" gap={2}>
        <GridItem>
          <Text fontSize={12} fontWeight={700}>
            MAC1
          </Text>
          <ul>
            <li>- 10% piedra USO 5/7</li>
            <li>- 40% piedra USO 6/7 (Quispe o carloncho)</li>
            <li>- 30% arena primaria (crushing)</li>
            <li>- 20% arena secundaria (global)</li>
          </ul>
        </GridItem>
        <GridItem>
          <Text fontSize={12} fontWeight={700}>
            MAC2
          </Text>
          <ul>
            <li>- 40% piedra USO 6/7  (Quispe o carloncho)</li>
            <li>- 36% arena primaria (crushing)</li>
            <li>- 24% arena secundaria (global)</li>
          </ul>
        </GridItem>
        <GridItem>
          <Text fontSize={12} fontWeight={700}>
            MAC3
          </Text>
          <ul>
            <li>- 40% confitillo</li>
            <li>- 38% arena primaria (crushing)</li>
            <li>- 22% arena secundaria (global)</li>
          </ul>
        </GridItem>
      </Grid>
    </Flex>
  );
};
