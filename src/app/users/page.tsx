'use client'

import React, { useState } from 'react'
import { Box, Button, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { DashboardLayout, Modal, TableComponent, UserForm, generateUserColumns, toast } from 'src/components'
import { useFetch } from 'src/common/hooks/useFetch';
import { IUserSchemaValidation, Role } from 'src/models/user';
import { API_ROUTES } from 'src/common/consts';
import { useMutate } from 'src/common/hooks/useMutate';
 
export default function Page() {
  const [userSelected, setUserSelected] = useState<IUserSchemaValidation>();
  console.log('userSelected:', userSelected)

  const { open, onOpen, onClose } = useDisclosure();
  const { open: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();

  const { data, isLoading, refetch } = useFetch<IUserSchemaValidation[]>(
    API_ROUTES.user
  );
  const { mutate, isMutating } = useMutate(API_ROUTES.user)

  const columns = generateUserColumns(); 

  const handleCloseDriverModal = () => {
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
  const creationDate = new Date()
  const deleteFooter = (
    <Button
      colorPalette="danger"
      variant="outline"
      onClick={handleDeleteDriver}
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
        <Flex width="100%" justifyContent="space-between">
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
          onClose={handleCloseDriverModal}
          heading={userSelected ? 'Editar usuario' : 'Añadir usuario'}
        >
          <UserForm
            user={userSelected}
            onSuccess={handleCloseDriverModal}
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
