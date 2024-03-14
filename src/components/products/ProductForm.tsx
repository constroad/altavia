import React, { useEffect } from 'react'
import { Box, Grid, GridItem } from '@chakra-ui/react'
import { FormInput } from '../form';
import { ProductType } from './utils';

interface ProductFormProps {
  handleSubmit: (event: { preventDefault: () => void }) => void;
  product: ProductType
  setter: React.Dispatch<React.SetStateAction<ProductType>> | React.Dispatch<React.SetStateAction<ProductType | undefined>>;
  productSelected: ProductType | undefined;
}

export const ProductForm = (props: ProductFormProps) => {
  const { handleSubmit, product, setter } = props

  useEffect(() => {
    setter({ ...product, total: product.quantity * product.unitPrice })
  }, [product.quantity, product.unitPrice])

  // handlers
  const handleChangeValue = (value: string, key: string) => {
    if ( setter ) {
      if ( key === 'quantity' || key === 'unitPrice' ) {
        setter({ ...product, [key]: +value })
      } else {
        setter({ ...product, [key]: value })
      }
    }
  }

  const handleSubmitForm = (e: { preventDefault: () => void }) => {
    handleSubmit(e)
  }

  return (
    <Box
      as='form'
      onSubmit={(e: { preventDefault: () => void }) => handleSubmitForm(e)}
      id='add-or-edit-product-form'
    >
      <Grid
        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(2, 1fr)" }}
        gap={2}
      >
        <GridItem colSpan={2}>
          <FormInput
            id='product-name'
            label='Nombre'
            value={product.description ?? ''}
            placeholder='Nombre del producto'
            onChange={(e) => handleChangeValue(e.target.value.toUpperCase(), 'description')}
            required
          />
        </GridItem>

        <GridItem colSpan={1}>
          <FormInput
            id='product-alias'
            label='Alias'
            value={product.alias ?? ''}
            placeholder='Alias del producto'
            onChange={(e) => handleChangeValue(e.target.value.toUpperCase(), 'alias')}
          />
        </GridItem>

        <GridItem colSpan={1}>
          <FormInput
            id='product-unit'
            label='Unidad'
            value={product.unit ?? ''}
            placeholder='Unidad de medida'
            onChange={(e) => handleChangeValue(e.target.value.toUpperCase(), 'unit')}
            required
          />
        </GridItem>

        <GridItem colSpan={1}>
          <FormInput
            id='product-price'
            label='Precio U.'
            value={product.unitPrice === 0 ? '' : product.unitPrice}
            placeholder='0'
            onChange={(e) => handleChangeValue(e.target.value.toUpperCase(), 'unitPrice')}
            type='number'
            required
          />
        </GridItem>
        
        <GridItem colSpan={1}>
          <FormInput
            id='product-quantity'
            label='Cantidad'
            value={product.quantity === 0 ? '' : product.quantity}
            placeholder='0'
            onChange={(e) => handleChangeValue(e.target.value.toUpperCase(), 'quantity')}
            type='number'
            required
          />
        </GridItem>
      </Grid>
    </Box>
  )
}

export default ProductForm;
