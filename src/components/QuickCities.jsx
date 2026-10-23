import { POPULAR_CITIES } from "../utils/constants";

export default function QuickCities({ onSelect }) {
  return (
    <div className="quick-row">
      <span className="quick-row__label">Popular</span>
      {POPULAR_CITIES.map((city) => (
        <button
          key={city.label}
          type="button"
          className="chip"
          onClick={() => onSelect(city)}
        >
          {city.label}
        </button>
      ))}
    </div>
  );
}
