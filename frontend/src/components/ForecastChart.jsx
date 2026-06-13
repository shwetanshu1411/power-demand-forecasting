import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function ForecastChart({ forecast }) {
  const labels = forecast.map((item) => {
    return new Date(item.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  });

  const values = forecast.map((item) => item.forecastDemand);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Forecast Demand",
        data: values,
        borderColor: "#2563eb",
        backgroundColor: "#2563eb",
        tension: 0.3,
        pointRadius: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="h-96 rounded-lg border bg-white p-4 shadow-sm">
      <Line data={data} options={options} />
    </div>
  );
}

export default ForecastChart;