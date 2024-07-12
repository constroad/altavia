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

type Metadata = {
  plate: string;
  totalWidth: string;
  totalLength: string;
  totalHeight: string;
};

interface ConcavoProps {
  onSave?: (metadata: Metadata) => void;
}

export const Concavo = (props: ConcavoProps) => {
  const [totalVolume, setTotalVolume] = useState<number>();
  const [wantVolume, setWantVolume] = useState<string>();
  const [heightDispatch, setHeightDispatch] = useState<string>();
  const [heightDispatchFromTop, setHeightDispatchFromTop] = useState<string>();
  const [values, setValues] = useState({
    totalWidth: '0',
    totalLength: '0',
    totalHeight: '0',
    concaveHight: '0',
    squareHeight: '0',
    leftConcaveWidth: '0',
    centralConcaveWidth: '0',
    rightConcaveWidth: '0',
  });

  const getVolumes = () => {
    const { totalWidth, totalLength, concaveHight, squareHeight, leftConcaveWidth, centralConcaveWidth } = values;
    const squareVolume = Number(totalWidth) * Number(totalLength) * Number(squareHeight);
    const semiSquareVolume = Number(concaveHight) * Number(centralConcaveWidth) * Number(totalLength);
    const semiCircleVolume =
      ((Number(concaveHight) * Number(leftConcaveWidth) * 3.1416) / 2) * Number(totalLength);

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
    const { totalHeight, concaveHight, squareHeight } = values;
    const { squareVolume, semiSquareVolume, semiCircleVolume } = getVolumes();
    const dispatchVolume = Number(wantVolume);

    const pendingVolume =
      dispatchVolume - (semiCircleVolume + semiSquareVolume);
    const heightToDispatch = ((pendingVolume * Number(squareHeight)) / squareVolume) + Number(concaveHight)
    setHeightDispatch(heightToDispatch.toFixed(2));
    setHeightDispatchFromTop((Number(totalHeight) - heightToDispatch).toFixed(2));
  };
  return (
    <>
      <Flex alignItems="center" justifyContent="center">
        <Image
          src="/img/cubicar/volquete-concavo.png"
          width={{ base: '70%', md: '80%' }}
          alt="volquete-logo"
          rounded="4px"
        />
      </Flex>
      <Flex flexDir="column" fontSize={12} gap={2} flex={1}>
        <Text fontWeight={600} fontSize={15}>
          Ingresar valores
        </Text>
        <Grid
          templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
          gap={3}
        >
          <GridItem>
            <Flex flexDir="column" gap={0}>
              <FormControl as={Flex} alignItems="center">
                <FormLabel fontSize="inherit" width="200px">
                  A1 (Ancho)
                </FormLabel>
                <NumberInput
                  size="xs"
                  name="cantidadCubos"
                  value={values.totalWidth}
                  onChange={(value) =>
                    setValues({
                      ...values,
                      totalWidth: value ?? '0',
                    })
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl as={Flex} alignItems="center">
                <FormLabel fontSize="inherit" width="200px">
                  A2 (Largo)
                </FormLabel>
                <NumberInput
                  size="xs"
                  name="cantidadCubos"
                  value={values.totalLength}
                  onChange={(value) =>
                    setValues({
                      ...values,
                      totalLength: value ?? '0',
                    })
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl as={Flex} alignItems="center">
                <FormLabel fontSize="inherit" width="200px">
                  A3 (Alto total)
                </FormLabel>
                <NumberInput
                  size="xs"
                  name="cantidadCubos"
                  value={values.totalHeight}
                  onChange={(value) =>
                    setValues({
                      ...values,
                      totalHeight: value ?? '0',
                    })
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl as={Flex} alignItems="center">
                <FormLabel fontSize="inherit" width="200px">
                  A4 (Alto concavo)
                </FormLabel>
                <NumberInput
                  size="xs"
                  name="cantidadCubos"
                  value={values.concaveHight}
                  onChange={(value) =>
                    setValues({
                      ...values,
                      concaveHight: value ?? '0',
                    })
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl as={Flex} alignItems="center">
                <FormLabel fontSize="inherit" width="200px">
                  A5 (Alto cuadrado)
                </FormLabel>
                <NumberInput
                  size="xs"
                  name="cantidadCubos"
                  value={values.squareHeight}
                  onChange={(value) =>
                    setValues({
                      ...values,
                      squareHeight: value ?? '0',
                    })
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl as={Flex} alignItems="center">
                <FormLabel fontSize="inherit" width="200px">
                  B1 (Ancho 1 concavo)
                </FormLabel>
                <NumberInput
                  size="xs"
                  name="cantidadCubos"
                  value={values.leftConcaveWidth}
                  onChange={(value) =>
                    setValues({
                      ...values,
                      leftConcaveWidth: value ?? '0',
                    })
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl as={Flex} alignItems="center">
                <FormLabel fontSize="inherit" width="200px">
                  B2 (Ancho 2 concavo)
                </FormLabel>
                <NumberInput
                  size="xs"
                  name="cantidadCubos"
                  value={values.centralConcaveWidth}
                  onChange={(value) =>
                    setValues({
                      ...values,
                      centralConcaveWidth: value ?? '0',
                    })
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl as={Flex} alignItems="center">
                <FormLabel fontSize="inherit" width="200px">
                  B3 (Ancho 3 concavo)
                </FormLabel>
                <NumberInput
                  size="xs"
                  name="cantidadCubos"
                  value={values.rightConcaveWidth}
                  onChange={(value) =>
                    setValues({
                      ...values,
                      rightConcaveWidth: value ?? '0',
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
                Volquete cubica {totalVolume?.toFixed(1)} m3
              </Flex>
            )}
          </GridItem>
          <GridItem>
            <Flex
              alignItems="center"
              justifyContent="space-between"
              height="100%"
              flexDir="column"
            >
              {totalVolume && (
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
                    size="sm"
                    colorScheme="yellow"
                    onClick={handleComputeWantTo}
                  >
                    Calcular
                  </Button>
                </Flex>
              )}
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
                      <Text>----------------------</Text>
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
            </Flex>
          </GridItem>
        </Grid>
      </Flex>
    </>
  );
};
