'use client'

import React, { useState } from 'react'
import { Box, Button, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { DashboardLayout, Modal, TableComponent, UserForm, generateUserColumns, toast } from 'src/components'
import { useFetch } from 'src/common/hooks/useFetch';
import { IUserSchemaValidation } from 'src/models/user';
import { API_ROUTES } from 'src/common/consts';
import { useMutate } from 'src/common/hooks/useMutate';
 
export default function Page() {
  const [userSelected, setUserSelected] = useState<IUserSchemaValidation>();
  const { open, onOpen, onClose } = useDisclosure();
  const { open: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();

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
    onCloseDelete()
    setUserSelected(undefined);
    refetch()
  }

  const handleDeleteDriver = () => {
    if (!userSelected) return;
    const deletePath = `${API_ROUTES.user}/${userSelected._id}`
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

  // consts
  const deleteFooter = (
    <Button
      colorPalette="danger"
      variant="outline"
      onClick={handleDeleteDriver}
      loading={isMutating}
    >
      Confirmar
    </Button>
  )
  return (
    <DashboardLayout>
      <Flex
        flexDir='column'
        alignItems={{base: '', md: ''}}
        width='100%'
        gap='5px'
      >
        <Flex width="100%" justifyContent="space-between" alignItems='center'>
          <Text
            fontSize={{ base: 25, md: 36 }}
            fontWeight={700}
            color="black"
            lineHeight={{ base: '28px', md: '39px' }}
          >
            Usuarios
          </Text>

          <Button autoFocus onClick={onOpen} size='sm'>
            Agregar usuario
          </Button>
        </Flex>

        {/* table */}
        <Flex>
           <Box w="100%">
            <TableComponent
              itemsPerPage={100}
              data={data ?? []}
              columns={columns}
              onDelete={(item) => {
                setUserSelected(item);
                onOpenDelete();
              }}
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

        <Modal
          isOpen={isOpenDelete}
          onClose={handleCloseDelete}
          heading={`¿Estás seguro de eliminar al usuario ${userSelected?.name}?`}
          footer={deleteFooter}
        />
      </Flex>
    </DashboardLayout>
  )
}
