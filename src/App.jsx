import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import About from "./components/About";
import AlertsBanner from "./components/AlertsBanner";
import CurrentWeather from "./components/CurrentWeather";
import ErrorState from "./components/ErrorState";
import Footer from "./components/Footer";
import ForecastList from "./components/ForecastList";
import Hero from "./components/Hero";
import Highlights from "./components/Highlights";
import HourlyForecast from "./components/HourlyForecast";
import Navbar from "./components/Navbar";
import { ChartSkeleton } from "./components/SkeletonLoader";
import { useSettings } from "./context/SettingsContext";
import { useToast } from "./context/ToastContext";
import { useGeolocation } from "./hooks/useGeolocation";
import { useWeather } from "./hooks/useWeather";
import { DEFAULT_LOCATION, MAX_FAVORITES } from "./utils/constants";
import { getWeatherTheme } from "./utils/weatherTheme";

const TemperatureChart = lazy(() =>
  import("./components/TemperatureChart")
);

export default function App() {
  const {
    unit,
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    lastLocation,
    setLastLocation,
  } = useSettings();
  const { showToast } = useToast();
  const { getPosition, loading: locating } = useGeolocation();

  const [activeLocation, setActiveLocation] = useState(() =>
    lastLocation && lastLocation.query ? lastLocation : DEFAULT_LOCATION
  );

  const [days, setDays] = useState(3);
  const { data, dataQuery, loading, error, stale, refetch } = useWeather(
    activeLocation.query
  );

  const favorite = data ? isFavorite(activeLocation.query) : false;
  const alerts = Array.isArray(data?.alerts?.alert) ? data.alerts.alert : [];

  const locationLabel = data
    ? `${data.location.name}${
        data.location.country ? `, ${data.location.country}` : ""
      }`
    : activeLocation.label;

  useEffect(() => {
    document.title = data
      ? `${data.location.name} Weather — Multi-Day Forecast`
      : "Weather — Live Forecast & Multi-Day Outlook";
  }, [data]);

  useEffect(() => {
    if (data?.current) {
      document.documentElement.dataset.theme = getWeatherTheme(data.current);
    }
  }, [data]);

  useEffect(() => {
    const availableDays = data?.forecast?.forecastday?.length;
    if (availableDays) {
      setDays((current) => Math.min(current, availableDays));
    }
  }, [data]);

  useEffect(() => {
    if (!data || dataQuery !== activeLocation.query) return;

    const resolved = {
      query: activeLocation.query,
      label: `${data.location.name}${
        data.location.country ? `, ${data.location.country}` : ""
      }`,
    };

    if (activeLocation.label !== resolved.label) {
      setActiveLocation(resolved);
    }

    // Only remember locations that loaded successfully, so a typo in the
    // search box doesn't replace the user's last working city on reload.
    setLastLocation(resolved);
  }, [data, dataQuery, activeLocation, setLastLocation]);

  useEffect(() => {
    const handleOffline = () =>
      showToast(
        "You're offline. Showing the last loaded forecast if available.",
        "error"
      );
    const handleOnline = () => showToast("You're back online.", "success");

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [showToast]);

  const handleSearch = useCallback(
    (nextLocation) => {
      if (!nextLocation?.query) return;

      if (nextLocation.query === activeLocation.query) {
        refetch();
        return;
      }

      setActiveLocation(nextLocation);
      window.setTimeout(() => {
        document
          .getElementById("current")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    },
    [activeLocation.query, refetch]
  );

  const handleLocate = async () => {
    try {
      const { lat, lon } = await getPosition();
      handleSearch({ query: `${lat},${lon}`, label: "My location" });
      showToast("Using your current location.", "success");
    } catch (locationError) {
      showToast(locationError.message, "error");
    }
  };

  const handleToggleFavorite = () => {
    if (!data) return;

    if (favorite) {
      removeFavorite(activeLocation.query);
      showToast("Removed from saved cities.", "info");
      return;
    }

    if (favorites.length >= MAX_FAVORITES) {
      showToast(
        `You can save up to ${MAX_FAVORITES} cities. Remove one before adding another.`,
        "error"
      );
      return;
    }

    addFavorite({
      query: activeLocation.query,
      label: `${data.location.name}${
        data.location.country ? `, ${data.location.country}` : ""
      }`,
    });
    showToast("City saved to your favorites.", "success");
  };

  const handleSubscribe = (email) => {
    showToast(`Thanks! ${email} is on the demo list.`, "success");
  };

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content">
        <Hero
          currentLabel={locationLabel}
          onSearch={handleSearch}
          onLocate={handleLocate}
          locating={locating}
          favorites={favorites}
          onRemoveFavorite={removeFavorite}
        />

        {error && !data && !loading ? (
          <section className="section state-section">
            <div className="container">
              <ErrorState message={error} onRetry={refetch} />
            </div>
          </section>
        ) : (
          <>
            <CurrentWeather
              data={data}
              unit={unit}
              loading={loading}
              stale={stale}
              favorite={favorite}
              onToggleFavorite={handleToggleFavorite}
            />

            {error && data && (
              <div className="container">
                <div className="inline-notice" role="status">
                  <i className="fa-solid fa-wifi" aria-hidden="true" />
                  <p>
                    {error}
                    {stale ? " Showing the last saved forecast." : ""}
                  </p>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={refetch}
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            <AlertsBanner alerts={alerts} />

            <Highlights data={data} unit={unit} loading={loading} />
            <HourlyForecast data={data} unit={unit} loading={loading} />
            <ForecastList
              data={data}
              unit={unit}
              days={days}
              onDaysChange={setDays}
              loading={loading}
            />
            <Suspense
              fallback={
                <section className="section">
                  <div className="container">
                    <ChartSkeleton />
                  </div>
                </section>
              }
            >
              <TemperatureChart data={data} unit={unit} loading={loading} />
            </Suspense>
          </>
        )}

        <About />
      </main>

      <Footer onSubscribe={handleSubscribe} />
    </>
  );
}
