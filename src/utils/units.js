export function tempValue(celsius, fahrenheit, unit) {
  const value = unit === "f" ? fahrenheit : celsius;
  return Number.isFinite(value) ? Math.round(value) : null;
}

export function tempText(celsius, fahrenheit, unit) {
  const value = tempValue(celsius, fahrenheit, unit);
  return value === null ? "—" : `${value}°`;
}

export function tempUnit(unit) {
  return unit === "f" ? "°F" : "°C";
}

export function windText(kph, mph, unit) {
  const value = unit === "f" ? mph : kph;
  if (!Number.isFinite(value)) return "—";
  return `${Math.round(value)} ${unit === "f" ? "mph" : "km/h"}`;
}

export function pressureText(mb, inches, unit) {
  if (unit === "f") {
    return Number.isFinite(inches) ? `${Number(inches).toFixed(2)} in` : "—";
  }
  return Number.isFinite(mb) ? `${Math.round(mb)} mb` : "—";
}

export function visibilityText(km, miles, unit) {
  const value = unit === "f" ? miles : km;
  if (!Number.isFinite(value)) return "—";
  return `${Number(value).toFixed(1)} ${unit === "f" ? "mi" : "km"}`;
}

export function precipText(mm, inches, unit) {
  if (unit === "f") {
    return Number.isFinite(inches) ? `${Number(inches).toFixed(2)} in` : "—";
  }
  return Number.isFinite(mm) ? `${Number(mm).toFixed(1)} mm` : "—";
}
