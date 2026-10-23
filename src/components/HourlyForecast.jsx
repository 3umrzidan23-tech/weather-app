import { useMemo, useRef } from "react";
import WeatherIcon from "./WeatherIcon";
import { HourlySkeleton } from "./SkeletonLoader";
import { formatHour } from "../utils/format";
import { tempValue } from "../utils/units";

export default function HourlyForecast({ data, unit, loading }) {
  const scrollRef = useRef(null);

  const hours = useMemo(() => {
    if (!data) return [];

    const now = data.location.localtime_epoch;
    const allHours = data.forecast.forecastday.flatMap((day) => day.hour);
    const upcoming = allHours.filter((hour) => hour.time_epoch >= now - 3600);
    const startIndex = upcoming.findIndex((hour) => hour.time_epoch + 3600 > now);
    const fromCurrentHour = startIndex > 0 ? upcoming.slice(startIndex) : upcoming;

    return (fromCurrentHour.length ? fromCurrentHour : allHours).slice(0, 24);
  }, [data]);

  const scroll = (direction) => {
    scrollRef.current?.scrollBy({
      left: direction * 380,
      behavior: "smooth",
    });
  };

  if (loading && !data) {
    return (
      <section id="hourly" className="section" aria-busy="true">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Hourly forecast</h2>
              <p>Loading the next 24 hours…</p>
            </div>
          </div>
          <HourlySkeleton />
        </div>
      </section>
    );
  }

  if (!data) return null;

  return (
    <section id="hourly" className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <h2>Hourly forecast</h2>
            <p>Next 24 hours in {data.location.name}.</p>
          </div>
          <div className="hourly-controls">
            <button
              type="button"
              className="icon-btn"
              onClick={() => scroll(-1)}
              aria-label="Scroll hourly forecast left"
            >
              <i className="fa-solid fa-chevron-left" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={() => scroll(1)}
              aria-label="Scroll hourly forecast right"
            >
              <i className="fa-solid fa-chevron-right" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          className="hourly-scroll"
          ref={scrollRef}
          role="list"
          aria-label={`Hourly forecast for ${data.location.name}`}
        >
          {hours.map((hour, index) => {
            const rain = Math.max(
              hour.chance_of_rain || 0,
              hour.chance_of_snow || 0
            );
            const isSnow = (hour.chance_of_snow || 0) > (hour.chance_of_rain || 0);
            const temperature = tempValue(hour.temp_c, hour.temp_f, unit);
            const isNow = index === 0;

            return (
              <article
                className={`hourly-card ${isNow ? "is-now" : ""}`}
                key={`${hour.time_epoch}-${index}`}
                role="listitem"
                title={`${hour.condition.text} · ${temperature}°`}
              >
                <p className="hourly-card__time">
                  {isNow ? "Now" : formatHour(hour.time, false)}
                </p>
                <WeatherIcon
                  code={hour.condition.code}
                  isDay={hour.is_day}
                  size="sm"
                />
                <p className="hourly-card__temp">{temperature ?? "—"}°</p>
                <p className="hourly-card__rain">
                  {rain > 0 ? (
                    <>
                      <i
                        className={`fa-solid ${isSnow ? "fa-snowflake" : "fa-droplet"}`}
                        aria-hidden="true"
                      />
                      {rain}%
                    </>
                  ) : (
                    <span className="hourly-card__dry">—</span>
                  )}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
