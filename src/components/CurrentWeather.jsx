import WeatherIcon from "./WeatherIcon";
import { CurrentSkeleton } from "./SkeletonLoader";
import { formatLocalTime } from "../utils/format";
import { tempValue, windText } from "../utils/units";

export default function CurrentWeather({
  data,
  unit,
  loading,
  stale,
  favorite,
  onToggleFavorite,
}) {
  if (loading && !data) {
    return (
      <section id="current" className="section current-section" aria-busy="true">
        <div className="container">
          <CurrentSkeleton />
        </div>
      </section>
    );
  }

  if (!data) return null;

  const { location, current, forecast } = data;
  const today = forecast.forecastday[0];
  const high = tempValue(today.day.maxtemp_c, today.day.maxtemp_f, unit);
  const low = tempValue(today.day.mintemp_c, today.day.mintemp_f, unit);
  const feelsLike = tempValue(
    current.feelslike_c,
    current.feelslike_f,
    unit
  );
  const temperature = tempValue(current.temp_c, current.temp_f, unit);

  return (
    <section id="current" className="section current-section">
      <div className="container">
        <article className="current-card">
          <div className="current-card__top">
            <div>
              <p className="current-card__eyebrow">
                <i className="fa-solid fa-location-dot" aria-hidden="true" />
                {[location.region, location.country].filter(Boolean).join(", ")}
              </p>
              <h2>{location.name}</h2>
              <p className="current-card__time">
                <i className="fa-regular fa-clock" aria-hidden="true" />
                {formatLocalTime(location.localtime)}
              </p>
            </div>

            <button
              type="button"
              className={`favorite-btn ${favorite ? "is-active" : ""}`}
              onClick={onToggleFavorite}
              aria-pressed={favorite}
              title={favorite ? "Remove from saved cities" : "Save this city"}
            >
              <i
                className={`${favorite ? "fa-solid" : "fa-regular"} fa-star`}
                aria-hidden="true"
              />
              <span>{favorite ? "Saved" : "Save city"}</span>
            </button>
          </div>

          <div className="current-card__body">
            <div className="current-card__hero">
              <WeatherIcon
                code={current.condition.code}
                isDay={current.is_day}
                size="xl"
                label={current.condition.text}
              />
              <div className="current-card__temp" aria-live="polite">
                <span>{temperature ?? "—"}</span>
                <sup>°{unit.toUpperCase()}</sup>
              </div>
              <p className="current-card__condition">{current.condition.text}</p>
              <p className="current-card__feels">
                Feels like <strong>{feelsLike ?? "—"}°</strong>
              </p>
            </div>

            <div className="current-card__quick">
              <div className="quick-stat">
                <span>High</span>
                <strong>{high ?? "—"}°</strong>
              </div>
              <div className="quick-stat">
                <span>Low</span>
                <strong>{low ?? "—"}°</strong>
              </div>
              <div className="quick-stat">
                <span>Humidity</span>
                <strong>{current.humidity}%</strong>
              </div>
              <div className="quick-stat">
                <span>Wind</span>
                <strong>{windText(current.wind_kph, current.wind_mph, unit)}</strong>
              </div>
            </div>
          </div>

          {stale && (
            <p className="current-card__stale" role="status">
              <i className="fa-solid fa-clock-rotate-left" aria-hidden="true" />
              Showing cached data while we reconnect.
            </p>
          )}
        </article>
      </div>
    </section>
  );
}
