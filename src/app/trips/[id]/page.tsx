'use client';

import { API_ROUTES, APP_ROUTES } from '@/common/consts';
import { useFetch } from '@/common/hooks/useFetch';
import { DisplayOptionIcon, GearIcon, SaveIcon, TrashIcon } from '@/common/icons';
import { TripExpense } from '@/components/trips/TripExpense';
import TripForm from '@/components/trips/TripForm';
import { ITripSchemaValidation } from '@/models/trip';
import { Button, Spinner, Flex, ButtonGroup, Menu, Portal, Box } from '@chakra-ui/react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { DashboardLayout } from 'src/components';

export default function Page() {
  const [savingTrip, setSavingTrip] = useState(false)
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
            variant="solid"
            onClick={() => {
              router.push(`${APP_ROUTES.trips}`);
            }}
          >
            Regresar
          </Button>
          <ButtonGroup
            size="sm"
            attached
            variant="outline"
            colorScheme="green"
          >
            <Button
              type="submit"
              colorScheme="primary"
              w="fit-content"
              size="xs"
              form="form-trip-id"
            >
              Guardar
              {savingTrip ? <Spinner /> : <SaveIcon />}
            </Button>

            <Menu.Root>
              <Menu.Trigger asChild>
                <Button
                  variant="outline"
                  aria-label="Options"
                  size="xs"
                  roundedLeft='0px'
                >
                  <DisplayOptionIcon />
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item value="rename">
                      <GearIcon />
                      <Box flex="1" fontSize={12}>Avanzados</Box>
                    </Menu.Item>
                    <Menu.Item
                      value="delete"
                      color="fg.error"
                      _hover={{ bg: "bg.error", color: "fg.error" }}
                    >
                      <TrashIcon />
                      <Box flex="1" fontSize={12}>Solicitar eliminación</Box>
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </ButtonGroup>
        </Flex>
      }
    >
      <TripForm trip={data} onSavingChange={setSavingTrip} />
      <br />
      <TripExpense trip={data} />
    </DashboardLayout>
  );
}
