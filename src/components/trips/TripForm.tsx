'use client';
import { FormProvider, useForm } from 'react-hook-form';
import { Button, VStack, HStack, Flex } from '@chakra-ui/react';
import { ITripSchemaValidation, TripSchemaValidation } from 'src/models/trip';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormTextarea, InputField, SelectField } from '../form';

import { useUbigeos } from '@/common/hooks/useUbigeos';

import { useFetch } from '@/common/hooks/useFetch';
import { API_ROUTES, APP_ROUTES } from '@/common/consts';
import { useMutate } from '@/common/hooks/useMutate';
import { toast } from 'src/components';
import { useRouter } from 'next/navigation';

type ITripForm = {
  trip: ITripSchemaValidation | null;
};

export default function TripForm(props: Readonly<ITripForm>) {
  const { trip } = props;
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

  const { mutate: mutateTrip, isMutating } = useMutate(API_ROUTES.trips);

  const { regions } = useUbigeos();

  const methods = useForm<ITripSchemaValidation>({
    resolver: zodResolver(TripSchemaValidation),
    defaultValues: {
      ...(trip ?? {}),
      startDate: trip?.startDate?.split?.('T')[0] ?? '',
    },
  });

  const statusArr = [
    { label: 'Pendiente', value: 'Pending' },
    { label: 'En Ruta', value: 'InProgress' },
    { label: 'Completado', value: 'Completed' },
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
          requestUrl: `${API_ROUTES.trips}/${_id}`,
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

  return (
    <FormProvider {...methods}>
      <form
        id="form-trip-id"
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
      >
        <VStack gap={2} w="100%" mt="10px">
          {/* CLIENTES */}
          <Flex gap={4} w="100%" alignItems="center">
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
            <InputField
              type="date"
              name="startDate"
              label="Fecha inicio"
              size={'xs'}
              isRequired
            />

            <InputField
              type="number"
              size="xs"
              name="Income"
              label="Monto"
              isRequired
            />
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
                isRequired
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
                isRequired
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
          {/* <HStack gap={4} w="100%">
            <Flex w="100%" gap={4}>
              <InputField
                type="date"
                name="endDate"
                label="Fecha fin"
                size={'xs'}
              />
            </Flex>
          </HStack> */}

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
                <FormTextarea name="notes" label="Notas" />
            </Flex>
          </HStack>          
        </VStack>
      </form>
    </FormProvider>
  );
}
