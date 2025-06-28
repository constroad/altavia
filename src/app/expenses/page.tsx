'use client';

import { Button, Flex, Stack, Text } from '@chakra-ui/react';
import { DashboardLayout } from 'src/components';
import { APP_ROUTES } from 'src/common/consts';
import { ExpenseList } from 'src/components/expenses/ExpenseList';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  // handlers
  const handleGoToExpenseId = (id: string) => {
    router.push(`${APP_ROUTES.expenses}/${id}`);
  };

  return (
    <DashboardLayout>
      <Stack gap={4}>
        <Flex gap={2} justifyContent="space-between">
          <Text fontWeight={600} fontSize={22}>Gastos Generales</Text>
          <Button size="sm" onClick={() => handleGoToExpenseId('new')}>
            Nuevo Gasto
          </Button>
        </Flex>
        <ExpenseList />
      </Stack>
    </DashboardLayout>
  );
}
