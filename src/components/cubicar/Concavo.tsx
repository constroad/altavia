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
  Input,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { ITransportValidationSchema } from 'src/models/transport';
import { toast } from '../Toast';

export type ConcaveMetadata = {
  plate: string;
  m3: number;
  totalWidth: string;
  totalLength: string;
  totalHeight: string;
  //concave
  concaveHight: string;
  squareHeight: string;
  leftConcaveWidth: string;
  centralConcaveWidth: string;
  rightConcaveWidth: string;
};

interface ConcavoProps {
  isLoading?: boolean;
  onSave?: (metadata: ConcaveMetadata) => void;
  transport?: ITransportValidationSchema;
}

export const Concavo = (props: ConcavoProps) => {
  const [totalVolume, setTotalVolume] = useState<number>();
  const [wantVolume, setWantVolume] = useState<string>();
  const [heightDispatch, setHeightDispatch] = useState<string>();
  const [heightDispatchFromTop, setHeightDispatchFromTop] = useState<string>();
  const [values, setValues] = useState<ConcaveMetadata>({
    plate: '',
    m3: 0,
    totalWidth: '0',
    totalLength: '0',
    totalHeight: '0',
    concaveHight: '0',
    squareHeight: '0',
    leftConcaveWidth: '0',
    centralConcaveWidth: '0',
    rightConcaveWidth: '0',
  });

  useEffect(() => {
    const { plate, m3, metadata } = props.transport ?? {};
    const {
      totalWidth,
      totalLength,
      totalHeight,
      concaveHight,
      squareHeight,
      leftConcaveWidth,
      centralConcaveWidth,
      rightConcaveWidth,
    } = metadata ?? {};
    if (props.transport) {
      setValues({
        totalWidth,
        totalLength,
        totalHeight,
        concaveHight,
        squareHeight,
        leftConcaveWidth,
        centralConcaveWidth,
        rightConcaveWidth,
        plate: plate ?? '',
        m3: m3 ?? 0,
      });
    }
  }, [props.transport]);

  const getVolumes = () => {
    const {
      totalWidth,
      totalLength,
      concaveHight,
      squareHeight,
      leftConcaveWidth,
      centralConcaveWidth,
    } = values;
    const squareVolume =
      Number(totalWidth) * Number(totalLength) * Number(squareHeight);
    const semiSquareVolume =
      Number(concaveHight) * Number(centralConcaveWidth) * Number(totalLength);
    const semiCircleVolume =
      ((Number(concaveHight) * Number(leftConcaveWidth) * 3.1416) / 2) *
      Number(totalLength);

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
    const heightToDispatch =
      (pendingVolume * Number(squareHeight)) / squareVolume +
      Number(concaveHight);
    setHeightDispatch(heightToDispatch.toFixed(2));
    setHeightDispatchFromTop(
      (Number(totalHeight) - heightToDispatch).toFixed(2)
    );
  };
  return (
    <Flex flexDir={{ base: 'column', md: 'row' }} gap={5}>
      <Flex flexDir="column" bgColor="white" rounded={10} px={2} py={5}>
        <Flex alignItems="center" justifyContent="center">
          <Image
            src="/img/cubicar/volquete-concavo.png"
            width={{ base: '70%', md: '30%' }}
            alt="volquete-logo"
            rounded="4px"
          />
        </Flex>

        <Flex flexDir="column" fontSize={12} gap={2} flex={1}>
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
            </GridItem>
            <GridItem>
              <FormControl as={Flex} flexDir="column" alignItems="start">
                <FormLabel fontSize="inherit">A2 (Largo)</FormLabel>
                <NumberInput
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
            </GridItem>
            <GridItem>
              <FormControl as={Flex} flexDir="column" alignItems="start">
                <FormLabel fontSize="inherit">A3 (Alto)</FormLabel>
                <NumberInput
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
            </GridItem>
            <GridItem>
              <FormControl as={Flex} flexDir="column" alignItems="start">
                <FormLabel fontSize="inherit">A4 (Alto concavo)</FormLabel>
                <NumberInput
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
            </GridItem>
            <GridItem>
              <FormControl as={Flex} flexDir="column" alignItems="start">
                <FormLabel fontSize="inherit">A5 (Alto cuadrado)</FormLabel>
                <NumberInput
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
            </GridItem>
            <GridItem>
              <FormControl as={Flex} flexDir="column" alignItems="start">
                <FormLabel fontSize="inherit">B1 (Ancho 1 concavo)</FormLabel>
                <NumberInput
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
            </GridItem>
            <GridItem>
              <FormControl as={Flex} flexDir="column" alignItems="start">
                <FormLabel fontSize="inherit">B2 (Ancho 2 concavo)</FormLabel>
                <NumberInput
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
            </GridItem>
            <GridItem>
              <FormControl as={Flex} flexDir="column" alignItems="start">
                <FormLabel fontSize="inherit">B3 (Ancho 3 concavo)</FormLabel>
                <NumberInput
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
            </GridItem>
          </Grid>

          <Flex alignItems="center" justifyContent="center" gap={2}>
            <Button size="sm" width="100%" onClick={handleComputeResult}>
              Cubicar
            </Button>
            <Button
              isLoading={props.isLoading}
              size="sm"
              width="100%"
              onClick={() => {
                if (!totalVolume) {
                  toast.error('No has cubicado aun la unidad');
                  return;
                }
                props.onSave?.({ ...values, m3: totalVolume });
              }}
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
              Volquete cubica {totalVolume?.toFixed(1)} m3
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
                    <Text>----------------------</Text>
                    {heightDispatch}cm
                  </Flex>
                </Box>
              </Box>
            )}
            <Flex width="100%" justifyContent="center" alignItems="center">
              <Image
                src="/img/cubicar/volquete-concavo-result.png"
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
