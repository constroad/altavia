import { IClientValidationSchema } from "src/models/client";
import { IDispatchList } from "src/models/dispatch";
import { IOrderValidationSchema } from "src/models/order";
import { ITransportValidationSchema } from "src/models/transport";
import { useAsync } from "./useAsync";
import { useEffect, useMemo, useState } from "react";
import { API_ROUTES } from "../consts";
import axios from "axios";
import { toast } from "src/components";
import { getDate } from "../utils";
import { DispatchNotePDFType } from "src/components/dispatch";
import { useDispatchContext } from "src/context/DispatchContext/DispatchContext";
import { v4 as uuidv4 } from 'uuid';


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



const fetcher = (path: string) => axios.get(path);
const postDisptach = (path: string, data: any) => axios.post(path, { data });
const putDisptach = (path: string, data: any) => axios.put(path, data);
const deleteDispatch = (path: string) => axios.delete(path);

type UseDispatchProps = {
  query: {
    page: number,
    limit: number,
    startDate?: string,
    endDate?: string,
    clientId?: string,
    orderId?: string,
  }
}

type optionsCallback = {
  onSuccess?: () => void
  onError?: () => void
}
export const useDispatch = (props: UseDispatchProps) => {
  const [ dispatchSelected, setDispatchSelected ] = useState<IDispatchList>();
  const { dispatchResponse, getDispatchs, refetchDispatch, isLoadingDispatch, setDispatchResponse } = useDispatchContext()
  const { query } = props
  console.log('query:', query)
  console.log('dispatchResponse:', dispatchResponse)

  // API
  const {
    run: runGetOrders,
    isLoading: loadingOrders,
    data: orderResponse,
  } = useAsync<IOrderValidationSchema[]>();
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
    if (!query.page && !query.limit && !query.startDate && !query.endDate && !query.clientId && !query.orderId) {
      return
    }
    getDispatchs({
      page: query.page,
      limit: query.limit,
      startDate: query.startDate,
      endDate: query.endDate,
      clientId: query.clientId,
      orderId: query.orderId,
    })
  }, [ query.page, query.limit, query.startDate, query.endDate, query.clientId, query.orderId ]);

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

  const listDispatch = dispatchResponse?.dispatchs ?? []

  //handlers
  const sendWhatsAppMessage = (
    dispatch?: IDispatchList,
    options?: {
      onSuccess: () => void
    }
  ) => {
    if (!dispatch?.phoneNumber) {
      toast.warning('Ingrese el numero de celular');
      return;
    }
    const message = `ConstRoad te envia el vale de despacho
     - Obra: ${dispatch?.obra}
     - Nro Cubos: ${dispatch?.quantity}
    `;
    const url = `https://api.whatsapp.com/send?phone=51${dispatch.phoneNumber}&text=${message}`;
    const win = window.open(url, '_blank');
    win?.focus();
    options?.onSuccess()
  };

  const handleGenerateDispatchNote = async (
    dispatch?: IDispatchList,
    options?: {
      onSuccess: () => void
    }
  ) => {
    if (!dispatch) {
      return;
    }
    if (!dispatch.phoneNumber) {
      toast.warning('Ingrese un numero de telefono');
      return;
    }
    const { slashDate, peruvianTime, currentYear, month } = getDate();
    const number = dispatchResponse?.dispatchs?.length ?? 0 + 1;
    const dispatchNoteNumber = `${currentYear}${month}-${number}`;

    const pdfData: DispatchNotePDFType = {
      nro: dispatchNoteNumber,
      date: slashDate,
      clientName: dispatch.client ?? '',
      proyect: dispatch.obra ?? '',
      material: dispatch.description ?? '',
      amount: dispatch.quantity ?? 0,
      plate: dispatch.plate ?? '',
      transportist:
        dispatch.driverName || dispatch.company || '',
      hour: peruvianTime,
      note: dispatch.note ?? '',
    };

    const response = await axios.post(
      API_ROUTES.generateDispatchNotePDF,
      { pdfData },
      { responseType: 'arraybuffer' }
    );
    const blob = new Blob([ response.data ], { type: 'application/pdf' });
    const pdfName = `Despacho_${dispatch?.plate}_${slashDate}.pdf`;

    const pdfUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute('download', pdfName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const path = `${API_ROUTES.dispatch}/${dispatch?._id}`;
    runUpdateDispatch(
      putDisptach(path, {
        ...dispatch,
        nroVale: dispatch.nroVale ?? dispatchNoteNumber,
      }),
      {
        onError: () => {
          toast.error('ocurrio un error actualizando un despacho');
        },
      }
    );

    sendWhatsAppMessage(dispatch, {
      onSuccess: () => options?.onSuccess()
    });

  };

  const onAddDispatch = (payload?: Partial<IDispatchList>) => {
    if (!dispatchResponse) return
    const data = dispatchResponse
    const newPayload = {
      ...defaultValueDispatch,
      ...payload,
      status: 'New',
      _id: uuidv4(),
    };
    if (data) {
      const newList = [ ...listDispatch ];
      newList.unshift(newPayload as IDispatchList);
      setDispatchResponse({ ...data, dispatchs: [ ...newList ] });
    }
  }

  const onDeleteDispatch = (props: optionsCallback) => {
    if (!dispatchSelected) {
      toast.warning("Seleccione un despacho a eliminar")
      return
    }
    const data = dispatchResponse
    if (dispatchSelected?.status === 'New' && data) {
      const newList = [ ...listDispatch ].filter(
        (x) => x._id !== dispatchSelected._id
      );
      setDispatchResponse({ ...data, dispatchs: [ ...newList ] });
      setDispatchSelected(undefined)
      props.onSuccess?.()
    }

    runDeleteDispatch(
      deleteDispatch(`${API_ROUTES.dispatch}/${dispatchSelected?._id}`),
      {
        onSuccess: () => {
          toast.success(
            `Eliminaste el pedido ${dispatchSelected?.description}`
          );
          setDispatchSelected(undefined);
          refetchDispatch();
          refetchTransport();
          refetchClients();
          props.onSuccess?.()
        },
      }
    );
  }

  console.log('dispatchResponse:', dispatchResponse)

  const onUpdateDispatch = (payload: IDispatchList, props?: optionsCallback) => {
    if (!dispatchResponse) return
    const data = dispatchResponse
    const newList = [ ...listDispatch ].map((x) => {
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
    setDispatchResponse({ ...data, dispatchs: [ ...newList ] });
    props?.onSuccess?.()
  }

  const onSaveAllDispatch = async (props?: optionsCallback) => {
    if (!dispatchResponse) return
    const data = dispatchResponse
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
    props?.onSuccess?.()
  }

  return {
    //DISPATCH
    dispatchResponse,
    setDispatchResponse,
    isLoadingDispatch,
    refetchDispatch,
    runAddDispatch,
    addingDispatch,
    runDeleteDispatch,
    deletingDispatch,
    runUpdateDispatch,
    updatingDispatch,
    listDispatch,
    onSelectDispatch: setDispatchSelected,
    dispatchSelected,
    onAddDispatch,
    onDeleteDispatch,
    onUpdateDispatch,
    onSaveAllDispatch,
    //ORDERS
    orderResponse,
    loadingOrders,
    //CLIENT
    clientResponse,
    refetchClients,
    //TRANSPORT
    responseTransport,
    refetchTransport,
    // HANDLERS
    sendWhatsAppMessage,
    handleGenerateDispatchNote
  }
}