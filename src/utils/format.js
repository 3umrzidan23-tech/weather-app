const WEEKDAY = new Intl.DateTimeFormat("en-US", { weekday: "long" });
const SHORT_DATE = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});
const HOUR = new Intl.DateTimeFormat("en-US", { hour: "numeric" });
const LOCAL_TIME = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function parseDate(value) {
  if (!value) return null;
  const date = new Date(`${value}`.replace(" ", "T"));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDay(dateStr, index) {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  const date = parseDate(dateStr);
  return date ? WEEKDAY.format(date) : "—";
}

export function formatShortDate(dateStr) {
  const date = parseDate(dateStr);
  return date ? SHORT_DATE.format(date) : "—";
}

export function formatHour(timeStr, isNow = false) {
  if (isNow) return "Now";
  const date = parseDate(timeStr);
  return date ? HOUR.format(date) : "—";
}

export function formatLocalTime(localtime) {
  const date = parseDate(localtime);
  return date ? LOCAL_TIME.format(date) : "—";
}

export function formatUv(index) {
  const value = Number(index);
  if (!Number.isFinite(value)) return { label: "Unknown", tone: "neutral" };
  if (value <= 2) return { label: "Low", tone: "good" };
  if (value <= 5) return { label: "Moderate", tone: "fair" };
  if (value <= 7) return { label: "High", tone: "warn" };
  if (value <= 10) return { label: "Very high", tone: "bad" };
  return { label: "Extreme", tone: "bad" };
}

export function aqiInfo(index) {
  const value = Number(index);
  const labels = {
    1: { label: "Good", tone: "good" },
    2: { label: "Moderate", tone: "fair" },
    3: { label: "Unhealthy for sensitive groups", tone: "warn" },
    4: { label: "Unhealthy", tone: "bad" },
    5: { label: "Very unhealthy", tone: "bad" },
    6: { label: "Hazardous", tone: "bad" },
  };
  return labels[value] || { label: "Unknown", tone: "neutral" };
}

export function formatNumber(value, digits = 0) {
  if (!Number.isFinite(Number(value))) return "—";
  return Number(value).toFixed(digits);
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
