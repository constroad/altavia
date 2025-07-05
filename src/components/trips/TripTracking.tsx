import { ALTAVIA_BOT, API_ROUTES, GROUP_ADMINISTRACION_ALTAVIA } from '@/common/consts';
import { useFetch } from '@/common/hooks/useFetch';
import { IMediaValidationSchema } from '@/models/media';
import { ITripSchemaValidation } from '@/models/trip';
import { Grid, Stack } from '@chakra-ui/react';
import { TelegramFileView } from '../telegramFileView';
import { CopyPaste } from '../upload/CopyPaste';
import { formatUtcDateTime } from '@/utils/general';
import { useWhatsapp } from '@/common/hooks/useWhatsapp';
import { TelegramMedia } from '@/common/hooks/useTelegram';
import { IClientSchemaValidation } from '@/models/client';

interface TripTrackingProps {
  trip: ITripSchemaValidation | null;
}

export const TripTracking = (props: TripTrackingProps) => {
  const { trip } = props;

  const { onSendWhatsAppFile } = useWhatsapp({
    page: 'TripTracking',
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
  const { data: vehicles, isLoading: loadingVehicles } = useFetch(
    API_ROUTES.vehicles,    
  );

  const handleSuccessUpload = (response: TelegramMedia) => {

    let phonesToNotify = [GROUP_ADMINISTRACION_ALTAVIA]
    if (client?.notifications?.whatsAppAlerts) {
      phonesToNotify= client?.notifications?.whatsAppAlerts
    }
    trip?.notifications?.notifyDestination?.forEach?.((x) => {
      phonesToNotify.push(x)
    })

    const vehicleId = trip?.vehicle[0] ?? ''
    const vehicle = vehicles.find((x: any) => x._id === vehicleId)
    onSendWhatsAppFile({
      type: 'image',
      message: `${ALTAVIA_BOT}

La unidad de placa *${vehicle.plate}* con destino a *${trip?.destination}* se encuentra en esta ubicación
      `,
      to: phonesToNotify,
      file: response.file,
    })
    refetchMedias();
  }

  return (
    <Stack gap={3}>
      <CopyPaste
        type="TRIP_TRACKING"
        title='Copiar y pegar mapa de ubicacion'
        resourceId={trip?._id}
        onSuccess={handleSuccessUpload}
        isDisabled={loadingClient || loadingVehicles}
      />

      <Grid
        templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }}
        gap={4}
      >
        {medias
          ?.filter?.((x) => x.type === 'TRIP_TRACKING')
          ?.map?.((media) => (
            <TelegramFileView
              key={media._id}
              media={media}
              description={`${formatUtcDateTime(media.date, {showTime: true})} ${media.name}`}
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
