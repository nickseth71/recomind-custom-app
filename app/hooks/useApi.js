// src/hooks/useApi.js
import { useState, useEffect, useCallback } from "react";

export function useApi(fn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(fn ? true : false);
  const [error, setError] = useState(null);

  const run = useCallback(async () => {
    if (!fn) return; // Don't run if fn is null

    setLoading(true);
    setError(null);
    try {
      const res = await fn();
      setData(res);
      console.log(res, "useAPI's data")
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { data, loading, error, refetch: run };
}
