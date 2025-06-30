'use client';

import React from 'react';
import { DashboardLayout } from 'src/components';
import { TripList } from 'src/components/trips/TripList';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/common/consts';
import { Button } from '@chakra-ui/react';

export default function Page() {
  const router = useRouter();

  return (
    <DashboardLayout
      title="Viajes"
      actions={
        <Button
          colorPalette="primary"
          size="xs"
          onClick={() => router.push(`${APP_ROUTES.expenses}/new`)}
        >
          Nuevo viaje
        </Button>
      }
    >
      <TripList />
    </DashboardLayout>
  );
}
