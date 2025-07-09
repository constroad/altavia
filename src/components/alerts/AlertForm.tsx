'use client';

import { Button, Flex, VStack } from '@chakra-ui/react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputField, SelectField, TextAreaField } from '../form';
import { useMutate } from 'src/common/hooks/useMutate';
import { API_ROUTES } from 'src/common/consts';
import { toast } from '../Toast';
import { useScreenSize } from '@/common/hooks';
import { IAlertSchemaValidation, alertSchemaValidation } from '@/models/alert';
import { useState } from 'react';

interface IAlertForm {
  alert?: IAlertSchemaValidation;
  closeModal: () => void;
}

export const AlertForm = (props: IAlertForm) => {
  const { alert } = props;
  const [status, setStatus] = useState('');
  const { isMobile } = useScreenSize()

  const methods = useForm<IAlertSchemaValidation>({
    resolver: zodResolver(alertSchemaValidation),
    defaultValues: {
      ...(alert ?? {
        status: 'Pending',
      }),
      dueDate: alert?.dueDate?.split?.('T')[0] ?? '',
    },
  });

  const {
    formState: { errors },
  } = methods;

  // API
  const { mutate: createAlert, isMutating: creatingAlert } = useMutate(
    API_ROUTES.alerts
  );
  const { mutate: updateAlert, isMutating: updatingAlert } = useMutate(
    `${API_ROUTES.alerts}/:id`,
    {
      urlParams: { id: alert?._id ?? '' },
    }
  );

  const onSubmit = (data: IAlertSchemaValidation) => {
    if (alert?._id) {
      //edit
      updateAlert('PUT', data, {
        onSuccess: () => {
          toast.success('La alerta se actualizó correctamente');
          props.closeModal();
        },
        onError: (err) => {
          toast.error('Error al actualizar la alerta');
          console.log(err);
        },
      });
      return;
    }
    // create
    createAlert('POST', data, {
      onSuccess: () => {
        toast.success('La alerta se registró correctamente');
        props.closeModal();
      },
      onError: (err) => {
        toast.error('Error al registrar la nueva alerta');
        console.log(err);
      },
    });
  };

  const statusArr = [
    { label: 'Pendiente', value: 'Pending' },
    { label: 'Vencido', value: 'Expired' },
    { label: 'Completado', value: 'Completed' },
  ];

  const typeOptions = [
    { label: 'Vehículo', value: 'vehicle' },
    { label: 'Conductor', value: 'driver' },
    { label: 'Empresa', value: 'company' },
    { label: 'Empleado', value: 'employee' },
  ];

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <VStack spaceY={2}>
          <InputField name="name" label="Nombre" isRequired size='xs' />
          <Flex gap={1} justifyContent="space-between" width="100%">
            <InputField name="dueDate" label="Vence:" type='date' size='xs' isRequired />
            <SelectField
              size="xs"
              label="Estado"
              name="status"
              options={statusArr}
              width="120px"
            />
            <SelectField
              size="xs"
              label="Tipo"
              name="type"
              options={typeOptions}
              width="120px"
            />
          </Flex>
          <Flex gap={1} justifyContent="space-between" width="100%">
            <TextAreaField name="description" label="Descripción" />
            
          </Flex>
          <Flex w='100%' justifyContent='end' gap={2} mt='10px'>
            <Button
              colorPalette='danger'
              variant='outline'
              onClick={props.closeModal}
              size={ isMobile ? 'xs' : 'sm' }
            >
              Cancelar
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              loading={alert?._id ? updatingAlert : creatingAlert }
              size={ isMobile ? 'xs' : 'sm' }
            >
              Guardar
            </Button>
          </Flex>
        </VStack>
      </form>
    </FormProvider>
  );
};
