'use client';

import { Box, Button, Flex, Grid, Input, Show, Text } from "@chakra-ui/react";
import DateField from "../form/DateField";
import { InputField } from "../form";
import { useFieldArray, useFormContext } from "react-hook-form";
import { IPayment, ITripSchemaValidation } from "@/models/trip";
import { IconWrapper } from "../IconWrapper/IconWrapper";
import { CloseIcon, PlusIcon } from "@/common/icons";
import { CopyPaste } from "../upload/CopyPaste";
import { useMedias } from "@/common/hooks/useMedias";
import { API_ROUTES, TELEGRAM_GROUP_ID_ALTAVIA_MEDIA } from "@/common/consts";
import { useFetch } from "@/common/hooks/useFetch";
import { TelegramFileView } from "../telegramFileView";

interface ITripAdvanced {
  trip: ITripSchemaValidation | null;
}

export const TripAdvanced = (props: ITripAdvanced) => {
  const { watch, control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "payments",
  });

  const income = watch("Income") || 0;
  const payments = watch("payments") || [];

  const deuda = income - payments.reduce((sum: number, p: IPayment) => sum + p.amount, 0);
  const deudaStr = deuda.toFixed(2).toString()

  const type = 'TRIP_PAYMENT';
  const metadata = {
    resourceId: props.trip?._id,
    //
  };
  const { onUpload, isUploading, medias, refetch } = useMedias({
    chat_id: TELEGRAM_GROUP_ID_ALTAVIA_MEDIA,
    enabled: true,
    type,
    resourceId: props.trip?._id,
  });

  const handleRefreshMedias = () => {
    useFetch.mutate(API_ROUTES.media);
    refetch();
  };

  const onSelect = (file: File | File[]) => {
    const selectedFile = file instanceof File ? file : file[0];
    if (!selectedFile) return;
  
    const metadata = {
      resourceId: props.trip?._id,
    };
  
    onUpload(selectedFile, {
      fileName: selectedFile.name ?? `${type}_upload.jpg`,
      type,
      metadata,
      onSuccess: () => {
        console.log("✅ Media creado, forzando refetch");
        refetch();
      },
    });
  };
  
  return (
    <Flex w='100%' flexDir='column' gapY={4}>
      {/* destinycontact */}
      <Flex gap={2}>
        <InputField
          name="destinationContact.name"
          label="Contacto Destino"
          placeholder="Nombre"
          size="xs"
        />
        <InputField
          name="destinationContact.phone"
          label="Teléfono"
          placeholder="999999999"
          size="xs"
        />
      </Flex>

      {/* deuda */}
      <Flex gap={2} w='100%'>
        <DateField
          size="xs"
          name="paymentDueDate"
          label="Fecha de Vencimiento"
        />

        <Flex flexDir='column' w='50%'>
          <Text fontWeight={500}>Deuda:</Text>
          <Input
            mt='6px'
            value={deudaStr}
            size="xs"
            readOnly
          />
        </Flex>
      </Flex>

      <Flex>
        <InputField
          name="mapsUrl"
          label="Ubicación"
          placeholder="https://maps.app.goo.gl/..."
          size="xs"
        />
      </Flex>

      {/* PAGOS */}
      <Box>
        <Flex justify="space-between" align="center" mb={2}>
          <Text fontWeight={500} fontSize={14} >
            Pagos: S/. ({payments.reduce((sum: number, p: IPayment) => sum + (p.amount || 0), 0).toFixed(2)})
          </Text>
          <Button
            aria-label="Agregar pago"
            size='xs'
            px='2px'
            onClick={() =>
              append({
                date: new Date().toISOString().split("T")[0],
                amount: 0,
                note: "",
              })
            }
          >
            <IconWrapper icon={PlusIcon} fontSize={12} />
          </Button>
        </Flex>

        <Flex direction="column" gap={2}>
          {fields.map((field, index) => (
            <Flex key={field.id} gap={2}>
              <Input
                type="date"
                size="xs"
                {...register(`payments.${index}.date`)}
              />
              <Input
                type="number"
                size="xs"
                {...register(`payments.${index}.amount`, { valueAsNumber: true })}
              />
              <Input
                placeholder="Notas"
                size="xs"
                {...register(`payments.${index}.note`)}
              />
              <Button
                px='2px'
                aria-label="Eliminar pago"
                size="xs"
                onClick={() => remove(index)}
                colorPalette='danger'
              >
                <IconWrapper icon={CloseIcon} />
              </Button>
            </Flex>
          ))}
        </Flex>

        <Flex flexDir='column' mt='30px'>
          <Text fontWeight={500} mb='10px'>Vouchers:</Text>
          <CopyPaste
            type="TRIP_PAYMENT"
            resourceId={props.trip?._id}
            onSelect={onSelect}
            onPaste={onSelect}
            metadata={metadata}
            onSuccess={() => {
              handleRefreshMedias();
            }}
            isUploading={isUploading}
          />

          <Show when={medias?.length > 0}>
            <Grid templateColumns="repeat(2, 1fr)" gap="2">
              {medias
                ?.filter?.((x) => x.metadata.resourceId === props.trip?._id)
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
        </Flex>
      </Box>
    </Flex>
  );
};
