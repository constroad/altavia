import { Box, Button, Heading, Stack, Flex } from '@chakra-ui/react';

import { DashboardLayout, toast } from 'src/components';
import { SelectField } from '../../components/form/SelectField';
import { UploadButton } from 'src/components/upload/UploadButton';
import { useMutate } from 'src/common/hooks/useMutate';
import { API_ROUTES, APP_ROUTES } from 'src/common/consts';
import { useRouter } from 'next/navigation';
import {
  IExpenseSchema,
  expenseValidationSchema,
} from 'src/models/generalExpense';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DateField from '../form/DateField';
import { InputField } from '../form/InputField';

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
      date: expense?.date ?? new Date(),
    },
  });
  console.log('expense:', expense);

  const {
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = methods;
  const values = watch();
  console.log('values:', values);
  const router = useRouter();

  // API
  const { mutate: addExpense, isMutating } = useMutate(API_ROUTES.expenses);

  // handlers
  const onSubmit = (form: IExpenseSchema) => {
    debugger;
    try {
      const payload = {
        ...form,
        amount: form.amount,
        date: form.date,
      };

      addExpense('POST', payload, {
        onSuccess: () => {
          toast.success('Gasto registrado');
        },
      });
    } catch (error) {
      console.log(error);
      toast.error('Error al registrar gasto');
    }
  };

  return (
    <DashboardLayout>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
          <Box p={8}>
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

              <SelectField
                isRequired
                label="Tipo"
                name="type"
                error={errors.type?.message}
                options={[
                  { value: 'service', label: 'Servicio' },
                  { value: 'spare_part', label: 'Repuesto' },
                  { value: 'driver_payment', label: 'Pago a Chofer' },
                ]}
              />

              <DateField size="xs" name="date" label="Fecha" isRequired />
              <UploadButton type="ROUTE_TRACKING" resourceId="JZENA" />
              <Flex width="100%" justifyContent="end" gap={1}>
                <Button loading={isMutating} type="submit">
                  Guardar
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    router.push(`${APP_ROUTES.expenses}`);
                  }}
                >
                  Cancelar
                </Button>
              </Flex>
            </Stack>
          </Box>
        </form>
      </FormProvider>
    </DashboardLayout>
  );
};
