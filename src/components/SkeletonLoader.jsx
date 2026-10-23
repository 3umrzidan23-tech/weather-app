export function Skeleton({ className = "", style }) {
  return <span className={`skeleton ${className}`.trim()} style={style} />;
}

export function CurrentSkeleton() {
  return (
    <div className="current-card current-card--skeleton" role="status" aria-live="polite">
      <span className="sr-only">Loading current weather…</span>
      <div className="skeleton-stack">
        <Skeleton className="skeleton--line skeleton--w-30" />
        <Skeleton className="skeleton--title skeleton--w-50" />
        <Skeleton className="skeleton--line skeleton--w-40" />
      </div>
      <div className="current-card__body">
        <div className="skeleton-stack skeleton-stack--center">
          <Skeleton className="skeleton--circle" />
          <Skeleton className="skeleton--hero" />
          <Skeleton className="skeleton--line skeleton--w-60" />
        </div>
        <div className="skeleton-grid">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="skeleton--stat" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function HighlightsSkeleton() {
  return (
    <div className="highlights-grid" role="status" aria-live="polite">
      <span className="sr-only">Loading weather details…</span>
      {Array.from({ length: 8 }).map((_, index) => (
        <div className="highlight-card" key={index}>
          <Skeleton className="skeleton--icon" />
          <Skeleton className="skeleton--line skeleton--w-50" />
          <Skeleton className="skeleton--value" />
          <Skeleton className="skeleton--line skeleton--w-70" />
        </div>
      ))}
    </div>
  );
}

export function HourlySkeleton() {
  return (
    <div className="hourly-scroll" role="status" aria-live="polite">
      <span className="sr-only">Loading hourly forecast…</span>
      {Array.from({ length: 8 }).map((_, index) => (
        <div className="hourly-card" key={index}>
          <Skeleton className="skeleton--line skeleton--w-60 skeleton--center" />
          <Skeleton className="skeleton--icon skeleton--center" />
          <Skeleton className="skeleton--value skeleton--center" />
        </div>
      ))}
    </div>
  );
}

export function ForecastSkeleton({ count = 3 }) {
  return (
    <div
      className={`forecast-grid ${count === 7 ? "forecast-grid--7" : ""}`}
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Loading daily forecast…</span>
      {Array.from({ length: count }).map((_, index) => (
        <div className="forecast-card" key={index}>
          <div className="skeleton-stack">
            <Skeleton className="skeleton--line skeleton--w-50" />
            <Skeleton className="skeleton--line skeleton--w-30" />
          </div>
          <Skeleton className="skeleton--icon" />
          <Skeleton className="skeleton--line skeleton--w-70" />
          <Skeleton className="skeleton--value" />
          <Skeleton className="skeleton--bar" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="chart-card" role="status" aria-live="polite">
      <span className="sr-only">Loading temperature chart…</span>
      <Skeleton className="skeleton--line skeleton--w-30" />
      <Skeleton className="skeleton--chart" />
    </div>
  );
}
