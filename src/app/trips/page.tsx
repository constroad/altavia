'use client';

import { Button, Flex, Show, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import { API_ROUTES } from 'src/common/consts';
import { useFetch } from 'src/common/hooks/useFetch';
import { DashboardLayout } from 'src/components';
import TripForm from 'src/components/trips/TripForm';
import { TripList } from 'src/components/trips/TripList';

export default function Page() {
  const { open, onOpen, onClose } = useDisclosure();

  // API
  const { data, isLoading, refetch } = useFetch(API_ROUTES.trips);
  const handleSubmit = () => {};
  return (
    <DashboardLayout>
      <Flex gap={2} flexDir="column">
        <Show
          when={open}
          fallback={
            <>
              <Button onClick={onOpen}>Nuevo viaje</Button>
              <TripList />
            </>
          }
        >
          <TripForm
            vehicles={[]}
            drivers={[]}
            clients={[]}
            onSubmit={handleSubmit}
          />
        </Show>
      </Flex>
    </DashboardLayout>
  );
}
