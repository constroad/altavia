import React, { useEffect, useState } from 'react'
import { Box, Button, Flex, Text, useDisclosure } from '@chakra-ui/react'
import { useAsync, useScreenSize } from 'src/common/hooks'
import {
  generateMobileProdColumns,
  generateProductColumns,
  AdministrationLayout,
  initialProducStore,
  TableComponent,
  ProductModal,
  ProductType,
  ProductForm,
  Modal,
  toast,
} from 'src/components'
import { ADMIN_ROUTES, API_ROUTES } from 'src/common/consts'
import { PlusIcon } from 'src/common/icons'
import axios from 'axios'
import { useRouter } from 'next/router'

const fetcher = (path: string) => axios.get(path)
const postProd = (path: string, data: ProductType) => axios.post(path, { data })
const updateProd = (path: string, data: ProductType) => axios.put(path, { data})
const deleteProd = (path: string) => axios.delete(path)

export const ProductsPage = () => {
  const [product, setProduct] = useState<ProductType>(initialProducStore)
  const [productSelected, setProductSelected] = useState<ProductType | undefined>(undefined)
  const [productsList, setProductsList] = useState<ProductType[]>([])

  const { isOpen: isOpenForm, onOpen: onOpenForm, onClose: onCloseForm } = useDisclosure()
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
  const { isOpen: isOpenProductModal, onOpen: onOpenProductModal, onClose: onCloseProductModal } = useDisclosure() 

  const { run: runGetProducts, refetch } = useAsync({ onSuccess(data) { setProductsList(data.data) } })
  const { run: runAddProduct, isLoading: addingProduct } = useAsync()
  const { run: runEditProduct, isLoading: editingProduct } = useAsync()
  const { run: runDeleteProduct, isLoading: deletingProduct } = useAsync()
  const { isMobile, isDesktop } = useScreenSize()
  const router = useRouter()
  const prevRoute = router.query.prevRoute;

  useEffect(() => {
    runGetProducts(fetcher(API_ROUTES.products), {
      refetch: () => runGetProducts(fetcher(API_ROUTES.products))
    })
  }, []) 

  const handleCloseFormModal = () => {
    onCloseForm()
    setProductSelected(undefined)
    setProduct(initialProducStore)
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const dbIncludesProduct = productsList.some(x => x.description === product.description);

    if (dbIncludesProduct) toast.warning('Este producto ya existe en la base de datos')

    if (!dbIncludesProduct) {
      runAddProduct(postProd(API_ROUTES.products, product), {
        onSuccess: () => {
          toast.success('Producto añadido con éxito!')
          refetch()
        }, 
        onError(error) {
          console.log(error)
        },
      })
    }

    handleCloseFormModal()
  }

  const handleEditClick = (prod: ProductType) => {
    setProductSelected(prod)
    onOpenForm()
  }
  const handleEditProduct = (e: any) => {
    e.preventDefault()

    runEditProduct(updateProd(`${API_ROUTES.products}/${productSelected?._id}`, productSelected!), {
      onSuccess: () => {
        toast.success('Editaste correctamente la información del producto')
        refetch()
      },
      onError(error) {
        console.log(error)
        toast.error('Hubo un problema al editar la información del producto')
      },
    })

    handleCloseFormModal()
  }

  // Delete product
  const handleDeleteClick = (prod: ProductType) => {
    setProductSelected(prod)
    onOpenDelete()
  }
  const handleDeleteCloseModal = () => {
    onCloseDelete()
    setProductSelected(undefined)
  }
  const handleDeleteProduct = () => {
    runDeleteProduct(deleteProd(`${API_ROUTES.products}/${productSelected?._id}`), {
      onSuccess: () => {
        toast.success(`Eliminaste el producto ${productSelected?.description}`)
        refetch()
      },
      onError(error) {
        console.log(error)
        toast.error('Hubo un problema al eliminar el producto')
      }
    })

    handleDeleteCloseModal()
  }

  // Product view
  const handleProductViewClick = (prod: ProductType) => {
    setProductSelected(prod)
    onOpenProductModal()
  }
  const handleCloseProductModal = () => {
    onCloseProductModal()
    setProductSelected(undefined)
  }

  const columns = generateProductColumns()
  const mobileColumns = generateMobileProdColumns(handleProductViewClick)

  // Renders
  const footer = (
    <Button
      isLoading={ productSelected ? editingProduct : addingProduct }
      type="submit"
      autoFocus
      form="add-or-edit-product-form"
      colorScheme='blue'
      size='sm'
    >
      { productSelected ? 'Guardar cambios' : 'Añadir Producto'}
    </Button>
  )
  const deleteFooter = (
    <Button
      isLoading={deletingProduct}
      variant="ghost"
      autoFocus
      colorScheme='red'
      onClick={handleDeleteProduct}
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
          mt={ isMobile ? '10px' : '0px' }
        >
          Productos
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
            width={{base: '120px', md: '200px'}}
            fontSize={{ base: 10, md: 16 }}
            padding={{ base: '5px', md: '12px' }}
            onClick={onOpenForm}
            colorScheme='blue'
            gap={2}
          >
            <Text>Añadir producto</Text><PlusIcon />
          </Button>
        </Box>

        <Box width='100%'>
          {isMobile && (
            <TableComponent
              data={productsList}
              columns={mobileColumns}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              actions
            />
          )}
          {isDesktop && (
            <TableComponent
              data={productsList}
              columns={columns}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              actions
            />
          )}
        </Box>
      </Flex>

      {/* Form modal */}
      <Modal
        isOpen={isOpenForm}
        onClose={handleCloseFormModal}
        heading={productSelected ? 'Editar Producto' : 'Añadir Producto'}
        footer={footer}
      >
        <ProductForm
          product={productSelected ? productSelected : product}
          setter={productSelected ? setProductSelected : setProduct}
          handleSubmit={ productSelected ? handleEditProduct : handleSubmit }
          productSelected={productSelected}
        />
      </Modal>

      {/* Delete modal */}
      <Modal
        isOpen={isOpenDelete}
        onClose={handleDeleteCloseModal}
        heading={`¿Estás seguro de eliminar el producto ${productSelected?.description}?`}
        footer={deleteFooter}
      />

      {/* Product preview modal */}
      {isMobile && productSelected && (
        <Modal
          isOpen={isOpenProductModal}
          onClose={handleCloseProductModal}
          heading={productSelected?.description}
          hideCancelButton
        >
          <ProductModal product={productSelected} />
        </Modal>
      )}
    </AdministrationLayout>
  )
}

export default ProductsPage
