import { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Button, Box, Input, Text, Flex } from '@chakra-ui/react';

import { Product, PurchaseOrder } from 'src/common/types';
import { useScreenSize } from 'src/common/hooks';
import { initialProduct } from '../form/utils';

import { CONSTROAD_COLORS } from 'src/styles/shared';
import { formatPriceNumber } from 'src/common/utils';
import { TrashIcon } from 'src/common/icons';

interface ProductTableProps {
  order: PurchaseOrder;
  setter: React.Dispatch<React.SetStateAction<PurchaseOrder>>;
}

const ProductTable = (props: ProductTableProps) => {
  const { order, setter } = props;
  const { isMobile } = useScreenSize()
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const totalSum = products
      .map(product => parseFloat(product.subtotal.replace(/,/g, '')))
      .reduce((total, value) => total + value, 0)
    const formattedTotal = formatPriceNumber(totalSum)
    setter({ ...order, products, total: formattedTotal.toString() })

  }, [products])

  const handleAddProduct = () => {
    setProducts([...products, initialProduct]);
  };

  const handleDeleteProduct = (index: number) => {
    const newProducts = [...products];
    newProducts.splice(index, 1);
    setProducts(newProducts);
  };

  const handleChangeProduct = (index: number, key: keyof Product, value: string) => {
    const newProducts = products.map((product, i) => {
      if (i === index) {
        if (key === 'quantity') {
          const subtotal = +value * +product.unitPrice
          const formattedSubtotal = formatPriceNumber(subtotal)
          return { ...product, ['subtotal']: formattedSubtotal.toString(), [key]: value }

        } else if ( key === 'unitPrice' ) {
          const subtotal = +value * +product.quantity
          const formattedSubtotal = formatPriceNumber(subtotal)
          return { ...product, ['subtotal']: formattedSubtotal.toString(), [key]: value }

        } else {
          return { ...product, [key]: value };
        }
      }
      return product;
    });
  
    setProducts(newProducts);
  };

  return (
    <Box fontSize={{base: 12, md: 14}}>
      <Box overflowX='scroll' rounded='8px' border='0.5px solid' borderColor={CONSTROAD_COLORS.bgPDF}>
        <Table variant='styled'>
          {/* head */}
          <Thead>
            <Tr width='100%'>
              <Th background={CONSTROAD_COLORS.bgPDF} color='white' paddingX={{ base: '8px', md: '24px' }}>
                <Text fontSize={{base: 11, md: 14}}>
                  {isMobile ? 'Nombre / Unidad' : 'Nombre de Producto'}
                </Text>
              </Th>
              <Th background={CONSTROAD_COLORS.bgPDF} color='white' paddingX={{ base: '8px', md: '24px' }} fontSize={{base: 11, md: 14}}>Unidad</Th>
              {!isMobile && (
                <>
                  <Th background={CONSTROAD_COLORS.bgPDF} color='white' fontSize={{base: 11, md: 14}}>Cantidad</Th>
                  <Th background={CONSTROAD_COLORS.bgPDF} color='white' fontSize={{base: 11, md: 14}}>Precio Unitario</Th>
                </>
              )}
              <Th background={CONSTROAD_COLORS.bgPDF} color='white' paddingX={{ base: '8px', md: '24px' }} fontSize={{base: 11, md: 14}}>SUBTOTAL</Th>
              {!isMobile && (
                <Th background={CONSTROAD_COLORS.bgPDF} color='white' paddingX={{ base: '8px', md: '24px' }} fontSize={{base: 11, md: 14}} width='32px'></Th>
              )}
            </Tr>
          </Thead>

          {/* body */}
          <Tbody>
            {products.map((product, index) => (
              <Tr key={index} width='100%' borderBottomWidth="0.5px" borderColor={CONSTROAD_COLORS.bgPDF}>
                {!isMobile && (
                  <>
                    <Td width={{ base: '100px', md: '65%' }}  paddingX='24px'>
                      <Input
                        paddingX={{ base: '6px', md: '' }}
                        fontSize={{base: 12, md: 14}}
                        size='sm'
                        placeholder='Nombre del producto'
                        type="text"
                        value={product.description}
                        onChange={(e) => handleChangeProduct(index, 'description', e.target.value)}
                      />
                    </Td>
                    <Td>
                      <Input
                        fontSize={{base: 12, md: 14}}
                        paddingX={{ base: '6px', md: '' }}
                        size='sm'
                        placeholder='M3'
                        type="text"
                        value={product.unit}
                        onChange={(e) => handleChangeProduct(index, 'unit', e.target.value)}
                      />
                    </Td>
                    <Td>
                      <Input
                        fontSize={{base: 12, md: 14}}
                        paddingX={{ base: '6px', md: '' }}
                        size='sm'
                        placeholder='0'
                        type="number"
                        value={product.quantity}
                        onChange={(e) => handleChangeProduct(index, 'quantity', e.target.value)}
                      />
                    </Td>
                    <Td>
                      <Input
                        fontSize={{base: 12, md: 14}}
                        paddingX={{ base: '6px', md: '' }}
                        size='sm'
                        placeholder='0'
                        type="number"
                        value={product.unitPrice}
                        onChange={(e) => handleChangeProduct(index, 'unitPrice', e.target.value)}
                      />
                    </Td>
                    <Td paddingX={{ base: '6px', md: '6px' }} position="relative">
                      <Box>
                        <Input
                          value={product.subtotal}
                          paddingX={{ base: '6px', md: '6px' }}
                          fontSize={{base: 12, md: 14}}
                          size='sm'
                          disabled
                        />
                      </Box>
                    </Td>
                    <Td textAlign='center'  paddingX={{ base: '6px', md: '24px' }} position="relative">
                      <Flex width='100%' textAlign='center' height='52px' alignItems='center' justifyContent='center'>
                        <Button
                          colorScheme='red'
                          width='20px'
                          minWidth="40px"
                          height={{ base: '30px', md: '' }}
                          fontSize={{base: 12, md: 14}}
                          paddingX='5px'
                          onClick={() => handleDeleteProduct(index)}
                        >
                          <TrashIcon fontSize={12} /> 
                        </Button>
                      </Flex>
                    </Td>
                  </>
                )}
                {isMobile && (
                  <>
                    <Td width={{ base: '47%', md: '65%' }}  paddingX={{ base: '8px', md: '24px' }}>
                      <Flex flexDirection='column'>
                        <Text fontWeight={600} fontSize={10}>NOMBRE</Text>
                        <Input
                          paddingX={{ base: '6px', md: '' }}
                          fontSize={{base: 12, md: 14}}
                          size='sm'
                          placeholder='Nombre del producto'
                          type="text"
                          value={product.description}
                          onChange={(e) => handleChangeProduct(index, 'description', e.target.value)}
                        />
                        <Text fontWeight={600} fontSize={10} mt='8px'>UNIDAD</Text>
                        <Input
                          fontSize={{base: 12, md: 14}}
                          paddingX={{ base: '6px', md: '' }}
                          size='sm'
                          placeholder='M3'
                          type="text"
                          value={product.unit}
                          onChange={(e) => handleChangeProduct(index, 'unit', e.target.value)}
                        />
                      </Flex>
                    </Td>
                    <Td width={{ base: '20%', md: '65%' }} paddingX={{ base: '8px', md: '24' }}>
                      <Flex flexDirection='column'>
                      <Text fontWeight={600} fontSize={10}>CANTIDAD</Text>
                        <Input
                          fontSize={{base: 12, md: 14}}
                          paddingX={{ base: '4px', md: '' }}
                          size='sm'
                          placeholder='0'
                          type="number"
                          value={product.quantity}
                          onChange={(e) => handleChangeProduct(index, 'quantity', e.target.value)}
                        />
                        <Text fontWeight={600} fontSize={10} mt='8px'>PRECIO U.</Text>
                        <Input
                          fontSize={{base: 12, md: 14}}
                          paddingX={{ base: '6px', md: '' }}
                          size='sm'
                          placeholder='0'
                          type="number"
                          value={product.unitPrice}
                          onChange={(e) => handleChangeProduct(index, 'unitPrice', e.target.value)}
                        />
                      </Flex>
                    </Td>
                    <Td  paddingX={{ base: '6px', md: '24px' }} position='relative'>
                      <Flex flexDirection='column' justifyContent='space-between' height='100%'>
                        <Box>
                          <Text fontWeight={600} fontSize={10}>SUBTOTAL</Text>
                          <Input fontSize={{base: 12, md: 14}} size='sm' disabled value={product.subtotal} paddingX={{ base: '6px', md: '24px' }} />
                        </Box>
                        <Flex width='100%' textAlign='center' height='60px' alignItems='end' justifyContent='center'>
                          <Button
                            colorScheme='red'
                            width='20px'
                            minWidth="40px"
                            height={{ base: '20px', md: '' }}
                            fontSize={{base: 12, md: 14}}
                            paddingX='5px'
                            onClick={() => handleDeleteProduct(index)}
                          >
                            <TrashIcon fontSize={12} /> 
                          </Button>
                        </Flex>
                      </Flex>
                    </Td>
                  </>
                )}
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Flex width='100%' justifyContent='end'>
          <Flex textAlign='center' gap='8px'>
            <Text fontSize={{base:10, md:14}} fontWeight={600} alignSelf='center'>
              TOTAL:
            </Text>
            <Box px='6px' py='2px' minWidth={{base: '110px', md: '210px'}} rounded='2px' bg='orange' textAlign='start'>
              {order.total}
            </Box>
          </Flex>
        </Flex>
      </Box>

      <Box width='100%' textAlign='start' paddingY='6px' marginTop='6px'>
        <Button
          fontSize={{base: 12, md: 14}}
          size='sm'
          colorScheme='blue'
          onClick={handleAddProduct}
        >
          Añadir Producto
        </Button>
      </Box>
    </Box>
  );
};

export default ProductTable;
