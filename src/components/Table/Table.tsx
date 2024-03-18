import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, Flex, CircularProgress, IconButton } from '@chakra-ui/react';
import { TableColumn, TableData } from './TableTypes';
import { CONSTROAD_COLORS } from 'src/styles/shared';
import { EditIcon, TrashIcon } from 'src/common/icons';
import { useState } from 'react';
import { Pagination } from './Pagination';

interface Props {
  data: TableData[];
  columns: TableColumn[];
  onDelete?: (item: any) => void;
  onSelectRow?: (item: any) => void;
  onEdit?: (item: any) => void;
  actions?: boolean;
  isLoading?: boolean;
  pagination?: boolean;
  itemsPerPage?: number;
}

export const TableComponent = (props: Props) => {
  const { data, columns, onDelete, onSelectRow, onEdit, actions, isLoading, itemsPerPage = 10 } = props;
  const [currentPage, setCurrentPage] = useState(1);

  const handleSelectRow = (item: any) => {
    if (onSelectRow) {
      onSelectRow(item)
    }
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <Flex
      overflowX="auto"
      rounded='4px'
      border={`0.5px solid ${CONSTROAD_COLORS.darkGray}`}
      w='100%'
      minW='100%'
      h='455px'
      flexDir='column'
      justifyContent='space-between'
    >
      <Table border="collapse">
        <Thead h={{ base: '32px', md: 'auto' }}>
          <Tr fontSize={10}>
            {columns.map(column => (
              <Th key={column.key} background={CONSTROAD_COLORS.bgPDF} color='white' textAlign='start' padding={{ base: 1, md: 2}} fontSize={{ base: 10, md: 12 }}>
                {column.label}
              </Th>
            ))}
            <Th background={CONSTROAD_COLORS.bgPDF} color='white' textAlign='center' padding={{ base: 1, md: 2}} width='5%' fontSize={{ base: 10, md: 12 }}>
              Acciones
            </Th>
          </Tr>
        </Thead>
        <Tbody fontSize={10}>
          { isLoading && (
            <Tr position='relative' height='38px'>
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
            <Tr position='relative' height='38px'>
              <Td width='100%' textAlign='center' position='absolute' fontSize={{ base: 10, md: 12 }}>
                No data found.
              </Td>
            </Tr>
          )}
          { data.length > 0 && !isLoading && (
            currentItems.map((row, index) => (
              <Tr key={index} onClick={() => handleSelectRow(row)} h='38px' maxH='38px' minH='38px'>
                {columns.map(column => (
                  <Td key={column.key} width={column.width} maxWidth={column.width} py={1} px={{ base: 1.5, md: 2 }} textAlign={column.textAlign ?? 'start'} >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </Td>
                ))}
                {actions &&  (
                  <Td py={1} px={{ base: 1.5, md: 2 }} textAlign='center'>
                    <Flex width='100%' justifyContent={{ base: 'space-between', md: 'space-evenly' }}>
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

      {props.pagination && (
        <Pagination
          currentPage={currentPage}
          paginate={paginate}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          data={data}
        />
      )}
    </Flex>
  );
};

export default TableComponent;
