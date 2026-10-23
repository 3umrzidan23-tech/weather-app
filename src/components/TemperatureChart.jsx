import { useMemo } from "react";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ChartSkeleton } from "./SkeletonLoader";
import { formatDay } from "../utils/format";
import { tempValue } from "../utils/units";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

ChartJS.defaults.font.family = "Manrope Variable, Manrope, sans-serif";
ChartJS.defaults.color = "#8b93a7";

export default function TemperatureChart({ data, unit, loading }) {
  const chartData = useMemo(() => {
    if (!data) return null;

    const days = data.forecast.forecastday;

    return {
      labels: days.map((day, index) => formatDay(day.date, index)),
      datasets: [
        {
          label: "High",
          data: days.map((day) =>
            tempValue(day.day.maxtemp_c, day.day.maxtemp_f, unit)
          ),
          borderColor: "#ffb84d",
          backgroundColor: "rgba(255, 184, 77, 0.14)",
          pointBackgroundColor: "#ffb84d",
          pointBorderColor: "#1e202b",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 2.5,
          tension: 0.38,
        },
        {
          label: "Low",
          data: days.map((day) =>
            tempValue(day.day.mintemp_c, day.day.mintemp_f, unit)
          ),
          borderColor: "#4cc9f0",
          backgroundColor: "rgba(76, 201, 240, 0.14)",
          pointBackgroundColor: "#4cc9f0",
          pointBorderColor: "#1e202b",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 2.5,
          tension: 0.38,
        },
      ],
    };
  }, [data, unit]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      animation: { duration: 650 },
      plugins: {
        legend: {
          position: "top",
          align: "end",
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            boxWidth: 8,
            boxHeight: 8,
            padding: 18,
            color: "#cfd6e4",
            font: { size: 12, weight: 600 },
          },
        },
        tooltip: {
          backgroundColor: "#141620",
          titleColor: "#ffffff",
          bodyColor: "#cfd6e4",
          borderColor: "rgba(255, 255, 255, 0.12)",
          borderWidth: 1,
          padding: 12,
          displayColors: true,
          callbacks: {
            label: (context) =>
              ` ${context.dataset.label}: ${context.parsed.y}°${unit.toUpperCase()}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: "#8b93a7", font: { size: 11, weight: 600 } },
        },
        y: {
          grid: { color: "rgba(255, 255, 255, 0.06)" },
          border: { display: false },
          ticks: {
            color: "#8b93a7",
            font: { size: 11 },
            callback: (value) => `${value}°`,
          },
        },
      },
    }),
    [unit]
  );

  if (loading && !data) {
    return (
      <section className="section" aria-busy="true">
        <div className="container">
          <ChartSkeleton />
        </div>
      </section>
    );
  }

  if (!data || !chartData) return null;

  const days = data.forecast.forecastday;
  const warmest = days.reduce(
    (best, day) => (day.day.maxtemp_c > best.day.maxtemp_c ? day : best),
    days[0]
  );
  const coolest = days.reduce(
    (best, day) => (day.day.mintemp_c < best.day.mintemp_c ? day : best),
    days[0]
  );
  const average =
    days.reduce(
      (sum, day) =>
        sum + (unit === "f" ? day.day.avgtemp_f : day.day.avgtemp_c),
      0
    ) / days.length;

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <h2>Temperature trend</h2>
            <p>
              Highs and lows for the next {days.length} days in{" "}
              {data.location.name}.
            </p>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-wrap">
            <Line
              data={chartData}
              options={options}
              role="img"
              aria-label={`Temperature trend for ${data.location.name}: ${days.length}-day high and low forecast`}
            />
          </div>

          <div className="chart-summary">
            <div>
              <span>Warmest</span>
              <strong>
                {tempValue(
                  warmest.day.maxtemp_c,
                  warmest.day.maxtemp_f,
                  unit
                )}
                °{" "}
                <small>
                  {formatDay(warmest.date, days.indexOf(warmest))}
                </small>
              </strong>
            </div>
            <div>
              <span>Coolest</span>
              <strong>
                {tempValue(coolest.day.mintemp_c, coolest.day.mintemp_f, unit)}°{" "}
                <small>{formatDay(coolest.date, days.indexOf(coolest))}</small>
              </strong>
            </div>
            <div>
              <span>Average</span>
              <strong>
                {Math.round(average)}° <small>{unit.toUpperCase()}</small>
              </strong>
            </div>
          </div>

          <table className="sr-only">
            <caption>
              {days.length}-day high and low temperatures
            </caption>
            <thead>
              <tr>
                <th scope="col">Day</th>
                <th scope="col">High</th>
                <th scope="col">Low</th>
              </tr>
            </thead>
            <tbody>
              {days.map((day, index) => (
                <tr key={day.date}>
                  <th scope="row">{formatDay(day.date, index)}</th>
                  <td>
                    {tempValue(day.day.maxtemp_c, day.day.maxtemp_f, unit)}°
                    {unit.toUpperCase()}
                  </td>
                  <td>
                    {tempValue(day.day.mintemp_c, day.day.mintemp_f, unit)}°
                    {unit.toUpperCase()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
