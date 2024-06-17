import axios from 'axios';
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { API_ROUTES } from 'src/common/consts';
import { useAsync } from 'src/common/hooks';
import { IGetAll } from 'src/models/dispatch';

type DispatchQuery = {
  page: number;
  limit: number;
  startDate?: string;
  endDate?: string;
  clientId?: string;
  orderId?: string;
};

interface DispatchContextProps {
  dispatchResponse?: IGetAll;
  isLoadingDispatch?: boolean;
  setDispatchResponse: (list: IGetAll) => void;
  getDispatchs: (query: DispatchQuery) => void;
  refetchDispatch: () => void;
}

export const DispatchContext = createContext({} as DispatchContextProps);

const fetcher = (path: string) => axios.get(path);

export const DispatchProvider = ({ children }: PropsWithChildren) => {
  const [dispatchResponse, setDispatchResponse] = useState<IGetAll>();

  //API
  const {
    run: runGetDispatchs,
    isLoading: isLoadingDispatch,
    refetch: refetchDispatch,
  } = useAsync<IGetAll>();

  const getDispatchs = (params: DispatchQuery) => {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
      startDate: params.startDate ?? '',
      endDate: params.endDate ?? '',
      clientId: params.clientId ?? '',
      orderId: params.orderId ?? '',
    });
    const path = `${API_ROUTES.dispatch}?${queryParams.toString()}`;
    runGetDispatchs(fetcher(path), {
      // cacheKey: path,
      refetch: () =>
        runGetDispatchs(fetcher(path), {
          onSuccess: (response) => {
            setDispatchResponse(response.data);
          },
        }),
      onSuccess: (response) => {
        setDispatchResponse(response.data);
      },
    });
  };

  const values = useMemo(
    () => ({
      getDispatchs,
      refetchDispatch,
      dispatchResponse,
      setDispatchResponse,
      isLoadingDispatch,
    }),
    [
      dispatchResponse,
      refetchDispatch,
      setDispatchResponse,
      getDispatchs,
      isLoadingDispatch,
    ]
  );

  return (
    <DispatchContext.Provider
      value={{
        getDispatchs,
        refetchDispatch,
        dispatchResponse,
        setDispatchResponse,
        isLoadingDispatch,
      }}
    >
      {children}
    </DispatchContext.Provider>
  );
};

export const useDispatchContext = (): DispatchContextProps => {
  const context = useContext(DispatchContext);
  if (!context) {
    throw new Error(
      'useDispatchContext must be used within a DispatchProvider'
    );
  }
  return context;
};
