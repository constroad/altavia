'use client';
import { FormProvider, useForm } from 'react-hook-form';
import {
  Box,
  Button,
  VStack,
  HStack,
  Field,
  Textarea,
  Flex,
  Icon,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { ITripSchemaValidation, TripSchemaValidation } from 'src/models/trip';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormTextarea, InputField, SelectField } from '../form';
import { UploadButton } from '../upload/UploadButton';
import { ArrowLeftIcon } from 'src/common/icons';
import { useScreenSize } from 'src/common/hooks';
import { useFieldArray } from 'react-hook-form';
import { useState } from 'react';
import { ExpenseModal } from './ExpenseModal';
import { v4 as uuidv4 } from 'uuid'; // asegúrate de tener 'uuid' instalado
import { useUbigeos } from '@/common/hooks/useUbigeos';
import { IconWrapper } from '../IconWrapper/IconWrapper';
import { PageLayout } from '../layout/Dashboard/PageLayout';
import { useFetch } from '@/common/hooks/useFetch';
import { API_ROUTES, APP_ROUTES } from '@/common/consts';
import { useMutate } from '@/common/hooks/useMutate';
import { toast } from 'src/components';
import { useRouter } from 'next/navigation';
import { IExpenseSchema } from '@/models/generalExpense';

type ITripForm = {
  trip: ITripSchemaValidation | null;
  onCancel: () => void;
};

