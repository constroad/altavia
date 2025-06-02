import { useState, useCallback } from 'react';

interface UseMutateFormResult<T> {
  mutate: (formData: FormData, url?: string) => Promise<void>;
  isMutating: boolean;
  mutateError: any;
  mutateData: T | null;
}

export const useMutateFormData = <T = any>(
  baseUrl: string
): UseMutateFormResult<T> => {
  const [mutateLoading, setMutateLoading] = useState(false);
  const [mutateError, setMutateError] = useState<any>(null);
  const [mutateData, setMutateData] = useState<T | null>(null);

  const mutate = useCallback(async (formData: FormData, requestUrl?: string) => {
    setMutateLoading(true);
    setMutateError(null);
    setMutateData(null);

    try {
      const response = await fetch(requestUrl ?? baseUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      setMutateData(result);
    } catch (error: any) {
      setMutateError(error);
    } finally {
      setMutateLoading(false);
    }
  }, [baseUrl]);

  return {
    mutate,
    isMutating: mutateLoading,
    mutateError,
    mutateData,
  };
};
