import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormLabel,
  Input,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { IntranetLayout, Modal, TableComponent } from 'src/components';
import { useScreenSize } from 'src/common/hooks';
import {
  SearchDispatch,
  Summary,
  generateDispatchColumns,
} from 'src/components/dispatch';
import { DownloadIcon } from 'src/common/icons';
import { getDateStringRange } from 'src/utils/general';
import { TablePagination, TableAction } from '../../../components/Table/Table';
import { useDispatch } from 'src/common/hooks/useDispatch';

const DispatchPage = () => {
  const { isMobile } = useScreenSize();
  const { dateTo, dateFrom } = getDateStringRange();
  const [startDate, setStartDate] = useState(dateFrom);
  const [clientId, setClientId] = useState('');
  const [isPaid, setIsPaid] = useState<boolean | undefined>();
  const [endDate, setEndDate] = useState(dateTo);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const { onClose, isOpen, onOpen } = useDisclosure();
  const {
    onClose: onCloseDelete,
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
  } = useDisclosure();

  // API
  const {
    dispatchResponse,
    clientResponse,
    responseTransport,
    isLoadingDispatch,
    deletingDispatch,
    refetchDispatch,
    refetchClients,
    refetchTransport,
    loadingOrders,
    orderResponse,
    addingDispatch,
    handleGenerateDispatchNote,
    listDispatch,
    onAddDispatch,
    onDeleteDispatch,
    onUpdateDispatch,
    onSaveAllDispatch,
    dispatchSelected,
    onSelectDispatch,
  } = useDispatch({
    query: {
      page: page,
      limit: itemsPerPage,
      startDate: startDate || '',
      endDate: endDate || '',
      clientId,
      isPaid
    },
  });

  // handlers
  const handleOnTableChange = (
    action: TableAction,
    pagination: TablePagination
  ) => {
    if (action === 'paginate') {
      setPage(pagination.page);
      setItemsPerPage(pagination.itemsPerPage);
    }
  };

  const columns = generateDispatchColumns({
    isMobile,
    isLoading: isLoadingDispatch || loadingOrders,
    orderList: orderResponse?.data?.orders ?? [],
    reloadClient: refetchClients,
    clientList: clientResponse?.data ?? [],
    reloadTransport: refetchTransport,
    transportList: responseTransport?.data ?? [],
    updateDispatch: onUpdateDispatch,
    onDelete: (dispatch) => {
      onSelectDispatch(dispatch);
      onOpenDelete();
    },
    onSendVale: (dispatch) => {
      onOpen();
      onSelectDispatch(dispatch);
    },
  });
  const dispatchSummary = dispatchResponse?.summary;

  const deleteFooter = (
    <Button
      isLoading={deletingDispatch}
      variant="ghost"
      autoFocus
      colorScheme="red"
      onClick={() =>
        onDeleteDispatch({
          onSuccess: onCloseDelete,
        })
      }
    >
      Confirm
    </Button>
  );

  return (
    <IntranetLayout title="Control de Despachos">
      <Flex flexDir="column" gap="15px" mt={5}>
        <SearchDispatch
          clientList={clientResponse?.data ?? []}
          startDate={startDate}
          endDate={endDate}
          clientId={clientId}
          isPaid={isPaid}
          isSearching={isLoadingDispatch}
          onSearch={({ startDate, endDate, clientId, isPaid }) => {
            setStartDate(startDate);
            setEndDate(endDate);
            setClientId(clientId);
            setIsPaid(isPaid)
          }}
        />
        <TableComponent
          toolbar={
            <Summary
              listDispatch={listDispatch}
              onRefreshDispatch={refetchDispatch}
              onAddDispatch={() => onAddDispatch()}
              addindDispatch={addingDispatch}
              totalRecords={dispatchSummary?.nroRecords ?? 0}
              onSaveDispatch={onSaveAllDispatch}
            />
          }
          // isLoading={isLoading || loadingOrders || updatingDispatch}
          data={listDispatch}
          columns={columns}
          pagination
          onChange={handleOnTableChange}
          currentPage={page}
          itemsPerPage={itemsPerPage}
          totalPages={dispatchResponse?.pagination?.totalPages ?? 0}
          totalRecords={dispatchSummary?.nroRecords ?? 0}
        />
      </Flex>

      {/* delete dispatch modal */}
      <Modal
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        heading={`¿Estás seguro de eliminar este Pedido ${dispatchSelected?.description}?`}
        footer={deleteFooter}
      />

      {/* download vale */}
      <Modal
        hideCancelButton
        isOpen={isOpen}
        onClose={onClose}
        heading="Imprimir vale"
      >
        <Flex flexDir="column" gap={2}>
          <Box>
            <FormLabel mb="6px" fontSize={{ base: 12 }}>
              Celular
            </FormLabel>
            <Input
              px={{ base: '5px', md: '3px' }}
              fontSize={{ base: 12 }}
              lineHeight="14px"
              height="32px"
              type="text"
              required
              onChange={(e) => {
                if (dispatchSelected) {
                  onSelectDispatch({
                    ...dispatchSelected,
                    phoneNumber: e.target.value,
                  });
                }
              }}
              value={dispatchSelected?.phoneNumber}
            />
          </Box>

          <Button
            size="sm"
            colorScheme="blue"
            onClick={() =>
              handleGenerateDispatchNote(dispatchSelected, {
                onSuccess: () => {
                  onClose();
                  onSelectDispatch(undefined);
                },
              })
            }
          >
            <DownloadIcon fontSize={20} />
            <Text ml="5px">Descargar y enviar por whatsApp</Text>
          </Button>
        </Flex>
      </Modal>
    </IntranetLayout>
  );
};

export default DispatchPage;