export default function TripForm(props: Readonly<ITripForm>) {
  const { onCancel, trip } = props;

  const { open, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  // API
  const { data: drivers, isLoading: isLoadingDrivers } = useFetch(
    API_ROUTES.drivers
  );
  const { data: vehicles, isLoading: isLoadingVehicles } = useFetch(
    API_ROUTES.vehicles
  );
  const { data: clients, isLoading: isLoadingClients } = useFetch(
    API_ROUTES.clients
  );
  const { data: expenses, isLoading: isLoadingExpenses, refetch: refetchExpenses } = useFetch<
    IExpenseSchema[]
  >(API_ROUTES.expenses, {
    queryParams: {
      tripId: trip?._id,
    },
    enabled: !!trip?._id,
  });
  const { mutate: mutateTrip, isMutating } = useMutate(API_ROUTES.trips);
  const { mutate: mutateExpense } = useMutate(API_ROUTES.expenses);

  const { regions } = useUbigeos();

  const methods = useForm<ITripSchemaValidation>({
    resolver: zodResolver(TripSchemaValidation),
    defaultValues: trip ?? {},
  });

  const {
    watch,
    formState: { errors },
  } = methods;

  const values = watch();
  console.log('values:', values);

  const statusArr = [
    { label: 'Pendiente', value: 'Pending' },
    { label: 'En Ruta', value: 'InProgress' },
    { label: 'Eliminado', value: 'Deleted' },
    { label: 'Eliminado', value: 'Deleted' },
  ];
  const regionsArr = regions.map((r) => ({
    label: r,
    value: r,
  }));

  const onSubmit = (form: ITripSchemaValidation) => {
    try {
      const { _id, ...rest } = form;
      const payload = {
        ...rest,
      };

      //Update
      if (_id) {
        mutateTrip('PUT', payload, {
          requestUrl: `${API_ROUTES.expenses}/${_id}`,
          onSuccess: () => {
            toast.success('Viaje Actualizado');
            useFetch.mutate(API_ROUTES.trips);
          },
        });
        return;
      }

      //Save
      mutateTrip('POST', payload, {
        onSuccess: (response) => {
          toast.success('Viaje registrado');
          useFetch.mutate(API_ROUTES.trips);
          router.push(`${APP_ROUTES.trips}/${response._id}`);
        },
      });
    } catch (error) {
      console.log(error);
      toast.error('Error al registrar viaje');
    }
  };

  const handleDeleteExpense = (expense: IExpenseSchema) => {
    mutateExpense(
      'DELETE',
      {},
      {
        requestUrl: `${API_ROUTES.expenses}/${expense._id}`,
        onSuccess: () => {
          toast.success('Gasto eliminado');
          refetchExpenses();
        },
      }
    );
  };

  return (
    <PageLayout title="Nuevo Viaje" onBack={onClose}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
          <VStack gap={2} w="100%" mt="10px">
            {/* CLIENTES */}
            <Flex w="100%" justifyContent="space-between">
              <SelectField
                loading={isLoadingClients}
                isRequired
                size="xs"
                name="client"
                label="Cliente"
                options={(clients ?? []).map((x: any) => ({
                  label: x.name,
                  value: x._id,
                }))}
              />
              <Button
                type="submit"
                colorScheme="primary"
                w="fit-content"
                size="xs"
                loading={isMutating}
              >
                Guardar
              </Button>
            </Flex>

            {/* ORIGEN - DESTINO */}
            <HStack gap={4} w="100%">
              <Flex w="100%" gap={4}>
                <SelectField
                  isRequired
                  size="xs"
                  name="origin"
                  label="Origen"
                  options={regionsArr}
                />
                <SelectField
                  isRequired
                  size="xs"
                  name="destination"
                  label="Destino"
                  options={regionsArr}
                />
              </Flex>
            </HStack>

            {/* VEHICLE - DRIVER */}
            <HStack gap={4} w="100%">
              <Flex w="100%" gap={4}>
                <SelectField
                  name="vehicle"
                  label="Vehículo"
                  options={(vehicles ?? []).map((x: any) => ({
                    label: x.plate,
                    value: x._id,
                  }))}
                  multiple
                  size="xs"
                  loading={isLoadingVehicles}
                />
                <SelectField
                  name="driver"
                  label="Conductor"
                  options={(drivers ?? []).map((x: any) => ({
                    label: x.name,
                    value: x._id,
                  }))}
                  multiple
                  size="xs"
                  loading={isLoadingDrivers}
                />
              </Flex>
            </HStack>

            {/* START DATE - END DATE */}
            <HStack gap={4} w="100%">
              <Flex w="100%" gap={4}>
                <InputField
                  type="date"
                  name="startDate"
                  label="Fecha inicio"
                  size={'xs'}
                  isRequired
                />
                <InputField
                  type="date"
                  name="endDate"
                  label="Fecha fin"
                  size={'xs'}
                />
              </Flex>
            </HStack>

            {/* GANANCIA - KILOMETRAJE */}
            {/* <Flex w="100%" gap={4}>
              <Flex w="50%">
                <InputField
                  type="number"
                  name="revenue"
                  label="Ganancia"
                  isRequired
                   size={'xs'}
                />
              </Flex>
              <Flex w="50%">
                <InputField
                  type="number"
                  name="kmTravelled"
                  label={isMobile ? 'Km. recorrido' : 'Kilometraje recorrido'}
                  isRequired
                   size={'xs'}
                />
              </Flex>
            </Flex> */}

            {/* STATUS - FECHA DE PAGO */}
            <HStack gap={4} w="100%">
              <Flex w="100%" gap={4}>
                <Flex w="50%">
                  <SelectField
                    name="status"
                    label="Estado"
                    options={statusArr}
                    size={{ base: 'xs', md: 'sm' }}
                  />
                </Flex>
                {/* <Flex w="50%">
                  <InputField
                    type="date"
                    name="paymentDueDate"
                    label="Fecha de pago"
                    size={{ base: 'xs', md: 'sm' }}
                  />
                </Flex> */}
              </Flex>
            </HStack>

            {/* NOTAS */}
            <Flex w="100%">
              <FormTextarea name="notes" label="Notas" />
            </Flex>

            {/* BOTÓN AGREGAR GASTO */}
            <Flex w="100%" justifyContent="start">
              <Button size="sm" colorScheme="blue" onClick={onOpen}>
                Agregar gasto
              </Button>
            </Flex>

            <VStack align="start" w="100%">
              <Text fontWeight="bold">Gastos agregados</Text>
              <Flex w="100%" gap="10px">
                {expenses?.map((item, index) => (
                  <Flex
                    key={item._id}
                    rounded="4px"
                    p="3px"
                    border="1px solid"
                    flexDir="column"
                  >
                    <Text>{item.description}</Text>
                    <Text>S/ {item.amount}</Text>

                    {/* {expenseMedias[item.expenseId]?.map((file, i) => (
                    <Box key={i} display="inline-block" position="relative" mr={2} mt={2}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`preview-${i}`}
                        width="60"
                        height="40"
                        style={{ borderRadius: '6px', objectFit: 'cover' }}
                      />
                    </Box>
                  ))} */}

                    <Button size="xs" mt='5px' onClick={() => handleDeleteExpense(item)}>Eliminar</Button>
                  </Flex>
                ))}
              </Flex>
            </VStack>
          </VStack>
        </form>

        <ExpenseModal
          resourceId={trip?._id!}
          open={open}
          onClose={() => {
            onClose()
            refetchExpenses()
          }}     
        />
      </FormProvider>
    </PageLayout>
  );
}
