import { Button, Stack, Flex, HStack, Grid, Show } from '@chakra-ui/react';

import { DashboardLayout, toast } from 'src/components';
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
import { useState } from 'react';
import { CopyPaste } from '../upload/CopyPaste';
import { formatUtcDateTime } from '@/utils/general';

interface ExpenseFormProps {
  expense: IExpenseSchema | null;
}

export const ExpenseForm = (props: ExpenseFormProps) => {
  const { expense } = props;
  const [fileSelected, setFileSelected] = useState<File | undefined>();

  const isValidExpense = !!expense;
  const resourceId = expense?._id;
  const type = 'GENERAL_EXPENSE';
  const metadata = {
    expenseId: expense?._id,
  };

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

  // handlers
  const onSubmit = (form: IExpenseSchema) => {
    try {
      const payload = {
        ...form,
        amount: form.amount,
        date: form.date,
      };

      //Update
      if (expense?._id) {
        mutateExpense('PUT', payload, {
          requestUrl: `${API_ROUTES.expenses}/${expense._id}`,
          onSuccess: () => {
            toast.success('Gasto Actualizado');
            useFetch.mutate(API_ROUTES.expenses);
          },
        });
        return;
      }

      if (!fileSelected) {
        toast.error('Seleccione un archivo');
        return;
      }

      //Save
      mutateExpense('POST', payload, {
        onSuccess: (response) => {
          toast.success('Gasto registrado');

          // upload
          onUpload(fileSelected, {
            type,
            fileName: fileSelected.name,
            resourceId: response._id,
            metadata: {
              ...metadata,
              expenseId: response._id,
            },
            onSuccess: () => {
              useFetch.mutate(API_ROUTES.expenses);
              refetchMedias();
              router.push(`${APP_ROUTES.expenses}/${response._id}`);
            },
          });

          // sending alert
          sendingAlert(response);
        },
      });
    } catch (error) {
      console.log(error);
      toast.error('Error al registrar gasto');
    }
  };

  const onSelectFile = (file: File | File[]) => {
    if (file instanceof File) {
      setFileSelected(file);
      return;
    }
    setFileSelected(file[0]);
  };

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

  const medias = mediaResponse ?? [];

  return (
    <DashboardLayout
      title="Gastos"
      actions={
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
      }
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
          <Stack gap={4}>
            <InputField
              size="xs"
              name="description"
              label="Nombre"
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
              type="GENERAL_EXPENSE"
              resourceId={resourceId}
              onSelect={!isValidExpense ? onSelectFile : undefined}
              onPaste={!isValidExpense ? onSelectFile : undefined}
              metadata={metadata}
              onSuccess={() => {
                refetchMedias();
              }}
            />
          </Stack>
        </form>
      </FormProvider>

      <Show when={fileSelected}>
        <Flex width="100%" alignItems="center" mt={2} justifyContent="space-between">
          {fileSelected?.name}
          <Button
            size="xs"
            variant="outline"
            onClick={() => setFileSelected(undefined)}
          >
            x
          </Button>
        </Flex>
      </Show>

      <Grid
        templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
        gap="2"
      >
        {medias.map((media) => (
          <TelegramFileView
            key={media._id}
            media={media}
            description={media.name}
            canDelete
            onRefresh={refetchMedias}
            imageStyle={{
              height: '200px',
            }}
          />
        ))}
      </Grid>
    </DashboardLayout>
  );
};
