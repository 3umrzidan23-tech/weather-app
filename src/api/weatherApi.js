const API_ENDPOINT = "/api/weather";

async function request(path, params, signal) {
  const search = new URLSearchParams({ path, ...params });

  let response;
  try {
    response = await fetch(`${API_ENDPOINT}?${search}`, {
      signal,
      headers: { Accept: "application/json" },
    });
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
  if (error.status === 400) {
    return "We couldn't find that location. Check the spelling or try a nearby city.";
  }
  if (error.status === 401 || error.status === 403) {
    return "The weather service rejected the request. Check the server API key configuration.";
  }
  if (error.status === 404) {
    return "The weather proxy is not available. Check that the API route is deployed.";
  }
  if (error.status === 429) {
    return "Too many requests right now. Please wait a moment and try again.";
  }
  if (error.status >= 500) {
    return "The weather service is having trouble. Please try again shortly.";
  }
  return error.message || "Something went wrong while loading the weather.";
}
