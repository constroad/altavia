import { IClientValidationSchema } from "src/models/client";
import { IDispatchList, IGetAll } from "src/models/dispatch";
import { IOrderValidationSchema } from "src/models/order";
import { ITransportValidationSchema } from "src/models/transport";
import { useAsync } from "./useAsync";
import { useEffect, useMemo } from "react";
import { API_ROUTES } from "../consts";
import axios from "axios";
import { toast } from "src/components";
import { getDate } from "../utils";
import { DispatchNotePDFType } from "src/components/dispatch";
import { useDispatchContext } from "src/context/DispatchContext/DispatchContext";


const fetcher = (path: string) => axios.get(path);
const putDisptach = (path: string, data: any) => axios.put(path, data);

type UseDispatchProps = {
  query: {
    page: number,
    limit: number,
    startDate?: string,
    endDate?: string,
    clientId?: string,
  }
}
export const useDispatch = (props: UseDispatchProps) => {
  const {dispatchResponse,getDispatchs, refetchDispatch, isLoadingDispatch, setDispatchResponse} = useDispatchContext()
  const { query } = props

  console.log('dispatchResponse:', dispatchResponse);
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
    getDispatchs({
      page: query.page,
      limit: query.limit,
      startDate: query.startDate,
      endDate: query.endDate,
      clientId: query.clientId,
    })
  }, [ query.page, query.limit, query.startDate, query.endDate, query.clientId ]);

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
    listDispatch: dispatchResponse?.dispatchs ?? [],
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