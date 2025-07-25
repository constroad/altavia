'use client';

import React from 'react';
import { TripList } from 'src/components/trips/TripList';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/common/consts';
import { Button, Flex } from '@chakra-ui/react';
import { PageHeader } from '@/components';

export default function TripsPage() {
  const router = useRouter();

  const actions = (
    <Button
      colorPalette="primary"
      size="xs"
      onClick={() => router.push(`${APP_ROUTES.trips}/new`)}
    >
      Nuevo viaje
    </Button>
  )

  return (
    <Flex flexDir='column' width='100%' >
      <PageHeader title='Viajes' actions={actions} />
      <TripList />
    </Flex>
  );
}
