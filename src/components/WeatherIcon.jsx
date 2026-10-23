import { getWeatherIcon } from "../utils/weatherTheme";

export default function WeatherIcon({
  code,
  isDay = 1,
  size = "md",
  className = "",
  label,
}) {
  const icon = getWeatherIcon(code, isDay);

  return (
    <span
      className={`weather-icon weather-icon--${size} ${className}`.trim()}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <i className={`fa-solid ${icon}`} />
    </span>
  );
}
