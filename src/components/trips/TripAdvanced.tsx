'use client';

import { Button, Flex } from '@chakra-ui/react';
import DateField from '../form/DateField';
import { InputField } from '../form';
import { useFormContext } from 'react-hook-form';
import { ITripSchemaValidation } from '@/models/trip';
import { useWhatsapp } from '@/common/hooks/useWhatsapp';
import { FormComboBox } from '../form/FormComboBox';
import { useMutate } from '@/common/hooks/useMutate';
import { API_ROUTES } from '@/common/consts';
import { toast } from '..';
import { useFetch } from '@/common/hooks/useFetch';

interface ITripAdvanced {
  trip: ITripSchemaValidation | null;
}

export const TripAdvanced = (props: ITripAdvanced) => {
  const { trip } = props;
  const { watch, setValue } = useFormContext();

  // API
  const { mutate: mutateTrip, isMutating } = useMutate(
    `${API_ROUTES.trips}/:id`,
    {
      urlParams: {
        id: trip?._id,
      },
    }
  );
  const { contacts, isLoadingContacts } = useWhatsapp({
    page: 'TripForm',
  });

  const notifications = watch('notifications') || 0;
  const tripForm = watch()
  // const income = watch('Income') ?? 0;
  // const payments = watch('payments') ?? [];

  const handleSelectWhatsAppNotification =
    (key: string) => (value: string[]) => {
      const notifications = trip?.notifications;

      setValue('notifications', {
        ...notifications,
        [key]: value,
      } as ITripSchemaValidation['notifications']);
    };

  const onUpdateTrip = () => {
    mutateTrip('PUT', tripForm, {
      onSuccess: () => {
        useFetch.mutate(API_ROUTES.trips);
        toast.success("Viaje actualizado")
      }
    })
  };

  return (
    <Flex w="100%" flexDir="column" gapY={4}>
      {/* deuda */}
      <Flex gap={2} w="100%">
        <DateField
          size="xs"
          name="paymentDueDate"
          label="Fecha de Vencimiento"
        />
        <InputField
          name="mapsUrl"
          label="Ubicación"
          placeholder="https://maps.app.goo.gl/..."
          size="xs"
        />
      </Flex>

      <FormComboBox
        controlled
        multiple
        showOptionSelected
        name="whatsAppAlerts"
        label="Notificar a:"
        placeholder="Escriba un grupo"
        options={
          contacts.map((x: any) => ({
            value: x.id,
            label: x.name ?? '',
          })) ?? []
        }
        value={notifications?.notifyDestination}
        loading={isLoadingContacts}
        onChange={handleSelectWhatsAppNotification('notifyDestination')}
      />
      <Flex>
        <Button size="xs" onClick={onUpdateTrip} loading={isMutating}>
          Guardar
        </Button>
      </Flex>
    </Flex>
  );
};
