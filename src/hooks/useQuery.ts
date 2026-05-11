import { useCallback, useEffect, useRef, useState } from "react";

interface UseQueryOptions<TData> {
  queryFn: () => Promise<TData>;
  initialData: TData;
}

export function useQuery<TData>({
  queryFn,
  initialData,
}: UseQueryOptions<TData>) {
  const initialDataRef = useRef(initialData);

  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await queryFn();
      setData(result);
      return result;
    } catch (caughtError) {
      setError(caughtError);
      return initialDataRef.current;
    } finally {
      setIsLoading(false);
    }
  }, [queryFn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch, setData };
}
