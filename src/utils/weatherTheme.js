const SNOW_CODES = new Set([
  1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1255, 1258,
  1261, 1264,
]);

const RAIN_CODES = new Set([
  1063, 1150, 1153, 1180, 1183, 1186, 1192, 1195, 1198, 1201, 1240, 1243,
  1246,
]);

const STORM_CODES = new Set([1087, 1273, 1276, 1279, 1282]);
const FOG_CODES = new Set([1030, 1135, 1147]);
const CLOUD_CODES = new Set([1003, 1006, 1009]);

export function getWeatherTheme(current) {
  const code = current?.condition?.code;
  const isDay = current?.is_day !== 0;

  if (STORM_CODES.has(code)) return "storm";
  if (SNOW_CODES.has(code)) return "snow";
  if (RAIN_CODES.has(code)) return "rain";
  if (FOG_CODES.has(code)) return "fog";
  if (CLOUD_CODES.has(code)) return isDay ? "cloudy" : "night";
  return isDay ? "sunny" : "night";
}

export function getWeatherIcon(code, isDay = 1) {
  if (code === 1000) return isDay ? "fa-sun" : "fa-moon";
  if (code === 1003) return isDay ? "fa-cloud-sun" : "fa-cloud-moon";
  if (code === 1006 || code === 1009) return "fa-cloud";
  if (FOG_CODES.has(code)) return "fa-smog";
  if (STORM_CODES.has(code)) return "fa-cloud-bolt";
  if (SNOW_CODES.has(code)) return "fa-snowflake";
  if (code === 1063 || code === 1150 || code === 1153) return "fa-cloud-rain";
  if (RAIN_CODES.has(code)) return "fa-cloud-showers-heavy";
  return isDay ? "fa-cloud-sun" : "fa-cloud-moon";
}

export function conditionTone(current) {
  const theme = getWeatherTheme(current);
  return theme === "night" ? "night" : theme;
}
