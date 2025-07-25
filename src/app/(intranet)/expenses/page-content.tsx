'use client';

import { Button, Flex } from '@chakra-ui/react';
import { APP_ROUTES } from 'src/common/consts';
import { ExpenseList } from 'src/components/expenses/ExpenseList';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components';

export default function ExpensesPage() {
  const router = useRouter();

  // handlers
  const handleGoToExpenseId = (id: string) => {
    router.push(`${APP_ROUTES.expenses}/${id}`);
  };

  const actions = (
    <Button size="sm" onClick={() => handleGoToExpenseId('new')}>
      + Nuevo Gasto
    </Button>
  )

  return (
    <Flex flexDir='column' width='100%' >  
      <PageHeader title="Gastos" actions={actions} />
      <ExpenseList />
    </Flex>
  );
}
