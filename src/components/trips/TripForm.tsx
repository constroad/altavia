'use client';
import { FormProvider, useForm } from 'react-hook-form';
import {
  Button,
  VStack,
  HStack,
  Flex,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { ITripSchemaValidation, TripSchemaValidation } from 'src/models/trip';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormTextarea, InputField, SelectField } from '../form';

import { ExpenseModal } from './ExpenseModal';
import { useUbigeos } from '@/common/hooks/useUbigeos';

import { PageLayout } from '../layout/Dashboard/PageLayout';
import { useFetch } from '@/common/hooks/useFetch';
import { API_ROUTES, APP_ROUTES } from '@/common/consts';
import { useMutate } from '@/common/hooks/useMutate';
import { TableColumn, TableComponent, toast } from 'src/components';
import { useRouter } from 'next/navigation';
import {
  EXPENSE_STATUS_MAP,
  EXPENSE_STATUS_TYPE,
  IExpenseSchema,
} from '@/models/generalExpense';
import { formatUtcDateTime } from '@/utils/general';
import { ImageView } from '../telegramFileView/imageView';
import { metadata } from '../../app/nosotros/page';
import { IMediaValidationSchema } from '@/models/media';
import { useState } from 'react';
import { IconWrapper } from '../IconWrapper/IconWrapper';
import { RefreshIcon } from '@/common/icons';

type ITripForm = {
  trip: ITripSchemaValidation | null;
  onCancel: () => void;
};

