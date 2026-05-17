import { useState, useCallback, useEffect } from 'react';

interface UseApiOptions {
  immediate?: boolean;
}

export function useApi<T>(apiFunc: (...args: any[]) => Promise<T>, options: UseApiOptions = { immediate: true }) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (...args: any[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiFunc(...args);
      setData(response);
      return response;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiFunc]);

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, [execute, options.immediate]);

  return { data, isLoading, error, execute, setData, refresh: execute };
}

