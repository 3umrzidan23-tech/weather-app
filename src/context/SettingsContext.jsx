import { createContext, useCallback, useContext, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { DEFAULT_LOCATION, MAX_FAVORITES } from "../utils/constants";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [unit, setUnit] = useLocalStorage("weather.unit", "c");
  const [favorites, setFavorites] = useLocalStorage("weather.favorites", []);
  const [lastLocation, setLastLocation] = useLocalStorage(
    "weather.lastLocation",
    DEFAULT_LOCATION
  );

  const addFavorite = useCallback(
    (location) => {
      setFavorites((current) => {
        if (!location?.query) return current;
        if (current.some((item) => item.query === location.query)) {
          return current;
        }
        return [...current, location].slice(0, MAX_FAVORITES);
      });
    },
    [setFavorites]
  );

  const removeFavorite = useCallback(
    (query) => {
      setFavorites((current) => current.filter((item) => item.query !== query));
    },
    [setFavorites]
  );

  const isFavorite = useCallback(
    (query) => favorites.some((item) => item.query === query),
    [favorites]
  );

  const value = useMemo(
    () => ({
      unit,
      setUnit,
      favorites,
      addFavorite,
      removeFavorite,
      isFavorite,
      lastLocation,
      setLastLocation,
    }),
    [
      unit,
      setUnit,
      favorites,
      addFavorite,
      removeFavorite,
      isFavorite,
      lastLocation,
      setLastLocation,
    ]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used inside SettingsProvider");
  }
  return context;
}
