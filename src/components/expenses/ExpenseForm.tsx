import { Box, Button, Heading, Stack, Input, Flex } from '@chakra-ui/react';

import { DashboardLayout, toast } from 'src/components';
import { SelectField } from '../../components/form/SelectField';
import { UploadButton } from 'src/components/upload/UploadButton';
import { useState } from 'react';
import { useMutate } from 'src/common/hooks/useMutate';
import { API_ROUTES, APP_ROUTES } from 'src/common/consts';
import { useRouter } from 'next/navigation';

interface ExpenseFormProps {}

export const ExpenseForm = (props: ExpenseFormProps) => {
  const [form, setForm] = useState({
    description: '',
    amount: '',
    type: 'service',
    date: '',
  });

  const router = useRouter();

  // API
  const { mutate: addExpense, isMutating } = useMutate(API_ROUTES.expenses);

  // handlers
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        amount: parseFloat(form.amount),
        date: new Date(form.date),
      };

      addExpense('POST', payload, {
        onSuccess: () => {
          toast.success('Gasto registrado');
        },
      });

      setForm({ description: '', amount: '', type: 'service', date: '' });
    } catch (error) {
      console.log(error);
      toast.error('Error al registrar gasto');
    }
  };

  return (
    <DashboardLayout>
      <Box p={8}>
        <Heading size="xl" mb={6}>
          Registrar Gasto General
        </Heading>
        <Stack gap={4}>
          <Input
            name="description"
            placeholder="Descripción"
            value={form.description}
            onChange={handleChange}
          />
          <Input
            name="amount"
            placeholder="Monto"
            type="number"
            value={form.amount}
            onChange={handleChange}
          />
          <SelectField
            label="Tipo"
            name="type"
            options={[
              { value: 'service', label: 'Servicio' },
              { value: 'spare_part', label: 'Repuesto' },
              { value: 'driver_payment', label: 'Pago a Chofer' },
            ]}
          />

          <Input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
          />
          <UploadButton type="ROUTE_TRACKING" resourceId="JZENA" />
          <Flex width="100%" justifyContent="end" gap={1}>
            <Button loading={isMutating} onClick={handleSubmit}>
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
    </DashboardLayout>
  );
};
