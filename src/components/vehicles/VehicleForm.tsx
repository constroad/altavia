'use client';

import { Button, Flex, Grid, Show, Text, VStack } from '@chakra-ui/react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputField } from '../form';
import { useEffect } from 'react';
import { useMutate } from 'src/common/hooks/useMutate';
import { ALTAVIA_BOT, API_ROUTES, GROUP_ADMINISTRACION_ALTAVIA, TELEGRAM_GROUP_ID_ALTAVIA_MEDIA } from 'src/common/consts';
import { toast } from '../Toast';
import { IVehicleSchemaValidation, vehicleSchemaValidation } from '@/models/vehicle';
import { useFieldArray } from 'react-hook-form';
import { FiPlus, FiTrash } from 'react-icons/fi';
import { CopyPaste } from '../upload/CopyPaste';
import { useMedias } from '@/common/hooks/useMedias';
import { useWhatsapp } from '@/common/hooks/useWhatsapp';
import { TelegramFileView } from '../telegramFileView';
import { useScreenSize } from '@/common/hooks';
import { useBufferedFiles } from '@/common/hooks/useBufferedFiles';
import DateField from '../form/DateField';

interface VehicleFormProps {
  vehicle?: IVehicleSchemaValidation;
  closeModal: () => void;
}

export const VehicleForm = (props: VehicleFormProps) => {
  const { vehicle } = props;
  const { onSendWhatsAppText } = useWhatsapp({
    page: 'VehicleForm',
  });
  const { isMobile } = useScreenSize()
  const {
    uploadedFiles,
    objectUrls,
    onSelect,
    onPaste,
    removeFile,
    resetFiles,
  } = useBufferedFiles({
    immediateUpload: !!vehicle,
    onUpload: (file) => {
      onUpload(file, {
        type,
        fileName: file.name,
        resourceId: vehicle?._id,
        metadata,
        onSuccess: handleRefreshMedias,
      });
    },
  });

  const handleCloseModal = () => {
    props.closeModal();
    resetFiles();
  }

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
  const { mutate: createVehicle, isMutating: createLoading } = useMutate(
    API_ROUTES.vehicles
  );
  const { mutate: updateVehicle, isMutating: updateLoading } = useMutate(
    `${API_ROUTES.vehicles}/:id`,
    {
      urlParams: { id: vehicle?._id ?? '' },
    }
  );

  const type = 'VEHICLE';
  const metadata = { resourceId: vehicle?._id };

  const { onUpload, isUploading, medias, refetch } = useMedias({
    chat_id: TELEGRAM_GROUP_ID_ALTAVIA_MEDIA,
    enabled: true,
    type,
    resourceId: vehicle?._id,
  });

  useEffect(() => {
    if (vehicle) {
      methods.reset(vehicle);
    }
  }, [vehicle, methods]);

  function sendingAlert(vehicle: IVehicleSchemaValidation) { 
    const plate = vehicle?.plate
    onSendWhatsAppText({
      message: `${ALTAVIA_BOT}

Se ha agregado un nuevo *Media* al vehículo de placa a *${plate}*
`,
      to: GROUP_ADMINISTRACION_ALTAVIA,
    });
  };

  const handleSave = (veh: IVehicleSchemaValidation) => {
    if (uploadedFiles.length === 0) {
      toast.error('Seleccione al menos un archivo');
      return;
    }
  
    let uploadedCount = 0;
  
    uploadedFiles.forEach((file) => {
      onUpload(file, {
        type,
        fileName: file.name,
        resourceId: veh._id!,
        metadata: {
          resourceId: veh._id!,
        },
        onSuccess: () => {
          uploadedCount++;
          if (uploadedCount === uploadedFiles.length) {
            handleRefreshMedias();
            sendingAlert(veh);
            handleCloseModal();
          }
        },
      });
    });
  };

  const onSubmit = (data: IVehicleSchemaValidation) => {
    if (props.vehicle?._id) {
      updateVehicle('PUT', data, {
        onSuccess: () => {
          toast.success('El vehículo se actualizó correctamente');
          handleCloseModal()
        },
        onError: (err) => {
          toast.error('Error al actualizar el vehículo');
          console.log(err);
          resetFiles();
        },
      });
      return;
    }
    
    createVehicle('POST', data, {
      onSuccess: (created) => {
        toast.success('El vehículo se registro correctamente');
        handleSave(created);
      },
      onError: (err) => {
        toast.error('Error al registrar el nuevo vehículo');
        console.log(err);
        resetFiles();
      },
    });
  };

  const handleRefreshMedias = () => {
    refetch();
  };

  const isCreating = !vehicle;
  const hasFiles = uploadedFiles.length > 0;

  const isSubmitLoading = hasFiles
    ? isUploading
    : isCreating
      ? createLoading
      : updateLoading;

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
            <DateField name='soatExpiry' label='Soat expira' size='xs' />
            <DateField name='inspectionExpiry' label='Revisión Tec. expira' size='xs' />
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
            
          <CopyPaste
            type="VEHICLE"
            resourceId={vehicle?._id!}
            onSelect={onSelect}
            onPaste={onPaste}
            metadata={metadata}
            onSuccess={handleRefreshMedias}
          />

          <Show when={uploadedFiles.length > 0}>
            <VStack width="100%" spaceY={2}>
            <Grid
              templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
              gap="2"
              w='100%'
            >
              {uploadedFiles.map((file, index) => (
                <Flex
                  key={index}
                  width="100%"
                  alignItems="center"
                  justifyContent="space-between"
                  borderWidth="1px"
                  borderRadius="md"
                  p={1}
                >
                  <Flex flexDir='column' gapY={1} w='100%'>
                    <Flex justifyContent='space-between' w='100%' alignItems='center'>
                      <span style={{ fontSize: '12px' }}>{file.name}</span>
                      <Button
                        size="2xs"
                        colorPalette='danger'
                        variant="outline"
                        onClick={() => removeFile(index)}
                      >
                        x
                      </Button>
                    </Flex>

                    <Flex w='100%' justifyContent='center'>
                      <img
                        src={objectUrls[index]}
                        alt={file.name}
                        style={{ height: '80px', borderRadius: '4px' }}
                      />
                    </Flex>
                  </Flex>
                </Flex>
              ))}
            </Grid>
            </VStack>
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
            
          <Flex w='100%' justifyContent='end' gap={2} mt='10px'>
            <Button
              colorPalette='danger'
              variant='outline'
              onClick={handleCloseModal}
              size={ isMobile ? 'xs' : 'sm' }
            >
              Cancelar
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              loading={ isSubmitLoading }
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
