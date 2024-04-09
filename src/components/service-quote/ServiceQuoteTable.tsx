import { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Button, Box, Input, Text, Flex } from '@chakra-ui/react';
import { useScreenSize } from 'src/common/hooks';
import { formatPriceNumber } from 'src/common/utils';
import { TrashIcon } from 'src/common/icons';
import { CONSTROAD_COLORS } from 'src/styles/shared';
import { ServiceQuoteType, newServiceQuote, initialServiceQuote, comparePhase } from './utils';
import { ServiceType } from '../services';

interface SwrviceQuoteTableProps {
  quote: ServiceQuoteType;
  setter: React.Dispatch<React.SetStateAction<ServiceQuoteType>> | React.Dispatch<React.SetStateAction<ServiceQuoteType | undefined>>;
  servicesDB: ServiceType[]
}

export const ServiceQuoteTable = (props: SwrviceQuoteTableProps) => {
  const { quote, setter, servicesDB } = props;
  const { isMobile } = useScreenSize()
  const [services, setServices] = useState<ServiceType[]>(quote.items);
  
  const aliasesToFilter = ['OBRAS PRELIMINARES', 'MOVIMIENTO DE TIERRA', 'PAVIMENTACION'];
  
  useEffect(() => {
    setServices(quote.items)
  }, [quote.items])
  
  useEffect(() => {
    const totalSum = services
      .map(serv => parseFloat(serv.total.toString().replace(/,/g, '')))
      .reduce((total, value) => total + value, 0)
    const formattedTotal = formatPriceNumber(totalSum).replaceAll(',', '')
    setter({ ...quote, items: services, total: +formattedTotal })
  }, [services])
  
  const handleAddService = () => {
    setServices([...services, newServiceQuote]);
  };

  function handleAddSDefaultServices() {
    const quoteServices = servicesDB.filter((service: ServiceType) => aliasesToFilter.includes(service.phase!));
    const sortedArray = quoteServices.slice().sort(comparePhase);
    const newQuoteWithServices = { ...initialServiceQuote, items: sortedArray };
    setter(newQuoteWithServices);
  }

  const handleDeleteService = (index: number) => {
    const newServices = [...services];
    newServices.splice(index, 1);
    setServices(newServices);
  };

  const handleChangeService = (index: number, key: keyof ServiceType, value: string) => {
    const newServices: ServiceType[] = services.map((serv, i) => {
      if (i === index) {
        if (key === 'quantity') {
          const subtotal = +value * serv.unitPrice
          const formattedSubtotal = formatPriceNumber(subtotal).replaceAll(',', '')
          return { ...serv, ['total']: +formattedSubtotal, [key]: +value }

        } else if ( key === 'unitPrice' ) {
          const subtotal = +value * +serv.quantity
          const formattedSubtotal = formatPriceNumber(subtotal).replaceAll(',', '')
          return { ...serv, ['total']: +formattedSubtotal, [key]: +value }

        } else if ( key === 'inches' ) {
          return { ...serv, [key]: +value }

        } else if ( key === 'flete' ) {
          return { ...serv, [key]: +value }
          
        } else {
          return { ...serv, [key]: value };
        }
      }
      return serv;
    });
  
    setServices(newServices);
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
                      Pulg.
                    </Text>
                  </Th>
                  <Th background={CONSTROAD_COLORS.bgPDF} color='white' paddingX={{ base: '8px', md: '10px' }} paddingY={{ base: '5px', md: '5px' }}>
                    <Text fontSize={{base: 10, md: 12}} textTransform='capitalize'>
                      Flete
                    </Text>
                  </Th>
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
            {services.map((serv, index) => (
              <Tr key={index} width='100%' borderBottomWidth="0.5px" borderColor={CONSTROAD_COLORS.bgPDF}>
                {!isMobile && (
                  <>
                    <Td width='40%'  padding='10px'>
                      <Flex flexDir='column'>
                        <Input
                          paddingX={{ base: '6px', md: '' }}
                          fontSize={{base: 10, md: 10}}
                          rounded='5px'
                          size='sm'
                          h='28px'
                          placeholder='Nombre del servicio'
                          type="text"
                          value={serv.description}
                          onChange={(e) => handleChangeService(index, 'description', e.target.value.toUpperCase())}
                        />
                        <Text fontSize={8} color='red' lineHeight='8px' fontWeight={600} >{serv.phase}</Text>
                      </Flex>
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
                        value={serv.unit}
                        onChange={(e) => handleChangeService(index, 'unit', e.target.value.toUpperCase())}
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
                        width='40px'
                        type="number"
                        value={serv.inches === 0 ? '' : serv.inches}
                        onChange={(e) => handleChangeService(index, 'inches', e.target.value)}
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
                        value={serv.flete === 0 ? '' : serv.flete}
                        onChange={(e) => handleChangeService(index, 'flete', e.target.value)}
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
                        value={serv.quantity === 0 ? '' : serv.quantity}
                        onChange={(e) => handleChangeService(index, 'quantity', e.target.value)}
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
                        value={serv.unitPrice === 0 ? '' : serv.unitPrice}
                        onChange={(e) => handleChangeService(index, 'unitPrice', e.target.value)}
                      />
                    </Td>
                    <Td padding={{ base: '6px', md: '6px' }} position="relative">
                      <Box>
                        <Input
                          value={formatPriceNumber(serv.total)}
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
                          width='30px'
                          minWidth="30px"
                          maxWidth='30px'
                          height={{ base: '30px', md: '30px' }}
                          fontSize={{base: 10, md: 12}}
                          paddingX='5px'
                          onClick={() => handleDeleteService(index)}
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
                          placeholder='Nombre del servicio'
                          rounded='5px'
                          height='25px'
                          type="text"
                          value={serv.description}
                          onChange={(e) => handleChangeService(index, 'description', e.target.value.toUpperCase())}
                        />

                        <Flex gap='2px' width='100%'>
                          <Box width='30%'>
                            <Text fontWeight={600} fontSize={10} mt='8px'>Unidad</Text>
                            <Input
                              fontSize={{base: 10, md: 12}}
                              paddingX='3px'
                              size='sm'
                              rounded='5px'
                              height='25px'
                              placeholder='M3'
                              type="text"
                              value={serv.unit}
                              onChange={(e) => handleChangeService(index, 'unit', e.target.value.toUpperCase())}
                            />
                          </Box>

                          <Box width='30%'>
                            <Text fontWeight={600} fontSize={10} mt='8px'>Pulg</Text>
                            <Input
                              fontSize={{base: 10, md: 12}}
                              paddingX='3px'
                              size='sm'
                              rounded='5px'
                              height='25px'
                              placeholder='0'
                              type="number"
                              value={serv.inches === 0 ? '' : serv.inches}
                              onChange={(e) => handleChangeService(index, 'inches', e.target.value.toUpperCase())}
                            />
                          </Box>

                          <Box width='40%'>
                            <Text fontWeight={600} fontSize={10} mt='8px'>Flete</Text>
                            <Input
                              fontSize={{base: 10, md: 12}}
                              paddingX='3px'
                              size='sm'
                              rounded='5px'
                              height='25px'
                              placeholder='0'
                              type="number"
                              value={serv.flete === 0 ? '' : serv.flete}
                              onChange={(e) => handleChangeService(index, 'flete', e.target.value.toUpperCase())}
                            />
                          </Box>
                        </Flex>
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
                          value={serv.quantity === 0 ? '' : serv.quantity}
                          onChange={(e) => handleChangeService(index, 'quantity', e.target.value)}
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
                          value={serv.unitPrice === 0 ? '' : serv.unitPrice}
                          onChange={(e) => handleChangeService(index, 'unitPrice', e.target.value)}
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
                            value={formatPriceNumber(serv.total)}
                            paddingX='3px'
                          />
                        </Box>
                        <Flex width='100%' textAlign='center' height='55px' alignItems='end' justifyContent='center'>
                          <Button
                            width='20px'
                            minWidth="40px"
                            height={{ base: '20px', md: '' }}
                            fontSize={{base: 10, md: 12}}
                            paddingX='5px'
                            onClick={() => handleDeleteService(index)}
                          >
                            <TrashIcon fontSize={12} color='black' /> 
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

        <Flex width='100%' justifyContent='end' height={{ base: '18px', md: '22px' }} alignItems='center'>
          <Flex textAlign='center' gap='8px' height='100%'>
            <Flex fontSize={{ base: 10, md: 12 }} fontWeight={600} alignItems='center' height='100%'>
              Total sin IGV:
            </Flex>
            <Flex px='6px' py='2px' minWidth={{base: '90px', md: '158px'}} rounded='2px' bg={CONSTROAD_COLORS.orange} height='100%' alignItems='center'>
              { formatPriceNumber(quote.total) }
            </Flex>
          </Flex>
        </Flex>
      </Box>

      <Box width='100%' textAlign='start' paddingY='6px'>
        <Button
          fontSize={{base: 10, md: 12}}
          size='sm'
          colorScheme='blue'
          onClick={handleAddService}
        >
          Añadir servicio
        </Button>

        {quote.clientId === '' && (
          <Button
            fontSize={{base: 10, md: 12}}
            size='sm'
            colorScheme='blue'
            onClick={handleAddSDefaultServices}
            ml='10px'
          >
            Añadir servicios por defecto
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ServiceQuoteTable;
