'use client';

import { Button, Flex, Grid, Show, VStack } from '@chakra-ui/react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputField } from '../form';
import { useEffect } from 'react';
import { useMutate } from 'src/common/hooks/useMutate';
import { ALTAVIA_BOT, API_ROUTES, GROUP_ADMINISTRACION_ALTAVIA, TELEGRAM_GROUP_ID_ALTAVIA_MEDIA } from 'src/common/consts';
import { toast } from '../Toast';
import { CopyPaste } from '../upload/CopyPaste';
import { useMedias } from '@/common/hooks/useMedias';
import { useFetch } from '@/common/hooks/useFetch';
import { useWhatsapp } from '@/common/hooks/useWhatsapp';
import { TelegramFileView } from '../telegramFileView';
import { IDriverSchemaValidation, driverSchemaValidation } from '@/models/driver';
import DateField from '../form/DateField';
import { useBufferedFiles } from '@/common/hooks/useBufferedFiles';

interface DriverFormProps {
  driver?: IDriverSchemaValidation;
  closeModal: () => void;
}

export const DriverForm = (props: DriverFormProps) => {
  const { driver } = props;
  const { onSendWhatsAppText } = useWhatsapp({ page: 'DriverForm' });

  const methods = useForm<IDriverSchemaValidation>({
    resolver: zodResolver(driverSchemaValidation),
    defaultValues: driver,
  });

  const {
    formState: { errors },
  } = methods;

  const type = 'DRIVER';
  const { onUpload, isUploading, medias, refetch } = useMedias({
    chat_id: TELEGRAM_GROUP_ID_ALTAVIA_MEDIA,
    enabled: !!driver?._id,
    type,
    resourceId: driver?._id,
  });

  const {
    uploadedFiles,
    objectUrls,
    onSelect,
    onPaste,
    removeFile,
    resetFiles,
  } = useBufferedFiles({
    immediateUpload: !!driver,
    onUpload: (file) => {
      if (!driver?._id) return;
      onUpload(file, {
        resourceId: driver._id,
        type,
        fileName: file.name,
        metadata: { resourceId: driver._id },
        onSuccess: handleRefreshMedias,
      });
    },
  });

  const { mutate: createDriver, isMutating: creatingDriver } = useMutate(API_ROUTES.drivers);
  const { mutate: updateDriver, isMutating: updatingDriver } = useMutate(`${API_ROUTES.drivers}/:id`, {
    urlParams: { id: driver?._id ?? '' },
  });

  useEffect(() => {
    if (driver) {
      methods.reset(driver);
    }
  }, [driver, methods]);

  const sendingAlert = (driver: IDriverSchemaValidation) => {
    const name = driver?.name;
    onSendWhatsAppText({
      message: `${ALTAVIA_BOT}

Se ha agregado un nuevo *Media* al conductor *${name}*`,
      to: GROUP_ADMINISTRACION_ALTAVIA,
    });
  };

  const onSubmit = (data: IDriverSchemaValidation) => {
    if (props.driver?._id) {
      updateDriver('PUT', data, {
        onSuccess: () => {
          if (uploadedFiles.length > 0 && driver?._id) {
            uploadedFiles.forEach((file) => {
              onUpload(file, {
                resourceId: driver._id,
                type,
                fileName: file.name,
                metadata: { resourceId: driver._id },
                onSuccess: handleRefreshMedias,
              });
            });
          }
          toast.success('El conductor se actualizó correctamente');
          handleCloseModal();
        },
        onError: (err) => {
          toast.error('Error al actualizar el conductor');
          console.log(err);
        },
      });
      return;
    }

    createDriver('POST', data, {
      onSuccess: (created) => {
        toast.success('El conductor se registró correctamente');

        if (uploadedFiles.length > 0) {
          let uploadedCount = 0;

          uploadedFiles.forEach((file) => {
            onUpload(file, {
              resourceId: created._id,
              type,
              fileName: file.name,
              metadata: { resourceId: created._id },
              onSuccess: () => {
                uploadedCount++;
                if (uploadedCount === uploadedFiles.length) {
                  handleRefreshMedias();
                  sendingAlert(created);
                  handleCloseModal();
                }
              },
            });
          });
        } else {
          handleRefreshMedias();
          handleCloseModal();
        }
      },
      onError: (err) => {
        toast.error('Error al registrar el nuevo conductor');
        console.log(err);
        resetFiles();
      },
    });
  };

  const handleRefreshMedias = () => {
    useFetch.mutate(API_ROUTES.media);
    refetch();
  };

  const handleCloseModal = () => {
    props.closeModal();
    resetFiles();
  };

  const resourceId = driver?._id!;
  const loading = creatingDriver || updatingDriver || isUploading;

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

          <CopyPaste 
            type="DRIVER"
            resourceId={resourceId}
            onSelect={onSelect}
            onPaste={onPaste}
            metadata={{ resourceId }}
            onSuccess={handleRefreshMedias}
          />

          <Show when={!driver && uploadedFiles.length > 0}>
            <VStack width="100%" spaceY={1}>
              {uploadedFiles.map((file, index) => (
                <Flex
                  key={index}
                  width="100%"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Flex alignItems="center" gap="2">
                    <img
                      src={objectUrls[index]}
                      alt={file.name}
                      style={{ height: '80px', borderRadius: '4px' }}
                    />
                    <span>{file.name}</span>
                  </Flex>
                  <Button
                    size="2xs"
                    variant="outline"
                    colorPalette="danger"
                    onClick={() => removeFile(index)}
                  >
                    x
                  </Button>
                </Flex>
              ))}
            </VStack>
          </Show>

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
                    imageStyle={{ height: '200px' }}
                  />
                ))
              }
            </Grid>
          </Show>

          <Flex w='100%' justifyContent='end' gap={2} mt='10px'>
            <Button
              colorPalette='danger'
              variant='outline'
              onClick={handleCloseModal}
              size='sm'
            >
              Cancelar
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              loading={loading}
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
