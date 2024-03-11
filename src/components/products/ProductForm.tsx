import React, { useState } from 'react'
import { Box, Grid, GridItem } from '@chakra-ui/react'
import { FormInput, FormTextarea } from '../form';
import { ProductType } from './utils';

interface ProductFormProps {
  handleSubmit: (event: { preventDefault: () => void }) => void;
  product: ProductType
  setter: React.Dispatch<React.SetStateAction<ProductType>> | React.Dispatch<React.SetStateAction<ProductType | undefined>>;
  productSelected: ProductType | undefined;
}

export const ProductForm = (props: ProductFormProps) => {
  const { handleSubmit, product, setter } = props

  // handlers
  const handleChangeValue = (value: string, key: string) => {
    if ( setter ) setter({ ...product, [key]: value })
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
            value={product.name ?? ''}
            placeholder='Nombre del producto'
            onChange={(e) => handleChangeValue(e.target.value.toUpperCase(), 'name')}
            required
          />
        </GridItem>

        <GridItem colSpan={2}>
          <FormTextarea
            id='product-description'
            label='Descripción'
            value={product.description ?? ''}
            placeholder='Descripción'
            onChange={(e) => handleChangeValue(e.target.value, 'description')}
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
            label='Precio'
            value={product.price ?? ''}
            placeholder='0'
            onChange={(e) => handleChangeValue(e.target.value.toUpperCase(), 'price')}
            type='number'
            required
          />
        </GridItem>
        
        <GridItem colSpan={1}>
          <FormInput
            id='product-quantity'
            label='Cantidad'
            value={product.quantity ?? ''}
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
