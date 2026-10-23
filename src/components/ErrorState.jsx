export default function ErrorState({
  title = "Couldn't load the forecast",
  message,
  onRetry,
}) {
  return (
    <div className="state-card" role="alert">
      <span className="state-card__icon" aria-hidden="true">
        <i className="fa-solid fa-cloud-bolt" />
      </span>
      <div>
        <h3>{title}</h3>
        <p>{message}</p>
        {onRetry && (
          <button type="button" className="btn-accent" onClick={onRetry}>
            <i className="fa-solid fa-rotate-right" aria-hidden="true" />
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
