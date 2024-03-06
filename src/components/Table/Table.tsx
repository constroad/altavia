import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, Flex, CircularProgress } from '@chakra-ui/react';
import { TableColumn, TableData } from './TableTypes';
import { CONSTROAD_COLORS } from 'src/styles/shared';
import { EditIcon, TrashIcon } from 'src/common/icons';

interface Props {
  data: TableData[];
  columns: TableColumn[];
  onDelete?: (item: any) => void;
  onSelectRow?: (item: any) => void;
  onEdit?: (item: any) => void;
  actions?: boolean;
  isLoading?: boolean
}

export const TableComponent = (props: Props) => {
  const { data, columns, onDelete, onSelectRow, onEdit, actions, isLoading } = props;

  const handleSelectRow = (item: any) => {
    if (onSelectRow) {
      onSelectRow(item)
    }
  }

  return (
    <Box overflowX="auto" rounded='4px' border={`0.5px solid ${CONSTROAD_COLORS.darkGray}`}>
      <Table border="collapse">
        <Thead>
          <Tr fontSize={10}>
            {columns.map(column => (
              <Th key={column.key} background={CONSTROAD_COLORS.bgPDF} color='white' textAlign='start' padding={2}>
                {column.label}
              </Th>
            ))}
            <Th background={CONSTROAD_COLORS.bgPDF} color='white' textAlign='center' padding={2} width='5%'>
              Actions
            </Th>
          </Tr>
        </Thead>
        <Tbody fontSize={10}>
          { isLoading && (
            <Tr position='relative' height='50px'>
              <Td width='100%' textAlign='center' position='absolute' fontSize={12}>
                <CircularProgress
                  isIndeterminate
                  color="white"
                  size="25px"
                  thickness="10px"
                  trackColor="green.500"
                />
              </Td>
            </Tr>
          )}
          { data.length === 0 && !isLoading && (
            <Tr position='relative' height='50px'>
              <Td width='100%' textAlign='center' position='absolute' fontSize={12}>
                No data found.
              </Td>
            </Tr>
          )}
          { data.length > 0 && !isLoading && (
            data.map((row, index) => (
              <Tr key={index} onClick={() => handleSelectRow(row)}>
                {columns.map(column => (
                  <Td key={column.key} width={column.width} padding={2} textAlign={column.textAlign ?? 'start'}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </Td>
                ))}
                {actions &&  (
                  <Td padding={2} textAlign='center'>
                    <Flex width='100%' justifyContent='space-evenly'>
                      {onEdit && (
                        <Button
                          colorScheme='blue'
                          minWidth="25px"
                          height={{ base: '20px', md: '' }}
                          fontSize={{base: 12, md: 14}}
                          paddingX='5px'
                          onClick={() => onEdit(row)}
                        >
                          <EditIcon fontSize={12} /> 
                        </Button>
                      )}

                      {onDelete && (
                        <Button
                          colorScheme='red'
                          minWidth="25px"
                          height={{ base: '20px', md: '' }}
                          fontSize={{base: 12, md: 14}}
                          paddingX='5px'
                          onClick={() => onDelete(row)}
                        >
                          <TrashIcon fontSize={12} /> 
                        </Button>
                      )}
                    </Flex>
                  </Td>
                )}
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default TableComponent;
