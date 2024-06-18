import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormLabel,
  Input,
  Text,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';
import { CustomDivider, IntranetLayout, Modal, TableComponent, toast } from 'src/components';
import { useScreenSize } from 'src/common/hooks';
import {
  DispatchNotePDFType,
  PDFViewer,
  SearchDispatch,
  Summary,
  generateDispatchColumns,
} from 'src/components/dispatch';
import { DownloadIcon, WhatsAppIcon } from 'src/common/icons';
import { getDateStringRange } from 'src/utils/general';
import { TablePagination, TableAction } from '../../../components/Table/Table';
import { useDispatch } from 'src/common/hooks/useDispatch';
import { getDate } from 'src/common/utils';
import axios from 'axios';

const DispatchPage = () => {
  const { isMobile } = useScreenSize();
  const { dateTo, dateFrom } = getDateStringRange();
  const [startDate, setStartDate] = useState(dateFrom);
  const [clientId, setClientId] = useState('');
  const [endDate, setEndDate] = useState(dateTo);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [pdfImage, setPdfImage] = useState()
  const [whatsappMessage, setWhatsappMessage] = useState('')
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
    sendWhatsAppMessage
  } = useDispatch({
    query: {
      page: page,
      limit: itemsPerPage,
      startDate: startDate || '',
      endDate: endDate || '',
      clientId,
    },
  });

  useEffect(() => {
    if (dispatchSelected) {
      const message =
      `ConstRoad te envia el vale de despacho
    - Obra: ${dispatchSelected?.obra}
    - Nro Cubos: ${dispatchSelected?.quantity}
      `;
      setWhatsappMessage(message)
    }
  }, [dispatchSelected])

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

  const handlePreview = async(dispatch: any) => {
    const { peruvianTime, slashDate } = getDate(dispatch.date)

    const pdfData: DispatchNotePDFType = {
      nro: dispatch?.nroVale ?? '',
      date: slashDate,
      clientName: dispatch?.client ?? '',
      proyect: dispatch?.obra ?? '',
      material: dispatch?.description ?? '',
      amount: dispatch?.quantity ?? 0,
      plate: dispatch?.plate ?? '',
      transportist:
      dispatch?.driverName || dispatch?.company || '',
      hour: peruvianTime,
      note: dispatch?.note || '',
    };
    
    try {
      const response = await axios.post('/api/pdf-preview', {pdfData});
      setPdfImage(response.data.imageBase64);
    } catch (error) {
      console.error('Error al generar la previsualización del PDF', error);
    }
  };

  const columns = generateDispatchColumns({
    isMobile,
    isLoading: isLoadingDispatch || loadingOrders,
    orderList: orderResponse?.data ?? [],
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
      handlePreview(dispatch)
    },
  });
  const dispatchSummary = dispatchResponse?.summary;

  const handleCloseModal = () => {
    onClose()
    onSelectDispatch(undefined)
  }
  const handleCloseDeleteModal = () => {
    onCloseDelete()
    onSelectDispatch(undefined)
  }

  const deleteFooter = (
    <Button
      isLoading={deletingDispatch}
      variant="ghost"
      autoFocus
      colorScheme="red"
      onClick={() =>
        onDeleteDispatch({
          onSuccess: handleCloseDeleteModal,
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
          isSearching={isLoadingDispatch}
          onSearch={({ startDate, endDate, clientId }) => {
            setStartDate(startDate);
            setEndDate(endDate);
            setClientId(clientId);
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
        onClose={handleCloseDeleteModal}
        heading={`¿Estás seguro de eliminar este Pedido ${dispatchSelected?.description}?`}
        footer={deleteFooter}
      />

      {/* download vale */}
      <Modal
        hideCancelButton
        isOpen={isOpen}
        onClose={handleCloseModal}
        heading="Imprimir vale"
        width='950px'
      >
        <Flex w='100%' h={{ base: 'auto', md: '450px'}} justifyContent='space-between' flexDir={{ base: 'column', md: 'row' }} gap={{base: '20px', md: '0px'}}>
          {/* PDF VIEWER */}
          <Flex w={{ base: '100%', md: '49%'}} flexDir='column' h={{ base: 'auto', md: '450px'}} alignItems='center' justifyContent='space-between'>
            <Flex flexDir='column' w='100%' h='88%'>
              <Text fontWeight={600}>Previsualizar PDF</Text>
              {pdfImage && (
                <PDFViewer pdfImage={pdfImage} pdfName={'name'} />
              )}
            </Flex>
            <Button
              size='sm'
              mt={{ base: '10px', md: '0px' }}
              colorScheme='blue'
              onClick={() => {
                handleGenerateDispatchNote(dispatchSelected)
              }}
            >
              <DownloadIcon fontSize={20} />
              <Text ml='5px'>Descargar vale</Text>
            </Button>
          </Flex>

          {isMobile && <CustomDivider />}

          {/* SEND WHATSAPP MESSAGE */}
          <Flex flexDir="column" gap={2} w={{ base: '100%', md: '49%'}} justifyContent='space-between'>
            <Flex flexDir='column'>
              <Flex flexDir='column'>
                <Text fontWeight={600} fontSize={{ base: 12, md: 14 }}>Mensaje:</Text> 
                <Textarea value={whatsappMessage} onChange={(e) => setWhatsappMessage(e.target.value)} fontSize={12} mt={{ base: '5px', md: '10px'}} />
              </Flex>

              <Box mt={{ base: '15px', md: '40px' }}>
                <FormLabel mb="6px" fontSize={{ base: 12, md: 14 }} fontWeight={600}>
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
            </Flex>

            <Flex w='100%' justifyContent='center'>
              <Button
                w='fit-content'
                size="sm"
                colorScheme="blue"
                onClick={() => {
                  sendWhatsAppMessage(dispatchSelected, whatsappMessage, {
                    onSuccess: () => {
                      onClose();
                      onSelectDispatch(undefined);
                    }
                  })
                }}
              >
                <WhatsAppIcon fontSize={20} />
                <Text ml="5px">Enviar por WhatsApp</Text>
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Modal>
    </IntranetLayout>
  );
};

export default DispatchPage;