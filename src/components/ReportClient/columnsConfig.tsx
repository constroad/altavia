import { Box, Flex, Grid, IconButton, Menu, MenuButton, MenuItem, MenuList, GridItem, Text } from '@chakra-ui/react';
import { TableColumn } from "../Table";
import { CONSTROAD_COLORS } from "src/styles/shared";
import { formatMoney } from "src/utils/general";
import { DownloadIcon, MenuVerticalIcon, ViewIcon } from "src/common/icons";

export const generateReportClientColumns = (
  onViewDispatches: () => void,
  onDownloadPDF: () => void,
  onDownloadCertificates: () => void,
  handleClickMenuButton: (row: any) => void,
  isMobile?: boolean
) => {

  if ( !isMobile ) {
    const columns: TableColumn[] = [
      {
        key: 'fechaProgramacion',
        label: 'Fecha',
        width: '5%',
        render: (item, row) => (
          <Flex flexDir="column" alignItems='center'>
            {new Date(item).toLocaleDateString('es-PE')}
          </Flex>
        ),
      },
      {
        key: 'fechaVencimiento',
        label: 'Vence',
        width: '5%',
        render: (item, row) => {
          return (
            <Flex justifyContent='center'>{item && new Date(item).toLocaleDateString('es-PE')}</Flex>
          );
        },
      },
      {
        key: 'obra',
        label: 'Obra',
        width: '10%',
        render: (item, row) => {
          return (
            <Flex>
              {item}         
            </Flex>
          );
        },
      },
      {
        key: 'cantidadCubos',
        bgColor: CONSTROAD_COLORS.yellow,
        color: CONSTROAD_COLORS.black,
        label: 'M3 Pedidos',
        width: '5%',
        summary: true,
        render: (item) => {
          return <Box textAlign="center">{item}</Box>
        }
      },
      { 
        key: 'montoAdelanto', 
        bgColor: CONSTROAD_COLORS.yellow,
        color: CONSTROAD_COLORS.black,
        label: 'Adelanto', 
        width: '5%',
        render: (item) => {
          return (<Box textAlign="right">S/.{formatMoney(item)}</Box>)
        }
      },
      {
        key: 'totalPedido',
        bgColor: CONSTROAD_COLORS.yellow,
        color: CONSTROAD_COLORS.black,
        label: 'Total',
        width: '5%',
        summary: true,
        render: (item) => {
          return <Box textAlign="right">S/.{formatMoney(item)}</Box>;
        },
      },
      {
        key: 'montoPorCobrar',
        bgColor: CONSTROAD_COLORS.yellow,
        color: CONSTROAD_COLORS.black,
        label: 'Debe',
        width: '5%',
        summary: true,
        render: (item, row) => {
          return (
            <Box bgColor={row.isPaid ? "#d7ead4" : "pink"} rounded={2} textAlign="right">
              {!row.isPaid && <>
                S/.{formatMoney(item)}
              </>}
              {row.isPaid && "Pagado"}
            </Box>
          );
        },
      },
      {
        key: '_id',
        // label: <>{props.isLoading && <Spinner size="xs" />}</>,
        label: '',
        width: '2%',
        render: (item, row) => {
          return (
            <Flex
              width="inherit"
              alignItems="center"
              justifyContent="space-between"
            >
              <Menu data-testid="page-menu" variant="brand">
                <MenuButton
                  as={IconButton}
                  variant="unstyled"
                  minW="auto"
                  h="auto"
                  aria-label="Page details"
                  icon={( <MenuVerticalIcon /> )}
                  onClick={() => handleClickMenuButton(row)}
                  rounded="full"
                />
  
                <MenuList maxW="170px">
                  <MenuItem
                    onClick={() => onViewDispatches()}
                    as={Flex}
                    gap={2}
                  >
                    <ViewIcon />
                    Ver despachos
                  </MenuItem>
                  <MenuItem
                    onClick={() => onDownloadPDF()}
                    color="red"
                    as={Flex}
                    gap={2}
                  >
                    <DownloadIcon />
                    Descargar como PDF
                  </MenuItem>
                  <MenuItem
                    onClick={() => onDownloadCertificates()}
                    color="red"
                    as={Flex}
                    gap={2}
                  >
                    <DownloadIcon />
                    Descargar certificados
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          );
        },
      },
    ];
  
    return columns;

  } else {
    const columns: TableColumn[] = [
      {
        key: '_id',
        label: 'Item',
        width: '100%',
        render: (item, row) => (
          <Grid templateColumns="repeat(2, 1fr)" gap={2} my={2} px='0px'>
            <GridItem px='0px'>
              <Flex justifyContent='start' gap='2px'>
                <Text w='77px' fontWeight={600} h='12px' textAlign='start' lineHeight='10px'>F. producción:</Text>
                <Flex h='12px' lineHeight='10px' textAlign='start'>
                  {new Date(row.fechaProgramacion).toLocaleDateString('es-PE')}
                </Flex>
              </Flex>
            </GridItem>
            <GridItem>
              <Flex justifyContent='start' gap='2px'>
                <Text w='50px' fontWeight={600} h='12px' textAlign='start' lineHeight='10px'>Total:</Text>
                <Flex h='12px' textAlign='start' lineHeight='10px'> S/.{formatMoney(row.totalPedido)} </Flex>
              </Flex>
            </GridItem>

            <GridItem>
              <Flex justifyContent='start' gap='2px'>
                <Text w='77px' fontWeight={600} h='12px' textAlign='start' lineHeight='10px'>F. vencimiento:</Text>
                <Flex h='12px' textAlign='start' lineHeight='10px'>
                  {row.fechaVencimiento && new Date(row.fechaVencimiento).toLocaleDateString('es-PE')}
                </Flex>
              </Flex>
            </GridItem>
            <GridItem>
              <Flex justifyContent='start' gap='2px'>
                <Text w='50px' fontWeight={600} h='12px' textAlign='start' lineHeight='10px'>Adelanto:</Text>
                <Flex h='12px' textAlign='start' lineHeight='10px'> S/.{formatMoney(row.montoAdelanto)} </Flex>
              </Flex>
            </GridItem>

            <GridItem>
              <Flex justifyContent='start' gap='2px'>
                <Text w='77px' fontWeight={600} h='12px' textAlign='start' lineHeight='10px'>Obra:</Text>
                <Flex minH='12px' textAlign='start' lineHeight='10px'> {row.obra} </Flex>
              </Flex>
            </GridItem>
            <GridItem>
              <Flex justifyContent='start' gap='2px'>
                <Text w='50px' fontWeight={600} h='12px' textAlign='start' lineHeight='10px'>Debe:</Text>
                <Box h='12px' bgColor={row.isPaid ? "#d7ead4" : "pink"} rounded={2} textAlign="start" lineHeight='10px'>
                  {!row.isPaid && <>
                    S/.{formatMoney(row.montoPorCobrar)}
                  </>}
                  {row.isPaid && "Pagado"}
                </Box>
              </Flex>
            </GridItem>

            <GridItem>
              <Flex justifyContent='start' gap='2px'>
                <Text w='77px' fontWeight={600} h='12px' textAlign='start' lineHeight='10px'>M3 Pedidos:</Text>
                <Flex h='12px' textAlign='start' lineHeight='10px'> {row.cantidadCubos} </Flex>
              </Flex>
            </GridItem>
          </Grid>
        )
      },
      {
          key: 'clienteId',
          label: '',
          width: '2%',
          render: (item, row) => {
            return (
              <Flex
                width="inherit"
                alignItems="center"
                justifyContent="space-between"
              >
                <Menu data-testid="page-menu" variant="brand">
                  <MenuButton
                    as={IconButton}
                    variant="unstyled"
                    minW="auto"
                    h="auto"
                    aria-label="Page details"
                    icon={( <MenuVerticalIcon /> )}
                    onClick={() => handleClickMenuButton(row)}
                    rounded="full"
                  />
    
                  <MenuList maxW="170px">
                    <MenuItem
                      onClick={() => onViewDispatches()}
                      as={Flex}
                      gap={2}
                    >
                      <ViewIcon />
                      Ver despachos
                    </MenuItem>
                    <MenuItem
                      onClick={() => onDownloadPDF()}
                      color="red"
                      as={Flex}
                      gap={2}
                    >
                      <DownloadIcon />
                      Descargar como PDF
                    </MenuItem>
                    <MenuItem
                      onClick={() => onDownloadCertificates()}
                      color="red"
                      as={Flex}
                      gap={2}
                    >
                      <DownloadIcon />
                      Descargar certificados
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            );
          },
        }
    ];
  
    return columns;
  }
};

