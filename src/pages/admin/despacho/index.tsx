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
import { IntranetLayout, Modal, TableComponent, toast } from 'src/components';
import axios from 'axios';
import {
  IDispatchList,
  IGetAll,
} from 'src/models/dispatch';
import { useScreenSize } from 'src/common/hooks';
import { API_ROUTES } from 'src/common/consts';
import {
  SearchDispatch,
  Summary,
  generateDispatchColumns,
} from 'src/components/dispatch';
import { DownloadIcon } from 'src/common/icons';
import { getDateStringRange } from 'src/utils/general';
import { TablePagination, TableAction } from '../../../components/Table/Table';
import { useDispatch } from 'src/common/hooks/useDispatch';
import { v4 as uuidv4 } from 'uuid';

const postDisptach = (path: string, data: any) => axios.post(path, { data });
const deleteDispatch = (path: string) => axios.delete(path);
const putDisptach = (path: string, data: any) => axios.put(path, data);

const defaultValueDispatch: IDispatchList = {
  date: new Date(),
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
  order: '',
  client: '',
  clientRuc: '',
  company: '',
  plate: '',
  key: new Date().toISOString()
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
    dispatchResponse,
    setDispatchResponse,
    clientResponse,
    responseTransport,
    isLoadingDispatch,
    deletingDispatch,
    refetchDispatch,
    runDeleteDispatch,
    refetchClients,
    refetchTransport,
    runAddDispatch,
    runUpdateDispatch,
    loadingOrders,
    orderResponse,
    addingDispatch,
    handleGenerateDispatchNote,
    listDispatch,
  } = useDispatch({
    query: {
      page: page,
      limit: itemsPerPage,
      startDate: startDate || '',
      endDate: endDate || '',
      clientId,
    },
  });

  // handlers
  const handleDeleteDispatch = (data?: IGetAll) => {
    if (dispatchSelected?.status === 'New' && data) {
      const newList = [...listDispatch].filter(
        (x) => x._id !== dispatchSelected._id
      );
      setDispatchResponse({ ...data, dispatchs: [...newList] });
      setDispatchSelected(undefined);
      onCloseDelete();
      return;
    }

    runDeleteDispatch(
      deleteDispatch(`${API_ROUTES.dispatch}/${dispatchSelected?._id}`),
      {
        onSuccess: () => {
          toast.success(
            `Eliminaste el pedido ${dispatchSelected?.description}`
          );
          setDispatchSelected(undefined);
          onCloseDelete();
          refetchDispatch();
          refetchTransport();
          refetchClients();
        },
      }
    );
  };

  const handleAddDispatch = (data?: IGetAll) => {
    const newPayload = {
      ...defaultValueDispatch,
      status: 'New',
      _id: uuidv4(),
    };
    if (data) {
      const newList = [...listDispatch];
      newList.unshift(newPayload as IDispatchList);
      setDispatchResponse({ ...data, dispatchs: [...newList] });
    }
  };

  const updateDispatch = (data?: IGetAll) => (payload: IDispatchList) => {
    if (data) {
      const newList = [...listDispatch].map((x) => {
        if (x._id === payload._id) {
          let status = 'Edit';
          const key = new Date().toISOString()
          if (payload.status === 'New') {
            status = 'New';
          }
          return {
            ...payload,
            key,
            status,
          } as IDispatchList;
        }
        return x;
      });
      setDispatchResponse({ ...data, dispatchs: [...newList] });
    }
  };

  const onSave = async (data?: IGetAll) => {
    if (!data) return;
    const dispatchs = data.dispatchs.filter(
      (x) => x.status === 'New' || x.status === 'Edit'
    );
    await Promise.all(
      dispatchs.map((item) => {
        //add new
        if (item.status === 'New') {
          return runAddDispatch(
            postDisptach(API_ROUTES.dispatch, {
              ...item,
              _id: undefined,
            }),
            {
              onError: () => {
                toast.error('ocurrio un error agregando un Despacho');
              },
            }
          );
        }
        //edit
        const path = `${API_ROUTES.dispatch}/${item._id}`;
        return runUpdateDispatch(
          putDisptach(path, { ...item, _id: undefined }),
          {
            onError: () => {
              toast.error('ocurrio un error actualizando un despacho');
            },
          }
        );
      })
    );
    setDispatchSelected(undefined);
    refetchDispatch();
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
    isLoading: isLoadingDispatch || loadingOrders,
    orderList: orderResponse?.data ?? [],
    reloadClient: refetchClients,
    clientList: clientResponse?.data ?? [],
    reloadTransport: refetchTransport,
    transportList: responseTransport?.data ?? [],
    updateDispatch: updateDispatch(dispatchResponse),
    onDelete: (dispatch) => {
      setDispatchSelected(dispatch);
      onOpenDelete();
    },
    onSendVale: (dispatch) => {
      onOpen();
      setDispatchSelected(dispatch);
    },
  });
  const dispatchSummary = dispatchResponse?.summary;

  const deleteFooter = (
    <Button
      isLoading={deletingDispatch}
      variant="ghost"
      autoFocus
      colorScheme="red"
      onClick={() => handleDeleteDispatch(dispatchResponse)}
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
              onAddDispatch={() => handleAddDispatch(dispatchResponse)}
              addindDispatch={addingDispatch}
              totalRecords={dispatchSummary?.nroRecords ?? 0}
              onSaveDispatch={() => onSave(dispatchResponse)}
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
            onClick={() =>
              handleGenerateDispatchNote(dispatchSelected, {
                onSuccess: () => {
                  onClose();
                  setDispatchSelected(undefined);
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
