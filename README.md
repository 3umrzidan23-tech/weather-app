# Weather.

A focused weather dashboard built with React and Vite. It keeps the original dark visual identity (`#1e202b`, `#2b2e3d`, `#009ad8`) while adding live conditions, hourly detail, a daily forecast, a temperature trend chart, saved cities, and a responsive layout.

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

## Tech stack

- React 19
- Vite 8
- Bootstrap grid CSS only (no Bootstrap JavaScript)
- Chart.js via `react-chartjs-2`
- Font Awesome via npm
- Manrope variable font via Fontsource
- WeatherAPI.com for weather and city search data
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
VITE_WEATHER_API_KEY=your_weatherapi_key_here
```

You can copy `.env.example` as a starting point. `.env.local` is ignored by Git and must not be committed.

Optional: override the API base if you put a server-side proxy in front of WeatherAPI:

```dotenv
# VITE_WEATHER_API_BASE=https://api.weatherapi.com/v1
```

### Run locally

```bash
npm run dev
```

Vite opens the app at `http://localhost:5173`.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create an optimized production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

## API and the free-plan limitation

The app requests seven forecast days (`days=7`) in a single `forecast.json` call so the UI can offer a 3-day / 7-day view. WeatherAPI's free plan may return only three forecast days regardless of the requested value.

The UI handles that automatically:

- If seven days are returned, the 3-day / 7-day toggle is shown.
- If fewer than seven days are returned, the toggle is hidden and a `3-day outlook` pill is displayed instead.
- The forecast section, chart, and chart summary all use the number of days actually returned.

No code change is needed when upgrading to a plan that returns seven days.

## Project structure

```text
src/
  api/          WeatherAPI request and error helpers
  components/   UI sections, search, charts, skeletons, alerts, and navigation
  context/      Settings/favorites persistence and toast notifications
  hooks/        Weather fetching, city search, geolocation, and localStorage
  styles/       Design system, themes, component styles, and media queries
  utils/        Constants, formatting, units, and weather-to-theme mapping
  App.jsx       Data orchestration and page composition
  main.jsx      App bootstrap and providers
legacy/         Original static version, preserved for reference
public/         Static assets and favicon
```

## Data flow

1. `App` keeps the active location and requests a forecast through `useWeather`.
2. `useWeather` caches successful responses in `sessionStorage` for ten minutes and aborts stale requests with `AbortController`.
3. A successful response is persisted as the last working location only after it loads, so a typo in the search box does not replace the saved city.
4. The theme is derived from the current condition and `is_day` value.
5. Preferences and saved cities are stored in `localStorage`; forecast responses use `sessionStorage`.

## Production notes

- `npm run build` outputs static files to `dist/`.
- Vite environment variables are embedded at build time. Set `VITE_WEATHER_API_KEY` in your hosting provider and rebuild when it changes.
- The current implementation calls WeatherAPI directly from the browser, so the API key is visible to users. That is acceptable for this demo, but for a public production deployment put the request behind a server-side proxy and keep the key server-side.
- A static host such as Netlify, Vercel, Cloudflare Pages, or GitHub Pages can serve `dist/`.

## Legacy version

The original static HTML/CSS/JavaScript version is preserved in `legacy/` and was captured in Git before the React migration. Its hard-coded API key has been replaced with `YOUR_WEATHERAPI_KEY`; add your own key there if you want to run the legacy version. The current app is a full replacement, not a wrapper around the old files.
