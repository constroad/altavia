'use client';

import { Button, Flex, Grid, Show, Text, VStack } from '@chakra-ui/react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputField } from '../form';
import { useEffect, useState } from 'react';
import { useMutate } from 'src/common/hooks/useMutate';
import { ALTAVIA_BOT, API_ROUTES, GROUP_ADMINISTRACION_ALTAVIA, TELEGRAM_GROUP_ID_ALTAVIA_MEDIA } from 'src/common/consts';
import { toast } from '../Toast';
import { IVehicleSchemaValidation, vehicleSchemaValidation } from '@/models/vehicle';
import { useFieldArray } from 'react-hook-form';
import { Input, IconButton } from '@chakra-ui/react';
import { FiPlus, FiTrash } from 'react-icons/fi';
import { CopyPaste } from '../upload/CopyPaste';
import { useMedias } from '@/common/hooks/useMedias';
import { useFetch } from '@/common/hooks/useFetch';
import { useWhatsapp } from '@/common/hooks/useWhatsapp';
import { TelegramFileView } from '../telegramFileView';
import { useScreenSize } from '@/common/hooks';

interface VehicleFormProps {
  vehicle?: IVehicleSchemaValidation;
  closeModal: () => void;
}

export const VehicleForm = (props: VehicleFormProps) => {
  const { vehicle } = props;
  const [uploadedFile, setUploadedFile] = useState<File | undefined>();
  const { onSendWhatsAppText } = useWhatsapp({
    page: 'VehicleForm',
  });
  const { isMobile } = useScreenSize()

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

  const type = 'VEHICLE';
  const metadata = {
    resourceId: vehicle?._id,
    //
  };
  const { onUpload, isUploading, medias, refetch } = useMedias({
    chat_id: TELEGRAM_GROUP_ID_ALTAVIA_MEDIA,
    enabled: true,
    type,
    resourceId: vehicle?._id,
    onPasteMetadata: {
      fileName: uploadedFile?.name ?? `${type}_upload.jpg`,
      type,
      metadata,
    },
  });

  useEffect(() => {
    if (vehicle) {
      methods.reset(vehicle);
    }
  }, [vehicle, methods]);

  const handleSave = (file: any) => {
    if (vehicle) {
      if (!file) {
        toast.error('Seleccione un archivo');
        return;
      }
      onUpload(file, {
        type,
        fileName: file.name,
        metadata,
        onSuccess: () => {
          handleRefreshMedias();
          props.closeModal();
        },
      });
      // sending alert
      sendingAlert(vehicle);
    }
  };

  function sendingAlert(vehicle: IVehicleSchemaValidation) { 
    const plate = vehicle?.plate   
    onSendWhatsAppText({
      message: `${ALTAVIA_BOT}

Se ha agregado un nuevo *Media* al vehículo de placa a *${plate}*
`,
      to: GROUP_ADMINISTRACION_ALTAVIA,
    });
  }

  const onSubmit = (data: IVehicleSchemaValidation) => {
    if (props.vehicle?._id) {
      //edit
      updateVehicle('PUT', data, {
        onSuccess: () => {
          handleSave(uploadedFile)
          toast.success('El vehículo se actualizó correctamente');
          props.closeModal();
        },
        onError: (err) => {
          toast.error('Error al actualizar el vehículo');
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

  const onSelect = (file: File | File[]) => {
    if (file instanceof File) {
      setUploadedFile(file);
      return;
    }
    setUploadedFile(file[0]);
  };

  const handleRefreshMedias = () => {
    useFetch.mutate(API_ROUTES.media);
    // props.onRefresh?.();
    refetch();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <VStack spaceY={2}>
          <InputField name="plate" label="Placa" isRequired size='xs' />
          <Flex gap={1} justifyContent="space-between" width="100%">
            <InputField name="brand" label="Marca" size='xs' />
            <InputField name="modelVehicle" label="Modelo" size='xs' />
          </Flex>
          <Flex gap={1} justifyContent="space-between" width="100%">
            <InputField name="year" label="Año de fab." type='number' isRequired size='xs' />
            <InputField name="km" label="Kilometraje" type='number' size='xs' />
          </Flex>
          <Flex gap={1} justifyContent="space-between" width="100%">
            <InputField name="tuce" label="Número de TUCE" size='xs' />
          </Flex>
          <Flex gap={1} justifyContent="space-between" width="100%">
            <InputField name="soatExpiry" label="Soat expira" type='date' size='xs' />
            <InputField name="inspectionExpiry" label="Revisión Tec. expira" type='date' size='xs' />
          </Flex>

          <VStack w="100%" align="start" spaceY={2}>
            <Flex justify="space-between" w="100%" align="center">
              <Text fontSize={isMobile ? 12 : 14} fontWeight={600}>Mantenimientos</Text>
              <Button
                size="2xs"
                onClick={() =>
                  append({
                    date: new Date(),
                    description: '',
                  })
                }
              >
                <FiPlus style={{ marginRight: '2px' }} />
                Añadir
              </Button>
            </Flex>

            {fields.map((field, index) => (
              <Flex key={field.id} w="100%" gap={2} align="end">
                <InputField
                  size='xs'
                  name={`maintenanceLogs.${index}.date`}
                  type="date"
                  label="Fecha"
                />
                <InputField
                  size='xs'
                  name={`maintenanceLogs.${index}.description`}
                  label="Descripción"
                />
                <Button
                  onClick={() => remove(index)}
                  size='xs'
                  colorScheme="red"
                  variant="ghost"
                >
                  <FiTrash />
                </Button>
              </Flex>
            ))}
          </VStack>

          {vehicle && (
            <>
              <CopyPaste 
                type="VEHICLE"
                resourceId={vehicle._id}
                onSelect={onSelect}
                onPaste={onSelect}
                metadata={metadata}
                onSuccess={() => {
                  handleRefreshMedias();
                }}
              />

              <Show when={uploadedFile}>
                <Flex width="100%" alignItems="center" justifyContent="space-between">
                  {uploadedFile?.name}
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => setUploadedFile(undefined)}
                  >
                    x
                  </Button>
                </Flex>
              </Show>

              <Show when={medias?.length > 0}>
                <Grid templateColumns="repeat(2, 1fr)" gap="2">
                  {medias
                    ?.filter?.((x) => x.metadata.resourceId === vehicle?._id)
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
            </>
          )}

          <Flex w='100%' justifyContent='end' gap={2} mt='10px'>
            <Button
              colorPalette='danger'
              variant='outline'
              onClick={props.closeModal}
              size={ isMobile ? 'xs' : 'sm' }
            >
              Cancelar
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              loading={vehicle?._id ? updatingVehicle : creatingVehicle }
              size={ isMobile ? 'xs' : 'sm' }
            >
              Guardar
            </Button>
          </Flex>
        </VStack>
      </form>
    </FormProvider>
  );
};
