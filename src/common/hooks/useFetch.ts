import { useState, useEffect, useCallback, useRef } from 'react';

interface FetchParams<T> extends RequestInit {
  raceCondition?: boolean
  enabled?: boolean
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  revalidateOnFocus?: boolean;
  body?: any;
  refreshInterval?: number;
  urlParams?: Record<string, string | undefined>;
  queryParams?: Record<string, string | undefined>;
  cacheTime?: number
}

interface FetchResult<T> {
  url: string;
  data: T | null;
  isLoading: boolean;
  error: any;
  refetch: () => Promise<void>;
  updateCache: (updateFn: (prevData: T | null) => T) => void;
}

const cache: Record<string, any> = {};
const cacheExpiry: Record<string, number> = {};

const fetchConfig: Record<string, FetchParams<any>> = {};

const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;

  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (let key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[ key ], b[ key ])) {
      return false;
    }
  }
  return true;
};

const useDeepCompareMemo = <T>(value: T): T => {
  const ref = useRef<T | undefined>();

  if (!deepEqual(value, ref.current)) {
    ref.current = value;
  }
  return ref.current as T;
};


const buildUrl = (
  url: string,
  pathParameters?: Record<string, string | undefined>,
  queryParameters?: Record<string, string | undefined>
): string => {
  let builtUrl = url;

  if (pathParameters) {
    Object.keys(pathParameters).forEach(key => {
      if (pathParameters[ key ] !== undefined) {
        builtUrl = builtUrl.replace(`:${key}`, pathParameters[ key ] as any);
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

const fetchRequest = async <T>(
  keyCache: string,
  url: string,
  options: RequestInit,
  cacheTime: number,
  onSuccess?: (data: T) => void,
  onError?: (error: any) => void,
  signal?: AbortSignal
): Promise<{ result: T, isDirty: boolean }> => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
    signal,
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const result = await response.json();
  const currentData = cache[ keyCache ];
  let isDirty = false
  if (JSON.stringify(currentData) !== JSON.stringify(result)) {
    isDirty = true
    cache[ keyCache ] = result;
    onSuccess?.(result);
  }
  cacheExpiry[ keyCache ] = new Date().getTime() + cacheTime;
  return { result, isDirty };
};

export const useFetch = <T = any>(baseUrl: string, params?: FetchParams<T>, cacheTime: number = 900000): FetchResult<T> => {
  const {
    urlParams,
    queryParams,
    refreshInterval,
    onSuccess,
    onError,
    revalidateOnFocus = true,
    enabled = true,
    raceCondition = true,
    ...options
  } = params ?? {};

  const url = buildUrl(baseUrl, urlParams, queryParams);
  let keyCache = url;
  if (options?.body) {
    keyCache = `${keyCache}, ${JSON.stringify(options.body)}`;
  }

  const [ data, setData ] = useState<T | null>(cache[ keyCache ] ?? null);
  const [ loading, setLoading ] = useState<boolean>(!cache[ keyCache ]);
  const [ error, setError ] = useState<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const memoizedOptions = useDeepCompareMemo(options);
  // Store the original fetch configuration
  fetchConfig[ keyCache ] = params ?? {};

  const fetchData = useCallback(async (ignoreCache = false, inBackGround = false) => {
    if (enabled === false) {
      setLoading(false);
      return
    }
    if (abortControllerRef.current && raceCondition) {
      abortControllerRef.current.abort();
    }
    const now = new Date().getTime();
    if (!ignoreCache && cache[ keyCache ] && cacheExpiry[ keyCache ] > now) {
      setData(cache[ keyCache ]);
      setLoading(false);
      onSuccess?.(cache[ keyCache ])
      return;
    }
    if (!inBackGround) setLoading(true);

    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    try {
      const { result, isDirty } = await fetchRequest<T>(
        keyCache,
        url,
        {
          ...memoizedOptions,
          body: memoizedOptions?.body ? JSON.stringify(memoizedOptions.body ?? '') : undefined,
        },
        cacheTime,
        onSuccess,
        onError,
        signal,
      );
      if (isDirty) {
        setData(result);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        setError(error);
        onError?.(error);
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
      abortControllerRef.current = null;
    }
  }, [ url, memoizedOptions, cacheTime, enabled ]);

  const updateCache = (updateFn: (prevData: T | null) => T) => {
    setData(prevData => {
      const updatedData = updateFn(prevData);
      cache[ keyCache ] = updatedData;
      return updatedData;
    });
  };

  useEffect(() => {
    fetchData();

    const handleFocus = () => {
      fetchData(true, true);
    };

    if (revalidateOnFocus) window.addEventListener('focus', handleFocus);
    return () => {
      if (revalidateOnFocus) window.removeEventListener('focus', handleFocus);
    };
  }, [ fetchData ]);

  useEffect(() => {
    if (refreshInterval) {
      const intervalId = setInterval(() => {
        fetchData(true, true);
      }, refreshInterval);

      return () => clearInterval(intervalId);
    }
  }, [ refreshInterval, fetchData ]);

  return { url, data, isLoading: loading, error, refetch: () => fetchData(true), updateCache };
};

// Function to search keys in the cache
const searchCache = (searchString: string): string[] => {
  let result: string[] = [];
  for (const key in cache) {
    if (key.includes(searchString)) {
      result.push(key);
    }
  }
  return result;
}
useFetch.searchCache = searchCache;

// Function to access the cache
useFetch.cache = cache;

// Function to mutate the cache
useFetch.mutate = async (searchTerm: string) => {
  const cacheKeys = searchCache(searchTerm)

  const promises = []

  for (const cacheKey of cacheKeys) {
    const originalConfig = fetchConfig[ cacheKey ];
    if (!originalConfig) {
      console.error(`No fetch configuration found for cache key: ${cacheKey}`)
      return
    }
    const { urlParams, queryParams, cacheTime, ...options } = originalConfig;
    const baseUrl = cacheKey.split('?')[ 0 ]
    const url = buildUrl(baseUrl, urlParams, queryParams);
    promises.push(fetchRequest(cacheKey, url, options, cacheTime ?? 900000, options.onSuccess, options.onError));
  }
  
  return Promise.all(promises)
};