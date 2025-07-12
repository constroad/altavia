'use client';

import React, { useState } from 'react';
import { Box, Button, Flex, useDisclosure } from '@chakra-ui/react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Modal } from '../modal';
import { ItemForm } from './ItemForm';
import { ITripSchemaValidation } from '@/models/trip';
import { z } from 'zod';
import { TableColumn, TableComponent } from '../Table';
import { useMutate } from '@/common/hooks/useMutate';
import { API_ROUTES } from '@/common/consts';
import { toast } from '../Toast';

export const itemSchemaValidation = z.object({
  _id: z.string().optional(),
  code: z.string().optional(),
  product: z.string().min(1, 'Requerido'),
  unit: z.string().optional(),
  amount: z.string().optional(),
  weight: z.string().optional(),
});

export type IItemFormValues = z.infer<typeof itemSchemaValidation>;

interface TripItemsProps {
  tripId?: string;
}

export const TripItems = (props: TripItemsProps) => {
  const { control } = useFormContext<ITripSchemaValidation>();

  const {
    fields,
    append,
    remove,
    update, // 👈 agrega esto si aún no lo tienes
  } = useFieldArray({
    control,
    name: 'items',
  });

  const { open, onOpen, onClose } = useDisclosure();
  const [itemSelected, setItemSelected] = useState<IItemFormValues | undefined>();

  const { mutate } = useMutate(API_ROUTES.trips);

  const onSubmit = (data: IItemFormValues) => {
    console.log("data recibida en submit", data); // <-- TEMPORAL PARA DEBUG
    const isEditing = !!data._id;
  
    const updatedItems = isEditing
      ? fields.map((f) =>
          (f._id || f.id) === data._id ? { ...data } : f
        )
      : [...fields, data];
  
    mutate('PATCH', { items: updatedItems }, {
      requestUrl: `${API_ROUTES.trips}/${props.tripId}`,
      onSuccess: () => {
        toast.success(`Ítem ${isEditing ? 'actualizado' : 'añadido'}`);
  
        if (isEditing) {
          const index = fields.findIndex(f => (f._id || f.id) === data._id);
          if (index !== -1) {
            update(index, {
              _id: data._id,
              code: data.code ?? '',
              product: data.product,
              unit: data.unit ?? '',
              amount: data.amount ?? '',
              weight: data.weight ?? '',
            });
          }
        } else {
          append({
            _id: data._id,
            code: data.code ?? '',
            product: data.product,
            unit: data.unit ?? '',
            amount: data.amount ?? '',
            weight: data.weight ?? '',
          });
        }
  
        handleClose();
      },
      onError: () => {
        toast.error('Error al guardar ítem');
      },
    });
  };

  const handleDeleteItem = (item: any) => {
    const index = fields.findIndex(f => f._id === item._id || f.id === item.id);
    if (index === -1) return;

    const updatedItems = fields.filter((_, i) => i !== index).map((f) => {
      const { id, ...rest } = f;
      return rest;
    });

    // Actualiza en DB
    mutate('PATCH', { items: updatedItems }, {
      requestUrl: `${API_ROUTES.trips}/${props.tripId}`,
      onSuccess: () => {
        toast.success('Ítem eliminado');
        remove(index); // actualiza en UI
      },
      onError: () => {
        toast.error('Error al eliminar ítem');
      }
    });
  };

  const itemColumns = () => {
    const columns: TableColumn[] = [
      {
        key: 'product',
        label: 'Producto',
        width: '25%',
        render: (item) => <>{item}</>,
      },
      {
        key: 'code',
        label: 'Código',
        width: '15%',
        render: (item) => <>{item}</>,
      },
      {
        key: 'unit',
        label: 'Unidad',
        width: '15%',
        render: (item) => <>{item}</>,
      },
      {
        key: 'amount',
        label: 'Cantidad',
        width: '15%',
        render: (item) => <>{item}</>,
      },
      {
        key: 'weight',
        label: 'Peso',
        width: '15%',
        render: (item) => <>{item}</>,
      },
    ];
  
    return columns;
  };
  
  const handleClose = () => {
    setItemSelected(undefined);
    onClose();
  };

  return (
    <Flex direction="column" w="100%">
      <Flex w='100%' justifyContent='end'>
        <Button onClick={onOpen} size="xs" mb={4}>
          + Añadir item
        </Button>
      </Flex>

      <Box w="100%">
        <TableComponent
          itemsPerPage={100}
          data={fields}
          columns={itemColumns()}
          onDelete={(item) => handleDeleteItem(item)}
          onEdit={(item) => {
            setItemSelected({
              _id: item._id || item.id, // asegúrate de setear bien el identificador
              code: item.code,
              product: item.product,
              unit: item.unit,
              amount: item.amount,
              weight: item.weight,
            });
            onOpen();
          }}
          // isLoading={isLoading}
          pagination
          actions
          /> 
      </Box>

      <Modal
        isOpen={open}
        onClose={handleClose}
        heading={itemSelected ? 'Editar item' : 'Añadir item'}
      >
      <ItemForm
        tripId={props.tripId!}
        item={itemSelected}
        onSubmitItem={onSubmit}
        onClose={handleClose}
      />
      </Modal>
    </Flex>
  );
};
