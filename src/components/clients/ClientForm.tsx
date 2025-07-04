'use client';

import { Button, Flex, VStack } from '@chakra-ui/react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputField } from '../form';
import { useEffect } from 'react';
import { useMutate } from 'src/common/hooks/useMutate';
import { API_ROUTES } from 'src/common/consts';
import { toast } from '../Toast';
import {
  IClientSchemaValidation,
  clientSchemaValidation,
} from '@/models/client';
import { useWhatsapp } from '@/common/hooks/useWhatsapp';
import { FormComboBox } from '../form/FormComboBox';
import { IconWrapper } from '../IconWrapper/IconWrapper';
import { RefreshIcon } from '@/common/icons';

interface ClientFormProps {
  client?: IClientSchemaValidation;
  closeModal: () => void;
}

export const ClientForm = (props: ClientFormProps) => {
  const { client } = props;

  const methods = useForm<IClientSchemaValidation>({
    resolver: zodResolver(clientSchemaValidation),
    defaultValues: client,
  });

  const {
    setValue,
    formState: { errors },
  } = methods;

  // API
  const { groups, isLoadingGroups, refetchGroups } = useWhatsapp({
    page: 'ClientForm',
  });
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

  const handleSelectWhatsAppNotification =
    (key: string) => ([value]: string[]) => {
      const notifications = client?.notifications;

      setValue('notifications', {
        ...notifications,
        [key]: value,
      } as IClientSchemaValidation['notifications']);
    };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <VStack spaceY={1}>
        <Flex gap={1} justifyContent="space-between" width="100%">

          <InputField size="xs" name="name" label="Nombre" isRequired />
          <InputField size="xs" name="ruc" label="RUC" />
        </Flex>
        
          <InputField size="xs" name="address" label="Dirección" />
          <Flex gap={1} justifyContent="space-between" width="100%">
            <InputField size="xs" name="phone" label="Teléfono" />
            <InputField size="xs" name="email" label="Correo" type="email" />
          </Flex>
          <Flex width="100%" gap={2} alignItems="end">
            <FormComboBox
              controlled
              name="whatsAppAlerts"
              label="WhatsApp para envio de alertas:"
              placeholder="Escriba un grupo"
              options={
                groups?.map((x: any) => ({
                  value: x.id,
                  label: x.name,
                })) ?? []
              }
              value={client?.notifications?.whatsAppAlerts ?? ''}
              loading={isLoadingGroups}
              onChange={handleSelectWhatsAppNotification('whatsAppAlerts')}
            />
            <Button onClick={refetchGroups} size="xs" loading={isLoadingGroups}>
              <IconWrapper icon={RefreshIcon} size="18px" />
            </Button>
          </Flex>
          <Flex width="100%" gap={2} alignItems="end">
            <FormComboBox
              controlled
              name="whatsAppAlerts"
              label="WhatsApp para envio pagos y facturas:"
              placeholder="Escriba un grupo"
              options={
                groups?.map((x: any) => ({
                  value: x.id,
                  label: x.name,
                })) ?? []
              }
              value={client?.notifications?.whatsAppManagement ?? ''}
              loading={isLoadingGroups}
              onChange={handleSelectWhatsAppNotification('whatsAppAlerts')}
            />
            <Button onClick={refetchGroups} size="xs" loading={isLoadingGroups}>
              <IconWrapper icon={RefreshIcon} size="18px" />
            </Button>
          </Flex>

          <Flex w="100%" justifyContent="end" gap={2} mt="10px">
            <Button
              colorPalette="danger"
              variant="outline"
              onClick={props.closeModal}
              size="sm"
            >
              Cancelar
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              loading={client?._id ? updatingClient : creatingClient}
              size="sm"
            >
              Guardar
            </Button>
          </Flex>
        </VStack>
      </form>
    </FormProvider>
  );
};
