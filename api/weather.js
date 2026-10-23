const API_ROOT = "https://api.weatherapi.com/v1";
const ALLOWED_PATHS = new Set(["forecast.json", "search.json"]);
const ALLOWED_PARAMS = new Set(["q", "days", "aqi", "alerts", "lang"]);

function response(status, body, cacheControl = "no-store") {
  return { status, body, cacheControl };
}

function cacheControlFor(path) {
  return path === "search.json"
    ? "public, s-maxage=86400, stale-while-revalidate=604800"
    : "public, s-maxage=300, stale-while-revalidate=600";
}

async function fetchUpstream(url, attempts = 2) {
  let lastError;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const upstreamResponse = await fetch(url);
      if (upstreamResponse.status >= 500 && attempt < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, 250));
        continue;
      }
      return upstreamResponse;
    } catch (error) {
      lastError = error;
      if (attempt < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    }
  }

  throw lastError;
}

/**
 * Shared request logic used by the Vercel Function and the Vite dev/preview
 * middleware. The API key never leaves the server.
 */
export async function getWeatherResponse({ path, searchParams, apiKey }) {
  if (!ALLOWED_PATHS.has(path)) {
    return response(400, {
      error: { message: "Unsupported weather endpoint." },
    });
  }

  if (!apiKey) {
    return response(500, {
      error: {
        message:
          "Weather API key is not configured on the server. Set WEATHER_API_KEY.",
      },
    });
  }

  const upstream = new URL(`${API_ROOT}/${path}`);
  upstream.searchParams.set("key", apiKey);

  const params =
    searchParams instanceof URLSearchParams
      ? searchParams
      : new URLSearchParams(searchParams || "");

  for (const [name, value] of params) {
    if (ALLOWED_PARAMS.has(name)) {
      upstream.searchParams.set(name, value);
    }
  }

  let upstreamResponse;
  try {
    upstreamResponse = await fetchUpstream(upstream);
  } catch {
    return response(502, {
      error: { message: "Could not reach the weather service." },
    });
  }

  let body;
  try {
    body = await upstreamResponse.json();
  } catch {
    body = {
      error: { message: "The weather service returned an invalid response." },
    };
  }

  return response(
    upstreamResponse.status,
    body,
    upstreamResponse.ok ? cacheControlFor(path) : "no-store"
  );
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: { message: "Method not allowed." } }));
    return;
  }

  const url = new URL(req.url, "http://localhost");
  const result = await getWeatherResponse({
    path: url.searchParams.get("path"),
    searchParams: url.searchParams,
    apiKey: process.env.WEATHER_API_KEY,
  });

  res.statusCode = result.status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", result.cacheControl);
  res.end(JSON.stringify(result.body));
}
