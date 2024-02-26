import React, { useEffect, useState } from 'react'
import { Box, Button, Flex, Text, useDisclosure } from '@chakra-ui/react'
import {
  ClientForm,
  IntranetLayout,
  Modal,
  TableComponent,
  toast,
  BankAccountType,
  generateTableColumns,
  ClientType,
  InitialClient,
  BankAccountCard
} from 'src/components'
import { useAsync } from 'src/common/hooks';
import { API_ROUTES } from 'src/common/consts';
import { PlusIcon } from 'src/common/icons';

import axios from 'axios'

const fetcher = (path: string) => axios.get(path);
const postClient = (path: string, data: any) => axios.post(path, {data})
export const ClientsPage = () => {
  const [client, setClient] = useState<ClientType>(InitialClient)
  const [clientsList, setClientsList] = useState<ClientType[]>([])
  const [clientSelected, setClientSelected] = useState<ClientType | undefined>(undefined)
  const [bankAccountSelected, setBankAccountSelected] = useState<BankAccountType | undefined>(undefined)

  const { onClose, isOpen, onOpen } = useDisclosure()
  const { onClose: onCloseDeleteModal, isOpen: isOpenDeleteModal, onOpen: onOpenDeleteModal } = useDisclosure()
  const { onClose: onCloseBankModal, isOpen: isOpenBankModal, onOpen: onOpenBankModal } = useDisclosure()

  const { run: runGetClients, isLoading, refetch } = useAsync({
    onSuccess(data) {
      setClientsList(data.data)
    },
  }) 
  const { run: runAddClient, isLoading: addingClient } = useAsync({ onSuccess: () => refetch() })
  const { run: runDeleteClient, isLoading: deletingClient } = useAsync({ onSuccess: () => refetch() })
  const { run: runEditClient, isLoading: editingClient } = useAsync({ onSuccess: () => refetch() })

  useEffect(() => {
    runGetClients(fetcher(API_ROUTES.client), {
      refetch: () => runGetClients(fetcher(API_ROUTES.client)),
    });
  }, []);

  // ---- BANK ACCOUNT ---- //
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

  // ---- TABLE COLUMNS ---- //
  const columns = generateTableColumns(handleSelectBankAccount)

  // ---- ADD CLIENT ---- //
  const handleCloseFormModal = () => {
    setClientSelected(undefined)
    setClient(InitialClient)
    onClose()
  }

  const handleSubmit = (e: any) => {
    console.log('clicking...')
    e.preventDefault()
    const listIncludesClient = clientsList.some(x => x.ruc === client.ruc);

    if (!listIncludesClient) {
      runAddClient(postClient(API_ROUTES.client, client))
      toast.success('Cliente añadido con éxito!')

    } else {
      toast.warning('El cliente ya existe en la base de datos')
    }

    onClose()
    setClient(InitialClient)
  }

  // ---- EDIT CLIENT ---- //
  const handleEditClientClick = (client: ClientType) => {
    setClientSelected(client)
    onOpen()
  }

  const handleEditClient = (e: any) => {
    e.preventDefault()
    try {
      runEditClient(axios.put(`${API_ROUTES.client}/${clientSelected?._id}`, clientSelected))
      toast.success('Editaste correctamente la información del cliente')

    } catch (error) {
      console.log(error)
      toast.error('Hubo un problema al editar la información del cliente')
    }
    
    handleCloseFormModal()
  }

  // ---- DELETE CLIENT ---- //
  const handleConfirmDelete = (client: ClientType) => {
    setClientSelected(client)
    onOpenDeleteModal()
  }

  const handleDeleteClient = () => {
    runDeleteClient(axios.delete(`${API_ROUTES.client}/${clientSelected?._id}`))
    toast.success(`Eliminaste al cliente ${clientSelected?.name}`)

    onCloseDeleteModal()
    setClientSelected(undefined)
  }

  // ---- RENDERS ---- //
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
    <IntranetLayout>
      <Flex
        flexDir='column'
        alignItems={{base: '', md: ''}}
        marginX='auto'
        gap='15px'
      >
        <Text
          fontSize={{ base: 25, md: 36 }}
          fontWeight={700}
          color='black'
          lineHeight={{ base: '28px', md: '39px' }}
          marginX='auto'
          marginTop='10px'
        >
          Clientes
        </Text>

        <Box width='100%' textAlign='end' gap={2}>
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

        <TableComponent
          data={clientsList}
          columns={columns}
          onDelete={handleConfirmDelete}
          onEdit={handleEditClientClick}
          isLoading={isLoading}
          actions
        />

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

        <Modal
          isOpen={isOpenDeleteModal}
          onClose={onCloseDeleteModal}
          heading={`¿Estás seguro de eliminar al cliente ${clientSelected?.name}?`}
          footer={deleteFooter}
        />

        <Modal
          isOpen={isOpenBankModal}
          onClose={handleCloseBankModal}
          heading={clientSelected?.name}
        >
          <BankAccountCard bankAccount={bankAccountSelected} />
        </Modal>

      </Flex>
    </IntranetLayout>
  )
}

export default ClientsPage
