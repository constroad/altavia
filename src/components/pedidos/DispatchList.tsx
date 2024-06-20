import { useDispatch, useScreenSize } from 'src/common/hooks';
import { IOrderValidationSchema } from 'src/models/order';
import { TableComponent } from '../Table';
import { Summary } from '../dispatch/Summary';
import { DispatchNotePDFType, PDFViewer, generateDispatchColumns, get12HoursFormat, getDispatchesPerMonth } from '../dispatch';
import { Box, Button, Flex, FormLabel, Input, Text, Textarea, useDisclosure } from '@chakra-ui/react';
import { CustomDivider, Modal } from 'src/components';
import { IDispatchList } from 'src/models/dispatch';
import { useEffect, useState } from 'react';
import { DownloadIcon, WhatsAppIcon } from 'src/common/icons';
import { getDate } from 'src/common/utils';
import axios from 'axios';

interface DispatchListProps {
  order?: IOrderValidationSchema;
}

export const DispatchList = (props: DispatchListProps) => {
  const { order } = props;
  const [pdfImage, setPdfImage] = useState()
  const [whatsappMessage, setWhatsappMessage] = useState('')
  //API
  const { isMobile } = useScreenSize();
  const { onClose, isOpen, onOpen } = useDisclosure();
  const {
    onClose: onCloseDelete,
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
  } = useDisclosure();
  const {
    listDispatch,
    refetchDispatch,
    isLoadingDispatch,
    addingDispatch,
    refetchTransport,
    responseTransport,
    dispatchResponse,
    deletingDispatch,
    onSelectDispatch,
    dispatchSelected,
    onAddDispatch,
    onDeleteDispatch,
    onUpdateDispatch,
    onSaveAllDispatch,
    handleGenerateDispatchNote,
    sendWhatsAppMessage,
  } = useDispatch({
    query: {
      page: 1,
      limit: 50,
      orderId: props?.order?._id,
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

  const columns = generateDispatchColumns({
    view: 'Order',
    isMobile,
    isLoading: isLoadingDispatch,
    orderList: [],
    clientList: [],
    reloadTransport: refetchTransport,
    transportList: responseTransport?.data ?? [],
    updateDispatch: (dispatch) => onUpdateDispatch(dispatch),
    onDelete: (dispatch) => {
      onSelectDispatch(dispatch);
      onOpenDelete();
    },
    onSendVale: (dispatch) => {
      onOpen();
      onSelectDispatch(dispatch);
      handlePreview(dispatch);
    },
  });
  const dispatchSummary = dispatchResponse?.summary;

  // Handlers
  const handlePreview = async(dispatch: any) => {
    const { peruvianTime, slashDate } = getDate(dispatch.date)
    const hourToSave = get12HoursFormat(dispatch?.hour ?? '')

    const pdfData: DispatchNotePDFType = {
      nro: dispatch.nroVale ?? '',
      date: slashDate,
      clientName: dispatch?.client ?? '',
      proyect: dispatch?.obra ?? '',
      material: dispatch?.description ?? '',
      amount: dispatch?.quantity ?? 0,
      plate: dispatch?.plate ?? '',
      transportist:
      dispatch?.driverName || dispatch?.company || '',
      hour: hourToSave ?? peruvianTime,
      note: dispatch?.note || '',
    };
    
    try {
      const response = await axios.post('/api/pdf-preview', {pdfData});
      setPdfImage(response.data.imageBase64);
    } catch (error) {
      console.error('Error al generar la previsualización del PDF', error);
    }
  };

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
          onSuccess: onCloseDelete,
        })
      }
    >
      Confirm
    </Button>
  );
  const orderText = `${order?.cliente} - ${order?.fechaProgramacion} - ${order?.cantidadCubos} cubos`;
  const OrderData: Partial<IDispatchList> = {
    order: orderText,
    orderId: props.order?._id,
    clientId: props.order?.clienteId,
    client: props.order?.cliente ?? '',
    obra: props.order?.obra ?? '',
  };

  return (
    <>
      <TableComponent
        toolbar={
          <Summary
            listDispatch={listDispatch}
            onRefreshDispatch={refetchDispatch}
            onAddDispatch={() => onAddDispatch(OrderData)}
            addindDispatch={addingDispatch}
            totalRecords={dispatchSummary?.nroRecords ?? 0}
            onSaveDispatch={onSaveAllDispatch}
          />
        }
        isLoading={isLoadingDispatch}
        data={listDispatch}
        columns={columns}
        currentPage={1}
        itemsPerPage={20}
        totalPages={dispatchResponse?.pagination?.totalPages ?? 0}
        totalRecords={dispatchSummary?.nroRecords ?? 0}
      />

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
    </>
  );
};
