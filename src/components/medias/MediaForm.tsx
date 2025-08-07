import { Box, Button, Flex, Grid, Show, Stack, Text, VStack } from '@chakra-ui/react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputField } from '../form';
import { useEffect, useState } from 'react';
import { useMutate } from 'src/common/hooks/useMutate';
import { API_ROUTES } from 'src/common/consts';
import { toast } from '../Toast';
import { IMediaValidationSchema, MediaType, mediaValidationSchema } from '@/models/media';
import { CopyPaste } from '../upload/CopyPaste';
import { useBufferedFiles } from '@/common/hooks/useBufferedFiles';
import { useMedias } from '@/common/hooks/useMedias';
import { TelegramFileView } from '../telegramFileView';

interface MediaFormProps {
  media: IMediaValidationSchema;
  onSuccess: () => void;
  refetchMedias: () => void;
}

export const MediaForm = (props: MediaFormProps) => {
  const { media, refetchMedias } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<IMediaValidationSchema>({
    resolver: zodResolver(mediaValidationSchema),
    defaultValues: media,
  });

  const {
    onReplace,
    isUploading,
    isLoading,
  } = useMedias({
    resourceId: media?.resourceId,
    enabled: !!media?.resourceId,
  });

  const {
    uploadedFiles,
    objectUrls,
    onSelect,
    onPaste,
    removeFile,
    resetFiles,
  } = useBufferedFiles({
    immediateUpload: false,
    maxFiles: 1,
    onUpload: (file) => {
      if (!media?._id) return;
      onReplace(media, file, {
        onSuccess: () => {
          refetchMedias();
          toast.success("Media reemplazada con éxito");
        },
      });
    },
  });

  const { mutate, isMutating } = useMutate(`${API_ROUTES.media}/:id`, {
    urlParams: {
      id: media._id,
    },
  });

  useEffect(() => {
    if (media) {
      methods.reset(media);
    }
  }, [media, methods]);

  const onSubmit = async (data: IMediaValidationSchema) => {
    if (!media?._id) return;
    setIsSubmitting(true);

    try {
      await mutate('PUT', data);

      if (uploadedFiles.length > 0) {
        const file = uploadedFiles[0];

        await new Promise<void>((resolve, reject) => {
          onReplace(media, file, {
            onSuccess: () => {
              refetchMedias();
              resetFiles();
              resolve();
            },
          });
        });
      }

      // Paso 3: Finalizar
      refetchMedias();
      props.onSuccess();
      toast.success("Media actualizada correctamente");

    } catch (error) {
      console.error("Error al actualizar media:", error);
      toast.error("Hubo un problema actualizando el media");
    } finally {
      refetchMedias();
      setIsSubmitting(false);
    }
  };


  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <VStack spaceY={4}>
          <InputField name="name" label="Nombre" />
          {/* <InputField name="type" label="Tipo" /> */}

          <Flex w='100%' flexDir='column'>
            <Text fontWeight={400} fontSize={{ base: 10, md: 12 }}>
              Actual media:
            </Text>
            <Box w='200px'>
              <TelegramFileView
                key={media._id}
                media={media}
                description={media.name}
                onRefresh={refetchMedias}
                imageStyle={{
                  width: '200px',
                  height: '200px',
                }}
              />
            </Box>
          </Flex>

          <Box w='100%' mt='20px'>
            <CopyPaste
              title="Reemplazar archivo"
              type={media.type as MediaType}
              resourceId={media.resourceId}
              onSelect={onSelect}
              onPaste={onPaste}
              onSuccess={refetchMedias}
            />
          </Box>

          <Show when={uploadedFiles.length > 0}>
            <VStack width="100%" spaceY={2}>
              <Grid
                templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(1, 1fr)' }}
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
                    <Flex flexDir="column" columnGap={1} w="100%">
                      <Flex justifyContent="space-between" w="100%" alignItems="center">
                        <span style={{ fontSize: '12px' }}>{file.name}</span>
                        <Button
                          size="xs"
                          p='4px'
                          colorPalette='danger'
                          variant="outline"
                          onClick={() => removeFile(index)}
                        >
                          x
                        </Button>
                      </Flex>
                      <Flex w="100%" justifyContent="center">
                        <img
                          src={objectUrls[index]}
                          alt={file.name}
                          style={{ height: '100px', borderRadius: '4px' }}
                        />
                      </Flex>
                    </Flex>
                  </Flex>
                ))}
              </Grid>
            </VStack>
          </Show>

          <Button colorScheme="blue" type="submit" loading={isSubmitting}>
            Guardar
          </Button>
        </VStack>
      </form>
    </FormProvider>
  );
};
