import {
  Flex,
  Image,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Text,
  Button,
  Grid,
  GridItem,
} from '@chakra-ui/react';

interface ConcavoProps {}

export const Concavo = () => {
  return (
    <>
      <Flex alignItems="center">
        <Image
          src="/img/cubicar/volquete-concavo.png"
          width={{ base: '70%', md: '50%' }}
          alt="volquete-logo"
          rounded="4px"
        />
        <Flex flexDir="column" fontSize={13}>
          <Flex gap={1}>
            <Text fontWeight={600}>A1</Text> Ancho
          </Flex>
          <Flex gap={1}>
            <Text fontWeight={600}>A2</Text> Largo
          </Flex>
          <Flex gap={1}>
            <Text fontWeight={600}>A3</Text> Alto Total
          </Flex>
          <Flex gap={1}>
            <Text fontWeight={600}>A4</Text> Alto Concavo
          </Flex>
          <Flex gap={1}>
            <Text fontWeight={600}>A5</Text> Alto Cuadrado
          </Flex>
          <Flex gap={1}>
            <Text fontWeight={600}>B1</Text> Ancho 1 concavo
          </Flex>
          <Flex gap={1}>
            <Text fontWeight={600}>B2</Text> Ancho 2 concavo
          </Flex>
          <Flex gap={1}>
            <Text fontWeight={600}>B3</Text> Ancho 3 concavo
          </Flex>
        </Flex>
      </Flex>
      <Flex flexDir="column" fontSize={12} gap={2} flex={1}>
        <Text fontWeight={600} fontSize={15}>
          Ingresar valores
        </Text>
        <Grid templateColumns="repeat(2, 1fr)" gap={3}>
          <GridItem>
            <Flex flexDir="column" gap={0}>
              <FormControl as={Flex} alignItems="center">
                <FormLabel fontSize="inherit" width="20px">
                  A1
                </FormLabel>
                <NumberInput size="xs" name="cantidadCubos" width={20}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl as={Flex} alignItems="center">
                <FormLabel fontSize="inherit" width="20px">
                  A2
                </FormLabel>
                <NumberInput size="xs" name="cantidadCubos" width={20}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl as={Flex} alignItems="center">
                <FormLabel fontSize="inherit" width="20px">
                  A3
                </FormLabel>
                <NumberInput size="xs" name="cantidadCubos" width={20}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl as={Flex} alignItems="center">
                <FormLabel fontSize="inherit" width="20px">
                  A4
                </FormLabel>
                <NumberInput size="xs" name="cantidadCubos" width={20}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl as={Flex} alignItems="center">
                <FormLabel fontSize="inherit" width="20px">
                  A5
                </FormLabel>
                <NumberInput size="xs" name="cantidadCubos" width={20}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>
            </Flex>
            <Flex flexDir="column">
              <FormControl as={Flex} alignItems="center">
                <FormLabel fontSize="inherit" width="20px">
                  B1
                </FormLabel>
                <NumberInput size="xs" name="cantidadCubos" width={20}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl as={Flex} alignItems="center">
                <FormLabel fontSize="inherit" width="20px">
                  B2
                </FormLabel>
                <NumberInput size="xs" name="cantidadCubos" width={20}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl as={Flex} alignItems="center">
                <FormLabel fontSize="inherit" width="20px">
                  B3
                </FormLabel>
                <NumberInput size="xs" name="cantidadCubos" width={20}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>
            </Flex>
            <Button size="sm" width="100%">
              Calcular
            </Button>
          </GridItem>
          <GridItem>
            <Flex alignItems="center" justifyContent="center" height="100%">
              <Text fontWeight={600} fontSize={20} >cubica 23 m3</Text>
            </Flex>
          </GridItem>
        </Grid>
      </Flex>
    </>
  );
};
