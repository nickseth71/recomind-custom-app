// src/hooks/useApi.js
import { useState, useEffect, useCallback, useRef } from "react";

export function useApi(fn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(fn ? true : false);
  const [error, setError] = useState(null);

  const requestIdRef = useRef(0);

  const run = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    if (!fn) {
      // No fn (e.g. no product selected yet) — clear any stale state
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fn();
      if (requestId !== requestIdRef.current) return; // a newer call superseded this one — drop it
      setData(res);
      //console.log(res, "useAPI's data");
    } catch (e) {
      if (requestId !== requestIdRef.current) return; // same guard for errors
      setError(e.message);
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { data, loading, error, refetch: run };
}
