import {
  Grid,
  GridItem,
  Box,
  Button,
  Flex,
  Select,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import {
  IFluidValidationSchema,
  fluidValidationSchema,
} from 'src/models/fluids';
import { FormInput, FormTextarea } from '../form';
import {
  ACEITE_TERMICO,
  GHASOL,
  PEN_01,
  PEN_02,
} from 'src/common/cylinderTableReference';

interface FormProps {
  fluid?: IFluidValidationSchema;
  isLoading?: boolean;
  onClose: () => void;
  onSave: (fluid: IFluidValidationSchema) => void;
  onDelete?: (fluid: IFluidValidationSchema) => void;
}

export const CylinderForm = (props: FormProps) => {
  const { fluid, isLoading } = props;
  const [validationError, setValidationError] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [volume, setVolume] = useState(0);
  const [volumeInStock, setVolumeInStock] = useState(0);
  const [levelCentimeter, setLevelCentimeter] = useState(0);
  const [tableReference, setTableReference] = useState('');
  const [bgColor, setBgColor] = useState('');

  useEffect(() => {
    if (fluid) {
      setName(fluid.name);
      setDescription(fluid.description ?? '');
      setVolume(fluid.volume);
      setVolumeInStock(fluid.volumeInStock);
      setLevelCentimeter(fluid.levelCentimeter);
      setTableReference(fluid.tableReference);
      setBgColor(fluid.bgColor ?? '');
    }
  }, [fluid]);

  const handleSubmit = () => {
    setValidationError('');
    const payload: IFluidValidationSchema = {
      name,
      description,
      volume,
      volumeInStock,
      levelCentimeter,
      tableReference,
      bgColor,
    };
    const result = fluidValidationSchema.safeParse(payload);
    if (!result.success) {
      setValidationError('Revisar valores obligatorios');
      return;
    }
    props.onSave(payload);
  };

  const handleChangeCentimeter = (e: any) => {
    const centimeters = e.target.value as string;
    const centimetersToGetVolumen = Number(centimeters).toString()
    const inStock = getVolumeInStock(tableReference, centimetersToGetVolumen);
    setLevelCentimeter(Number(centimeters));
    setVolumeInStock(inStock);
  };

  const getVolumeInStock = (ref: string, cent: string) => {
    let inStock = 0;
    // console.log('getVolumeInStock', { ref, cent });
    if (ref === 'PEN_01') {
      // @ts-ignore
      inStock = PEN_01[cent] || 0;
    }
    if (ref === 'PEN_02') {
      // @ts-ignore
      inStock = PEN_02[cent] || 0;
    }
    if (ref === 'GHASOL') {
      // @ts-ignore
      inStock = GHASOL[cent] || 0;
    }
    if (ref === 'ACEITE_TERMICO') {
      // @ts-ignore
      inStock = ACEITE_TERMICO[cent] || 0;
    }

    return inStock;
  };

  const handleChangeType = (e: any) => {
    const type = e.target.value;
    const inStock = getVolumeInStock(type, levelCentimeter.toString());

    setTableReference(type);
    setVolumeInStock(inStock);
  };

  return (
    <Box as={Flex} flexDir="column" gap={2}>
      <Grid
        templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)' }}
        gap={2}
      >
        <GridItem colSpan={2}>
          <FormInput
            id="fluid-name"
            label="Nombre"
            value={name}
            placeholder="Nombre de Tanque"
            onChange={(e) => setName(e.target.value)}
            required
          />
          <FormTextarea
            id="fluid-description"
            label="Descripcion"
            value={description}
            placeholder="Descripcion"
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </GridItem>
        <GridItem colSpan={1}>
          <FormLabel fontSize="small">Seleccione Tipo</FormLabel>
          <Select
            placeholder="Tipo"
            size="xs"
            required
            onChange={handleChangeType}
            value={tableReference}
          >
            <option value="PEN_01">Pen 01</option>
            <option value="PEN_02">Pen 02</option>
            <option value="PEN_02">Pen 03</option>
            <option value="GHASOL">Ghasol</option>
            <option value="ACEITE_TERMICO">Aceite Termico</option>
          </Select>
        </GridItem>
        <GridItem colSpan={1}>
          <FormLabel fontSize="small">Volumen</FormLabel>
          <NumberInput
            defaultValue={15}
            min={0}
            max={8500}
            size="xs"
            value={volume}
            isDisabled={fluid !== undefined}
          >
            <NumberInputField
              onChange={(e) => setVolume(Number(e.target.value))}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </GridItem>
        <GridItem colSpan={1}>
          <FormLabel fontSize="small">Nivel en centimetros (enteros)</FormLabel>
          <NumberInput
            defaultValue={0}
            precision={2}
            step={0.2}
            size="xs"
            value={levelCentimeter}
          >
            <NumberInputField onChange={handleChangeCentimeter} />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </GridItem>
        <GridItem colSpan={1}>
          <FormInput
            id="fluid-volumeInStock"
            label="Stock"
            value={volumeInStock}
            placeholder="Galones en stock"
            onChange={(e) => setVolumeInStock(Number(e.target.value))}
            disabled
            required
          />
        </GridItem>
        <GridItem colSpan={1}>
          <FormInput
            id="fluid-bgColor"
            label="Color"
            value={bgColor}
            placeholder="Color del tanque"
            onChange={(e) => setBgColor(e.target.value)}
            required
          />
        </GridItem>
      </Grid>
      <Flex gap={2} justifyContent="space-between">
        <Box flex={1}>
          {validationError && (
            <Text color="red" fontSize="small">
              ** Revisar valores obligatorios
            </Text>
          )}
        </Box>
        <Flex gap={2}>
          <Button
            isLoading={isLoading}
            autoFocus
            form="add-or-edit-client-form"
            colorScheme="blue"
            size="sm"
            type="submit"
            onClick={handleSubmit}
          >
            {fluid ? 'Actualizar' : 'Guardar'}
          </Button>
          <Button
            form="add-or-edit-client-form"
            colorScheme="gray"
            size="sm"
            onClick={props.onClose}
          >
            Cancel
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};
