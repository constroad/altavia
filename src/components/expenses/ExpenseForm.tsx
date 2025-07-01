import {
  Box,
  Button,
  Heading,
  Stack,
  Flex,
  Show,
  HStack,
} from '@chakra-ui/react';

import { DashboardLayout, toast } from 'src/components';
import { SelectField } from '../../components/form/SelectField';
import { UploadButton } from 'src/components/upload/UploadButton';
import { useMutate } from 'src/common/hooks/useMutate';
import { ALTAVIA_BOT, API_ROUTES, APP_ROUTES, GROUP_ADMINISTRACION_ALTAVIA } from 'src/common/consts';
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

interface ExpenseFormProps {
  expense: IExpenseSchema | null;
}

export const ExpenseForm = (props: ExpenseFormProps) => {
  const { expense } = props;
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
  const { medias: mediaResponse, refetch: refetchMedias } = useMedias({
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

      //Save
      mutateExpense('POST', payload, {
        onSuccess: (response) => {
          sendingAlert(response)
          toast.success('Gasto registrado');
          useFetch.mutate(API_ROUTES.expenses);
          router.push(`${APP_ROUTES.expenses}/${response._id}`);
        },
      });
    } catch (error) {
      console.log(error);
      toast.error('Error al registrar gasto');
    }
  };

  function sendingAlert(expense: IExpenseSchema) {    
    //@ts-ignore
    const date = formatUtcDateTime(expense.date as string)

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
          <Heading size="xl" mb={6}>
            Registrar Gasto General
          </Heading>
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

            <DateField size="xs" name="date" label="Fecha" isRequired />
            <Flex width="100%" justifyContent="end" gap={1}>
              <UploadButton
                title="Adjuntar comprobante"
                type="TRIP_EXPENSE"
                resourceId={expense?._id}
                onSuccess={refetchMedias}
                isDisabled={expense?._id === undefined}
              />

              <Button size="xs" loading={isMutating} type="submit">
                Guardar
              </Button>
            </Flex>
          </Stack>
        </form>
      </FormProvider>

      <Flex gap={2}>
        {medias.map((media) => (
          <TelegramFileView
            key={media._id}
            media={media}
            description={media.name}
            canDelete
            onRefresh={refetchMedias}
            imageStyle={{
              height: '300px',
            }}
          />
        ))}
      </Flex>
    </DashboardLayout>
  );
};
