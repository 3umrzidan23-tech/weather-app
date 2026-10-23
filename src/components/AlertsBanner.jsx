function severityClass(severity) {
  return `severity--${(severity || "unknown")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}`;
}

export default function AlertsBanner({ alerts }) {
  if (!alerts?.length) return null;

  return (
    <section className="alerts-section" aria-labelledby="alerts-title">
      <div className="container">
        <div className="alerts-card">
          <div className="alerts-card__head">
            <span className="alerts-card__icon" aria-hidden="true">
              <i className="fa-solid fa-triangle-exclamation" />
            </span>
            <div>
              <h2 id="alerts-title">Weather alerts</h2>
              <p>
                {alerts.length} active {alerts.length === 1 ? "alert" : "alerts"}{" "}
                for this area.
              </p>
            </div>
          </div>

          <div className="alerts-list">
            {alerts.map((alert, index) => (
              <article
                className="alert-item"
                key={`${alert.headline}-${index}`}
              >
                <div className="alert-item__top">
                  <span className={`severity ${severityClass(alert.severity)}`}>
                    {alert.severity || "Alert"}
                  </span>
                  <h3>{alert.headline}</h3>
                </div>
                <p className="alert-item__meta">
                  {[
                    alert.areas,
                    alert.effective && `From ${alert.effective}`,
                    alert.expires && `Until ${alert.expires}`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <details>
                  <summary>Read details</summary>
                  <p>{alert.desc}</p>
                  {alert.instruction && (
                    <p className="alert-item__instruction">
                      <strong>What to do:</strong> {alert.instruction}
                    </p>
                  )}
                </details>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
