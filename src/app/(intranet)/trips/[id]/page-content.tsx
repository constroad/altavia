'use client';

import { API_ROUTES, APP_ROUTES } from '@/common/consts';
import { useFetch } from '@/common/hooks/useFetch';
import { DisplayOptionIcon, GearIcon, SaveIcon, TrashIcon } from '@/common/icons';
import { PageHeader } from '@/components';
import { IconWrapper } from '@/components/IconWrapper/IconWrapper';
import { TripExpense } from '@/components/trips/TripExpense';
import TripForm from '@/components/trips/TripForm';
import { IPayment, ITripSchemaValidation, TripSchemaValidation, TripStatus } from '@/models/trip';
import { Button, Spinner, Flex, ButtonGroup, Menu, Portal, Box, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function TripSelected() {
  const [savingTrip, setSavingTrip] = useState(false)
  const [open, setOpen] = useState(false);
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

  const shouldLoadDefault = !!data || expenseId === 'new'

  const methods = useForm<ITripSchemaValidation>({
    resolver: zodResolver(TripSchemaValidation),
    defaultValues: shouldLoadDefault
      ? {
          ...(data ?? { status: 'Pending' as TripStatus }),
          startDate: data?.startDate?.split('T')[0] ?? new Date().toDateString(),
          paymentDueDate: data?.paymentDueDate?.split('T')[0] ?? '',
          payments: data?.payments?.map((p: IPayment) => ({
            ...p,
            date: p.date?.split('T')[0] ?? '',
          })) ?? [],
          items: data?.items ?? [],
        }
      : undefined,
  });

  useEffect(() => {
    if (data) {
      methods.reset({
        ...data,
        startDate: data?.startDate?.split('T')[0] ?? '',
        paymentDueDate: data?.paymentDueDate?.split('T')[0] ?? '',
        payments: data?.payments?.map((p: IPayment) => ({
          ...p,
          date: p.date?.split('T')[0] ?? '',
        })) ?? [],
        items: data?.items ?? [],
      });
    }
  }, [data]);

  if (isLoading || (!data && expenseId !== 'new')) {
    return <Spinner />;
  }

  const actions = (
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
          {savingTrip ? <Spinner /> : <IconWrapper icon={SaveIcon} />}
        </Button>

        <Menu.Root>
          <Menu.Trigger asChild>
            <Button
              variant="outline"
              aria-label="Options"
              size="xs"
              roundedLeft='0px'
            >
              <IconWrapper icon={DisplayOptionIcon} />
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item
                  value="rename"
                  onClick={ () => setOpen(true) }
                >
                  <IconWrapper icon={GearIcon} />
                  <Box flex="1" fontSize={12}>Avanzados</Box>
                </Menu.Item>
                <Menu.Item
                  value="delete"
                  color="fg.error"
                  _hover={{ bg: "bg.error", color: "fg.error" }}
                >
                  <IconWrapper icon={TrashIcon} />
                  <Box flex="1" fontSize={12}>Solicitar eliminación</Box>
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </ButtonGroup>
    </Flex>
  )

  return (
    <Flex flexDir='column' width='100%' >
      <PageHeader title='Viaje' actions={actions} />

      <TripForm
        trip={data}
        formMethods={methods}
        onSavingChange={setSavingTrip}
        openAdvance={open}
        setOpenAdvance={setOpen}
      />
      <br />
      <TripExpense
        trip={data}
        formMethods={methods}
      />
    </Flex>
  );
}
