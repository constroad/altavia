import { Box, Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';
import { TableColumn, TableData } from './TableTypes';
import { CONSTROAD_COLORS } from 'src/styles/shared';
import { FaRegTrashAlt } from 'react-icons/fa';

interface Props {
    data: TableData[];
    columns: TableColumn[];
}

const TableComponent: React.FC<Props> = ({ data, columns }) => {
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
            <Th background={CONSTROAD_COLORS.bgPDF} color='white' textAlign='center' padding={2}>
              Actions
            </Th>
          </Tr>
        </Thead>
        <Tbody fontSize={10}>
          {data.map((item, index) => (
            <Tr key={index}>
              {columns.map(column => (
                <Td key={column.key} width={column.width} padding={2}>{item[column.key]}</Td>
              ))}
              <Td padding={2} textAlign='center'>
                <Button
                  colorScheme='red'
                  minWidth="25px"
                  height={{ base: '20px', md: '' }}
                  fontSize={{base: 12, md: 14}}
                  paddingX='5px'
                  // onClick={() => handleDeleteProduct(index)}
                >
                  <FaRegTrashAlt fontSize={12} /> 
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default TableComponent;
