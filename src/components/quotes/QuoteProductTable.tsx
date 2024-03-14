import { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Button, Box, Input, Text, Flex } from '@chakra-ui/react';
import { useScreenSize } from 'src/common/hooks';
import { formatPriceNumber } from 'src/common/utils';
import { QuoteType, newQuoteProduct } from './utils';
import { TrashIcon } from 'src/common/icons';
import { CONSTROAD_COLORS } from 'src/styles/shared';
import { ProductType } from '../products';

interface QuoteProductTableProps {
  quote: QuoteType;
  setter: React.Dispatch<React.SetStateAction<QuoteType>> | React.Dispatch<React.SetStateAction<QuoteType | undefined>>;
}

export const QuoteProductTable = (props: QuoteProductTableProps) => {
  const { quote, setter } = props;
  const { isMobile } = useScreenSize()
  const [products, setProducts] = useState<ProductType[]>(quote.items);
  
  useEffect(() => {
    setProducts(quote.items)
  }, [quote.items])
  
  useEffect(() => {
    const totalSum = products
      .map(product => parseFloat(product.total.toString().replace(/,/g, '')))
      .reduce((total, value) => total + value, 0)
    const formattedTotal = formatPriceNumber(totalSum).replaceAll(',', '')
    setter({ ...quote, items: products, total: +formattedTotal })
  }, [products])
  
  const handleAddProduct = () => {
    setProducts([...products, newQuoteProduct]);
  };

  const handleDeleteProduct = (index: number) => {
    const newProducts = [...products];
    newProducts.splice(index, 1);
    setProducts(newProducts);
  };

  const handleChangeProduct = (index: number, key: keyof ProductType, value: string) => {
    const newProducts: ProductType[] = products.map((product, i) => {
      if (i === index) {
        if (key === 'quantity') {
          const subtotal = +value * product.unitPrice
          const formattedSubtotal = formatPriceNumber(subtotal).replaceAll(',', '')
          return { ...product, ['total']: +formattedSubtotal, [key]: +value }

        } else if ( key === 'unitPrice' ) {
          const subtotal = +value * +product.quantity
          const formattedSubtotal = formatPriceNumber(subtotal).replaceAll(',', '')
          return { ...product, ['total']: +formattedSubtotal, [key]: +value }

        } else {
          return { ...product, [key]: value };
        }
      }
      return product;
    });
  
    setProducts(newProducts);
  };

  return (
    <Box fontSize={{base: 10, md: 12}}>
      <Box overflowX='scroll' rounded='8px' border='0.5px solid' borderColor={CONSTROAD_COLORS.bgPDF}>
        <Table variant='styled'>
          {/* head */}
          <Thead>
            <Tr width='100%'>
              <Th background={CONSTROAD_COLORS.bgPDF} color='white' paddingX={{ base: '8px', md: '10px' }} paddingY={{ base: '5px', md: '5px' }}>
                <Text fontSize={{base: 10, md: 12}} textTransform='capitalize'>
                  {isMobile ? 'Nombre / Unidad' : 'Descripción'}
                </Text>
              </Th>
              <Th background={CONSTROAD_COLORS.bgPDF} color='white' paddingX={{ base: '8px', md: '10px' }} paddingY={{ base: '5px', md: '5px' }}>
                <Text fontSize={{base: 10, md: 12}} textTransform='capitalize'>
                  { isMobile ? 'Precio' : 'Unidad' }
                </Text>
              </Th>
              {!isMobile && (
                <>
                  <Th background={CONSTROAD_COLORS.bgPDF} color='white' paddingX={{ base: '8px', md: '10px' }} paddingY={{ base: '5px', md: '5px' }}>
                    <Text fontSize={{base: 10, md: 12}} textTransform='capitalize'>
                      Cantidad
                    </Text>
                  </Th>
                  <Th background={CONSTROAD_COLORS.bgPDF} color='white' paddingX={{ base: '8px', md: '10px' }} paddingY={{ base: '5px', md: '5px' }}>
                    <Text fontSize={{base: 10, md: 12}} textTransform='capitalize'>
                      Precio Unitario
                    </Text>
                  </Th>
                </>
              )}
              <Th background={CONSTROAD_COLORS.bgPDF} color='white' paddingX={{ base: '8px', md: '10px' }} paddingY={{ base: '5px', md: '5px' }}>
                <Text fontSize={{base: 10, md: 12}} textTransform='capitalize'>
                  Subtotal
                </Text>
              </Th>
              {!isMobile && (
                <Th background={CONSTROAD_COLORS.bgPDF} color='white' paddingX={{ base: '8px', md: '10px' }} fontSize={{base: 10, md: 12}} width='25px'></Th>
              )}
            </Tr>
          </Thead>

          {/* body */}
          <Tbody>
            {products.map((product, index) => (
              <Tr key={index} width='100%' borderBottomWidth="0.5px" borderColor={CONSTROAD_COLORS.bgPDF}>
                {!isMobile && (
                  <>
                    <Td width={{ base: '100px', md: '43%' }}  padding='10px'>
                      <Input
                        paddingX={{ base: '6px', md: '' }}
                        fontSize={{base: 10, md: 10}}
                        rounded='5px'
                        size='sm'
                        h='28px'
                        placeholder='Nombre del producto'
                        type="text"
                        value={product.description}
                        onChange={(e) => handleChangeProduct(index, 'description', e.target.value.toUpperCase())}
                      />
                    </Td>
                    <Td padding='10px'>
                      <Input
                        fontSize={{base: 10, md: 10}}
                        paddingX={{ base: '6px', md: '' }}
                        size='sm'
                        h='28px'
                        rounded='5px'
                        placeholder='M3'
                        width='50px'
                        type="text"
                        value={product.unit}
                        onChange={(e) => handleChangeProduct(index, 'unit', e.target.value.toUpperCase())}
                      />
                    </Td>
                    <Td padding='10px'>
                      <Input
                        fontSize={{base: 10, md: 10}}
                        paddingX={{ base: '6px', md: '' }}
                        size='sm'
                        h='28px'
                        rounded='5px'
                        placeholder='0'
                        width='70px'
                        type="number"
                        value={product.quantity === 0 ? '' : product.quantity}
                        onChange={(e) => handleChangeProduct(index, 'quantity', e.target.value)}
                      />
                    </Td>
                    <Td padding='10px'>
                      <Input
                        fontSize={{base: 10, md: 10}}
                        paddingX={{ base: '6px', md: '' }}
                        size='sm'
                        h='28px'
                        rounded='5px'
                        placeholder='0'
                        width='70px'
                        type="number"
                        value={product.unitPrice === 0 ? '' : product.unitPrice}
                        onChange={(e) => handleChangeProduct(index, 'unitPrice', e.target.value)}
                      />
                    </Td>
                    <Td padding={{ base: '6px', md: '6px' }} position="relative">
                      <Box>
                        <Input
                          value={formatPriceNumber(product.total)}
                          paddingX={{ base: '6px', md: '6px' }}
                          fontSize={{base: 10, md: 12}}
                          size='sm'
                          h='28px'
                          rounded='5px'
                          disabled
                        />
                      </Box>
                    </Td>
                    <Td textAlign='center'  paddingX={{ base: '6px', md: '10px' }} paddingY='10px' position="relative">
                      <Flex width='100%' textAlign='center' height='30px' alignItems='center' justifyContent='center'>
                        <Button
                          colorScheme='red'
                          width='30px'
                          minWidth="30px"
                          maxWidth='30px'
                          height={{ base: '30px', md: '30px' }}
                          fontSize={{base: 10, md: 12}}
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
                    <Td width='55%'  paddingX={{ base: '8px', md: '10px' }} paddingY={{ base: '8px', md: '16px' }}>
                      <Flex flexDirection='column'>
                        <Text fontWeight={600} fontSize={10}>Nombre</Text>
                        <Input
                          paddingX='3px'
                          fontSize={{base: 10, md: 12}}
                          size='sm'
                          placeholder='Nombre del producto'
                          rounded='5px'
                          height='25px'
                          type="text"
                          value={product.description}
                          onChange={(e) => handleChangeProduct(index, 'description', e.target.value)}
                        />
                        <Text fontWeight={600} fontSize={10} mt='8px'>Unidad</Text>
                        <Input
                          fontSize={{base: 10, md: 12}}
                          paddingX='3px'
                          size='sm'
                          rounded='5px'
                          height='25px'
                          placeholder='M3'
                          type="text"
                          value={product.unit}
                          onChange={(e) => handleChangeProduct(index, 'unit', e.target.value)}
                        />
                      </Flex>
                    </Td>
                    <Td width='18%' paddingX={{ base: '8px', md: '10px' }} paddingY={{ base: '8px', md: '16px' }}>
                      <Flex flexDirection='column'>
                      <Text fontWeight={600} fontSize={10}>Cantidad</Text>
                        <Input
                          fontSize={{base: 10, md: 12}}
                          paddingX='3px'
                          size='sm'
                          rounded='5px'
                          height='25px'
                          placeholder='0'
                          type="number"
                          value={product.quantity === 0 ? '' : product.quantity}
                          onChange={(e) => handleChangeProduct(index, 'quantity', e.target.value)}
                        />
                        <Text fontWeight={600} fontSize={10} mt='8px'>Precio U.</Text>
                        <Input
                          fontSize={{base: 10, md: 12}}
                          paddingX='3px'
                          size='sm'
                          placeholder='0'
                          rounded='5px'
                          height='25px'
                          type="number"
                          value={product.unitPrice === 0 ? '' : product.unitPrice}
                          onChange={(e) => handleChangeProduct(index, 'unitPrice', e.target.value)}
                        />
                      </Flex>
                    </Td>
                    <Td  paddingX={{ base: '6px', md: '10px' }} position='relative' paddingY={{ base: '8px', md: '16px' }}>
                      <Flex flexDirection='column' justifyContent='space-between'>
                        <Box>
                          <Text fontWeight={600} fontSize={10}>Subtotal</Text>
                          <Input
                            fontSize={{base: 10, md: 12}}
                            rounded='5px'
                            height='25px'
                            size='sm'
                            disabled
                            value={formatPriceNumber(product.total)}
                            paddingX='3px'
                          />
                        </Box>
                        <Flex width='100%' textAlign='center' height='55px' alignItems='end' justifyContent='center'>
                          <Button
                            colorScheme='red'
                            width='20px'
                            minWidth="40px"
                            height={{ base: '20px', md: '' }}
                            fontSize={{base: 10, md: 12}}
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

        <Flex width='100%' justifyContent='end' height={{ base: '22px', md: '30px' }} alignItems='center'>
          <Flex textAlign='center' gap='8px' height='100%'>
            <Flex fontSize={{ base: 10, md: 12 }} fontWeight={600} alignItems='center' height='100%'>
              TOTAL:
            </Flex>
            <Flex px='6px' py='2px' minWidth={{base: '90px', md: '158px'}} rounded='2px' bg='orange' height='100%' alignItems='center'>
              { formatPriceNumber(quote.total) }
            </Flex>
          </Flex>
        </Flex>
      </Box>

      <Box width='100%' textAlign='start' paddingY='6px' marginTop='6px'>
        <Button
          fontSize={{base: 10, md: 12}}
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

export default QuoteProductTable;
