import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Image,
  NumberInput,
  NumberInputField,
  Text,
} from '@chakra-ui/react';
import { values } from 'lodash';
import { useState } from 'react';

interface CuadradoProps {}

export const Cuadrado = () => {
  const [totalVolume, setTotalVolume] = useState<number>();
  const [wantVolume, setWantVolume] = useState<string>();
  const [heightDispatch, setHeightDispatch] = useState<string>();
  const [heightDispatchFromTop, setHeightDispatchFromTop] = useState<string>();
  const [values, setValues] = useState({
    width: '0',
    length: '0',
    height: '0',
  });

  const handleComputeResult = () => {
    const { width, length, height } = values;
    const volumen = Number(width) * Number(length) * Number(height);
    setTotalVolume(volumen);
  };

  const handleComputeWantTo = () => {
    if (!totalVolume) return;
    const { height } = values;
    const altura = (Number(wantVolume) * Number(height)) / totalVolume;
    setHeightDispatch(altura.toFixed(2));
    setHeightDispatchFromTop((Number(height) - altura).toFixed(2));
  };

  return (
    <>
      <Flex alignItems="center" justifyContent="center">
        <Image
          src="/img/cubicar/volquete-cuadrado.png"
          width={{ base: '70%', md: '50%' }}
          alt="volquete-logo"
          rounded="4px"
        />
      </Flex>
      <Flex flexDir="column" fontSize={12} gap={2} flex={1}>
        <Text fontWeight={600} fontSize={15}>
          Ingresar valores
        </Text>
        <Grid
          templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
          gap={3}
        >
          <GridItem>
            <Flex flexDir="column" gap={0}>
              <FormControl as={Flex} alignItems="center">
                <FormLabel fontSize="inherit" width="120px">
                  A1 (Ancho)
                </FormLabel>
                <NumberInput
                  size="xs"
                  name="cantidadCubos"
                  value={values.width}
                  onChange={(value) =>
                    setValues({
                      ...values,
                      width: value ?? '0',
                    })
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl as={Flex} alignItems="center">
                <FormLabel fontSize="inherit" width="120px">
                  A2 (Largo)
                </FormLabel>
                <NumberInput
                  size="xs"
                  name="cantidadCubos"
                  value={values.length}
                  onChange={(value) =>
                    setValues({
                      ...values,
                      length: value ?? '0',
                    })
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl as={Flex} alignItems="center">
                <FormLabel fontSize="inherit" width="120px">
                  A3 (alto)
                </FormLabel>
                <NumberInput
                  size="xs"
                  name="cantidadCubos"
                  value={values.height}
                  onChange={(value) =>
                    setValues({
                      ...values,
                      height: value ?? '0',
                    })
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
            </Flex>

            <Button size="sm" width="100%" onClick={handleComputeResult}>
              Cubicar
            </Button>
          </GridItem>
          <GridItem>
            {totalVolume && (
              <Flex
                fontWeight={600}
                fontSize={15}
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                color="red"
              >
                Volquete cubica {totalVolume?.toFixed(2)} m3
              </Flex>
            )}
          </GridItem>
          <GridItem colSpan={{ base: 2, md: 1 }}>
            <Flex alignItems="center" height="100%" flexDir="column" gap={1}>
              {totalVolume && (
                <>
                  <Flex
                    bgColor="whitesmoke"
                    width="100%"
                    alignItems="center"
                    justifyContent="center"
                    gap={2}
                    py={1}
                  >
                    <Text fontWeight={600}>Quiero</Text>
                    <NumberInput
                      size="xs"
                      name="cantidadCubos"
                      defaultValue={0}
                      width="60px"
                      value={wantVolume ?? '0'}
                      onChange={(value) => setWantVolume(value)}
                    >
                      <NumberInputField />
                    </NumberInput>
                    <Text>m3</Text>
                    <Button
                      colorScheme="yellow"
                      size="sm"
                      onClick={handleComputeWantTo}
                    >
                      Calcular
                    </Button>
                  </Flex>

                  {heightDispatch && (
                    <Box position="relative" width="100%" textAlign="center">
                      <Box position="absolute" top="30px" width="100%">
                        <Flex
                          fontWeight={600}
                          fontSize={15}
                          alignItems="center"
                          justifyContent="center"
                          width="100%"
                          flexDir="column"
                          lineHeight={1}
                        >
                          {heightDispatchFromTop}cm
                          <Text>-------------------------</Text>
                          {heightDispatch}cm
                        </Flex>
                      </Box>
                    </Box>
                  )}
                  <Image
                    src="/img/cubicar/volquete-cuadrado-result.png"
                    width="70%"
                    alt="volquete-logo"
                  />
                </>
              )}
            </Flex>
          </GridItem>
        </Grid>
      </Flex>
    </>
  );
};
