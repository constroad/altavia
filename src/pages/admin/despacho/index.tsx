import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';
import { CustomDivider, IntranetLayout, Modal, TableComponent, toast } from 'src/components';
import axios from 'axios';
import {
  IDispatchList,
  IDispatchValidationSchema,
  IGetAll,
} from 'src/models/dispatch';
import { useAsync, useScreenSize } from 'src/common/hooks';
import { API_ROUTES } from 'src/common/consts';
import {
  DispatchNotePDFType,
  PDFViewer,
  generateDispatchColumns,
} from 'src/components/dispatch';
import { IClientValidationSchema } from 'src/models/client';
import { ITransportValidationSchema } from 'src/models/transport';
import { IOrderValidationSchema } from 'src/models/order';
import { DownloadIcon, RefreshIcon, WhatsAppIcon } from 'src/common/icons';
import { getDate } from 'src/common/utils';
import { formatISODate, formatMoney, getDateStringRange } from 'src/utils/general';
import { TablePagination, TableAction } from '../../../components/Table/Table';
import { Select } from '@chakra-ui/react';
import { CONSTROAD_COLORS } from 'src/styles/shared';

const fetcher = (path: string) => axios.get(path);
const postDisptach = (path: string, data: any) => axios.post(path, { data });
const deleteDispatch = (path: string) => axios.delete(path);
const putDisptach = (path: string, data: any) => axios.put(path, data);

const defaultValueDispatch: IDispatchValidationSchema = {
  date: formatISODate(new Date().toDateString()),
  transportId: '',
  clientId: '',
  invoice: '',
  description: 'Mezcla asfaltica',
  guia: '',
  obra: '',
  igvCheck: true,
  driverName: '',
  driverCard: '',
  quantity: 0,
  price: 480,
  subTotal: 0,
  igv: 0,
  total: 0,
  note: '',
};

