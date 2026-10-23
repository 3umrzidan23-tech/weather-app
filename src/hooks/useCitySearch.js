import { useEffect, useState } from "react";
import { searchCities } from "../api/weatherApi";
import { useDebounce } from "./useDebounce";

export function useCitySearch(query) {
  const debouncedQuery = useDebounce(query.trim(), 300);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    searchCities(debouncedQuery, { signal: controller.signal })
      .then((list) => {
        if (controller.signal.aborted) return;
        setResults(Array.isArray(list) ? list.slice(0, 7) : []);
      })
      .catch((requestError) => {
        if (requestError.name === "AbortError" || controller.signal.aborted) {
          return;
        }
        setResults([]);
        setError("City search is unavailable right now.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [debouncedQuery]);

  return {
    results,
    loading,
    error,
    active: debouncedQuery.length >= 2,
  };
}
