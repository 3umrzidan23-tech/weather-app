import { HighlightsSkeleton } from "./SkeletonLoader";
import { aqiInfo, formatNumber, formatUv } from "../utils/format";
import {
  pressureText,
  tempValue,
  visibilityText,
  windText,
} from "../utils/units";

function HighlightCard({ icon, label, value, sub }) {
  return (
    <div className="highlight-card">
      <span className="highlight-card__icon" aria-hidden="true">
        <i className={`fa-solid ${icon}`} />
      </span>
      <p className="highlight-card__label">{label}</p>
      <p className="highlight-card__value">{value}</p>
      <p className="highlight-card__sub">{sub}</p>
    </div>
  );
}

function AstroItem({ icon, label, value, sub }) {
  return (
    <div className="astro-item">
      <span className="astro-item__icon" aria-hidden="true">
        <i className={`fa-solid ${icon}`} />
      </span>
      <div>
        <p className="astro-item__label">{label}</p>
        <p className="astro-item__value">{value}</p>
        {sub && <p className="astro-item__sub">{sub}</p>}
      </div>
    </div>
  );
}

export default function Highlights({ data, unit, loading }) {
  if (loading && !data) {
    return (
      <section id="details" className="section" aria-busy="true">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Today&apos;s details</h2>
              <p>Loading the current conditions…</p>
            </div>
          </div>
          <HighlightsSkeleton />
        </div>
      </section>
    );
  }

  if (!data) return null;

  const { current, forecast, location } = data;
  const today = forecast.forecastday[0];
  const astro = today.astro;
  const air = current.air_quality;
  const uv = formatUv(current.uv);
  const aqiIndex = air?.["us-epa-index"];
  const aqi = aqiInfo(aqiIndex);
  const hasAqi = Number.isFinite(Number(aqiIndex));

  const items = [
    {
      icon: "fa-temperature-half",
      label: "Feels like",
      value: `${tempValue(current.feelslike_c, current.feelslike_f, unit) ?? "—"}°`,
      sub: "Perceived temperature",
    },
    {
      icon: "fa-droplet",
      label: "Humidity",
      value: `${current.humidity}%`,
      sub: `Dew point ${tempValue(current.dewpoint_c, current.dewpoint_f, unit) ?? "—"}°`,
    },
    {
      icon: "fa-wind",
      label: "Wind",
      value: windText(current.wind_kph, current.wind_mph, unit),
      sub: `${current.wind_dir || "—"} · Gusts ${Math.round(
        unit === "f" ? current.gust_mph : current.gust_kph
      )} ${unit === "f" ? "mph" : "km/h"}`,
    },
    {
      icon: "fa-gauge-high",
      label: "Pressure",
      value: pressureText(current.pressure_mb, current.pressure_in, unit),
      sub: "Sea-level pressure",
    },
    {
      icon: "fa-eye",
      label: "Visibility",
      value: visibilityText(current.vis_km, current.vis_miles, unit),
      sub: "Current visibility",
    },
    {
      icon: "fa-sun",
      label: "UV index",
      value: formatNumber(current.uv, 1),
      sub: `${uv.label} exposure`,
    },
    {
      icon: "fa-cloud-showers-heavy",
      label: "Chance of rain",
      value: `${today.day.daily_chance_of_rain}%`,
      sub: "Today's probability",
    },
    {
      icon: "fa-leaf",
      label: "Air quality",
      value: hasAqi ? `AQI ${aqiIndex}` : "N/A",
      sub: air
        ? `${aqi.label} · PM2.5 ${formatNumber(air.pm2_5, 1)} µg/m³`
        : "Not available for this location",
    },
  ];

  return (
    <section id="details" className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <h2>Today&apos;s details</h2>
            <p>Everything happening right now in {location.name}.</p>
          </div>
        </div>

        <div className="highlights-grid">
          {items.map((item) => (
            <HighlightCard key={item.label} {...item} />
          ))}
        </div>

        <div className="astro-card">
          <div className="astro-card__head">
            <h3>Sun &amp; moon</h3>
            <p>Local times for {location.name}</p>
          </div>
          <div className="astro-grid">
            <AstroItem
              icon="fa-sunrise"
              label="Sunrise"
              value={astro.sunrise}
              sub={astro.is_sun_up ? "Sun is up" : "Sun is down"}
            />
            <AstroItem
              icon="fa-sunset"
              label="Sunset"
              value={astro.sunset}
              sub="Golden hour ready"
            />
            <AstroItem
              icon="fa-moon"
              label="Moonrise"
              value={astro.moonrise}
              sub={astro.is_moon_up ? "Moon is up" : "Moon is down"}
            />
            <AstroItem
              icon="fa-cloud-moon"
              label="Moonset"
              value={astro.moonset}
              sub="Local time"
            />
            <AstroItem
              icon="fa-circle-half-stroke"
              label="Moon phase"
              value={astro.moon_phase}
              sub={`${astro.moon_illumination}% illuminated`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
