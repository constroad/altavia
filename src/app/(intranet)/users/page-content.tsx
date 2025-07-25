'use client'

import React, { useState } from 'react'
import { Box, Button, Flex, useDisclosure } from '@chakra-ui/react';
import { Modal, PageHeader, TableComponent, UserForm, generateUserColumns, toast } from 'src/components'
import { useFetch } from 'src/common/hooks/useFetch';
import { IUserSchemaValidation } from 'src/models/user';
import { API_ROUTES } from 'src/common/consts';
import { useMutate } from 'src/common/hooks/useMutate';
 
export default function UsersPage() {
  const [userSelected, setUserSelected] = useState<IUserSchemaValidation>();
  const { open, onOpen, onClose } = useDisclosure();

  const { data, isLoading, refetch } = useFetch<IUserSchemaValidation[]>(
    API_ROUTES.user
  );
  const { mutate, isMutating } = useMutate(API_ROUTES.user)

  const columns = generateUserColumns(); 

  const handleCloseUserModal = () => {
    onClose();
    setUserSelected(undefined);
    refetch()
  };

  const handleCloseDelete = () => {
    setUserSelected(undefined);
    refetch()
  }

  const handleDeleteUser = (user: IUserSchemaValidation) => {
    const deletePath = `${API_ROUTES.user}/${user._id}`
    mutate(
      'DELETE',
      {},
      {
        requestUrl: deletePath,
        onSuccess() {
          handleCloseDelete()
          toast.success('Usuario eliminado correctamente')
        },
      }
    )
  }

  const actions = (
    <Button autoFocus onClick={onOpen} size='sm'>
      Agregar usuario
    </Button>
  )

  return (
    <Flex flexDir='column' width='100%' >
      <PageHeader title='Usuarios' actions={actions} />
      <Flex>
          <Box w="100%">
          <TableComponent
            itemsPerPage={100}
            data={data ?? []}
            columns={columns}
            onDelete={(item) => handleDeleteUser(item)}
            deleteMessage='Esta seguro de eliminar este usuario?'
            onEdit={(item) => {
              setUserSelected(item);
              onOpen();
            }}
            isLoading={isLoading}
            pagination
            actions
          /> 
        </Box>
      </Flex>

      <Modal
        hideCancelButton
        isOpen={open}
        onClose={handleCloseUserModal}
        heading={userSelected ? 'Editar usuario' : 'Añadir usuario'}
      >
        <UserForm
          user={userSelected}
          closeModal={handleCloseUserModal}
        />
      </Modal>
    </Flex>
  )
}