export const generateDispatchColumns = () => {
  const columns: TableColumn[] = [
    {
      key: 'date',
      label: 'Fecha',
      width: '5%',
      render: (item, row) => (
        <Flex flexDir="column" alignItems='center'>
          {new Date(item).toLocaleDateString('es-PE')}
        </Flex>
      ),
    },
    {
      key: 'plate',
      label: 'Placa',
      width: '5%',
      render: (item, row) => (
        <Flex flexDir="column" alignItems='center'>
          {item}
        </Flex>
      ),
    },
    {
      key: 'driverName',
      label: 'Chofer',
      width: '5%',
      render: (item, row) => (
        <Flex flexDir="column" alignItems='center'>
          {item}
        </Flex>
      ),
    },
    {
      key: 'hour',
      label: 'Hora',
      width: '5%',
      render: (item, row) => (
        <Flex flexDir="column" alignItems='center'>
          {item}
        </Flex>
      ),
    },
    {
      key: 'note',
      label: 'Nota',
      width: '5%',
      render: (item, row) => (
        <Flex flexDir='column' alignItems='center'>
          {item}
        </Flex>
      )
    },
    {
      key: 'quantity',
      label: 'M3',
      width: '5%',
      render: (item, row) => (
        <Flex flexDir="column" alignItems='center'>
          {item}
        </Flex>
      ),
    },
  ]

  return columns;
}
