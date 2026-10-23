const FEATURES = [
  {
    icon: "fa-satellite-dish",
    title: "Real-time conditions",
    text: "Temperature, wind, humidity, pressure, visibility, UV, and air quality refreshed from live station data.",
  },
  {
    icon: "fa-clock",
    title: "Hourly clarity",
    text: "A 24-hour breakdown so you can plan commutes, workouts, and outdoor time with confidence.",
  },
  {
    icon: "fa-calendar-days",
    title: "Extended outlook",
    text: "A focused multi-day view with a temperature trend chart. More days unlock automatically when your data plan supports them.",
  },
  {
    icon: "fa-triangle-exclamation",
    title: "Safety first",
    text: "Severe weather alerts from the forecast area appear automatically, with practical guidance.",
  },
];

export default function About() {
  return (
    <section id="about" className="section about-section">
      <div className="container">
        <div className="about-layout">
          <div className="about-copy">
            <span className="eyebrow">About Weather.</span>
            <h2>Clear answers for everyday decisions.</h2>
            <p>
              Weather. brings live conditions, hourly detail, air quality, sun
              and moon data, and a multi-day outlook into one focused dashboard. No
              clutter, no noise — just the numbers that help you plan your day.
            </p>
            <p>
              Forecast data is provided by{" "}
              <a
                href="https://www.weatherapi.com/"
                target="_blank"
                rel="noreferrer"
              >
                WeatherAPI.com
              </a>
              . Your saved cities and unit preference stay in your browser.
            </p>
            <div className="tech-chips" aria-label="Technology stack">
              <span>React 19</span>
              <span>Vite</span>
              <span>WeatherAPI</span>
              <span>Chart.js</span>
            </div>
          </div>

          <div className="about-grid">
            {FEATURES.map((feature) => (
              <article className="about-card" key={feature.title}>
                <span className="about-card__icon" aria-hidden="true">
                  <i className={`fa-solid ${feature.icon}`} />
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
