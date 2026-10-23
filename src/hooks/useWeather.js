import { useCallback, useEffect, useRef, useState } from "react";
import { friendlyError, getForecast } from "../api/weatherApi";

const CACHE_PREFIX = "weather:forecast:";
const CACHE_TTL = 10 * 60 * 1000;

function readCache(query) {
  try {
    const raw = window.sessionStorage.getItem(CACHE_PREFIX + query);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.data || !parsed?.timestamp) return null;
    return {
      data: parsed.data,
      expired: Date.now() - parsed.timestamp > CACHE_TTL,
    };
  } catch {
    return null;
  }
}

function writeCache(query, data) {
  try {
    window.sessionStorage.setItem(
      CACHE_PREFIX + query,
      JSON.stringify({ data, timestamp: Date.now() })
    );
  } catch {
    // Ignore quota / privacy-mode errors; the app still works without cache.
  }
}

export function useWeather(query) {
  const [data, setData] = useState(null);
  const [dataQuery, setDataQuery] = useState(null);
  const [loading, setLoading] = useState(Boolean(query));
  const [error, setError] = useState(null);
  const [stale, setStale] = useState(false);

  const requestIdRef = useRef(0);
  const controllerRef = useRef(null);

  const load = useCallback(
    async ({ force = false } = {}) => {
      if (!query) return;

      const cached = readCache(query);
      if (cached && !cached.expired && !force) {
        requestIdRef.current += 1;
        controllerRef.current?.abort();
        setData(cached.data);
        setDataQuery(query);
        setError(null);
        setStale(false);
        setLoading(false);
        return;
      }

      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;
      const requestId = ++requestIdRef.current;

      setLoading(true);
      setError(null);

      try {
        const result = await getForecast(query, { signal: controller.signal });
        if (requestId !== requestIdRef.current) return;

        setData(result);
        setDataQuery(query);
        setStale(false);
        setError(null);
        writeCache(query, result);
      } catch (requestError) {
        if (
          requestError.name === "AbortError" ||
          requestId !== requestIdRef.current
        ) {
          return;
        }

        if (cached) {
          setData(cached.data);
          setDataQuery(query);
          setStale(true);
        }
        setError(friendlyError(requestError));
      } finally {
        if (requestId === requestIdRef.current) setLoading(false);
      }
    },
    [query]
  );

  useEffect(() => {
    setData(null);
    setDataQuery(null);
    setError(null);
    setStale(false);
    load();

    return () => controllerRef.current?.abort();
  }, [load]);

  const refetch = useCallback(() => load({ force: true }), [load]);

  return { data, dataQuery, loading, error, stale, refetch };
}
