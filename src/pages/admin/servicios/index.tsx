import React, { useEffect, useState } from 'react'
import { Box, Button, Flex, Text, useDisclosure } from '@chakra-ui/react'
import { useAsync, useScreenSize } from 'src/common/hooks'
import {
  AdministrationLayout,
  TableComponent,
  Modal,
  toast,
  ServiceType,
  initialService,
  generateServiceColumns,
  generateMobileServiceColumns,
  ServiceForm,
  ServiceModal,
} from 'src/components'
import { API_ROUTES } from 'src/common/consts'
import { PlusIcon } from 'src/common/icons'
import axios from 'axios'
import { useRouter } from 'next/router'

const fetcher = (path: string) => axios.get(path)
const post = (path: string, data: ServiceType) => axios.post(path, { data })
const update = (path: string, data: ServiceType) => axios.put(path, { data})
const deleteService = (path: string) => axios.delete(path)

export const ServicesPage = () => {
  const [service, setService] = useState<ServiceType>(initialService)
  const [serviceSelected, setServiceSelected] = useState<ServiceType | undefined>(undefined)
  const [servicesDB, setServicesDB] = useState<ServiceType[]>([])

  const { isOpen: isOpenForm, onOpen: onOpenForm, onClose: onCloseForm } = useDisclosure()
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
  const { isOpen: isOpenServiceModal, onOpen: onOpenServiceModal, onClose: onCloseServiceModal } = useDisclosure() 

  const { run: runGetServices, isLoading, refetch } = useAsync({ onSuccess(data) { setServicesDB(data.data) } })
  const { run: runAddService, isLoading: addingService } = useAsync()
  const { run: runEditService, isLoading: editingService } = useAsync()
  const { run: runDeleteService, isLoading: deletingService } = useAsync()
  const { isMobile, isDesktop } = useScreenSize()
  const router = useRouter()
  const prevRoute = router.query.prevRoute;

  useEffect(() => {
    runGetServices(fetcher(API_ROUTES.services), {
      refetch: () => runGetServices(fetcher(API_ROUTES.services)),
      cacheKey: API_ROUTES.services
    })
  }, []) 

  const handleCloseFormModal = () => {
    onCloseForm()
    setServiceSelected(undefined)
    setService(initialService)
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const dbIncludesService = servicesDB.some(x => x.description === service.description);

    if (dbIncludesService) toast.warning('Este servicio ya existe en la base de datos')

    if (!dbIncludesService) {
      runAddService(post(API_ROUTES.services, service), {
        onSuccess: () => {
          toast.success('Servicio añadido con éxito!')
          refetch()
        }, 
        onError(error) {
          console.log(error)
        },
      })
    }

    handleCloseFormModal()
  }

  const handleEditClick = (service: ServiceType) => {
    setServiceSelected(service)
    onOpenForm()
  }
  const handleEditService = (e: any) => {
    e.preventDefault()

    runEditService(update(`${API_ROUTES.services}/${serviceSelected?._id}`, serviceSelected!), {
      onSuccess: () => {
        toast.success('Editaste correctamente la información del servicio')
        refetch()
      },
      onError(error) {
        console.log(error)
        toast.error('Hubo un problema al editar la información del servicio')
      },
    })

    handleCloseFormModal()
  }

  // Delete service
  const handleDeleteClick = (serv: ServiceType) => {
    setServiceSelected(serv)
    onOpenDelete()
  }
  const handleDeleteCloseModal = () => {
    onCloseDelete()
    setServiceSelected(undefined)
  }
  const handleDeleteService = () => {
    runDeleteService(deleteService(`${API_ROUTES.services}/${serviceSelected?._id}`), {
      onSuccess: () => {
        toast.success(`Eliminaste el servicio ${serviceSelected?.description}`)
        refetch()
      },
      onError(error) {
        console.log(error)
        toast.error('Hubo un problema al eliminar el servicio')
      }
    })

    handleDeleteCloseModal()
  }

  // Service view
  const handleServiceViewClick = (service: ServiceType) => {
    setServiceSelected(service)
    onOpenServiceModal()
  }
  const handleCloseServiceModal = () => {
    onCloseServiceModal()
    setServiceSelected(undefined)
  }

  const columns = generateServiceColumns()
  const mobileColumns = generateMobileServiceColumns(handleServiceViewClick)
  // const tableData = servicesDB.sort((a, b) => new Date(b.createdAd!).getTime() - new Date(a.createdAd!).getTime())
  const tableData = servicesDB.reverse()

  // Renders
  const footer = (
    <Button
      isLoading={ serviceSelected ? editingService : addingService }
      type="submit"
      autoFocus
      form="add-or-edit-service-form"
      colorScheme='blue'
      size='sm'
    >
      { serviceSelected ? 'Guardar cambios' : 'Añadir servicio'}
    </Button>
  )
  const deleteFooter = (
    <Button
      isLoading={deletingService}
      variant="ghost"
      autoFocus
      colorScheme='red'
      onClick={handleDeleteService}
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
          Servicios
        </Text>
        <Box width='100%' textAlign='end' gap={2}>
          {prevRoute && (
            <Button
              size='sm'
              width={{base: '100px', md: '200px'}}
              fontSize={{ base: 10, md: 16 }}
              padding={{ base: '5px', md: '12px' }}
              onClick={() => router.push(prevRoute as string)}
              colorScheme='blue'
              gap={2}
              mr='5px'
              height='25px'
            >
              Volver a cotizar
            </Button>
          )}
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
            <Text>Añadir servicio</Text><PlusIcon fontSize={ isMobile ? 10 : 14 }/>
          </Button>
        </Box>

        <Box width='100%'>
          {isMobile && (
            <TableComponent
              data={tableData}
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
              data={tableData}
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
        heading={serviceSelected ? 'Editar Servicio' : 'Añadir Servicio'}
        footer={footer}
      >
        <ServiceForm
          service={serviceSelected ? serviceSelected : service}
          setter={serviceSelected ? setServiceSelected : setService}
          handleSubmit={ serviceSelected ? handleEditService : handleSubmit }
          serviceSelected={serviceSelected}
          servicesDB={servicesDB}
        />
      </Modal>

      {/* Delete modal */}
      <Modal
        isOpen={isOpenDelete}
        onClose={handleDeleteCloseModal}
        heading={`¿Estás seguro de eliminar el servicio ${serviceSelected?.description}?`}
        footer={deleteFooter}
      />

      {/* Service preview modal */}
      {isMobile && serviceSelected && (
        <Modal
          isOpen={isOpenServiceModal}
          onClose={handleCloseServiceModal}
          heading={serviceSelected?.description}
          hideCancelButton
        >
          <ServiceModal service={serviceSelected} />
        </Modal>
      )}
    </AdministrationLayout>
  )
}

export default ServicesPage
