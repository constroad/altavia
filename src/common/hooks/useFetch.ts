import { useState, useEffect, useCallback, useRef } from 'react';

const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;

  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (let key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
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

interface FetchParams extends RequestInit {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  revalidateOnFocus?: boolean;
  body?: any;
  refreshInterval?: number
}

interface FetchResult<T> {
  data: T | null;
  isLoading: boolean;
  error: any;
  refetch: () => void;
  updateCache: (updateFn: (prevData: T | null) => T) => void;
}

const cache: Record<string, any> = {};
const cacheExpiry: Record<string, number> = {};

export const useFetch = <T = any>(url: string, params?: FetchParams, cacheTime: number = 900000): FetchResult<T> => {
  const { refreshInterval, onSuccess, onError, revalidateOnFocus = true, ...options } = params ?? {};
  let keyCache = url;
  if (options?.body) {
    keyCache = `${keyCache}, ${JSON.stringify(options.body)}`;
  }

  const [data, setData] = useState<T | null>(cache[keyCache] || null);
  const [loading, setLoading] = useState<boolean>(!cache[keyCache]);
  const [error, setError] = useState<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const memoizedOptions = useDeepCompareMemo(options);

  const fetchData = useCallback(async (ignoreCache = false, inBackGround = false) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const now = new Date().getTime();
    if (!ignoreCache && cache[keyCache] && cacheExpiry[keyCache] > now) {
      setData(cache[keyCache]);
      setLoading(false);
      return;
    }
    if (!inBackGround) setLoading(true);

    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...memoizedOptions,
        signal,
        body: memoizedOptions?.body ? JSON.stringify(memoizedOptions.body ?? '') : undefined,
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();

      const currentData = cache[keyCache];
      if (JSON.stringify(currentData) !== JSON.stringify(result)) {
        cache[keyCache] = result;
        setData(result);
        onSuccess?.(result);
      }
      cacheExpiry[keyCache] = now + cacheTime;
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
  }, [url, memoizedOptions, cacheTime]);

  const updateCache = (updateFn: (prevData: T | null) => T) => {
    setData(prevData => {
      const updatedData = updateFn(prevData);
      cache[keyCache] = updatedData;
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
  }, [fetchData]);

  useEffect(() => {
    if (refreshInterval) {
      const intervalId = setInterval(() => {
        fetchData(true, true);
      }, refreshInterval);

      return () => clearInterval(intervalId);
    }
  }, [refreshInterval, fetchData]);

  return { data, isLoading: loading, error, refetch: () => fetchData(true), updateCache };
};
