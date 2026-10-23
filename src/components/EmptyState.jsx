export default function EmptyState({
  title = "Search for a city to get started",
  message = "Type at least two characters and pick a location from the suggestions.",
  icon = "fa-location-dot",
}) {
  return (
    <div className="state-card state-card--empty" role="status">
      <span className="state-card__icon" aria-hidden="true">
        <i className={`fa-solid ${icon}`} />
      </span>
      <div>
        <h3>{title}</h3>
        <p>{message}</p>
      </div>
    </div>
  );
}
