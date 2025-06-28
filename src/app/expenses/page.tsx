'use client';

import { Button } from '@chakra-ui/react';
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
    <DashboardLayout
      title="Gastos"
      actions={
        <Button size="sm" onClick={() => handleGoToExpenseId('new')}>
          + Nuevo Gasto
        </Button>
      }
    >
      <ExpenseList />
    </DashboardLayout>
  );
}
