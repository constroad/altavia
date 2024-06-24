import React, { useEffect } from 'react';
import { Grid, Input, Button, Flex, Box } from "@chakra-ui/react";
import { CONSTROAD_COLORS } from 'src/styles/shared';
import { TrashIcon } from 'src/common/icons';
import { useScreenSize } from 'src/common/hooks';
import { formatPriceNumber } from '../../common/utils/index';
import { ProdInfoType } from './new-utils';

interface CostsTableProps {
  columns: string[];
  rows: {
    id: number;
    [key: string]: string | number;
  }[];
  setter: any
  keyString: string;
  prodInfo: ProdInfoType;
}

const CostsTable: React.FC<CostsTableProps> = ({ columns, rows, setter, keyString, prodInfo }) => {
  const { isMobile } = useScreenSize()

  // Effect
  useEffect(() => {
    if (keyString === 'asphalt') {
      const updatedRows = rows.map((row: any) => {
        return {
          ...row,
          'M3/GLS': +((+row.Dosis * prodInfo.m3Produced!).toFixed(2)),
          'Total': +((+row.Dosis * prodInfo.m3Produced!) * +row.Precio).toFixed(2)
        }
      })
      setter(updatedRows)

    } else if ( keyString === 'service' ) {
      const updatedRows = rows.map((row: any) => {
        const isTransport = row.Item === 'Transporte'
        const isOnePayment =
        row.Item === 'Laboratorio' ||
        row.Item === 'Sindicato' ||
        row.Item === 'Sindicato' ||
        row.Item === 'Camabaja' ||
        row.Item === 'Samuel' ||
        row.Item === 'EPP' ||
        row.Item === 'Viaticos'

        return {
          ...row,
          'Cantidad': isOnePayment ? 1 : isTransport ? +(prodInfo.m3Produced.toFixed(2)) : +prodInfo.days,
          'Total': isOnePayment ? +((1 * +row.Precio).toFixed(2)) : isTransport ? +((+prodInfo.m3Produced * +row.Precio).toFixed(2)) : +((+prodInfo.days * +row.Precio).toFixed(2))
        }
      })
      setter(updatedRows)

    } else if ( keyString === 'imprimacion' ) { 
      const updatedRows = rows.map((row: any) => {
        const imprimacionQuantity = row.Item === 'MC-30' ? prodInfo.metrado : +row.Cantidad 
        const total = row.Item !== 'MC-30' ? +row.Cantidad * +row.Precio : +imprimacionQuantity * +row.Precio * +row.Dosis
        return {
          ...row,
          'Cantidad': +imprimacionQuantity,
          'Total': +(total.toFixed(2)) 
        }
      })
      setter(updatedRows)
    }
  }, [prodInfo])

  // handler
  const handleChange = (id: number, key: string, value: string | number) => {
    if (key === 'Total') return;

    if ( key === 'Cantidad' ) {
      if ( keyString === 'imprimacion' ) {
        const updatedRows = rows.map( row => {
          const newTotal = row.Item === 'MC-30' ? +value * +row.Dosis * +row.Precio : +value * +row.Precio
          return (
            row.id === id ? { ...row, [key]: +value, ['Total']: +(newTotal).toFixed(2) } : row
          )
        })
        setter(updatedRows)
        return;

      } else {
        const updatedRows = rows.map(row => 
          row.id === id ? { ...row, [key]: +value, ['Total']: +(+value * +row.Precio).toFixed(2) } : row
        );
        setter(updatedRows);
      }

    } else if ( key === 'Dosis' ) {

      if ( keyString === 'imprimacion' ) {
        const updatedRows = rows.map( row => {
          const newTotal = row.Item === 'MC-30' ? +value * +row.Cantidad * +row.Precio : +row.Cantidad * +row.Precio
          return (
            row.id === id ? { ...row, [key]: +value, ['Total']: +(newTotal).toFixed(2) } : row 
          )
        })
        setter(updatedRows) 
        return;
      }

      const newM3PerGln = +value * prodInfo.m3Produced
      const updatedRows = rows.map(row =>
        row.id === id ? { ...row, [key]: +value, ['M3/GLS']: +(newM3PerGln.toFixed(2)), ['Total']: newM3PerGln * +row.Precio } : row
      );
      setter(updatedRows);

    } else if ( key === 'Precio' ) {
      if ( keyString === 'asphalt' ) {
        const updatedRows = rows.map(row =>
          row.id === id ? { ...row, [key]: +value, ['Total']: +(+value * +row['M3/GLS']).toFixed(2) } : row
        );
        setter(updatedRows);
      
      } else if ( keyString === 'imprimacion' ) {
        const updatedRows = rows.map(row => {
          const newTotal = row.Item === 'MC-30' ? +value * +row.Dosis * +row.Cantidad : +value * +row.Cantidad
          return (
            row.id === id ? { ...row, [key]: +value, ['Total']: +(newTotal).toFixed(2) } : row
          )
        }
        );
        setter(updatedRows); 

      } else {
        const updatedRows = rows.map(row =>
          row.id === id ? { ...row, [key]: +value, ['Total']: +(+value * +row['Cantidad']).toFixed(2) } : row
        );
        setter(updatedRows);
      }

    } else if ( key === 'Insumo' || key === "Item" ) {
      const updatedRows = rows.map(row =>
        row.id === id ? { ...row, [key]: value } : row
      );
      setter(updatedRows);

    } else {
      const updatedRows = rows.map(row =>
        row.id === id ? { ...row, [key]: +value } : row
      );
      setter(updatedRows);
    }
  };

  const handleAddRow = () => {
    const newId = rows.length + 1;
    setter([
      ...rows,
      { id: newId, ...Object.fromEntries(columns.map(title => [title, ""])) }
    ]);
  };

  const handleDeleteRow = (id: number) => {
    const filteredRows = rows.filter(row => row.id !== id)
    setter(filteredRows)
  }

  const total = rows?.reduce((total, row) => total + (+row['Total']), 0)

  return (
    <Box>
      <Flex>
        <Grid templateColumns={`repeat(${columns.length}, 1fr)`} gap={0} w='100%' justifyContent='center' h='19px'>
          {columns.map((title, index) => (
            <Flex key={`${title}-${index}`} justify="center" bg={CONSTROAD_COLORS.yellow} border='0.5px solid' fontSize={{ base: 10, md: 12 }} fontWeight={600} h='19px'>
              {title === 'Remover' ? '' : title}
            </Flex>
          ))}
          {rows.map((row, rowIndex) => (
            <React.Fragment key={`${row.id}-fragment-${keyString}`}>
              {columns.map((title, columnIndex) => (
                <Flex key={`${row.id}-${columnIndex}-table-${keyString}`} w='100%'>
                  <Input
                    h='19px'
                    bg={ title === 'Dosis' && row.Insumo === 'PEN' ? 'yellow' : '' }
                    color={ title === 'Dosis' && row.Insumo === 'PEN' ? 'red' : '' }
                    fontWeight={ title === 'Insumo' || title === 'Item' || (title === 'Dosis' && row.Insumo === 'PEN') ? 600 : 400 }
                    px='4px'
                    rounded='0px'
                    type={title === 'Dosis' || title === 'Precio' || title === 'Cantidad' ? 'number' : 'text'}
                    textAlign={title === 'Total' ? 'end' : undefined}
                    value={ title === 'Total' ? formatPriceNumber(+row[title]) : row[title] }
                    fontSize={{ base: 10, md: 11 }}
                    onChange={(e) => handleChange(row.id, title, e.target.value)}
                    disabled={title === 'M3/GLS' || title === 'Total' || (keyString === 'imprimacion' && title === 'Dosis' && row.Item !== 'MC-30')}
                    _disabled={{ bg: 'transparent', cursor: 'not-allowed' }}
                  />
                </Flex>
              ))}
            </React.Fragment>
          ))}
        </Grid>
        <Flex flexDir='column' h='100%'>
          <Flex h='19px' w='24px'></Flex>
          <Flex flexDir='column' gap='4px' mt='2.5px' ml='2px'>
            {rows.map((r, idx) => (
              <Flex
                w='15px'
                h='15px'
                justifyContent='center'
                alignItems='center'
                my='auto'
                cursor='pointer'
                key={`${idx}-deleteButton-${keyString}`}
                flexDir='column'
                rounded='4px'
                onClick={() => handleDeleteRow(r.id)}
                _hover={{
                  bg: 'gray.300'
                }}
              >
                <TrashIcon fontSize={isMobile ? 10 : 11} color='black' />
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Flex>
      <Grid templateColumns={`repeat(${keyString === 'asphalt' ? '2' : '1'}, 1fr)`} mt='5px' w='calc(100% - 24px)' gap={{ base: '55px', md: '76px' }}>
        {keyString === 'asphalt' && (
          <Flex
            fontSize={{ base: 10, md: 11 }}
            gap='4px'
            justifyContent='space-between'
            border='0.5px solid'
            h='19px'
            alignItems='center'
          >
            <Flex alignItems='center' h='19px' fontWeight={600} px='4px' bg={CONSTROAD_COLORS.yellow} borderRight='0.5px solid' borderY='0.5px solid' w='50%' justifyContent='start'>Costo M3:</Flex>
            <Flex alignItems='center' h='19px' fontWeight={600} px='4px'>{+((total / prodInfo?.m3Produced).toFixed(2))}</Flex>
          </Flex>
        )}
        {keyString !== 'thickness' && (
          <Flex
            fontSize={{ base: 10, md: 11 }}
            gap='4px'
            justifyContent='space-between'
            border='0.5px solid'
            h='19px'
            alignItems='center'
          >
            <Flex alignItems='center' h='19px' fontWeight={600} px='4px' bg={CONSTROAD_COLORS.yellow} borderRight='0.5px solid' borderY='0.5px solid' w='50%' justifyContent='start'>Total:</Flex>
            <Flex alignItems='center' h='19px' fontWeight={600} px='4px'>{formatPriceNumber(total)}</Flex>
          </Flex>
        )}
      </Grid>
      <Button size='xs' onClick={handleAddRow} mt='5px' bg={CONSTROAD_COLORS.darkGray} color='white' _hover={{ bg: '#787878' }} h='20px' fontSize={{ base: 10, md: 11 }}>Añadir fila</Button>
    </Box>
  );
};

export default CostsTable;
