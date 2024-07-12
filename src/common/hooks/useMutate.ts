import { useState, useCallback } from 'react';

interface UseMutateOptions extends RequestInit {
  headers?: Record<string, string>;
}

interface MutateParams<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseMutateResult<T> {
  mutate: (method: string, body: T, params?: MutateParams<T>) => Promise<void>;
  isMutating: boolean;
  mutateError: any;
  mutateData: T | null;
}


export const useMutate = <T = any>(
  url: string,
  options?: UseMutateOptions,
  updateCache?: (updateFn: (data: T[]) => T[]) => T[] | undefined
): UseMutateResult<T> => {
  const [ mutateLoading, setMutateLoading ] = useState<boolean>(false);
  const [ mutateError, setMutateError ] = useState<any>(null);
  const [ mutateData, setMutateData ] = useState<T | null>(null);

  const mutate = useCallback(async (method: string, body: T, params?: MutateParams<T>) => {
    setMutateLoading(true);
    setMutateError(null);
    setMutateData(null);

    let previousData: T[] | undefined;
    if (updateCache) {
      previousData = updateCache(data => {
        if (method === 'POST') {
          return [ ...data, body ];
        } else if (method === 'PATCH' || method === 'PUT') {
          //@ts-ignore
          return data.map(item => item.id === body.id ? { ...item, ...body } : item);
        } else if (method === 'DELETE') {
          //@ts-ignore
          return data.filter(item => item.id !== body.id);
        }
        return data;
      });
    }

    try {
      const response = await fetch(url, {
        ...options,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(options?.headers || {})
        },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result: T = await response.json();
      setMutateData(result);
      params?.onSuccess?.(result)
    } catch (error: any) {
      setMutateError(error);
      params?.onError?.(error)
      if (updateCache && previousData) {
        updateCache(() => previousData!);
      }
    } finally {
      setMutateLoading(false);
    }
  }, [ url, options, updateCache ]);

  return {
    mutate,
    isMutating: mutateLoading,
    mutateError,
    mutateData
  };
};