const DispatchPage = () => {
  const { isMobile } = useScreenSize();
  const { dateTo, dateFrom } = getDateStringRange();
  const [startDate, setStartDate] = useState(dateFrom);
  const [clientId, setClientId] = useState('');
  const [endDate, setEndDate] = useState(dateTo);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [dispatchSelected, setDispatchSelected] = useState<IDispatchList>();
  const { onClose, isOpen, onOpen } = useDisclosure();
  const {
    onClose: onCloseDelete,
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
  } = useDisclosure();

  const [image, setImage] = useState<string | null>(null);
  const [whatsappMessage, setWhatsappMessage] = useState('')

  // API
  const {
    run: runGetOrders,
    isLoading: loadingOrders,
    data: orderResponse,
  } = useAsync<IOrderValidationSchema[]>();
  const {
    run: runGetDispatchs,
    data: dispatchResponse,
    isLoading,
    refetch,
  } = useAsync<IGetAll>();
  const {
    run: runGetClients,
    data: clientResponse,
    refetch: refetchClients,
  } = useAsync<IClientValidationSchema[]>();
  const {
    run: runGetTransports,
    data: responseTransport,
    refetch: refetchTransport,
  } = useAsync<ITransportValidationSchema[]>();
  const { run: runAddDispatch, isLoading: addingDispatch } = useAsync();
  const { run: runDeleteDispatch, isLoading: deletingDispatch } = useAsync();
  const { run: runUpdateDispatch, isLoading: updatingDispatch } = useAsync();

  useEffect(() => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: itemsPerPage.toString(),
      startDate: startDate || '',
      endDate: endDate || '',
      clientId,
    });
    const path = `${API_ROUTES.dispatch}?${queryParams.toString()}`;
    runGetDispatchs(fetcher(path), {
      cacheKey: path,
      refetch: () => runGetDispatchs(fetcher(path)),
    });
  }, [page, itemsPerPage, startDate, endDate, clientId]);

  useEffect(() => {
    runGetOrders(fetcher(API_ROUTES.order), {
      // cacheKey: API_ROUTES.order,
      refetch: () => runGetOrders(fetcher(API_ROUTES.order)),
    });

    runGetClients(fetcher(API_ROUTES.client), {
      cacheKey: API_ROUTES.client,
      refetch: () => runGetClients(fetcher(API_ROUTES.client)),
    });

    runGetTransports(fetcher(API_ROUTES.transport), {
      cacheKey: API_ROUTES.transport,
      refetch: () => runGetTransports(fetcher(API_ROUTES.transport)),
    });
  }, []);

  useEffect(() => {
    if (dispatchSelected) {
      handlePreview()
    }
  }, [dispatchSelected])

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
  const handleDeleteDispatch = () => {
    runDeleteDispatch(
      deleteDispatch(`${API_ROUTES.dispatch}/${dispatchSelected?._id}`),
      {
        onSuccess: () => {
          toast.success(
            `Eliminaste el pedido ${dispatchSelected?.description}`
          );
          setDispatchSelected(undefined);
          onCloseDelete();
          refetch();
          refetchTransport();
          refetchClients();
        },
      }
    );
  };

  const handleAddDispatch = () => {
    const { currentYear, month } = getDate();
    const number = dispatchResponse?.data?.dispatchs?.length + 1;
    const dispatchNoteNumber = `${currentYear}${month}-${number}`;
    runAddDispatch(
      postDisptach(API_ROUTES.dispatch, { ...defaultValueDispatch, nroVale: dispatchNoteNumber }),
      {
        onSuccess: () => {
          refetch();
          setDispatchSelected(undefined);
        },
        onError: () => {
          toast.error('ocurrio un error agregando un Despacho');
        },
      }
    );
  };

  const updateDispatch = (payload: IDispatchValidationSchema) => {
    const path = `${API_ROUTES.dispatch}/${payload._id}`;
    runUpdateDispatch(putDisptach(path, payload), {
      onSuccess: () => {
        setDispatchSelected(undefined);
        refetch();
      },
      onError: () => {
        toast.error('ocurrio un error actualizando un despacho');
      },
    });
  };

  const handleSendWhatsAppMessage = () => {
    if (!dispatchSelected?.phoneNumber) {
      toast.warning('Ingrese el numero de celular');
      return;
    }
    const url = `https://api.whatsapp.com/send?phone=51${dispatchSelected.phoneNumber}&text=${whatsappMessage}`;
    const win = window.open(url, '_blank');
    win?.focus();
    onClose();
    setDispatchSelected(undefined);
  };

  const handleGenerateDispatchNote = async () => {
    if (!dispatchSelected) {
      return;
    }
    const [year, months, day] = dispatchSelected.date.split('-')
    const newDate = `${day}/${months}/${year}`

    const { peruvianTime } = getDate();

    const pdfData: DispatchNotePDFType = {
      nro: dispatchSelected.nroVale ?? '',
      date: newDate,
      clientName: dispatchSelected.client ?? '',
      proyect: dispatchSelected.obra ?? '',
      material: dispatchSelected.description ?? '',
      amount: dispatchSelected.quantity ?? 0,
      plate: dispatchSelected.plate ?? '',
      transportist:
        dispatchSelected.driverName || dispatchSelected.company || '',
      hour: peruvianTime,
      note: dispatchSelected.note || '',
    };

    const response = await axios.post(
      API_ROUTES.generateDispatchNotePDF,
      { pdfData },
      { responseType: 'arraybuffer' }
    );
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const pdfName = `Despacho_${dispatchSelected?.plate}_${newDate}.pdf`;

    const pdfUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute('download', pdfName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
    isLoading: isLoading || loadingOrders || updatingDispatch,
    orderList: orderResponse?.data ?? [],
    reloadClient: refetchClients,
    clientList: clientResponse?.data ?? [],
    reloadTransport: refetchTransport,
    transportList: responseTransport?.data ?? [],
    updateDispatch,
    onDelete: (dispatch) => {
      setDispatchSelected(dispatch);
      onOpenDelete();
    },
    onSendVale: (dispatch) => {
      onOpen();
      setDispatchSelected(dispatch);
    },
  });

  const listDispatch = useMemo((): IDispatchList[] => {
    if (!dispatchResponse) return [];

    return dispatchResponse.data.dispatchs.map((item) => {
      const transport = responseTransport?.data?.find(
        (x) => x._id === item.transportId
      );
      const order = orderResponse?.data?.find((x) => x._id === item.orderId);
      let client = clientResponse?.data?.find((x) => x._id === item.clientId);
      if (order) {
        client = clientResponse?.data?.find((x) => x._id === order.clienteId);
      }
      return {
        ...item,
        order: order
          ? `${client?.name} ${
              new Date(order.fechaProgramacion).toLocaleDateString('es-PE') ??
              ''
            } ${order.cantidadCubos} cubos`
          : '',
        obra: order?.obra || item.obra,
        client: client?.name ?? '',
        clientRuc: client?.ruc ?? '',
        company: transport?.company ?? '',
        plate: transport?.plate ?? '',
        driverName: item.driverName || transport?.driverName || '',
      };
    });
  }, [dispatchResponse, clientResponse, responseTransport, isLoading]);

  const handlePreview = async () => {
    if (!dispatchSelected) return
    else {
      const [year, months, day] = dispatchSelected.date.split('-')
      const newDate = `${day}/${months}/${year}`

      const { peruvianTime } = getDate();
  
      const pdfData: DispatchNotePDFType = {
        nro: dispatchSelected.nroVale ?? '',
        date: newDate,
        clientName: dispatchSelected.client ?? '',
        proyect: dispatchSelected.obra ?? '',
        material: dispatchSelected.description ?? '',
        amount: dispatchSelected.quantity ?? 0,
        plate: dispatchSelected.plate ?? '',
        transportist:
          dispatchSelected.driverName || dispatchSelected.company || '',
        hour: peruvianTime,
        note: dispatchSelected.note || '',
      };
  
      try {
        const response = await axios.post('/api/pdf-preview', {pdfData});
        setImage(response.data.imageBase64);
      } catch (error) {
        console.error('Error al generar la previsualización del PDF', error);
      }
    }
  };

  const [year, months, day] = dispatchSelected!?.date.split('-') || ["", "", ""]
  const newDate = `${day}/${months}/${year}`
  const pdfName = `Despacho_${dispatchSelected?.plate}_${newDate}.pdf`;

  const deleteFooter = (
    <Button
      isLoading={deletingDispatch}
      variant="ghost"
      autoFocus
      colorScheme="red"
      onClick={handleDeleteDispatch}
    >
      Confirm
    </Button>
  );

  return (
    <IntranetLayout title="Control de Despachos">
      <Flex
        flexDir="column"
        alignItems={{ base: '', md: '' }}
        gap="15px"
        mt={5}
      >
        <Flex
          width="100%"
          alignItems={{ base: 'start', md: "end" }}
          justifyContent="space-between"
          flexDir={{ base: 'column', md: 'row' }}
          gap={{ base: '4px', md: '0px' }}
        >
          <Flex gap={{ base: 1, md: 2 }}>
            <FormControl>
              <FormLabel mb="6px" fontSize={{ base: 12 }}>
                Desde:
              </FormLabel>
              <Input
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                paddingInlineEnd={1}
                paddingInlineStart={1}
                fontSize={{ base: 12 }}
                height="32px"
                type="date"
                width="100px"
              />
            </FormControl>
            <FormControl>
              <FormLabel mb="6px" fontSize={{ base: 12 }}>
                Hasta
              </FormLabel>
              <Input
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                paddingInlineEnd={1}
                paddingInlineStart={1}
                fontSize={{ base: 12 }}
                height="32px"
                type="date"
                width="100px"
              />
            </FormControl>
            <Flex flexDir="column" fontSize="inherit">
              <Text fontSize={{ base: 12 }} mb="6px">
                Cliente:
              </Text>
              <Select
                defaultValue=""
                size="sm"
                width={{ base: '90px', md: '150px' }}
                onChange={(e) => setClientId(e.target.value)}
                fontSize={12}
              >
                <option value="">Todos</option>
                {clientResponse?.data?.map((client) => (
                  <option key={`filter-${client._id}`} value={client._id}>
                    {client.name}
                  </option>
                ))}
              </Select>
            </Flex>
          </Flex>
          <Flex alignItems="center" gap={1}>
            <Button autoFocus onClick={() => refetch()} size="sm">
              <RefreshIcon />
            </Button>
            <Button
              autoFocus
              onClick={handleAddDispatch}
              size="sm"
              isLoading={addingDispatch}
            >
              + {!isMobile && 'Despacho'}
            </Button>
          </Flex>
        </Flex>
        <Flex flexDir="column" fontSize="12px" width="210px">
          <Flex>
            <Box width="30%" bgColor="black" color="white">
              M3:
            </Box>
            <Text flex={1} textAlign="right" bgColor={CONSTROAD_COLORS.yellow}>
              {listDispatch
                .map((x) => x.quantity)
                .reduce((prev, current) => prev + current, 0)}
            </Text>
          </Flex>
          <Flex>
            <Box width="30%" bgColor="black" color="white">
              Total:
            </Box>
            <Text textAlign="right" flex={1} bgColor={CONSTROAD_COLORS.yellow}>
              S/.
              {formatMoney(
                listDispatch
                  .map((x) => x.total)
                  .reduce((prev, current) => prev + current, 0)
              )}
            </Text>
          </Flex>
        </Flex>

        <TableComponent
          // isLoading={isLoading || loadingOrders || updatingDispatch}
          data={listDispatch}
          columns={columns}
          pagination
          onChange={handleOnTableChange}
          currentPage={page}
          itemsPerPage={itemsPerPage}
          totalPages={dispatchResponse?.data?.pagination?.totalPages ?? 0}
          totalRecords={dispatchResponse?.data?.pagination?.totalRecords ?? 0}
        />
      </Flex>

      {/* delete dispatch modal */}
      <Modal
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        heading={`¿Estás seguro de eliminar este Pedido ${dispatchSelected?.description}?`}
        footer={deleteFooter}
      />

      {/* download vale  ----  TRABAJAR AQUII */}
      <Modal  
        hideCancelButton
        isOpen={isOpen}
        onClose={onClose}
        heading="Imprimir vale"
        width='950px'
      >
        <Flex w='100%' h={{ base: 'auto', md: '450px'}} justifyContent='space-between' flexDir={{ base: 'column', md: 'row' }} gap={{base: '20px', md: '0px'}}>
          {/* PDF VIEWER */}
          <Flex w={{ base: '100%', md: '49%'}} flexDir='column' h={{ base: 'auto', md: '450px'}} alignItems='center' justifyContent='space-between'>
            <Flex flexDir='column' w='100%' h='88%'>
              <Text fontWeight={600}>Previsualizar PDF</Text>
              {image && (
                <PDFViewer pdfImage={image} pdfName={pdfName} />
              )}
            </Flex>
            <Button
              size='sm'
              mt={{ base: '10px', md: '0px' }}
              colorScheme='blue'
              onClick={handleGenerateDispatchNote}
            >
              <DownloadIcon fontSize={20} />
              <Text ml='5px'>Descargar vale</Text>
            </Button>
          </Flex>

          {isMobile && <CustomDivider/>}
          
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
                      setDispatchSelected({
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
                onClick={handleSendWhatsAppMessage}
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
