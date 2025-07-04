'use client';
import { API_ROUTES } from '@/common/consts';
import { useFetch } from '@/common/hooks/useFetch';
import { useMutate } from '@/common/hooks/useMutate';
import { useUbigeos } from '@/common/hooks/useUbigeos';
import { RefreshIcon } from '@/common/icons';
import {
  DashboardLayout,
  Modal,
  TableColumn,
  TableComponent,
  toast,
} from '@/components';
import { IconWrapper } from '@/components/IconWrapper/IconWrapper';
import { FormComboBox } from '@/components/form/FormComboBox';
import { RouteCostForm } from '@/components/routeCost/routeCostForm';
import { IRouteCostSchemaValidation } from '@/models/routeCost';
import { formatMoney } from '@/utils/general';
import { Button, useDisclosure, Text, Box, Flex } from '@chakra-ui/react';
import { useState } from 'react';

const Summary = (value: number, bgColor?: string) => {
  return (
    <Box
      as={Flex}
      alignItems="center"
      justifyContent="end"
      bgColor={bgColor ?? 'primary.600'}
      color={'white'}
      fontWeight={600}
      fontSize={11}
      height={30}
    >
      S/.
      {formatMoney(value)}
    </Box>
  );
};

const Page = () => {
  const [costSelected, setCostSelected] =
    useState<IRouteCostSchemaValidation>();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const { open, onOpen, onClose } = useDisclosure();

  //API
  const { data, isLoading, refetch } = useFetch(API_ROUTES.routeCost, {
    queryParams: {
      origin,
      destination,
    },
  });
  const { mutate } = useMutate(API_ROUTES.routeCost);
  const { regions } = useUbigeos();

  const columns: TableColumn[] = [
    {
      key: 'origin',
      label: 'Origen',
      width: '10%',
    },
    { key: 'destination', label: 'Destino', width: '30%' },
    {
      key: 'route',
      label: 'Ruta',
      width: '10%',
    },
    {
      key: 'type',
      label: 'Tipo',
      width: '10%',
    },
    {
      key: 'description',
      label: 'Descripcion',
      textAlign: 'center',
      width: '20%',
    },
    {
      key: 'amount',
      label: 'Monto',
      textAlign: 'end',
      bgColor: 'primary.600',
      width: '10%',
      summary: (value) => Summary(value),
      render: (item, row) => {
        return (
          <Box
            // p={1}
            height="100%"
            bgColor={row.status === 'paid' ? '#d7ead4' : 'pink'}
            rounded={2}
            textAlign="right"
          >
            {<>S/.{formatMoney(item, 1)}</>}
          </Box>
        );
      },
    },
  ];

  const handleDeleteCost = (cost: IRouteCostSchemaValidation) => {
    const deletePath = `${API_ROUTES.routeCost}/${cost._id}`;
    mutate(
      'DELETE',
      {},
      {
        requestUrl: deletePath,
        onSuccess() {
          refetch();
          toast.success('Costo eliminado correctamente');
        },
      }
    );
  };

  return (
    <DashboardLayout
      title="Costo de Ruta"
      actions={
        <Button size="xs" onClick={onOpen}>
          + Nuevo Gasto
        </Button>
      }
    >
      <Flex gap={1} alignItems="end" width="fit-content" mb={4}>
        <FormComboBox
          controlled
          name="origin"
          label="Origen"
          placeholder="Buscar Origen"
          options={
            regions?.map((r: any) => ({
              value: r,
              label: r,
            })) ?? []
          }
          value={origin}
          onChange={([value]: string[]) => setOrigin(value)}
        />
        <FormComboBox
          controlled
          name="destination"
          label="Destino"
          placeholder="Buscar Destino"
          options={
            regions?.map((r: any) => ({
              value: r,
              label: r,
            })) ?? []
          }
          value={destination}
          onChange={([value]: string[]) => setDestination(value)}
        />
        <Button onClick={refetch} size="xs">
          <IconWrapper icon={RefreshIcon} size="18px" />
        </Button>
      </Flex>
      <TableComponent
        isLoading={isLoading}
        data={data ?? []}
        columns={columns}
        actions
        onEdit={(item) => {
          setCostSelected(item);
          onOpen();
        }}
        onDelete={handleDeleteCost}
        toolbar={
          <Flex justifyContent="end" p={1} fontSize={12}>
            <Flex
              gap={1}
              fontWeight={500}
              flexDir={{ base: 'column', md: 'row' }}
            >
              <Text>Registros:</Text>
              <Text>{data?.length ?? 0}</Text>
            </Flex>
          </Flex>
        }
      />

      <Modal
        hideCancelButton
        isOpen={open}
        onClose={onClose}
        heading={costSelected ? 'Editar Costo' : 'Añadir Costo'}
      >
        <RouteCostForm
          routeCost={costSelected}
          onSuccess={() => {
            onClose();
            refetch();
          }}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default Page;
