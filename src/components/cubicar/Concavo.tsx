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
  Box,
} from '@chakra-ui/react';
import { useState } from 'react';

interface ConcavoProps {}

export const Concavo = () => {
  const [totalVolume, setTotalVolume] = useState<number>();
  const [wantVolume, setWantVolume] = useState<string>();
  const [heightDispatch, setHeightDispatch] = useState<string>();
  const [heightDispatchFromTop, setHeightDispatchFromTop] = useState<string>();
  const [values, setValues] = useState({
    a1: '0',
    a2: '0',
    a3: '0',
    a4: '0',
    a5: '0',
    b1: '0',
    b2: '0',
    b3: '0',
  });

  const getVolumes = () => {
    const { a1, a2, a3, a4, a5, b1, b2, b3 } = values;
    const squareVolume = Number(a1) * Number(a2) * Number(a5);
    const semiSquareVolume = Number(a4) * Number(b2) * Number(a2);
    const semiCircleVolume =
      ((Number(a4) * Number(b1) * 3.1416) / 2) * Number(a2);

    return {
      squareVolume,
      semiSquareVolume,
      semiCircleVolume,
    };
  };
  const handleComputeResult = () => {
    const { squareVolume, semiSquareVolume, semiCircleVolume } = getVolumes();
    const total = squareVolume + semiSquareVolume + semiCircleVolume;
    setTotalVolume(total);
  };

  const handleComputeWantTo = () => {
    const { a1, a2, a3, a4 } = values;
    const { squareVolume, semiSquareVolume, semiCircleVolume } = getVolumes();
    const dispatchVolume = Number(wantVolume);
    const pendingVolume =
      dispatchVolume - (semiCircleVolume + semiSquareVolume);
    const result = pendingVolume / (Number(a2) * Number(a1)) + Number(a4);
    setHeightDispatch(result.toFixed(1));
    setHeightDispatchFromTop((Number(a3) - result).toFixed(2));
  };
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
              <FormControl as={Flex} alignItems="center">
                <FormLabel fontSize="inherit" width="20px">
                  A4
                </FormLabel>
                <NumberInput
                  size="xs"
                  name="cantidadCubos"
                  value={values.a4}
                  onChange={(value) =>
                    setValues({
                      ...values,
                      a4: value ?? '0',
                    })
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl as={Flex} alignItems="center">
                <FormLabel fontSize="inherit" width="20px">
                  A5
                </FormLabel>
                <NumberInput
                  size="xs"
                  name="cantidadCubos"
                  value={values.a5}
                  onChange={(value) =>
                    setValues({
                      ...values,
                      a5: value ?? '0',
                    })
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
            </Flex>
            <Flex flexDir="column">
              <FormControl as={Flex} alignItems="center">
                <FormLabel fontSize="inherit" width="20px">
                  B1
                </FormLabel>
                <NumberInput
                  size="xs"
                  name="cantidadCubos"
                  value={values.b1}
                  onChange={(value) =>
                    setValues({
                      ...values,
                      b1: value ?? '0',
                    })
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl as={Flex} alignItems="center">
                <FormLabel fontSize="inherit" width="20px">
                  B2
                </FormLabel>
                <NumberInput
                  size="xs"
                  name="cantidadCubos"
                  value={values.b2}
                  onChange={(value) =>
                    setValues({
                      ...values,
                      b2: value ?? '0',
                    })
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl as={Flex} alignItems="center">
                <FormLabel fontSize="inherit" width="20px">
                  B3
                </FormLabel>
                <NumberInput
                  size="xs"
                  name="cantidadCubos"
                  value={values.b3}
                  onChange={(value) =>
                    setValues({
                      ...values,
                      b3: value ?? '0',
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
                src="/img/cubicar/volquete-concavo-result.png"
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
                    value={wantVolume ?? "0"}
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
