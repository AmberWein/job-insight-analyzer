import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "./LogsChart.css";

function LogsChart({ logs }) {
  // group logs by date
  const logsByDate = logs.reduce((acc, log) => {
    const date = new Date(log.timestamp).toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  // convert to array for chart and metric calculation
  const chartData = Object.entries(logsByDate)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // compute metrics
  const totalLogs = chartData.reduce((sum, day) => sum + day.count, 0);
  const averageLogs = (totalLogs / chartData.length).toFixed(2);

  const latest = chartData[chartData.length - 1];
  const previous = chartData[chartData.length - 2];

  const delta =
    latest && previous
      ? (latest.count - previous.count).toString()
      : "N/A";

  return (
    <div className="logs-chart">
      <h2>Logs trend over time</h2>

      {/* Highlighted metrics */}
      <div className="logs-metrics">
        <div><strong>Average daily logs:</strong> {averageLogs}</div>
        <div><strong>Latest day logs:</strong> {latest?.count ?? "N/A"}</div>
        <div>
          <strong>Change from previous day:</strong>{" "}
          {delta !== "N/A" ? `${delta > 0 ? "+" : ""}${delta}` : "N/A"}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#3f51b5"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LogsChart;