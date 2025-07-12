'use client';
import { FormProvider, useForm } from 'react-hook-form';
import { Flex, Grid, GridItem, Button } from '@chakra-ui/react';
import {
  ITripSchemaValidation,
  TripSchemaValidation,
  TripStatus,
} from 'src/models/trip';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormTextarea, InputField, SelectField } from '../form';

import { useUbigeos } from '@/common/hooks/useUbigeos';

import { useFetch } from '@/common/hooks/useFetch';
import { API_ROUTES, APP_ROUTES } from '@/common/consts';
import { useMutate } from '@/common/hooks/useMutate';
import { DrawerComponent, toast } from 'src/components';
import { useRouter } from 'next/navigation';
import DateField from '../form/DateField';
import { TripAdvanced } from './TripAdvanced';
import { IconWrapper } from '../IconWrapper/IconWrapper';
import { MoneyIcon } from '@/common/icons';
import { PopOver } from '../ui/popover';
import { RouteCostSummary } from '../routeCost/routeCostSummary';
import { FormComboBox } from '../form/FormComboBox';

type ITripForm = {
  trip: ITripSchemaValidation | null;
  formMethods: ReturnType<typeof useForm<ITripSchemaValidation>>;
  onSavingChange?: (saving: boolean) => void;
  openAdvance: boolean;
  setOpenAdvance: (open: boolean) => void;
};

export default function TripForm(props: Readonly<ITripForm>) {
  const { trip, onSavingChange, openAdvance, setOpenAdvance } = props;
  const router = useRouter();
  const { regions } = useUbigeos();

  const { mutate: mutateTrip } = useMutate(API_ROUTES.trips);
  const methods = props.formMethods

  const { watch } = methods;
  const origin = watch('origin');
  const destination = watch('destination');

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

  const { data: routeCostData } = useFetch(API_ROUTES.routeCost, {
    queryParams: {
      origin,
      destination,
    },
    enabled: !!destination
  })

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

  const routeCost =
    routeCostData?.reduce?.((acc: any, curr: any) => curr.amount + acc, 0) ?? 0;

  const onSubmit = (form: ITripSchemaValidation) => {
    onSavingChange?.(true);
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
    } finally {
      onSavingChange?.(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        id="form-trip-id"
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
      >
        <Grid templateColumns="repeat(3, 1fr)" gap="2">
          {/* CLIENTES */}

          <GridItem>
            <FormComboBox
              isRequired
              name="client"
              label="Cliente"
              options={(clients ?? []).map((x: any) => ({
                label: x.name,
                value: x._id,
              }))}
              loading={isLoadingClients}
            />
          </GridItem>
          <GridItem>
            <DateField
              size="xs"
              name="startDate"
              label="Fecha Viaje"
              isRequired
            />
          </GridItem>
          <GridItem>
            <InputField
              type="number"
              size="xs"
              name="Income"
              label="Monto"
              isRequired
            />
          </GridItem>
          {/* ORIGEN - DESTINO */}
          <GridItem>
            <SelectField
              isRequired
              size="xs"
              name="origin"
              label="Origen"
              options={regionsArr}
            />
          </GridItem>
          <GridItem>
            <Flex gap={1} alignItems="end">
              <SelectField
                isRequired
                size="xs"
                name="destination"
                label={`Destino S/.(${routeCost})`}
                options={regionsArr}
              />
              <PopOver
                content={
                  <RouteCostSummary origin={origin} destination={destination} />
                }
              >
                <Button size="xs" disabled={!destination}>
                  <IconWrapper icon={MoneyIcon} size="10px" />
                </Button>
              </PopOver>
            </Flex>
          </GridItem>
          <GridItem>
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
          </GridItem>

          {/* VEHICLE - KM */}
          <GridItem>
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
          </GridItem>
          <GridItem>
            <InputField
              type="number"
              name="kmTravelled"
              label={'Km. recorrido'}
              isRequired
              size={'xs'}
            />
          </GridItem>
          <GridItem>
            <SelectField
              name="status"
              label="Estado"
              options={statusArr}
              size={'xs'}
            />
          </GridItem>

          <GridItem>
            <FormTextarea name="notes" label="Notas" />
          </GridItem>
        </Grid>

        {trip && (
          <DrawerComponent
            title='Avanzados'
            open={openAdvance}
            onChangeOpen={(e) => setOpenAdvance(e.open)}
          >
            <TripAdvanced trip={trip} />
          </DrawerComponent>
        )}

      </form>

    </FormProvider>
  );
}
