import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { IntranetLayout, Modal, TableComponent, toast } from 'src/components';
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
  generateDispatchColumns,
} from 'src/components/dispatch';
import { IClientValidationSchema } from 'src/models/client';
import { ITransportValidationSchema } from 'src/models/transport';
import { IOrderValidationSchema } from 'src/models/order';
import { DownloadIcon, RefreshIcon } from 'src/common/icons';
import { getDate } from 'src/common/utils';
import { formatISODate, getDateStringRange } from 'src/utils/general';
import { TablePagination, TableAction } from '../../../components/Table/Table';
import { Select } from '@chakra-ui/react';

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
      cacheKey: API_ROUTES.order,
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
    runAddDispatch(
      postDisptach(API_ROUTES.dispatch, { ...defaultValueDispatch }),
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

  const sendWhatsAppMessage = (phone: string) => {
    if (!phone) {
      toast.warning('Ingrese el numero de celular');
      return;
    }
    const message = `ConstRoad te envia el vale de despacho
     - Obra: ${dispatchSelected?.obra}
     - Nro Cubos: ${dispatchSelected?.quantity}
    `;
    const url = `https://api.whatsapp.com/send?phone=51${phone}&text=${message}`;
    const win = window.open(url, '_blank');
    win?.focus();
    onClose();
    setDispatchSelected(undefined);
  };

  const handleGenerateDispatchNote = async () => {
    if (!dispatchSelected) {
      return;
    }
    if (!dispatchSelected.phoneNumber) {
      toast.warning('Ingrese un numero de telefono');
      return;
    }
    const { slashDate, peruvianTime, currentYear, month } = getDate();
    const number = dispatchResponse?.data?.dispatchs?.length + 1;
    const dispatchNoteNumber = `${currentYear}${month}-${number}`;

    const pdfData: DispatchNotePDFType = {
      nro: dispatchNoteNumber,
      date: slashDate,
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
    const pdfName = `Despacho_${dispatchSelected?.plate}_${slashDate}.pdf`;

    const pdfUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute('download', pdfName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const path = `${API_ROUTES.dispatch}/${dispatchSelected?._id}`;
    runUpdateDispatch(
      putDisptach(path, {
        ...dispatchSelected,
        nroVale: dispatchSelected.nroVale ?? dispatchNoteNumber,
      }),
      {
        onError: () => {
          toast.error('ocurrio un error actualizando un despacho');
        },
      }
    );

    sendWhatsAppMessage(dispatchSelected.phoneNumber ?? '');

    onClose();
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
        <Flex width="100%" alignItems="end" justifyContent="space-between">
          <Flex gap={{base: 1, md: 2}}>
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
                width={{base: "90px" , md: "150px"}}
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
                  setDispatchSelected({
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
            onClick={handleGenerateDispatchNote}
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
