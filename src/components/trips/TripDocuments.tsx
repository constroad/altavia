import { ALTAVIA_BOT, API_ROUTES, GROUP_ADMINISTRACION_ALTAVIA } from '@/common/consts';
import { useFetch } from '@/common/hooks/useFetch';
import { IMediaValidationSchema, MediaType } from '@/models/media';
import { ITripSchemaValidation } from '@/models/trip';
import { CopyPaste } from '../upload/CopyPaste';
import { Grid, HStack, RadioGroup, Stack } from '@chakra-ui/react';
import { useState } from 'react';
import { TelegramFileView } from '../telegramFileView';
import { useWhatsapp } from '@/common/hooks/useWhatsapp';
import { TelegramMedia } from '@/common/hooks/useTelegram';
import { IClientSchemaValidation } from '@/models/client';

interface TripDocumentsProps {
  trip: ITripSchemaValidation | null;
}

const items = [
  { label: 'G. Remision', value: 'TRIP_BILL_OF_LOADING' },
  { label: 'G. transporte', value: 'TRIP_BILL_OF_LOADING_CARRIER' },
  { label: 'Factura', value: 'TRIP_INVOICE' },
];

const sunatDocuments = ['TRIP_BILL_OF_LOADING', 'TRIP_BILL_OF_LOADING_CARRIER', 'TRIP_INVOICE']


export const TripDocuments = (props: TripDocumentsProps) => {
  const { trip } = props;
  const [value, setValue] = useState<string>('TRIP_BILL_OF_LOADING');

  const { onSendWhatsAppFile } = useWhatsapp({
    page: 'TripDocuments',
  });
  
  // API
  const { data: medias, refetch: refetchMedias } = useFetch<
    IMediaValidationSchema[]
  >(API_ROUTES.media, {
    queryParams: {
      resourceId: trip?._id,
    },
    enabled: trip?._id !== undefined,
  });
  const { data: client, isLoading: loadingClient } = useFetch<IClientSchemaValidation>(
    `${API_ROUTES.clients}/${trip?.client}`,
    {
      enabled: trip?.client !== undefined
    }
  );
  const { data: drivers, isLoading: isLoadingDrivers } = useFetch(
    API_ROUTES.drivers
  );

  const handleSuccessUpload = (response: TelegramMedia) => {
    const driverId =    trip?.driver[0]
    const driver = drivers.find((x: any) => x._id === driverId)
    const document= items.find((x) => x.value === value)?.label

    const message = `${ALTAVIA_BOT}

Se adjunta la  *${document}* ${response.file_name}`
    if (value === 'TRIP_BILL_OF_LOADING_CARRIER' || value === 'TRIP_INVOICE') {      
      onSendWhatsAppFile({
        type: 'file',
        message,
        to: client?.notifications?.whatsAppAlerts ?? GROUP_ADMINISTRACION_ALTAVIA,
        file: response.file,
      })
    }

    if (value === 'TRIP_BILL_OF_LOADING_CARRIER' || value === 'TRIP_BILL_OF_LOADING') {      
      onSendWhatsAppFile({
        type: 'file',
        message,
        to: driver.phone ?? GROUP_ADMINISTRACION_ALTAVIA,
        file: response.file,
      })
    }
    
    refetchMedias();
  }

  return (
    <Stack gap={3}>
      <RadioGroup.Root
        size="sm"
        colorPalette="teal"
        value={value}
        onValueChange={(e) => setValue(e.value as string)}
      >
        <HStack gap="2">
          {items.map((item) => (
            <RadioGroup.Item key={item.value} value={item.value}>
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
            </RadioGroup.Item>
          ))}
        </HStack>
      </RadioGroup.Root>

      <CopyPaste
        title='Copiar y pegar documento de sunat'
        type={value as MediaType}
        resourceId={trip?._id}
        metadata={{
          documentType: items.find((x) => x.value === value)?.label
        }}
        onSuccess={handleSuccessUpload}
        isDisabled={isLoadingDrivers || loadingClient}
      />

      <Grid templateColumns={{base: "repeat(2, 1fr)", md: "repeat(5, 1fr)"}} gap={4}>
        {medias
          ?.filter?.((x) => sunatDocuments.includes(x.type))
          ?.map?.((media) => (
            <TelegramFileView
              key={media._id}
              media={media}
              description={`${media.metadata?.documentType} ${media.name}`}              
              canDelete
              onRefresh={refetchMedias}
              imageStyle={{
                height: '100px',
              }}
            />
          ))}
      </Grid>
    </Stack>
  );
};
