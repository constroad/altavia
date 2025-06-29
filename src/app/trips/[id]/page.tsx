'use client'

import { API_ROUTES, APP_ROUTES } from '@/common/consts';
import { useFetch } from '@/common/hooks/useFetch';
import TripForm from '@/components/trips/TripForm';
import { ITripSchemaValidation } from '@/models/trip';
import { Spinner } from '@chakra-ui/react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import { DashboardLayout } from 'src/components'

export default function Page() {

  const params = useParams();
  const router = useRouter();
  
  const { id: expenseId } = params;

  const { data, isLoading } = useFetch<ITripSchemaValidation>(
    `${API_ROUTES.trips}/:id`,
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

  
  return (
    <DashboardLayout>
      <TripForm trip={data} onCancel={() =>    router.push(`${APP_ROUTES.trips}`)} />
    </DashboardLayout>
  )
}
