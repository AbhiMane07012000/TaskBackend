import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface UseFetchOptions {
  skip?: boolean;
  dependencies?: any[];
}

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useFetch = <T,>(
  url: string | null,
  options?: UseFetchOptions
): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!url || options?.skip) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<T>(url);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  }, [url, options?.skip]);

  useEffect(() => {
    fetchData();
  }, [fetchData, options?.dependencies]);

  return { data, loading, error, refetch: fetchData };
};
