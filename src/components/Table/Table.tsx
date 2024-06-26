import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
  CircularProgress,
  Box,
} from '@chakra-ui/react';
import { TableColumn, TableData } from './TableTypes';
import { CONSTROAD_COLORS } from 'src/styles/shared';
import { EditIcon, ShareIcon, TrashIcon } from 'src/common/icons';
import { useEffect, useMemo, useState } from 'react';
import { Pagination } from './Pagination';
import { v4 as uuidv4 } from 'uuid';

export type TableAction = 'paginate' | 'filter';
export type TablePagination = {
  page: number;
  itemsPerPage: number;
};
interface Props {
  data: TableData[];
  columns: TableColumn[];
  onDelete?: (item: any) => void;
  onSelectRow?: (item: any) => void;
  onEdit?: (item: any) => void;
  onShare?: (item: any) => void;
  onChange?: (action: TableAction, pagination: TablePagination) => void;
  actions?: boolean;
  isLoading?: boolean;
  pagination?: boolean;
  itemsPerPage?: number;
  currentPage?: number;
  totalPages?: number;
  totalRecords?: number;
  // Renders
  toolbar?: React.ReactNode;
}

export const TableComponent = (props: Props) => {
  const [currentItems, setCurrentItems] = useState<TableData[]>([]);
  const { data, columns, onDelete, onSelectRow, onEdit, onShare, isLoading } =
    props;
  const [currentPage, setCurrentPage] = useState(props.currentPage ?? 1);
  const [itemsPerPage, setItemsPerPage] = useState(props.itemsPerPage ?? 20);

  const indexOfLastItem = useMemo(
    () => currentPage * itemsPerPage,
    [currentPage, itemsPerPage]
  );
  const indexOfFirstItem = useMemo(
    () => indexOfLastItem - itemsPerPage,
    [indexOfLastItem, itemsPerPage]
  );

  useEffect(() => {
    if (props.currentPage) {
      setCurrentItems(data);
      return;
    }
    setCurrentItems([...data.slice(indexOfFirstItem, indexOfLastItem)]);
  }, [data, props.currentPage, indexOfLastItem, indexOfFirstItem]);

  const handleSelectRow = (item: any) => {
    if (onSelectRow) {
      onSelectRow(item);
    }
  };
  const paginate = (pageNumber: number, items: number) => {
    setCurrentPage(pageNumber);
    setItemsPerPage(items);
    props.onChange?.('paginate', {
      page: pageNumber,
      itemsPerPage: items,
    });
  };

  const totalPages = props.totalPages || Math.ceil(data.length / itemsPerPage);

  return (
    <Flex
      overflowX="auto"
      rounded="4px"
      border={`0.5px solid ${CONSTROAD_COLORS.darkGray}`}
      w="100%"
      minW="100%"
      flexDir="column"
      justifyContent="space-between"
      fontSize="inherit"
    >
      <Box>{props.toolbar}</Box>
      <Table border="collapse">
        <Thead h={{ base: '32px', md: 'auto' }}>
          <Tr fontSize={10}>
            {columns.map((column, idx) => (
              <Th
                key={`header-${column.key}-${idx}`}
                background={column.bgColor ?? CONSTROAD_COLORS.black}
                color={column.color ?? 'white'}
                textAlign="center"
                padding={0}
                fontSize={{ base: 10, md: 12 }}
              >
                {typeof column.label === 'string' && (
                  <Box padding={{ base: 1, md: 2 }}>{column.label}</Box>
                )}
                {typeof column.label !== 'string' && column.label}
              </Th>
            ))}
            {(onEdit || onDelete) && (
              <Th
                background={CONSTROAD_COLORS.black}
                color="white"
                textAlign="center"
                padding={0}
                width="5%"
                fontSize={{ base: 10, md: 12 }}
              >
                Acciones
              </Th>
            )}
          </Tr>
        </Thead>
        <Tbody fontSize={10}>
          {isLoading && (
            <Tr position="relative" height="38px">
              <Td
                width="100%"
                textAlign="center"
                position="absolute"
                fontSize={12}
              >
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
          {data.length === 0 && !isLoading && (
            <Tr position="relative" height="38px">
              <Td
                width="100%"
                textAlign="center"
                position="absolute"
                fontSize={{ base: 10, md: 12 }}
              >
                No data found.
              </Td>
            </Tr>
          )}
          {data.length > 0 &&
            !isLoading &&
            currentItems.map((row, index) => (
              <Tr
                // key={`row-${uuidv4()}`}
                key={`row-${row?._id ? `${row?._id}-${row?.key}` : index}`}
                onClick={() => handleSelectRow(row)}
                _hover={{
                  background: 'whitesmoke',
                }}
                height="fit-content"
                p={0}
              >
                {columns.map((column, idx) => (
                  <Td
                    //@ts-ignore
                    key={`item-${column.key}-${idx}`}
                    width={column.width}
                    maxWidth={column.width}
                    p={0}
                    m={0}
                    px={{ base: 1.5, md: 2 }}
                    py={0}
                    lineHeight={7}
                    height="max-content"
                    textAlign={column.textAlign ?? 'start'}
                    {...column.tdStyles}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </Td>
                ))}
                {(onEdit || onDelete || onShare) && (
                  <Td py={1} px={{ base: 1.5, md: 2 }} textAlign="center">
                    <Flex
                      width="100%"
                      justifyContent={{
                        base: 'space-between',
                        md: 'space-evenly',
                      }}
                    >
                      {onEdit && (
                        <Button
                          minWidth="25px"
                          height={{ base: '20px', md: '' }}
                          fontSize={{ base: 12, md: 14 }}
                          paddingX="5px"
                          onClick={() => onEdit(row)}
                        >
                          <EditIcon fontSize={12} />
                        </Button>
                      )}

                      {onDelete && (
                        <Button
                          minWidth="25px"
                          height={{ base: '20px', md: '' }}
                          fontSize={{ base: 12, md: 14 }}
                          paddingX="5px"
                          onClick={() => onDelete(row)}
                        >
                          <TrashIcon fontSize={12} />
                        </Button>
                      )}

                      {onShare && (
                        <Button
                          minWidth="25px"
                          height={{ base: '20px', md: '' }}
                          fontSize={{ base: 12, md: 14 }}
                          paddingX="5px"
                          onClick={() => onShare(row)}
                        >
                          <ShareIcon fontSize={12} />
                        </Button>
                      )}
                    </Flex>
                  </Td>
                )}
              </Tr>
            ))}

          {/* summaries */}
          {columns.some((x) => x.summary) &&
            columns.map((column, idx) => (
              <Td key={`summary-${column.key}-${idx}`} padding={0}>
                {column.summary?.(
                  currentItems.reduce(
                    (prev, curr) => prev + (curr[column.key] ?? 0),
                    0
                  ),
                  data
                )}
              </Td>
            ))}
        </Tbody>
      </Table>

      {props.pagination && (
        <Pagination
          currentPage={currentPage}
          paginate={paginate}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          totalRecords={props.totalRecords ?? data.length}
          data={data}
        />
      )}
    </Flex>
  );
};

export default TableComponent;
