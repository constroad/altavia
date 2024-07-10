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
    a1: '0',
    a2: '0',
    a3: '0',
  });

  const handleComputeResult = () => {
    const { a1, a2, a3 } = values
    const volumen = Number(a1) * Number(a2) * Number(a3);
    setTotalVolume(volumen)
  }

  const handleComputeWantTo =() => {
    if (!totalVolume) return
    const { a1, a3 } = values;
    const altura = (Number(wantVolume) / totalVolume) * Number(a1);
    setHeightDispatch(altura.toFixed(2));
    setHeightDispatchFromTop((Number(a1) - altura).toFixed(2));
  }

  return (
    <>
      <Flex alignItems="center">
        <Image
          src="/img/cubicar/volquete-cuadrado.png"
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
        </Flex>
      </Flex>
      <Flex flexDir="column" fontSize={12} gap={2} flex={1}>
        <Text fontWeight={600} fontSize={15}>
          Ingresar valores
        </Text>
        <Grid templateColumns="repeat(3, 1fr)" gap={3}>
          <GridItem>
            <Flex flexDir="column" gap={0}>
              <FormControl as={Flex} alignItems="center">
                <FormLabel fontSize="inherit" width="20px">
                  A1
                </FormLabel>
                <NumberInput
                  size="xs"
                  name="cantidadCubos"
                  value={values.a1}
                  onChange={(value) =>
                    setValues({
                      ...values,
                      a1: value ?? '0',
                    })
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl as={Flex} alignItems="center">
                <FormLabel fontSize="inherit" width="20px">
                  A2
                </FormLabel>
                <NumberInput
                  size="xs"
                  name="cantidadCubos"
                  value={values.a2}
                  onChange={(value) =>
                    setValues({
                      ...values,
                      a2: value ?? '0',
                    })
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl as={Flex} alignItems="center">
                <FormLabel fontSize="inherit" width="20px">
                  A3
                </FormLabel>
                <NumberInput
                  size="xs"
                  name="cantidadCubos"
                  value={values.a3}
                  onChange={(value) =>
                    setValues({
                      ...values,
                      a3: value ?? '0',
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
          <GridItem colSpan={2}>
            <Flex
              alignItems="center"
              justifyContent="space-between"
              height="100%"
              flexDir="column"
            >
              {totalVolume && (
                <Flex
                  fontWeight={600}
                  fontSize={16}
                  alignItems="center"
                  justifyContent="center"
                  textAlign="center"
                  width="60%"
                  color="red"
                >
                  Volquete cubica {totalVolume?.toFixed(1)} m3
                </Flex>
              )}
              {heightDispatch && (
                <Box position="relative" width="100%" textAlign="center">
                  <Box position="absolute" top="20px" width="100%">
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
                      <Text>---------------</Text>
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
              {totalVolume && (
                <Flex
                  width="100%"
                  alignItems="center"
                  justifyContent="end"
                  gap={2}
                >
                  <Text>Quiero</Text>
                  <NumberInput
                    size="xs"
                    name="cantidadCubos"
                    defaultValue={0}
                    width="50%"
                    value={wantVolume ?? '0'}
                    onChange={(value) => setWantVolume(value)}
                  >
                    <NumberInputField />
                  </NumberInput>
                  <Text>m3</Text>
                  <Button size="sm" onClick={handleComputeWantTo}>
                    Calcular
                  </Button>
                </Flex>
              )}
            </Flex>
          </GridItem>
        </Grid>
      </Flex>
    </>
  );
};
