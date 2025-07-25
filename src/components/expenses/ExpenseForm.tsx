import { Button, Stack, Flex, HStack, Grid, Show } from '@chakra-ui/react';

import { PageHeader, toast } from 'src/components';
import { SelectField } from '../../components/form/SelectField';
import { useMutate } from 'src/common/hooks/useMutate';
import {
  ALTAVIA_BOT,
  API_ROUTES,
  APP_ROUTES,
  GROUP_ADMINISTRACION_ALTAVIA,
} from 'src/common/consts';
import { useRouter } from 'next/navigation';
import {
  EXPENSE_STATUS,
  EXPENSE_STATUS_MAP,
  EXPENSE_TYPES,
  EXPENSE_TYPES_MAP,
  IExpenseSchema,
  expenseValidationSchema,
} from 'src/models/generalExpense';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DateField from '../form/DateField';
import { InputField } from '../form/InputField';
import { useFetch } from 'src/common/hooks/useFetch';
import { useMedias } from '@/common/hooks/useMedias';
import { TelegramFileView } from '../telegramFileView';
import { useWhatsapp } from '@/common/hooks/useWhatsapp';
import { CopyPaste } from '../upload/CopyPaste';
import { formatUtcDateTime } from '@/utils/general';
import { useBufferedFiles } from '@/common/hooks/useBufferedFiles';


interface ExpenseFormProps {
  expense: IExpenseSchema | null;
}

export const ExpenseForm = (props: ExpenseFormProps) => {
  const { expense } = props;

  const isValidExpense = !!expense;
  const resourceId = expense?._id;
  const type = 'GENERAL_EXPENSE';
  const metadata = {
    expenseId: expense?._id,
  };

  const {
    uploadedFiles,
    objectUrls,
    onSelect,
    onPaste,
    removeFile,
    resetFiles,
  } = useBufferedFiles({
    immediateUpload: !!expense,
    onUpload: (file) => {
      onUpload(file, {
        type,
        fileName: file.name,
        resourceId: expense?._id,
        metadata,
        onSuccess: refetchMedias,
      });
    },
  });

  const methods = useForm<IExpenseSchema>({
    resolver: zodResolver(expenseValidationSchema),
    defaultValues: {
      description: expense?.description,
      amount: expense?.amount,
      type: expense?.type,
      status: expense?.status ?? 'paid',
      date: expense?.date ?? new Date(),
    },
  });

  const {
    reset,
    formState: { errors },
  } = methods;
  const router = useRouter();
  const { onSendWhatsAppText } = useWhatsapp({
    page: 'ExpenseForm',
  });

  // API
  const { mutate: mutateExpense, isMutating } = useMutate(API_ROUTES.expenses);
  const {
    medias: mediaResponse,
    refetch: refetchMedias,
    onUpload,
    isUploading,
  } = useMedias({
    resourceId: expense?._id,
    enabled: expense?._id !== undefined,
  });

  function sendingAlert(expense: IExpenseSchema) {
    //@ts-ignore
    const date = formatUtcDateTime(expense.date as string);

    onSendWhatsAppText({
      message: `${ALTAVIA_BOT}

Se ha agregado un nuevo *Gasto* :
- Tipo: ${expense.type}
- Fecha: ${date}
- Descripcion: ${expense.description}
- monto: ${expense.amount}
      `,
      to: GROUP_ADMINISTRACION_ALTAVIA,
    });
  }

  // handlers
  const handleSave = (expense: IExpenseSchema) => {
    if (uploadedFiles.length === 0) {
      useFetch.mutate(API_ROUTES.expenses);
      refetchMedias();
      router.push(`${APP_ROUTES.expenses}/${expense._id}`);
      return;
    }
  
    let uploadedCount = 0;
  
    uploadedFiles.forEach((file) => {
      onUpload(file, {
        type,
        fileName: file.name,
        resourceId: expense._id!,
        metadata: {
          ...metadata,
          expenseId: expense._id!,
        },
        onSuccess: () => {
          uploadedCount++;
          if (uploadedCount === uploadedFiles.length) {
            useFetch.mutate(API_ROUTES.expenses);
            refetchMedias();
            router.push(`${APP_ROUTES.expenses}/${expense._id}`);
          }
        },
      });
    });
  
    sendingAlert(expense);
  };
  
  const onSubmit = (data: IExpenseSchema) => {
    if (expense?._id) {
      mutateExpense('PUT', data, {
        requestUrl: `${API_ROUTES.expenses}/${expense._id}`,
        onSuccess: () => {
          toast.success('Gasto actualizado');
          useFetch.mutate(API_ROUTES.expenses);
        },
        onError: (err) => {
          toast.error('Error al actualizar gasto');
          console.log(err);
          resetFiles();
        },
      });
      return;
    }
  
    mutateExpense('POST', data, {
      onSuccess: (created) => {
        toast.success('Gasto registrado');
        handleSave(created); // misma idea que VehicleForm
      },
      onError: (err) => {
        toast.error('Error al registrar gasto');
        console.log(err);
        resetFiles();
      },
    });
  };

  const medias = mediaResponse ?? [];

  const actions = (
    <Button
      size="xs"
      variant="outline"
      onClick={() => {
        reset();
        router.push(`${APP_ROUTES.expenses}`);
      }}
    >
      Regresar
    </Button>
  )

  return (
    <>
      <PageHeader title='Gastos' actions={actions} />
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
          <Stack gap={4}>
            <InputField
              size="xs"
              name="description"
              label="Descripción"
              isRequired
            />
            <InputField
              type="number"
              size="xs"
              name="amount"
              label="Monto"
              isRequired
            />

            <HStack width="100%">
              <SelectField
                isRequired
                label="Tipo"
                name="type"
                size="xs"
                error={errors.type?.message}
                options={EXPENSE_TYPES.map((type) => ({
                  value: type,
                  label: EXPENSE_TYPES_MAP[type],
                }))}
              />
              <SelectField
                isRequired
                label="Estado"
                name="status"
                size="xs"
                options={EXPENSE_STATUS.map((status) => ({
                  value: status,
                  label: EXPENSE_STATUS_MAP[status],
                }))}
              />
            </HStack>

            <HStack width="100%" align="end">
              <DateField size="xs" name="date" label="Fecha" isRequired />

              <Button
                size="xs"
                loading={isMutating || isUploading}
                type="submit"
              >
                Guardar
              </Button>
            </HStack>

            <CopyPaste
              title="Copiar y pegar comprobante"
              type={type}
              resourceId={resourceId}
              onSelect={onSelect}
              onPaste={onPaste}
              metadata={metadata}
              onSuccess={refetchMedias}
            />
          </Stack>
        </form>
      </FormProvider>

      <Show when={uploadedFiles.length > 0}>
        <Stack width="100%" mt={2} spaceY={2}>
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

                  <Flex w='100%' justifyContent="center">
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
        </Stack>
      </Show>

      <Grid
        templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
        gap="2"
      >
        {medias
          .filter((media) => media.url && media.url.trim() !== '')
          .map((media) => (
            <TelegramFileView
              key={media._id}
              media={media}
              description={media.name}
              canDelete
              onRefresh={refetchMedias}
              imageStyle={{ height: '200px' }}
            />
        ))}
      </Grid>
    </>
  );
};
