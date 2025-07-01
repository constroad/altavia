'use client';

import { API_ROUTES, APP_ROUTES } from '@/common/consts';
import { useFetch } from '@/common/hooks/useFetch';
import { TripExpense } from '@/components/trips/TripExpense';
import TripForm from '@/components/trips/TripForm';
import { ITripSchemaValidation } from '@/models/trip';
import { Button, Spinner, Flex } from '@chakra-ui/react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { DashboardLayout } from 'src/components';

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
    <DashboardLayout
      title="Viaje"
      actions={
        <Flex gap={2}>
          <Button
            size="xs"
            variant="outline"
            onClick={() => {
              router.push(`${APP_ROUTES.trips}`);
            }}
          >
            Regresar
          </Button>
          <Button
            type="submit"
            colorScheme="primary"
            w="fit-content"
            size="xs"
            form="form-trip-id"
          >
            Guardar
          </Button>
        </Flex>
      }
    >
      <TripForm trip={data} />
      <br />
      <TripExpense trip={data} />
    </DashboardLayout>
  );
}
