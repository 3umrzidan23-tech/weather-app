import { useEffect, useRef, useState } from "react";
import { useCitySearch } from "../hooks/useCitySearch";

export default function SearchBar({
  currentLabel,
  onSearch,
  onLocate,
  locating,
}) {
  const [value, setValue] = useState(currentLabel || "");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [validation, setValidation] = useState("");
  const [isUserTyping, setIsUserTyping] = useState(false);
  const inputRef = useRef(null);
  const blurTimer = useRef(null);

  const { results, loading, error, active } = useCitySearch(
    isUserTyping ? value : ""
  );

  useEffect(() => {
    setValue(currentLabel || "");
    setIsUserTyping(false);
  }, [currentLabel]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [results]);

  useEffect(() => {
    if (isUserTyping && active && results.length > 0) setOpen(true);
  }, [isUserTyping, active, results]);

  useEffect(() => {
    return () => window.clearTimeout(blurTimer.current);
  }, []);

  const chooseCity = (city) => {
    const label = city.name;
    onSearch({
      // WeatherAPI resolves city IDs far more precisely than coordinates,
      // which can snap to a neighbouring locality for large cities.
      query: city.id ? `id:${city.id}` : `${city.lat},${city.lon}`,
      label,
    });
    setValue(label);
    setOpen(false);
    setValidation("");
    setIsUserTyping(false);
    inputRef.current?.focus();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = value.trim();

    if (!trimmed) {
      setValidation("Enter a city name or use your current location.");
      setOpen(false);
      setIsUserTyping(false);
      return;
    }

    if (open && activeIndex >= 0 && results[activeIndex]) {
      chooseCity(results[activeIndex]);
      return;
    }

    onSearch({ query: trimmed, label: trimmed });
    setOpen(false);
    setValidation("");
    setIsUserTyping(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) =>
        Math.min(current + 1, Math.max(results.length - 1, 0))
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, -1));
      return;
    }

    if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      setIsUserTyping(false);
    }
  };

  const showDropdown = open && active && isUserTyping;

  return (
    <div className="search-shell">
      <form className="search-form" onSubmit={handleSubmit} role="search">
        <i
          className="fa-solid fa-magnifying-glass search-form__icon"
          aria-hidden="true"
        />

        <label className="sr-only" htmlFor="city-search">
          Search for a city
        </label>
        <input
          ref={inputRef}
          id="city-search"
          className="search-input"
          type="text"
          value={value}
          placeholder="Search for a city…"
          aria-label="Search for a city"
          autoComplete="off"
          spellCheck="false"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="city-listbox"
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `city-option-${activeIndex}` : undefined
          }
          aria-describedby={validation ? "search-validation" : "search-hint"}
          onChange={(event) => {
            const nextValue = event.target.value;
            setValue(nextValue);
            setValidation("");
            setIsUserTyping(true);
            setOpen(nextValue.trim().length >= 2);
          }}
          onFocus={() => {
            if (isUserTyping && active) setOpen(true);
          }}
          onBlur={() => {
            blurTimer.current = window.setTimeout(() => setOpen(false), 120);
          }}
          onKeyDown={handleKeyDown}
        />

        {loading && (
          <i
            className="fa-solid fa-spinner fa-spin search-form__spinner"
            aria-hidden="true"
          />
        )}

        <button
          type="button"
          className="icon-btn search-form__locate"
          onClick={onLocate}
          disabled={locating}
          title="Use my current location"
          aria-label="Use my current location"
        >
          <i
            className={`fa-solid ${
              locating ? "fa-spinner fa-spin" : "fa-location-crosshairs"
            }`}
            aria-hidden="true"
          />
        </button>

        <button type="submit" className="btn-accent search-submit">
          <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
          <span className="search-submit__label">Search</span>
        </button>
      </form>

      <p id="search-hint" className="search-hint">
        Try “London”, “Tokyo”, or a postcode. Pick a suggestion for the most
        accurate result.
      </p>

      {validation && (
        <p id="search-validation" className="search-validation" role="alert">
          {validation}
        </p>
      )}

      {showDropdown && (
        <div
          className="search-dropdown"
          id="city-listbox"
          role="listbox"
          aria-label="City suggestions"
        >
          {loading && results.length === 0 ? (
            <div className="search-dropdown__status">
              <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
              Searching cities…
            </div>
          ) : results.length === 0 ? (
            <div className="search-dropdown__status">
              No matches for “{value.trim()}”. Try another spelling.
            </div>
          ) : (
            results.map((city, index) => (
              <div
                key={`${city.id}-${index}`}
                id={`city-option-${index}`}
                role="option"
                tabIndex={-1}
                aria-selected={activeIndex === index}
                className={`search-option ${
                  activeIndex === index ? "is-active" : ""
                }`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => chooseCity(city)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <span className="search-option__pin" aria-hidden="true">
                  <i className="fa-solid fa-location-dot" />
                </span>
                <span className="search-option__text">
                  <span className="search-option__name">{city.name}</span>
                  <span className="search-option__meta">
                    {[city.region, city.country].filter(Boolean).join(", ")}
                  </span>
                </span>
              </div>
            ))
          )}

          {error && <p className="search-dropdown__error">{error}</p>}
        </div>
      )}
    </div>
  );
}
