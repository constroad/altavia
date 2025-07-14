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
import { IDriverSchemaValidation, driverSchemaValidation } from '@/models/driver';
import DateField from '../form/DateField';

interface DriverFormProps {
  driver?: IDriverSchemaValidation;
  closeModal: () => void;
}

export const DriverForm = (props: DriverFormProps) => {
  const { driver } = props;
  const [uploadedFile, setUploadedFile] = useState<File | undefined>();
  const { onSendWhatsAppText } = useWhatsapp({
    page: 'DriverForm',
  });

  const methods = useForm<IDriverSchemaValidation>({
    resolver: zodResolver(driverSchemaValidation),
    defaultValues: driver,
  });

  const {
    formState: { errors },
  } = methods;

  // API
  const { mutate: createDriver, isMutating: creatingDriver } = useMutate(
    API_ROUTES.drivers
  );
  const { mutate: updateDriver, isMutating: updatingDriver } = useMutate(
    `${API_ROUTES.drivers}/:id`,
    {
      urlParams: { id: driver?._id ?? '' },
    }
  );

  const type = 'DRIVER';
  const metadata = {
    resourceId: driver?._id,
    //
  };
  const { onUpload, isUploading, medias, refetch, isLoading } = useMedias({
    chat_id: TELEGRAM_GROUP_ID_ALTAVIA_MEDIA,
    enabled: true,
    type,
    resourceId: driver?._id,
    onPasteMetadata: {
      fileName: uploadedFile?.name ?? `${type}_upload.jpg`,
      type,
      metadata,
    },
  });

  useEffect(() => {
    if (driver) {
      methods.reset(driver);
    }
  }, [driver, methods]);

  const handleSave = (file: any) => {
    if ( file === undefined ) return;
    if ( driver ) {
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
      sendingAlert(driver);
    }
  };

  function sendingAlert(driver: IDriverSchemaValidation) { 
    const name = driver?.name   
    onSendWhatsAppText({
      message: `${ALTAVIA_BOT}

Se ha agregado un nuevo *Media* al conductor *${name}*
`,
      to: GROUP_ADMINISTRACION_ALTAVIA,
    });
  }

  const onSubmit = (data: IDriverSchemaValidation) => {
    if (props.driver?._id) {
      //edit
      updateDriver('PUT', data, {
        onSuccess: () => {
          handleSave(uploadedFile)
          toast.success('El conductor se actualizó correctamente');
          props.closeModal();
        },
        onError: (err) => {
          toast.error('Error al actualizar el conductor');
          console.log(err);
        },
      });
      return;
    }
    // create
    createDriver('POST', data, {
      onSuccess: () => {
        toast.success('El conductor se registro correctamente');
        props.closeModal();
      },
      onError: (err) => {
        toast.error('Error al registrar el nuevo conductor');
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
          <InputField name="name" label="Nombre" isRequired size='xs' />
          <Flex gap={1} justifyContent="space-between" width="100%">
            <InputField name="dni" label="DNI" size='xs' isRequired />
            <InputField name="phone" label="Teléfono" size='xs' isRequired />
          </Flex>
          <Flex gap={1} justifyContent="space-between" width="100%">
            <InputField name="licenseNumber" label="Licencia" isRequired size='xs' />
            <DateField name='licenseExpiry' label='Licencia Exp.' size='xs' isRequired />
          </Flex>

          {driver && (
            <>
              <CopyPaste 
                type="DRIVER"
                resourceId={driver._id}
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
                    size="2xs"
                    variant="outline"
                    colorPalette='danger'
                    onClick={() => setUploadedFile(undefined)}
                  >
                    x
                  </Button>
                </Flex>
              </Show>

              {isLoading && <Text fontSize={12} lineHeight='12px'>cargando...</Text>}

              <Show when={medias?.length > 0}>
                <Grid templateColumns="repeat(2, 1fr)" gap="2">
                  {medias
                    ?.filter?.((x) => x.metadata.resourceId === driver?._id)
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
                    ))
                  }
                </Grid>
              </Show>
            </>
          )}

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
              loading={driver?._id ? updatingDriver : creatingDriver }
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
