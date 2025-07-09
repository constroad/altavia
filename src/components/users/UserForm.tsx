'use client';

import { Box, Button, Flex, Text, VStack } from '@chakra-ui/react';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputField, SelectField } from '../form';
import { useEffect } from 'react';
import { useMutate } from 'src/common/hooks/useMutate';
import { API_ROUTES } from 'src/common/consts';
import { toast } from '../Toast';
import { IUserSchemaValidation, userSchemaValidation } from 'src/models/user';
import { Checkbox } from '../ui/checkbox';

interface UserFormProps {
  user?: IUserSchemaValidation;
  closeModal: () => void;
}

export const UserForm = (props: UserFormProps) => {
  const { user } = props;
  
  const methods = useForm<IUserSchemaValidation>({
    resolver: zodResolver(userSchemaValidation),
    defaultValues: user,
  });

  const {
    formState: { errors },
  } = methods;

  // API
  const { mutate: createUser, isMutating: creatingUser } = useMutate(
    API_ROUTES.user
  );
  const { mutate: updateUser, isMutating: updatingUser } = useMutate(
    `${API_ROUTES.user}/:id`,
    {
      urlParams: { id: user?._id ?? '' },
    }
  );

  useEffect(() => {
    if (user) {
      methods.reset(user);
    }
  }, [user, methods]);

  const onSubmit = (data: IUserSchemaValidation) => {
    data.userName = data.userName.toLowerCase();

    if (props.user?._id) {
      //edit
      updateUser('PUT', data, {
        onSuccess: () => {
          toast.success('El usuario se actualizo correctamente');
          props.closeModal();
        },
        onError: (err) => {
          toast.error('Error al actualizar el nuevo usuario');
          console.log(err);
        },
      });
      return;
    }
    // create
    createUser('POST', data, {
      onSuccess: () => {
        toast.success('El usuario se registro correctamente');
        props.closeModal();
      },
      onError: (err) => {
        toast.error('Error al registrar el nuevo usuario');
        console.log(err);
      },
    });
  };

  const options = [
    { label: 'Admin', value: 'admin' },
    { label: 'Laboratorio', value: 'laboratory' },
    { label: 'Supervisor', value: 'supervisor' },
    { label: 'Invitado', value: 'guest' },
  ];

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <VStack spaceY={2}>
          <InputField name="name" label="Nombre" isRequired />
          <InputField name="lastName" label="Apellido" isRequired />
          <InputField name="userName" label="Usuario" isRequired />
          <InputField
            name="password"
            label="Contraseña"
            isRequired
            type="password"
          />
          <InputField
            name="doi"
            label="Documento de Identidad (DOI)"
            type="number"
          />

          <Box w="100%">
            <SelectField
              name="role"
              label="Rol"
              isRequired
              options={options}
            />  
          </Box>

          {/* Campo para el estado activo (Checkbox) */}
          <Box w="100%">
            <FormControl>
              <FormLabel fontSize={13}>Activo</FormLabel>
              <Controller
                name="isActive"
                control={methods.control}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    checked={field.value} // Aquí usamos isChecked para vincular el estado del Checkbox
                    value={field.value ? 'true' : 'false'} // Convertimos el valor a string
                    fontSize={10}
                  >
                    <Text fontSize={13}>
                      {field.value ? 'Activo' : 'Inactivo'}
                    </Text>
                  </Checkbox>
                )}
              />
            </FormControl>
          </Box>

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
              loading={user?._id ? updatingUser : creatingUser }
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
