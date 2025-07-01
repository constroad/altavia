'use client';

import { Button, Flex, VStack } from '@chakra-ui/react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputField } from '../form';
import { useEffect } from 'react';
import { useMutate } from 'src/common/hooks/useMutate';
import { API_ROUTES } from 'src/common/consts';
import { toast } from '../Toast';
import { IVehicleSchemaValidation, vehicleSchemaValidation } from '@/models/vehicle';
import { useFieldArray } from 'react-hook-form';
import { Input, IconButton } from '@chakra-ui/react';
import { FiPlus, FiTrash } from 'react-icons/fi';

interface VehicleFormProps {
  vehicle?: IVehicleSchemaValidation;
  closeModal: () => void;
}

export const VehicleForm = (props: VehicleFormProps) => {
  const { vehicle } = props;

  const methods = useForm<IVehicleSchemaValidation>({
    resolver: zodResolver(vehicleSchemaValidation),
    defaultValues: vehicle,
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "maintenanceLogs",
  });

  const {
    formState: { errors },
  } = methods;

  // API
  const { mutate: createVehicle, isMutating: creatingVehicle } = useMutate(
    API_ROUTES.vehicles
  );
  const { mutate: updateVehicle, isMutating: updatingVehicle } = useMutate(
    `${API_ROUTES.vehicles}/:id`,
    {
      urlParams: { id: vehicle?._id ?? '' },
    }
  );

  useEffect(() => {
    if (vehicle) {
      methods.reset(vehicle);
    }
  }, [vehicle, methods]);

  const onSubmit = (data: IVehicleSchemaValidation) => {
    if (props.vehicle?._id) {
      //edit
      updateVehicle('PUT', data, {
        onSuccess: () => {
          toast.success('El vehículo se actualizó correctamente');
          props.closeModal();
        },
        onError: (err) => {
          toast.error('Error al actualizar el cliente');
          console.log(err);
        },
      });
      return;
    }
    // create
    createVehicle('POST', data, {
      onSuccess: () => {
        toast.success('El vehículo se registro correctamente');
        props.closeModal();
      },
      onError: (err) => {
        toast.error('Error al registrar el nuevo vehículo');
        console.log(err);
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <VStack spaceY={2}>
          <InputField name="plate" label="Placa" isRequired />
          <InputField name="brand" label="Marca" />
          <InputField name="modelVehicle" label="Modelo" />
          <InputField name="year" label="Año de fab." type='number' isRequired />
          <InputField name="soatExpiry" label="Soat expira" type='date' />
          <InputField name="inspectionExpiry" label="Revisión Tec. expira" type='date' />

          <VStack w="100%" align="start" spaceY={2}>
            <Flex justify="space-between" w="100%" align="center">
              <b>Mantenimientos</b>
              <Button
                size="xs"
                onClick={() =>
                  append({
                    date: new Date(), // ← Esto sí es un Date válido
                    description: '',
                  })
                }
              >
                <FiPlus style={{ marginRight: '4px' }} />
                Añadir
              </Button>
            </Flex>

            {fields.map((field, index) => (
              <Flex key={field.id} w="100%" gap={2} align="end">
                <InputField
                  name={`maintenanceLogs.${index}.date`}
                  type="date"
                  label="Fecha"
                />
                <InputField
                  name={`maintenanceLogs.${index}.description`}
                  label="Descripción"
                />
                <Button
                  onClick={() => remove(index)}
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                >
                  <FiTrash />
                </Button>
              </Flex>
            ))}
          </VStack>

          <InputField name="km" label="Kilometraje" type='number' />

          <Flex w='100%' justifyContent='end' gap={2} mt='10px'>
            <Button
              colorPalette='danger'
              variant='outline'
              onClick={props.closeModal}
              size='sm'
            >
              Cancelar
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              loading={vehicle?._id ? updatingVehicle : creatingVehicle }
              size='sm'
            >
              Guardar
            </Button>
          </Flex>
        </VStack>
      </form>
    </FormProvider>
  );
};
