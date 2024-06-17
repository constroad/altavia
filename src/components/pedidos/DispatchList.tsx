import { useDispatch, useScreenSize } from 'src/common/hooks';
import { IOrderValidationSchema } from 'src/models/order';
import { TableComponent } from '../Table';
import { Summary } from '../dispatch/Summary';
import { generateDispatchColumns } from '../dispatch';
import { Button, useDisclosure } from '@chakra-ui/react';
import { Modal } from 'src/components';
import { IDispatchList } from 'src/models/dispatch';

interface DispatchListProps {
  order?: IOrderValidationSchema;
}

export const DispatchList = (props: DispatchListProps) => {
  const { order } = props;
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
  } = useDispatch({
    query: {
      page: 1,
      limit: 50,
      orderId: props?.order?._id,
    },
  });

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
        onClose={onCloseDelete}
        heading={`¿Estás seguro de eliminar este Pedido ${dispatchSelected?.description}?`}
        footer={deleteFooter}
      />
    </>
  );
};
