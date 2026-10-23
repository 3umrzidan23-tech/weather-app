import WeatherIcon from "./WeatherIcon";
import { ForecastSkeleton } from "./SkeletonLoader";
import { clamp, formatDay, formatShortDate } from "../utils/format";
import { tempValue } from "../utils/units";

export default function ForecastList({ data, unit, days, onDaysChange, loading }) {
  if (loading && !data) {
    return (
      <section id="forecast" className="section" aria-busy="true">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Daily forecast</h2>
              <p>Loading the outlook…</p>
            </div>
            <span className="section-pill">Loading outlook…</span>
          </div>
          <ForecastSkeleton count={days} />
        </div>
      </section>
    );
  }

  if (!data) return null;

  const allDays = data.forecast.forecastday;
  const availableDays = allDays.length;
  const visibleDays = allDays.slice(0, Math.min(days, availableDays));
  const canShowSevenDays = availableDays >= 7;
  const weekMin = Math.min(...allDays.map((day) => day.day.mintemp_c));
  const weekMax = Math.max(...allDays.map((day) => day.day.maxtemp_c));
  const span = Math.max(weekMax - weekMin, 1);

  return (
    <section id="forecast" className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <h2>Daily forecast</h2>
            <p>
              {visibleDays.length}-day outlook for {data.location.name}.
            </p>
          </div>
          {canShowSevenDays ? (
            <div className="segmented" role="group" aria-label="Forecast length">
              <button
                type="button"
                className={days === 3 ? "is-active" : ""}
                aria-pressed={days === 3}
                onClick={() => onDaysChange(3)}
              >
                3 days
              </button>
              <button
                type="button"
                className={days === 7 ? "is-active" : ""}
                aria-pressed={days === 7}
                onClick={() => onDaysChange(7)}
              >
                7 days
              </button>
            </div>
          ) : (
            <span className="section-pill">
              {availableDays}-day outlook
            </span>
          )}
        </div>

        <div
          className={`forecast-grid ${
            visibleDays.length > 3 ? "forecast-grid--7" : ""
          }`}
        >
          {visibleDays.map((day, index) => {
            const high = tempValue(
              day.day.maxtemp_c,
              day.day.maxtemp_f,
              unit
            );
            const low = tempValue(day.day.mintemp_c, day.day.mintemp_f, unit);
            const average = tempValue(
              day.day.avgtemp_c,
              day.day.avgtemp_f,
              unit
            );
            const left = clamp(
              ((day.day.mintemp_c - weekMin) / span) * 100,
              0,
              92
            );
            const width = clamp(
              ((day.day.maxtemp_c - day.day.mintemp_c) / span) * 100,
              8,
              100 - left
            );
            const rain = day.day.daily_chance_of_rain || 0;
            const snow = day.day.daily_chance_of_snow || 0;
            const isSnow = snow > rain;
            const precipitation = isSnow ? snow : rain;

            return (
              <article
                className={`forecast-card ${index === 0 ? "is-today" : ""}`}
                key={day.date}
              >
                <div className="forecast-card__top">
                  <span className="forecast-card__day">
                    {formatDay(day.date, index)}
                  </span>
                  <span className="forecast-card__date">
                    {formatShortDate(day.date)}
                  </span>
                </div>

                <div className="forecast-card__icon-row">
                  <WeatherIcon
                    code={day.day.condition.code}
                    isDay={1}
                    size="md"
                    label={day.day.condition.text}
                  />
                  <div className="forecast-card__temps">
                    <span className="forecast-card__max">{high ?? "—"}°</span>
                    <span className="forecast-card__min">{low ?? "—"}°</span>
                  </div>
                </div>

                <p className="forecast-card__condition">
                  {day.day.condition.text}
                </p>

                <div
                  className="forecast-card__range"
                  aria-hidden="true"
                  title={`Low ${low}°, high ${high}°`}
                >
                  <span style={{ left: `${left}%`, width: `${width}%` }} />
                </div>

                <div className="forecast-card__meta">
                  <span>
                    <i
                      className={`fa-solid ${isSnow ? "fa-snowflake" : "fa-droplet"}`}
                      aria-hidden="true"
                    />
                    {precipitation}% {isSnow ? "snow" : "rain"}
                  </span>
                  <span>Avg {average ?? "—"}°</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
