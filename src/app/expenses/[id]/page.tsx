'use client';

import { Spinner } from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import { API_ROUTES } from 'src/common/consts';
import { useFetch } from 'src/common/hooks/useFetch';
import { ExpenseForm } from 'src/components/expenses/ExpenseForm';
import { IExpenseSchema } from 'src/models/generalExpense';

const Page = () => {
  const params = useParams();
  const { id: expenseId } = params;

  const { data, isLoading } = useFetch<IExpenseSchema>(
    `${API_ROUTES.expenses}/:id`,
    {
      urlParams: {
        id: expenseId as string,
      },
      enabled: !!expenseId && expenseId !== 'new',
    }
  );

  if (isLoading) {
    return <Spinner />;
  }

  return <ExpenseForm expense={data} />;
};

export default Page;
