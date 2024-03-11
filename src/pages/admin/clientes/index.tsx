import React, { useEffect, useState } from 'react'
import { Box, Button, Flex, Text, useDisclosure } from '@chakra-ui/react'
import {
  ClientForm,
  Modal,
  TableComponent,
  toast,
  BankAccountType,
  generateClientColumns,
  ClientType,
  InitialClient,
  BankAccountCard,
  generateMobileClientColumns,
  ClientModal,
  AdministrationLayout
} from 'src/components'
import { useAsync, useScreenSize } from 'src/common/hooks';
import { ADMIN_ROUTES, API_ROUTES } from 'src/common/consts';
import { PlusIcon } from 'src/common/icons';

import axios from 'axios'
import { useRouter } from 'next/router';

const fetcher = (path: string) => axios.get(path);
const postClient = (path: string, data: any) => axios.post(path, {data})
const deleteClient = (path: string) => axios.delete(path);

export const ClientsPage = () => {
  const [client, setClient] = useState<ClientType>(InitialClient)
  const [clientsList, setClientsList] = useState<ClientType[]>([])
  const [clientSelected, setClientSelected] = useState<ClientType | undefined>(undefined)
  const [bankAccountSelected, setBankAccountSelected] = useState<BankAccountType | undefined>(undefined)

  const { onClose, isOpen, onOpen } = useDisclosure()
  const { onClose: onCloseDeleteModal, isOpen: isOpenDeleteModal, onOpen: onOpenDeleteModal } = useDisclosure()
  const { onClose: onCloseBankModal, isOpen: isOpenBankModal, onOpen: onOpenBankModal } = useDisclosure()
  const { onClose: onCloseClientModal, isOpen: isOpenClientModal, onOpen: onOpenClientModal } = useDisclosure()

  const { run: runGetClients, isLoading, refetch } = useAsync({ onSuccess(data) { setClientsList(data.data) } }) 
  const { run: runAddClient, isLoading: addingClient } = useAsync()
  const { run: runDeleteClient, isLoading: deletingClient } = useAsync()
  const { run: runEditClient, isLoading: editingClient } = useAsync()
  const { isMobile, isDesktop } = useScreenSize()
  const router = useRouter()
  const prevRoute = router.query.prevRoute;

  useEffect(() => {
    runGetClients(fetcher(API_ROUTES.client), {
      refetch: () => runGetClients(fetcher(API_ROUTES.client)),
    });
  }, []);

  // Bank account
  const handleSelectBankAccount = (acc: BankAccountType, row: ClientType) => {
    setBankAccountSelected(acc)
    setClientSelected(row)
    onOpenBankModal()
  }

  const handleCloseBankModal = () => {
    setBankAccountSelected(undefined)
    setClientSelected(undefined)
    onCloseBankModal()
  }

  // Add client
  const handleCloseFormModal = () => {
    setClientSelected(undefined)
    setClient(InitialClient)
    onClose()
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const listIncludesClient = clientsList.some(x => x.ruc === client.ruc);

    if (!listIncludesClient) {
      runAddClient(postClient(API_ROUTES.client, client), {
        onSuccess: () => {
          toast.success('Cliente añadido con éxito!')
          refetch()
        }
      })
    } else {
      toast.warning('El cliente ya existe en la base de datos')
    }

    onClose()
    setClient(InitialClient)
  }

  // Edit client
  const handleEditClientClick = (client: ClientType) => {
    setClientSelected(client)
    onOpen()
  }

  const handleEditClient = (e: any) => {
    e.preventDefault()
    try {
      runEditClient(axios.put(`${API_ROUTES.client}/${clientSelected?._id}`, clientSelected), {
        onSuccess: () => {
          toast.success('Editaste correctamente la información del cliente')
          refetch()
        }
      })

    } catch (error) {
      console.log(error)
      toast.error('Hubo un problema al editar la información del cliente')
    }
    
    handleCloseFormModal()
  }

  // Delete client
  const handleConfirmDelete = (client: ClientType) => {
    setClientSelected(client)
    onOpenDeleteModal()
  }

  const handleDeleteClient = () => {
    runDeleteClient(deleteClient(`${API_ROUTES.client}/${clientSelected?._id}`), {
      onSuccess: () => {
        toast.success(`Eliminaste al cliente ${clientSelected?.name}`)
        refetch()
      }
    })

    onCloseDeleteModal()
    setClientSelected(undefined)
  }

  // client preview
  const handleSelectClient = (client: ClientType) => {
    setClientSelected(client)
    onOpenClientModal()
  }
  const handleCloseClientModal = () => {
    onCloseClientModal()
    setClientSelected(undefined)
  }

  const columns = generateClientColumns(handleSelectBankAccount)
  const mobileColumns = generateMobileClientColumns(handleSelectClient)

  // Renders
  const footer = (
    <Button
      isLoading={clientSelected ? editingClient : addingClient}
      type="submit"
      autoFocus
      form="add-or-edit-client-form"
      colorScheme='blue'
      size='sm'
    >
      {clientSelected ? 'Guardar cambios' : 'Añadir Cliente'}
    </Button>
  )
  const deleteFooter = (
    <Button
      isLoading={deletingClient}
      variant="ghost"
      autoFocus
      colorScheme='red'
      onClick={handleDeleteClient}
    >
      Confirm
    </Button>
  )

  return (
    <AdministrationLayout>
      <Flex
        flexDir='column'
        alignItems={{base: '', md: ''}}
        width='100%'
        gap='5px'
      >
        <Text
          fontSize={{ base: 25, md: 36 }}
          fontWeight={700}
          color='black'
          lineHeight={{ base: '28px', md: '39px' }}
          marginX='auto'
        >
          Clientes
        </Text>

        <Box width='100%' textAlign='end' gap={2}>
          {prevRoute === ADMIN_ROUTES.generateQuotation && (
            <Button
              size='sm'
              width={{base: '100px', md: '200px'}}
              fontSize={{ base: 10, md: 16 }}
              padding={{ base: '5px', md: '12px' }}
              onClick={() => router.push(ADMIN_ROUTES.generateQuotation)}
              colorScheme='blue'
              gap={2}
              mr='5px'
            >
              Volver a cotizar
            </Button>
          )}
          <Button
            size='sm'
            width={{base: '100px', md: '200px'}}
            fontSize={{ base: 10, md: 16 }}
            padding={{ base: '5px', md: '12px' }}
            onClick={onOpen}
            colorScheme='blue'
            gap={2}
          >
            <Text>Nuevo cliente</Text><PlusIcon />
          </Button>
        </Box>

        <Box w='100%'>
          {isDesktop && (
            <TableComponent
              data={clientsList}
              columns={columns}
              onDelete={handleConfirmDelete}
              onEdit={handleEditClientClick}
              isLoading={isLoading}
              actions
            />
          )}
          {isMobile && (
            <TableComponent
              data={clientsList}
              columns={mobileColumns}
              onDelete={handleConfirmDelete}
              onEdit={handleEditClientClick}
              isLoading={isLoading}
              actions
            />
          )}
        </Box>

        {/* client form modal */}
        <Modal
          isOpen={isOpen}
          onClose={handleCloseFormModal}
          heading={clientSelected ? 'Editar cliente' : 'Añadir cliente'}
          footer={footer}
        >
          <ClientForm
            client={clientSelected ? clientSelected : client}
            setter={clientSelected ? setClientSelected : setClient}
            handleSubmit={ clientSelected ? handleEditClient : handleSubmit }
            clientSelected={clientSelected}
          />
        </Modal>

        {/* delete client modal */}
        <Modal
          isOpen={isOpenDeleteModal}
          onClose={onCloseDeleteModal}
          heading={`¿Estás seguro de eliminar al cliente ${clientSelected?.name}?`}
          footer={deleteFooter}
        />

        {/* bank account modal */}
        <Modal
          isOpen={isOpenBankModal}
          onClose={handleCloseBankModal}
          heading={clientSelected?.name}
        >
          <BankAccountCard bankAccount={bankAccountSelected} />
        </Modal>

        {/* client preview modal */}
        {clientSelected && (
          <Modal
            isOpen={isOpenClientModal}
            onClose={handleCloseClientModal}
            heading={clientSelected?.name}
          >
            <ClientModal client={clientSelected} />
          </Modal>
        )}

      </Flex>
    </AdministrationLayout>
  )
}

export default ClientsPage
