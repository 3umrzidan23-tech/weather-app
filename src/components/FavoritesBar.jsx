export default function FavoritesBar({ favorites, onSelect, onRemove }) {
  if (!favorites.length) return null;

  return (
    <div className="quick-row quick-row--favorites">
      <span className="quick-row__label">
        <i className="fa-solid fa-star" aria-hidden="true" /> Saved
      </span>
      {favorites.map((favorite) => (
        <span className="chip chip--favorite" key={favorite.query}>
          <button
            type="button"
            className="chip__main"
            onClick={() => onSelect(favorite)}
          >
            {favorite.label}
          </button>
          <button
            type="button"
            className="chip__remove"
            onClick={() => onRemove(favorite.query)}
            aria-label={`Remove ${favorite.label} from saved cities`}
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </span>
      ))}
    </div>
  );
}