export default function TripForm(props: Readonly<ITripForm>) {
  const { onCancel, trip } = props;

  const { open, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const [expenseSelected, setExpenseSelected] = useState<
    IExpenseSchema | undefined
  >();

  // API
  const { data: drivers, isLoading: isLoadingDrivers } = useFetch(
    API_ROUTES.drivers
  );
  const { data: vehicles, isLoading: isLoadingVehicles } = useFetch(
    API_ROUTES.vehicles
  );
  const { data: clients, isLoading: isLoadingClients } = useFetch(
    API_ROUTES.clients
  );

  const {
    data: expenses,
    isLoading: isLoadingExpenses,
    refetch: refetchExpenses,
  } = useFetch<IExpenseSchema[]>(API_ROUTES.expenses, {
    queryParams: {
      tripId: trip?._id,
    },
    enabled: trip?._id !== undefined,
  });
  const { data: medias, refetch: refetchMedias } = useFetch<
    IMediaValidationSchema[]
  >(API_ROUTES.media, {
    queryParams: {
      resourceId: trip?._id,
    },
    enabled: trip?._id !== undefined,
  });

  const { mutate: mutateTrip, isMutating } = useMutate(API_ROUTES.trips);
  const { mutate: mutateExpense } = useMutate(API_ROUTES.expenses);

  const { regions } = useUbigeos();

  const methods = useForm<ITripSchemaValidation>({
    resolver: zodResolver(TripSchemaValidation),
    defaultValues: {
      ...(trip ?? {}),
      startDate: trip?.startDate?.split?.('T')[0] ?? '',
    },
  });

  const statusArr = [
    { label: 'Pendiente', value: 'Pending' },
    { label: 'En Ruta', value: 'InProgress' },
    { label: 'Completado', value: 'Completed' },
    { label: 'Eliminado', value: 'Deleted' },
  ];
  const regionsArr = regions.map((r) => ({
    label: r,
    value: r,
  }));

  const columns: TableColumn[] = [
    {
      key: 'date',
      label: 'Fecha',
      width: '20%',
      textAlign: 'center',
      render: (item) => <Text>{formatUtcDateTime(item)}</Text>,
    },
    { key: 'description', label: 'Descripcion', width: '20%' },
    {
      key: 'amount',
      label: 'Cantidad',
      textAlign: 'center',
      width: '10%',
    },
    {
      key: 'status',
      label: 'Estado',
      textAlign: 'center',
      width: '20%',
      render: (item) => {
        return <>{EXPENSE_STATUS_MAP[item as EXPENSE_STATUS_TYPE]}</>;
      },
    },
    {
      key: '_id',
      label: 'Imagenes',
      textAlign: 'center',
      width: '20%',
      render: (item, row) => {
        const expenseMedias =
          medias?.filter?.((x) => x.metadata.expenseId === row._id) ?? [];
        return (
          <Flex gap={1} alignItems="center" width="100%">
            {expenseMedias.map?.((m) => (
              <ImageView width="60px" height="60px" key={m._id} media={m} />
            ))}
          </Flex>
        );
      },
    },
  ];

  const onSubmit = (form: ITripSchemaValidation) => {
    try {
      const { _id, ...rest } = form;
      const payload = {
        ...rest,
      };

      //Update
      if (_id) {
        mutateTrip('PUT', payload, {
          requestUrl: `${API_ROUTES.expenses}/${_id}`,
          onSuccess: () => {
            toast.success('Viaje Actualizado');
            useFetch.mutate(API_ROUTES.trips);
          },
        });
        return;
      }

      //Save
      mutateTrip('POST', payload, {
        onSuccess: (response) => {
          toast.success('Viaje registrado');
          useFetch.mutate(API_ROUTES.trips);
          router.push(`${APP_ROUTES.trips}/${response._id}`);
        },
      });
    } catch (error) {
      console.log(error);
      toast.error('Error al registrar viaje');
    }
  };

  const handleDeleteExpense = (expense: IExpenseSchema) => {
    mutateExpense(
      'DELETE',
      {},
      {
        requestUrl: `${API_ROUTES.expenses}/${expense._id}`,
        onSuccess: () => {
          toast.success('Gasto eliminado');
          refetchExpenses();
        },
      }
    );
  };
  const handleSelectExpense = (expense: IExpenseSchema) => {
    setExpenseSelected(expense);
    onOpen();
  };

  return (
    <PageLayout title="Nuevo Viaje" onBack={onCancel}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
          <VStack gap={2} w="100%" mt="10px">
            {/* CLIENTES */}
            <Flex w="100%" justifyContent="space-between">
              <SelectField
                loading={isLoadingClients}
                isRequired
                size="xs"
                name="client"
                label="Cliente"
                options={(clients ?? []).map((x: any) => ({
                  label: x.name,
                  value: x._id,
                }))}
              />
              <Button
                type="submit"
                colorScheme="primary"
                w="fit-content"
                size="xs"
                loading={isMutating}
              >
                Guardar
              </Button>
            </Flex>

            {/* ORIGEN - DESTINO */}
            <HStack gap={4} w="100%">
              <Flex w="100%" gap={4}>
                <SelectField
                  isRequired
                  size="xs"
                  name="origin"
                  label="Origen"
                  options={regionsArr}
                />
                <SelectField
                  isRequired
                  size="xs"
                  name="destination"
                  label="Destino"
                  options={regionsArr}
                />
              </Flex>
            </HStack>

            {/* VEHICLE - DRIVER */}
            <HStack gap={4} w="100%">
              <Flex w="100%" gap={4}>
                <SelectField
                  name="vehicle"
                  label="Vehículo"
                  options={(vehicles ?? []).map((x: any) => ({
                    label: x.plate,
                    value: x._id,
                  }))}
                  multiple
                  size="xs"
                  loading={isLoadingVehicles}
                />
                <SelectField
                  name="driver"
                  label="Conductor"
                  options={(drivers ?? []).map((x: any) => ({
                    label: x.name,
                    value: x._id,
                  }))}
                  multiple
                  size="xs"
                  loading={isLoadingDrivers}
                />
              </Flex>
            </HStack>

            {/* START DATE - END DATE */}
            <HStack gap={4} w="100%">
              <Flex w="100%" gap={4}>
                <InputField
                  type="date"
                  name="startDate"
                  label="Fecha inicio"
                  size={'xs'}
                  isRequired
                />
                <InputField
                  type="date"
                  name="endDate"
                  label="Fecha fin"
                  size={'xs'}
                />
              </Flex>
            </HStack>

            {/* GANANCIA - KILOMETRAJE */}
            {/* <Flex w="100%" gap={4}>
              <Flex w="50%">
                <InputField
                  type="number"
                  name="revenue"
                  label="Ganancia"
                  isRequired
                   size={'xs'}
                />
              </Flex>
              <Flex w="50%">
                <InputField
                  type="number"
                  name="kmTravelled"
                  label={isMobile ? 'Km. recorrido' : 'Kilometraje recorrido'}
                  isRequired
                   size={'xs'}
                />
              </Flex>
            </Flex> */}

            {/* STATUS - FECHA DE PAGO */}
            <HStack gap={4} w="100%">
              <Flex w="100%" gap={4}>
                <Flex w="50%">
                  <SelectField
                    name="status"
                    label="Estado"
                    options={statusArr}
                    size={{ base: 'xs', md: 'sm' }}
                  />
                </Flex>
                {/* <Flex w="50%">
                  <InputField
                    type="date"
                    name="paymentDueDate"
                    label="Fecha de pago"
                    size={{ base: 'xs', md: 'sm' }}
                  />
                </Flex> */}
              </Flex>
            </HStack>

            {/* NOTAS */}
            <Flex w="100%">
              <FormTextarea name="notes" label="Notas" />
            </Flex>

            <VStack align="start" w="100%">
              <Flex w="100%" gap="10px">
                <TableComponent
                  isLoading={isLoadingExpenses}
                  data={expenses ?? []}
                  columns={columns}
                  actions
                  onEdit={handleSelectExpense}
                  onDelete={handleDeleteExpense}
                  toolbar={
                    <Flex
                      alignItems="center"
                      justifyContent="space-between"
                      fontSize="12px"
                      m={1}
                    >
                      <Flex gap={2}>
                        <Button
                          size="xs"                          
                          onClick={() => {
                            onOpen();
                            setExpenseSelected(undefined);
                          }}
                        >
                          + Gasto
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            refetchExpenses();
                            refetchMedias();
                          }}
                          size="xs"
                        >
                          <IconWrapper icon={RefreshIcon} size="18px" />
                        </Button>
                      </Flex>
                      <Text fontWeight={600}>
                        Total:
                        {expenses?.reduce((acc, curr) => acc + curr.amount, 0)}
                      </Text>
                    </Flex>
                  }
                />
              </Flex>
            </VStack>
          </VStack>
        </form>

        <ExpenseModal
          expense={expenseSelected}
          resourceId={trip?._id!}
          open={open}
          onClose={() => {
            setExpenseSelected(undefined);
            onClose();
            refetchExpenses();
            refetchMedias();
          }}
        />
      </FormProvider>
    </PageLayout>
  );
}
