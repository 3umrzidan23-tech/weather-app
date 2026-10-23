import FavoritesBar from "./FavoritesBar";
import QuickCities from "./QuickCities";
import SearchBar from "./SearchBar";

export default function Hero({
  currentLabel,
  onSearch,
  onLocate,
  locating,
  favorites,
  onRemoveFavorite,
}) {
  return (
    <section id="home" className="hero">
      <div className="container hero__content">
        <div className="hero__text">
          <span className="hero__eyebrow">
            <i className="fa-solid fa-satellite-dish" aria-hidden="true" />
            Live weather intelligence
          </span>
          <h1>
            Weather that keeps you <span>one step ahead.</span>
          </h1>
          <p className="hero__lead">
            Real-time conditions, a 24-hour outlook, and a multi-day forecast
            for any city — all in one clean dashboard.
          </p>
          <ul className="hero__badges" aria-label="App features">
            <li>
              <i className="fa-solid fa-circle-check" aria-hidden="true" />
              Live conditions
            </li>
            <li>
              <i className="fa-solid fa-circle-check" aria-hidden="true" />
              24-hour detail
            </li>
            <li>
              <i className="fa-solid fa-circle-check" aria-hidden="true" />
              Daily outlook
            </li>
            <li>
              <i className="fa-solid fa-circle-check" aria-hidden="true" />
              Weather alerts
            </li>
          </ul>
        </div>

        <SearchBar
          currentLabel={currentLabel}
          onSearch={onSearch}
          onLocate={onLocate}
          locating={locating}
        />

        <QuickCities onSelect={onSearch} />

        <FavoritesBar
          favorites={favorites}
          onSelect={onSearch}
          onRemove={onRemoveFavorite}
        />
      </div>
    </section>
  );
}
