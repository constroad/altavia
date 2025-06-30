'use client';

import { Button, Flex, VStack } from '@chakra-ui/react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputField } from '../form';
import { useEffect } from 'react';
import { useMutate } from 'src/common/hooks/useMutate';
import { API_ROUTES } from 'src/common/consts';
import { toast } from '../Toast';
import { IClientSchemaValidation, clientSchemaValidation } from '@/models/client';

interface ClientFormProps {
  client?: IClientSchemaValidation;
  closeModal: () => void;
}

export const ClientForm = (props: ClientFormProps) => {
  const { client } = props;
  console.log('client en userForm para pasar al mutate:', client);

  const methods = useForm<IClientSchemaValidation>({
    resolver: zodResolver(clientSchemaValidation),
    defaultValues: client,
  });

  const {
    formState: { errors },
  } = methods;

  // API
  const { mutate: createClient, isMutating: creatingClient } = useMutate(
    API_ROUTES.clients
  );
  const { mutate: updateClient, isMutating: updatingClient } = useMutate(
    `${API_ROUTES.clients}/:id`,
    {
      urlParams: { id: client?._id ?? '' },
    }
  );

  useEffect(() => {
    if (client) {
      methods.reset(client);
    }
  }, [client, methods]);

  const onSubmit = (data: IClientSchemaValidation) => {
    if (props.client?._id) {
      //edit
      console.log('ID que se enviará:', props.client?._id);
      updateClient('PUT', data, {
        onSuccess: () => {
          toast.success('El cliente se actualizó correctamente');
          props.closeModal();
        },
        onError: (err) => {
          toast.error('Error al actualizar el cliente');
          console.log(err);
        },
      });
      return;
    }
    // create
    createClient('POST', data, {
      onSuccess: () => {
        toast.success('El cliente se registro correctamente');
        props.closeModal();
      },
      onError: (err) => {
        toast.error('Error al registrar el nuevo cliente');
        console.log(err);
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <VStack spaceY={2}>
          <InputField name="name" label="Nombre" isRequired />
          <InputField name="ruc" label="RUC" />
          <InputField name="address" label="Dirección" />
          <InputField name="phone" label="Teléfono" />
          <InputField name="email" label="Correo" type='email' />

          <Flex w='100%' justifyContent='end' gap={2} mt='10px'>
            <Button
              colorPalette='danger'
              variant='outline'
              onClick={props.closeModal}
              size='sm'
            >
              Cancelar
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              loading={client?._id ? updatingClient : creatingClient }
              size='sm'
            >
              Guardar
            </Button>
          </Flex>
        </VStack>
      </form>
    </FormProvider>
  );
};
