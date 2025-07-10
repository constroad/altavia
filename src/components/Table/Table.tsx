'use client';

import { Button, Flex, Box, Text, Spinner } from '@chakra-ui/react';

import { SortColumnStatus, TableColumn, TableData } from './TableTypes';
import { CONSTROAD_COLORS } from 'src/styles/shared';
import { EditIcon, ShareIcon, TrashIcon } from 'src/common/icons';
import { useLayoutEffect, useMemo, useState } from 'react';
import { Pagination } from './Pagination';
import { WithSort } from './WithSort';
import { Table, Tbody, Td, Th, Thead, Tr } from '../ui/table';
import { ButtonConfirm } from '../ButtonConfirm/ButtonConfirm';
import { IconWrapper } from '../IconWrapper/IconWrapper';

export type TableAction = 'paginate' | 'filter';
import { v4 as uuidv4 } from 'uuid';
import { CustomSelect } from '../ui/CustomSelect';

export type TablePagination = {
  page: number;
  itemsPerPage: number;
};
interface Props {
  data: TableData[];
  columns: TableColumn[];
  onDelete?: (item: any) => void;
  deleteMessage?: string;
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
  // tableProps?: TableProps;
  forUpdateEachTime?: boolean;
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

  useLayoutEffect(() => {
    const paginacionActiva = !props.currentPage;
  
    if (!paginacionActiva) {
      setRows(data);
      return;
    }
  
    const first = (currentPage - 1) * itemsPerPage;
    const last = first + itemsPerPage;
    const sliced = data.slice(first, last);
  
    console.log({
      currentPage,
      itemsPerPage,
      first,
      last,
      total: data.length,
      sliced,
    });
  
    setRows(sliced);
  }, [data, currentPage, itemsPerPage, props.currentPage]);
  

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

  const onChangePagination = (value: string) => {
    const parsed = parseInt(value);
  
    if (!isNaN(parsed) && parsed > 0) {
      setItemsPerPage(parsed);
      setCurrentPage(1);
      props.onChange?.("paginate", {
        page: 1,
        itemsPerPage: parsed,
      });
    } else {
      console.warn("Valor inválido para itemsPerPage:", value);
    }
  };  

  const paginationOptions = [
    { label: "20 por página", value: "20" },
    { label: "50 por página", value: "50" },
    { label: "100 por página", value: "100" },
    { label: "200 por página", value: "200" },
  ];

  const safeItemsPerPage = parseInt(String(itemsPerPage)) || 1;
  const totalPages = props.totalPages ?? Math.ceil(data.length / safeItemsPerPage);

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
                <Flex
                  width="100%"
                  textAlign="center"
                  justifyContent="center"
                  {...column.thStyles}
                >
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
                <Spinner />
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
                key={
                  props.forUpdateEachTime
                    ? `row-${uuidv4()}`
                    : `row-${row?._id ? `${row?._id}-${row?.key}` : index}`
                }
                onClick={() => handleSelectRow(row)}
                _hover={{
                  background: 'whitesmoke',
                }}                
                height="fit-content"
                p={0}
              >
                {columns.map((column, idx) => (
                  <Td
                    p={1}
                    m={0}
                    key={`item-${column.key}-${idx}`}
                    maxWidth={column.width as any}
                    width={column.width as any}
                    height={'max-content' as any}
                    textAlign={(column.textAlign ?? 'start') as any}
                    cursor={handleSelectRow !== undefined ? 'cursor' : 'inherit'}
                    {...(column.tdStyles as any)}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </Td>
                ))}
                {(onEdit || onDelete || onShare) && (
                  <Td p={0} px={{ base: 1.5, md: 2 }} textAlign="center">
                    <Flex
                      width="100%"
                      justifyContent={{
                        base: 'space-between',
                        md: 'space-evenly',
                      }}
                      py={0}
                    >
                      {onEdit && (
                        <Button
                          padding={0}
                          margin={0}
                          height="fit-content"
                          onClick={() => onEdit(row)}
                          size="xs"
                          variant="outline"
                          borderWidth={0}
                        >
                          <IconWrapper icon={EditIcon} size={10} />
                        </Button>
                      )}

                      {onDelete && (
                        <ButtonConfirm
                          message={
                            props.deleteMessage
                              ? props.deleteMessage
                              : 'Esta seguro de eliminar este gasto?'
                          }
                          onOk={() => onDelete(row)}
                          size="xs"
                          width="fit-content"
                        >
                          <IconWrapper icon={TrashIcon} size={10} color="red" />
                        </ButtonConfirm>
                      )}

                      {onShare && (
                        <Button
                          minWidth="25px"
                          height={{ base: '20px', md: '' }}
                          fontSize={{ base: 12, md: 14 }}
                          paddingX="5px"
                          onClick={() => onShare(row)}
                        >
                          <IconWrapper icon={ShareIcon} fontSize={12} />
                        </Button>
                      )}
                    </Flex>
                  </Td>
                )}
              </Tr>
            ))}

          {/* summaries */}
          {!isLoading && columns.some((x) => x.summary) && (
            <Tr>
              {columns.map((column, idx) => (
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
            </Tr>
          )}
        </Tbody>
      </Table>

      {props.pagination && (
        <>
          <Flex justifyContent="flex-end" maxHeight='28px' mb={1} px='4px'>
            <CustomSelect
              placeholder="Registros por página"
              items={paginationOptions}
              value={String(itemsPerPage)}
              onChange={onChangePagination}
              width={{ base: '120px', md: '130px' }}
            />
          </Flex>
          <Pagination 
            currentPage={currentPage}
            paginate={paginate}
            itemsPerPage={itemsPerPage}
            totalPages={totalPages}
            totalRecords={props.totalRecords ?? data.length}
            data={data}
          />
        </>
      )}
    </Flex>
  );
};

export default TableComponent;
