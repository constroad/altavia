import React from 'react'
import { ProductType } from './utils'
import { Flex, Text } from '@chakra-ui/react';
import { formatPriceNumber } from 'src/common/utils';

interface ProductModalProps {
  product: ProductType
}

export const ProductModal = (props: ProductModalProps) => {
  const { product } = props;
  return (
    <Flex flexDir='column' gap='10px' fontSize={12}>
      <Flex gap='2px'>
        <Text fontWeight={600} width='100px'>Alias:</Text>
        <Text>{product.alias}</Text>
      </Flex>
      <Flex gap='2px'>
        <Text fontWeight={600} width='100px'>Unidad:</Text>
        <Text>{product.unit}</Text>
      </Flex>
      <Flex gap='2px'>
        <Text fontWeight={600} width='100px'>Cantidad:</Text>
        <Text>{product.quantity}</Text>
      </Flex>
      <Flex gap='2px'>
        <Text fontWeight={600} width='100px'>Precio:</Text>
        <Text>{formatPriceNumber(product.unitPrice)}</Text>
      </Flex>
    </Flex>
  )
}

export default ProductModal
