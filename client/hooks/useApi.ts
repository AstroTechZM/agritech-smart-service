// client/hooks/useApi.ts
import { useState, useCallback, useEffect } from 'react';

interface UseApiOptions<T> {
  immediate?: boolean;
  fallback?: T; // Mock data to use when API fails (no backend yet)
}

export function useApi<T>(
  apiFunc: (...args: any[]) => Promise<T>,
  options: UseApiOptions<T> = { immediate: true }
) {
  const [data, setData] = useState<T | null>(options.fallback ?? null);
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
      const error = err as Error;
      setError(error);

      // If a fallback was provided and we have no data yet, use it silently
      if (options.fallback !== undefined) {
        setData(options.fallback);
      }

      // Log quietly — don't rethrow, so the UI never crashes
      console.warn('[useApi] Request failed, using fallback data:', error.message);
      return options.fallback ?? null;
    } finally {
      setIsLoading(false);
    }
  }, [apiFunc]);

  useEffect(() => {
    if (options.immediate !== false) {
      execute();
    }
  }, [execute]);

  return { data, isLoading, error, execute, setData, refresh: execute };
}