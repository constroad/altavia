import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Image,
  Input,
  NumberInput,
  NumberInputField,
  Text,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { ITransportValidationSchema } from 'src/models/transport';

export type SquareMetadata = {
  plate: string;
  m3: number;
  totalWidth: string;
  totalLength: string;
  totalHeight: string;
};
interface CuadradoProps {
  onSave?: (metadata: SquareMetadata) => void;
  transport?: ITransportValidationSchema;
}

export const Cuadrado = (props: CuadradoProps) => {
  const [totalVolume, setTotalVolume] = useState<number>();
  const [wantVolume, setWantVolume] = useState<string>();
  const [heightDispatch, setHeightDispatch] = useState<string>();
  const [heightDispatchFromTop, setHeightDispatchFromTop] = useState<string>();
  const [values, setValues] = useState<SquareMetadata>({
    plate: '',
    m3: 0,
    totalWidth: '0',
    totalLength: '0',
    totalHeight: '0',
  });

  useEffect(() => {
    const { plate, m3, metadata } = props.transport ?? {};
    const { totalWidth, totalLength, totalHeight } = metadata ?? {};
    if (props.transport) {
      setValues({
        plate: plate ?? '',
        m3: m3 ?? 0,
        totalWidth,
        totalLength,
        totalHeight,
      });
    }
  }, [props.transport]);

  const handleComputeResult = () => {
    const { totalWidth, totalLength, totalHeight } = values;
    const volume =
      Number(totalWidth) * Number(totalLength) * Number(totalHeight);
    if (volume === 0) {
      return;
    }
    setValues({ ...values, m3: volume });
    setTotalVolume(volume);
  };

  const handleComputeWantTo = () => {
    if (!totalVolume) return;
    const { totalHeight } = values;
    const altura = (Number(wantVolume) * Number(totalHeight)) / totalVolume;
    setHeightDispatch(altura.toFixed(2));
    setHeightDispatchFromTop((Number(totalHeight) - altura).toFixed(2));
  };

  return (
    <Flex flexDir={{ base: 'column', md: 'row' }} gap={5}>
      <Flex flexDir="column" bgColor="white" rounded={10} px={2} py={5}>
        <Flex alignItems="center" justifyContent="center">
          <Image
            src="/img/cubicar/volquete-cuadrado.png"
            width={{ base: '70%', md: '40%' }}
            alt="volquete-logo"
            rounded="4px"
          />
        </Flex>
        <Flex flexDir="column" fontSize={12} flex={1} gap={2}>
          <Text fontWeight={600} fontSize={15}>
            Ingresar valores
          </Text>
          <Grid templateColumns="repeat(3, 1fr)" gap={3}>
            <GridItem colSpan={3}>
              <FormControl as={Flex} flexDir="column" alignItems="start">
                <Input
                  placeholder="Placa"
                  value={values.plate}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      plate: e.target.value.toUpperCase(),
                    })
                  }
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl as={Flex} flexDir="column" alignItems="start">
                <FormLabel fontSize="inherit">A1 (Ancho)</FormLabel>
                <NumberInput
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
            </GridItem>
            <GridItem>
              <FormControl as={Flex} flexDir="column" alignItems="start">
                <FormLabel fontSize="inherit">A2 (Largo)</FormLabel>
                <NumberInput
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
            </GridItem>
            <GridItem>
              <FormControl as={Flex} flexDir="column" alignItems="start">
                <FormLabel fontSize="inherit">A3 (alto)</FormLabel>
                <NumberInput
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
            </GridItem>
          </Grid>

          <Flex alignItems="center" justifyContent="center" gap={2}>
            <Button size="sm" width="100%" onClick={handleComputeResult}>
              Cubicar
            </Button>
            <Button
              size="sm"
              width="100%"
              onClick={() => props.onSave?.(values)}
              colorScheme="yellow"
            >
              Guardar transporte
            </Button>
          </Flex>
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
        </Flex>
      </Flex>

      <Flex
        flexDir="column"
        bgColor="white"
        rounded={10}
        px={2}
        py={3}
        alignItems="start"
        gap={4}
      >
        {totalVolume && (
          <>
            <Text fontSize={15} fontWeight={600}>
              Calcular cubicaje
            </Text>
            <Flex width="100%" alignItems="center" gap={2} py={1}>
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
              <Button size="sm" onClick={handleComputeWantTo}>
                Calcular
              </Button>
            </Flex>

            {heightDispatch && (
              <Box position="relative" width="100%" textAlign="center">
                <Box position="absolute" top="50px" width="100%">
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
                    <Text>-----------------------</Text>
                    {heightDispatch}cm
                  </Flex>
                </Box>
              </Box>
            )}
            <Flex width="100%" justifyContent="center" alignItems="center">
              <Image
                src="/img/cubicar/volquete-cuadrado-result.png"
                width="70%"
                alt="volquete-logo"
              />
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  );
};
