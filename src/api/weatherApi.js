const API_BASE =
  import.meta.env.VITE_WEATHER_API_BASE || "https://api.weatherapi.com/v1";
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

function requireKey() {
  if (!API_KEY) {
    const error = new Error(
      "Weather API key is missing. Add VITE_WEATHER_API_KEY to .env.local and restart the dev server."
    );
    error.code = "MISSING_API_KEY";
    throw error;
  }
  return API_KEY;
}

async function request(path, params, signal) {
  const url = new URL(`${API_BASE}/${path}`);
  url.search = new URLSearchParams({
    key: requireKey(),
    ...params,
  }).toString();

  let response;
  try {
    response = await fetch(url, { signal });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    const networkError = new Error(
      "Network request failed. Check your internet connection and try again."
    );
    networkError.cause = error;
    throw networkError;
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      payload?.error?.message || `Weather service error (${response.status})`
    );
    error.status = response.status;
    throw error;
  }

  return payload;
}

export function getForecast(query, { signal } = {}) {
  return request(
    "forecast.json",
    {
      q: query,
      days: "7",
      aqi: "yes",
      alerts: "yes",
      lang: "en",
    },
    signal
  );
}

export function searchCities(query, { signal } = {}) {
  return request("search.json", { q: query }, signal);
}

export function friendlyError(error) {
  if (!error) return "";
  if (error.name === "AbortError") return "";
  if (error.code === "MISSING_API_KEY") return error.message;
  if (error.status === 400) {
    return "We couldn't find that location. Check the spelling or try a nearby city.";
  }
  if (error.status === 401 || error.status === 403) {
    return "The weather service rejected the API key. Check your WeatherAPI configuration.";
  }
  if (error.status === 429) {
    return "Too many requests right now. Please wait a moment and try again.";
  }
  if (error.status >= 500) {
    return "The weather service is having trouble. Please try again shortly.";
  }
  return error.message || "Something went wrong while loading the weather.";
}
