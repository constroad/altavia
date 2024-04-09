import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Box, Button, Flex, Text, useDisclosure } from '@chakra-ui/react';
import {
  AdministrationLayout,
  Modal,
  ProviderForm,
  ProviderModal,
  ProviderType,
  TableComponent,
  generateMobileProvColumns,
  generateProviderColumns,
  initialProvider,
  toast
} from 'src/components'
import { API_ROUTES } from 'src/common/consts';
import { useAsync, useScreenSize } from 'src/common/hooks';
import { PlusIcon } from 'src/common/icons';

const fetcher = (path: string) => axios.get(path)
const postProv = (path: string, data: ProviderType) => axios.post(path, { data })
const updateProv = (path: string, data: ProviderType) => axios.put(path, { data})
const deleteProv = (path: string) => axios.delete(path)

export const ProvidersPage = () => {
  const [provider, setProvider] = useState<ProviderType>(initialProvider)
  const [providersList, setProvidersList] = useState<ProviderType[]>([])
  const [providerSelected, setProviderSelected] = useState<ProviderType | undefined>()
  const [descriptionNote, setDescriptionNote] = useState('')

  const { isOpen: isOpenForm, onOpen: onOpenForm, onClose: onCloseForm } = useDisclosure()
  const { isOpen: isOpenDeleteModal, onOpen: onOpenDeleteModal, onClose: onCloseDeleteModal } = useDisclosure()
  const { isOpen: isOpenDescNote, onOpen: onOpenDescNote, onClose: onCloseDescNote } = useDisclosure()
  const { isOpen: isOpenProvModal, onOpen: onOpenProvModal, onClose: onCloseProvModal } = useDisclosure() 
  const { isMobile, isDesktop } = useScreenSize()

  const { run: runGetProviders, isLoading, refetch } = useAsync({ onSuccess(data) { setProvidersList(data.data) } })
  const { run: runAddProvider, isLoading: addingProvider } = useAsync()
  const { run: runEditProvider, isLoading: editingProvider } = useAsync()
  const { run: runDeleteProvider, isLoading: deletingProvider } = useAsync()

  useEffect(() => {
    runGetProviders(fetcher(API_ROUTES.provider), {
      refetch: () => runGetProviders(fetcher(API_ROUTES.provider)),
      cacheKey: API_ROUTES.provider
    })
  }, []) 
  
  const handleCloseFormModal = () => {
    onCloseForm()
    setProvider(initialProvider)
    setProviderSelected(undefined)
  }

  // description - notes preview
  const handleOpenDescOrNote = (type: string, prov: ProviderType) => {
    setDescriptionNote(type)
    setProviderSelected(prov)
    onOpenDescNote()
  }
  const handleCloseDescOrNote = () => {
    onCloseDescNote()
    setDescriptionNote('')
    setProviderSelected(undefined)
  }

  // provider mobile preview
  const handleSelectProvider = (prov: ProviderType) => {
    setProviderSelected(prov)
    onOpenProvModal()
  }
  const handleCloseProvModal = () => {
    onCloseProvModal()
    setProviderSelected(undefined)
  }

  const columns = generateProviderColumns(handleSelectProvider)
  const mobileColumns = generateMobileProvColumns(handleSelectProvider)

  // Add client
  const handleSubmit = (e: any) => {
    e.preventDefault()
    const listIncludesProvider = providersList.some(x => x.name === provider.name);

    if (!listIncludesProvider) {
      runAddProvider(postProv(API_ROUTES.provider, provider), {
        onSuccess: () => {
          toast.success('Proveedor añadido con éxito!')
          refetch()
        }, 
        onError(error) {
          console.log(error)
        },
      })
    } else {
      toast.warning('El Proveedor ya existe en la base de datos')
    }

    handleCloseFormModal()
  }

  // Edit client
  const handleEditClick = (prov: ProviderType) => {
    setProviderSelected(prov)
    onOpenForm()
  }

  const handleEditProvider = (e: any) => {
    e.preventDefault()
    
    runEditProvider(updateProv(`${API_ROUTES.provider}/${providerSelected?._id}`, providerSelected!), {
      onSuccess: () => {
        toast.success('Editaste correctamente la información del proveedor')
        refetch()
      },
      onError(error) {
        console.log(error)
        toast.error('Hubo un problema al editar la información del proveedor')
      },
    })
    
    handleCloseFormModal()
  }

  // Delete client
  const handleDeleteClick = (prov: ProviderType) => {
    setProviderSelected(prov)
    onOpenDeleteModal()
  }
  const handleCloseDeleteModal = () =>  {
    onCloseDeleteModal()
    setProviderSelected(undefined)
  }
  const handleDeleteProvider = () => {
    runDeleteProvider(deleteProv(`${API_ROUTES.provider}/${providerSelected?._id}`), {
      onSuccess: () => {
        toast.success(`Eliminaste al proveedor ${providerSelected?.name}`)
        refetch()
      },
      onError(error) {
        console.log(error)
        toast.error('Hubo un problema al eliminar al proveedor')
      },
    })

    handleCloseDeleteModal()
  }

  const sortedProvidersList = [...providersList].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0;
    return dateB.getTime() - dateA.getTime();
  });  

  // Renders
  const footer = (
    <Button
      isLoading={ providerSelected ? editingProvider : addingProvider }
      type="submit"
      autoFocus
      form="add-or-edit-provider-form"
      colorScheme='blue'
      size='sm'
    >
      { providerSelected ? 'Guardar cambios' : 'Añadir Proveedor'}
    </Button>
  )
  const deleteFooter = (
    <Button
      isLoading={deletingProvider}
      variant="ghost"
      autoFocus
      colorScheme='red'
      onClick={handleDeleteProvider}
    >
      Confirmar
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
          Proveedores
        </Text>
        <Box width='100%' textAlign='end' gap={2}>
          <Button
            size='sm'
            width={{base: '120px', md: '200px'}}
            fontSize={{ base: 10, md: 16 }}
            padding={{ base: '5px', md: '12px' }}
            onClick={onOpenForm}
            colorScheme='blue'
            height='25px'
            gap={2}
          >
            <Text>Añadir proveedor</Text><PlusIcon fontSize={ isMobile ? 10 : 14 }/>
          </Button>
        </Box>

        <Box width='100%'>
          {isMobile && (
            <TableComponent
              data={sortedProvidersList}
              columns={mobileColumns}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              isLoading={isLoading}
              pagination
              actions
            />
          )}
          {isDesktop && (
            <TableComponent
              data={sortedProvidersList}
              columns={columns}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              isLoading={isLoading}
              pagination
              actions
            />
          )}
        </Box>
      </Flex>

      {/* Form modal */}
      <Modal
        isOpen={isOpenForm}
        onClose={handleCloseFormModal}
        heading={providerSelected ? 'Editar Proveedor' : 'Añadir Proveedor'}
        footer={footer}
      >
        <ProviderForm
          provider={providerSelected ? providerSelected : provider}
          setter={providerSelected ? setProviderSelected : setProvider}
          handleSubmit={ providerSelected ? handleEditProvider : handleSubmit }
          providerSelected={providerSelected}
        />
      </Modal>

      {/* Description or Note modal */}
      <Modal
        isOpen={isOpenDescNote}
        heading={providerSelected?.name}
        onClose={handleCloseDescOrNote}
      >
        <Flex flexDir='column' gap='10px'>
          <Text fontWeight={600}>{descriptionNote === 'note' ? 'Notas:' : 'Descripción:'}</Text>
          <Text>
            {
              descriptionNote === 'note' ?
              providerSelected?.notes :
              providerSelected?.description
            }
          </Text>
        </Flex>
      </Modal>

      {/* Delete modal */}
      <Modal
        isOpen={isOpenDeleteModal}
        onClose={handleCloseDeleteModal}
        heading={`¿Estás seguro de eliminar al proveedor ${providerSelected?.name}?`}
        footer={deleteFooter}
      />

      { providerSelected && (
        <Modal
          isOpen={isOpenProvModal}
          heading={providerSelected.name}
          onClose={handleCloseProvModal}
          hideCancelButton
        >
          <ProviderModal provider={providerSelected} />
        </Modal>
      )}
    </AdministrationLayout>
  )
}

export default ProvidersPage;
