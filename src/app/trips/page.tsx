'use client';

import { Box, Button, Flex, Show, Text, useDisclosure } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import React from 'react';
import { API_ROUTES, APP_ROUTES } from 'src/common/consts';
import { useFetch } from 'src/common/hooks/useFetch';
import { DashboardLayout } from 'src/components';
import TripForm from 'src/components/trips/TripForm';
import { TripList } from 'src/components/trips/TripList';
import { useRouter } from 'next/navigation';

export default function Page() {
  const { open, onOpen, onClose } = useDisclosure();
  const { data: session } = useSession();
  const router = useRouter();

  // API
  const { data, isLoading, refetch } = useFetch(API_ROUTES.trips);


  const handleCreateTrip = (id: string) => {
    router.push(`${APP_ROUTES.trips}/${id}`);
  }

  const handleSubmit = () => {};




  // consts
  const vehiclesArr = [
    { label: 'Mu', value: 'vehicle1' },
    { label: 'Aldebaran', value: 'vehicle2' },
  ]

  const driversArr = [
    { label: 'Hector', value: 'driver1' },
    { label: 'Zamora', value: 'driver2' },
  ]

  const clientsArr = [
    { label: 'Cliente 1', value: 'client1' },
    { label: 'Cliente 2', value: 'client2' },
  ]


  return (
    <DashboardLayout>
      <Flex gap={2} flexDir="column">
        <Show
          when={open}
          fallback={
            <>
              <Flex width="100%" justifyContent="space-between" alignItems='center'>
                <Text
                  fontSize={{ base: 25, md: 36 }}
                  fontWeight={700}
                  lineHeight={{ base: '28px', md: '39px' }}
                >
                  Trips
                </Text>
                <Button autoFocus onClick={onOpen} colorPalette='primary' size={{ base: 'xs', md: 'sm' }}>
                  Nuevo viaje
                </Button>
              </Flex>

              <TripList />
            </>
          }
        >
          <TripForm
            vehicles={vehiclesArr}
            drivers={driversArr}
            clients={clientsArr}
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        </Show>
      </Flex>
    </DashboardLayout>
  );
}
