# Weather.

A focused weather dashboard built with React and Vite. It keeps the original dark visual identity (`#1e202b`, `#2b2e3d`, `#009ad8`) while adding live conditions, hourly detail, a daily forecast, a temperature trend chart, saved cities, and a responsive layout.

- Live demo: https://weather-app-seven-iota-58.vercel.app
- Repository: https://github.com/3umrzidan23-tech/weather-app

## Features

- Live current conditions, feels-like temperature, humidity, wind, pressure, visibility, UV, and air quality
- 24-hour forecast strip
- Daily forecast for every day returned by the API
- Lazy-loaded Chart.js temperature trend with a screen-reader table fallback
- City autocomplete plus geolocation support
- Saved cities and temperature unit preference persisted in `localStorage`
- Dynamic theme colors based on the current weather condition and day/night state
- Severe weather alert banner when the API returns alerts
- Skeleton loading states, retry/error states, offline notices, and toast feedback
- Responsive navigation, keyboard-friendly search, skip link, and reduced-motion support
- Server-side API key through a small Vercel Function and a matching local Vite middleware

## Tech stack

- React 19
- Vite 8
- Bootstrap grid CSS only (no Bootstrap JavaScript)
- Chart.js via `react-chartjs-2`
- Font Awesome via npm
- Manrope variable font via Fontsource
- WeatherAPI.com for weather and city search data
- Vercel Functions for the server-side API proxy
- ESLint

## Getting started

### Requirements

- Node.js 20.19+ or 22.12+ (required by Vite 8)
- A free WeatherAPI.com API key

### Install

```bash
npm install
```

### Configure the API key

Create `.env.local` in the project root:

```dotenv
WEATHER_API_KEY=your_weatherapi_key_here
```

You can copy `.env.example` as a starting point.

Important: do **not** prefix this variable with `VITE_`. Vite exposes `VITE_*` values to the browser. The key is read by `api/weather.js` and by the local Vite middleware only, and is never included in the client bundle.

`.env.local` is ignored by Git and must not be committed.

### Run locally

```bash
npm run dev
```

Vite opens the app at `http://localhost:5173`. The app calls `/api/weather`, which the Vite dev server forwards to WeatherAPI using the server-side key.

To test the production bundle locally with the same API route:

```bash
npm run build
npm run preview
```

The preview server uses the same local middleware, so the production build can be tested without exposing the key.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server with the local API middleware |
| `npm run build` | Create an optimized production build in `dist/` |
| `npm run preview` | Preview the production build with the local API middleware |
| `npm run lint` | Run ESLint across the project |

## API proxy

The browser only talks to:

```text
/api/weather?path=forecast.json&q=...&days=7&aqi=yes&alerts=yes&lang=en
/api/weather?path=search.json&q=...
```

`api/weather.js`:

- Allows only `forecast.json` and `search.json`
- Forwards only the supported query parameters
- Adds `WEATHER_API_KEY` from the server environment
- Returns the upstream status and JSON payload
- Retries transient network errors and upstream 5xx responses once
- Adds CDN caching headers for successful responses:
  - Forecast: 5 minutes
  - City search: 24 hours
- Returns `no-store` for errors

The same logic is reused by `vite.config.js` for `npm run dev` and `npm run preview`, so local development and production behave the same way.

## API and the free-plan limitation

The app requests seven forecast days (`days=7`) in a single `forecast.json` call so the UI can offer a 3-day / 7-day view. WeatherAPI's free plan may return only three forecast days regardless of the requested value.

The UI handles that automatically:

- If seven days are returned, the 3-day / 7-day toggle is shown.
- If fewer than seven days are returned, the toggle is hidden and a `3-day outlook` pill is displayed instead.
- The forecast section, chart, and chart summary all use the number of days actually returned.

No code change is needed when upgrading to a plan that returns seven days.

## Project structure

```text
api/
  weather.js    Vercel Function: adds the server-side API key and proxies WeatherAPI
src/
  api/          Client request and error helpers
  components/   UI sections, search, charts, skeletons, alerts, and navigation
  context/      Settings/favorites persistence and toast notifications
  hooks/        Weather fetching, city search, geolocation, and localStorage
  styles/       Design system, themes, component styles, and media queries
  utils/        Constants, formatting, units, and weather-to-theme mapping
  App.jsx       Data orchestration and page composition
  main.jsx      App bootstrap and providers
legacy/         Original static version, preserved for reference
public/         Static assets, robots.txt, and favicon
```

## Data flow

1. `App` keeps the active location and requests a forecast through `useWeather`.
2. The client calls `/api/weather` with the endpoint name and query parameters.
3. The Vercel Function (or Vite middleware) adds the API key and calls WeatherAPI.
4. `useWeather` caches successful responses in `sessionStorage` for ten minutes and aborts stale requests with `AbortController`.
5. A successful response is persisted as the last working location only after it loads, so a typo in the search box does not replace the saved city.
6. The theme is derived from the current condition and `is_day` value.
7. Preferences and saved cities are stored in `localStorage`; forecast responses use `sessionStorage`.

## Deploying to Vercel

1. Push the project to a GitHub repository under your personal account.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Keep the detected Vite settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add an Environment Variable:
   - Name: `WEATHER_API_KEY`
   - Value: your WeatherAPI.com key
5. Deploy.

Vercel automatically detects `api/weather.js` as a serverless function. The browser receives only `/api/weather` responses; the key remains in the function environment.

The Vercel Hobby plan is free for personal and non-commercial projects and does not require a bank card. For a commercial/client deployment, use the appropriate paid plan. Keep the GitHub repository under a personal account if you are using Hobby.

If you deploy to a host other than Vercel, you need to provide an equivalent `/api/weather` proxy that adds the server-side key. A completely static host will not be able to hide the key.

## Security notes

- `WEATHER_API_KEY` is server-only and is never referenced by client code.
- `.env.local` and `.vercel/` are ignored by Git.
- The proxy only forwards the two endpoints and the parameters the app needs.
- If an API key was ever committed or shared, rotate it in the WeatherAPI dashboard before publishing the repository.

## Legacy version

The original static HTML/CSS/JavaScript version is preserved in `legacy/` and was captured in Git before the React migration. Its hard-coded API key has been replaced with `YOUR_WEATHERAPI_KEY`; add your own key there if you want to run the legacy version. The current app is a full replacement, not a wrapper around the old files.
