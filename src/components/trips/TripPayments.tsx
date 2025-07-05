'use client';

import { API_ROUTES, TELEGRAM_GROUP_ID_ALTAVIA_MEDIA } from '@/common/consts';
import { useMutate } from '@/common/hooks/useMutate';
import { IPayment, ITripSchemaValidation } from '@/models/trip';
import { Button, Flex, Grid, Show, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { IconWrapper } from '../IconWrapper/IconWrapper';
import { CloseIcon, PlusIcon } from '@/common/icons';
import { InputField, toast } from 'src/components';
import { useFetch } from '@/common/hooks/useFetch';
import { useMedias } from '@/common/hooks/useMedias';
import { CopyPaste } from '../upload/CopyPaste';
import { TelegramFileView } from '../telegramFileView';

interface TripPaymentsProps {
  trip: ITripSchemaValidation | null;
}

export const TripPayments = (props: TripPaymentsProps) => {
  const { trip } = props;

  const [payments, setPayments] = useState<IPayment[]>([]);
  const type = 'TRIP_PAYMENT';
  const metadata = {
    resourceId: props.trip?._id,    
  };

  useEffect(() => {
    if (trip?.payments) {
      setPayments(
        trip?.payments?.map((x) => ({
          ...x,
          date: x?.date?.split?.('T')[0],
        }))
      );
    }
  }, [trip?.payments]);

  //API
  const { mutate: mutateTrip, isMutating } = useMutate(
    `${API_ROUTES.trips}/:id`,
    {
      urlParams: {
        id: trip?._id,
      },
    }
  );
  const { isUploading, medias, refetch } = useMedias({
    chat_id: TELEGRAM_GROUP_ID_ALTAVIA_MEDIA,
    enabled: true,
    type,
    resourceId: props.trip?._id,
  });

  //handlers
  const updatePayment = (key: string, value: any, index: number) => {
    const paymentUpdated = payments.map((x, idx) => {
      if (index === idx) {
        return {
          ...x,
          [key]: value,
        };
      }
      return { ...x };
    });
    setPayments(paymentUpdated);
  };

  const onUpdateTrip = () => {
    mutateTrip(
      'PUT',
      { payments },
      {
        onSuccess: () => {
          toast.success('Pagos actualizados');
          useFetch.mutate(API_ROUTES.trips);
        },
      }
    );
  };

  const handleRefreshMedias = () => {
    useFetch.mutate(API_ROUTES.media);
    refetch();
  };
  const isValidTrip = trip !== null;
  const totalPayments = payments
    ?.reduce?.((sum: number, p: IPayment) => sum + (p.amount || 0), 0)
    ?.toFixed(2);


  return (
    <Stack
      gap={8}
      alignItems="start"
      direction={{base: 'column', md: 'row'}}      
      justifyContent="space-between"
    >
      <Stack gap={3} width="40%">
        <Flex justify="space-between" align="center" mb={2} >
          <Text fontWeight={500} fontSize={14}>
            Pagos: S/. ({totalPayments})
          </Text>
          <Flex gap={2}>
            <Button
              variant="outline"
              size="xs"
              px="2px"
              disabled={!isValidTrip}
              onClick={() =>
                setPayments((prev) => [
                  ...prev,
                  {
                    date: new Date().toISOString().split('T')[0],
                    amount: 0,
                    note: '',
                  },
                ])
              }
            >
              <IconWrapper icon={PlusIcon} fontSize={12} />
            </Button>
            <Button
              size="xs"
              disabled={payments.length === 0 || !isValidTrip}
              onClick={onUpdateTrip}
              loading={isMutating}
            >
              Guardar
            </Button>
          </Flex>
        </Flex>

        <Flex direction="column" gap={2}>
          {payments.map((field, index) => (
            <Flex key={index} gap={2}>
              <InputField
                controlled
                value={field.date}
                name="date"
                type="date"
                onChange={(value) => {
                  updatePayment('date', value, index);
                }}
                size="xs"
              />
              <InputField
                controlled
                name="amount"
                type="number"
                size="xs"
                value={field.amount}
                onChange={(value) => {
                  updatePayment('amount', value, index);
                }}
              />
              <InputField
                controlled
                name="note"
                placeholder="Notas"
                size="xs"
                value={field.note}
                onChange={(value) => {
                  updatePayment('note', value, index);
                }}
              />
              <Button
                p={1}
                size="xs"
                onClick={() => {
                  const newFilter = payments.filter((_, idx) => idx !== index);
                  setPayments([...newFilter]);
                }}
                variant="outline"
                colorPalette="danger"
              >
                <IconWrapper icon={CloseIcon} />
              </Button>
            </Flex>
          ))}
        </Flex>
      </Stack>

      <Stack flexDir="column" flex={1} gap={4}>
        <Text fontWeight={500}>
          Vouchers:
        </Text>
        <CopyPaste
          isDisabled={!isValidTrip}
          type="TRIP_PAYMENT"
          resourceId={props.trip?._id}          
          metadata={metadata}
          onSuccess={() => {
            handleRefreshMedias();
          }}
          isUploading={isUploading}
        />

        <Show when={medias?.length > 0}>
          <Grid templateColumns="repeat(2, 1fr)" gap="2">
            {medias
              ?.filter?.((x) => x.type === type)
              ?.map?.((media) => (
                <TelegramFileView
                  key={media._id}
                  media={media}
                  description={media.name}
                  canDelete
                  onRefresh={handleRefreshMedias}
                  imageStyle={{
                    height: '200px',
                  }}
                />
              ))}
          </Grid>
        </Show>
      </Stack>
    </Stack>
  );
};
