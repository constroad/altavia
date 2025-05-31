import {
  Button,
  Flex,
  Box,
  Text,
} from '@chakra-ui/react';

import { CircularProgress } from '@chakra-ui/progress'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableProps,
} from '@chakra-ui/table'

import { SortColumnStatus, TableColumn, TableData } from './TableTypes';
import { CONSTROAD_COLORS } from 'src/styles/shared';
import { EditIcon, ShareIcon, TrashIcon } from 'src/common/icons';
import { useEffect, useMemo, useState } from 'react';
import { Pagination } from './Pagination';
import { v4 as uuidv4 } from 'uuid';
import { WithSort } from './WithSort';

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
  tableProps?: TableProps
}

export const TableComponent = (props: Props) => {
  const [rows, setRows] = useState<TableData[]>([]);
  const { data, columns, onDelete, onSelectRow, onEdit, onShare, isLoading } =
    props;
  const [currentPage, setCurrentPage] = useState(props.currentPage ?? 1);
  const [itemsPerPage, setItemsPerPage] = useState(props.itemsPerPage ?? 20);
  const [sortColumn, setSortColumn] = useState('');

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
      setRows(data);
      return;
    }
    setRows([...data.slice(indexOfFirstItem, indexOfLastItem)]);
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
  const onSort = (col: TableColumn) => (status: SortColumnStatus) => {
    const { key } = col;
    const newRows = rows.sort((a, b) => {
      if (col.key === key) {
        const evaluation = col.sorter?.(status, a, b);
        return evaluation;
      }
      return false;
    });

    setRows([...newRows]);
    setCurrentPage(1);
    setSortColumn(key);
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
      {/* @ts-ignore */}
      <Table border="collapse" mb={10} {...props.tableProps}>
        <Thead h={{ base: '32px', md: 'auto' }}>
          <Tr fontSize={10}>
            {columns.map((column, idx) => (
              <Th
                key={`header-${column.key}-${idx}`}
                background={column.bgColor ?? CONSTROAD_COLORS.black}
                color={column.color ?? 'white'}
                padding={0}
                py={1}
                fontSize={{ base: 10, md: 12 }}
                width={column.width}
                maxWidth={column.width}
              >
                {/* @ts-ignore */}
                <Flex width="100%" textAlign="center" justifyContent="center" {...column.thStyles}>
                  {typeof column.label === 'string' && (
                    <Text>{column.label}</Text>
                  )}
                  {typeof column.label !== 'string' && column.label?.(data)}
                  <WithSort
                    col={column}
                    isLoading={isLoading}
                    reset={sortColumn !== column.key}
                    onClick={onSort(column)}
                  />
                </Flex>
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
            rows.map((row, index) => (
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
                    key={`item-${column.key}-${idx}`}
                    maxWidth={column.width as any}
                    width={column.width as any}
                    height={"max-content" as any}
                    textAlign={(column.textAlign ?? 'start') as any}
                    {...column.tdStyles as any}
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
          {!isLoading &&
            columns.some((x) => x.summary) &&
            columns.map((column, idx) => (
              <Td key={`summary-${column.key}-${idx}`} padding={0}>
                {column.summary?.(
                  rows.reduce(
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
