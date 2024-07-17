import { useState, useCallback } from 'react';

interface UseMutateOptions extends RequestInit {
  headers?: Record<string, string>;
  urlParams?: Record<string, string | undefined>;
  queryParams?: Record<string, string | undefined>;
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

const buildUrl = (url: string, pathParameters?: UseMutateOptions["urlParams"], queryParameters?: UseMutateOptions["queryParams"]): string => {
  let builtUrl = url;

  if (pathParameters) {
    Object.keys(pathParameters).forEach(key => {
      if (pathParameters[ key ] !== undefined) {
        builtUrl = builtUrl.replace(`:${key}`, pathParameters[ key ]!);
      } else {
        builtUrl = builtUrl.replace(`:${key}`, '');
      }
    });
  }

  if (queryParameters) {
    const validQueryParams = Object.keys(queryParameters)
      .filter(key => queryParameters[ key ] !== undefined)
      .reduce((acc, key) => {
        acc[ key ] = queryParameters[ key ]!;
        return acc;
      }, {} as Record<string, string>);

    const queryParams = new URLSearchParams(validQueryParams).toString();
    if (queryParams) {
      builtUrl += `?${queryParams}`;
    }
  }

  builtUrl = builtUrl.endsWith('/') ? builtUrl.slice(0, -1) : builtUrl;

  return builtUrl;
};


export const useMutate = <T = any>(
  baseUrl: string,
  params?: UseMutateOptions,
  updateCache?: (updateFn: (data: T[]) => T[]) => T[] | undefined
): UseMutateResult<T> => {
  const [ mutateLoading, setMutateLoading ] = useState<boolean>(false);
  const [ mutateError, setMutateError ] = useState<any>(null);
  const [ mutateData, setMutateData ] = useState<T | null>(null);
  const { urlParams, queryParams, ...options } = params ?? {}
  const url = buildUrl(baseUrl, urlParams, queryParams);

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
