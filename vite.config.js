import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { getWeatherResponse } from "./api/weather.js";

function weatherApiMiddleware(apiKey) {
  return async function handleWeatherApi(req, res, next) {
    if (!req.url?.startsWith("/api/weather")) {
      next();
      return;
    }

    if (req.method !== "GET") {
      res.statusCode = 405;
      res.setHeader("Allow", "GET");
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ error: { message: "Method not allowed." } }));
      return;
    }

    try {
      const url = new URL(req.url, "http://localhost");
      const result = await getWeatherResponse({
        path: url.searchParams.get("path"),
        searchParams: url.searchParams,
        apiKey,
      });

      res.statusCode = result.status;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader("Cache-Control", "no-store");
      res.end(JSON.stringify(result.body));
    } catch {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(
        JSON.stringify({
          error: { message: "The local weather proxy failed." },
        })
      );
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiKey = env.WEATHER_API_KEY || process.env.WEATHER_API_KEY;

  const weatherApiPlugin = {
    name: "weather-api-proxy",
    configureServer(server) {
      server.middlewares.use(weatherApiMiddleware(apiKey));
    },
    configurePreviewServer(server) {
      server.middlewares.use(weatherApiMiddleware(apiKey));
    },
  };

  return {
    plugins: [react(), weatherApiPlugin],
    server: {
      port: 5173,
      open: true,
    },
    build: {
      outDir: "dist",
      sourcemap: false,
    },
  };
});
