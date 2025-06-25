'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { DashboardLayout } from 'src/components';
import { ExpenseForm } from 'src/components/expenses/ExpenseForm';

const Page = () => {
  const params = useParams();
  const {id: expenseId} = params
  const searchParams = useSearchParams();
  const expenseId2 = searchParams.get('id');

  // Iterate through all query parameters
  searchParams.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });
  // const expenseId = router.query?.id as string;
  console.log('expenseId:', expenseId);

  return <ExpenseForm />;
};

export default Page;
