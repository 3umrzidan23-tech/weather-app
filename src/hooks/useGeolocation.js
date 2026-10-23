import { useCallback, useState } from "react";

export function useGeolocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getPosition = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!("geolocation" in navigator)) {
        const notSupported = new Error(
          "Geolocation is not supported by this browser."
        );
        setError(notSupported.message);
        reject(notSupported);
        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLoading(false);
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (geoError) => {
          const message =
            geoError.code === geoError.PERMISSION_DENIED
              ? "Location permission was denied. Enable it in your browser settings or search by city instead."
              : geoError.code === geoError.TIMEOUT
                ? "Getting your location took too long. Please try again."
                : "We couldn't determine your location. Please try again or search by city.";
          setLoading(false);
          setError(message);
          reject(new Error(message));
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
      );
    });
  }, []);

  return { getPosition, loading, error };
}
