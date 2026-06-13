import { useEffect, useState } from "react";
import { getForecast, getWeather, getHolidays } from "./api";
import ForecastChart from "./components/ForecastChart";
import WeatherCard from "./components/WeatherCard";
import HolidayTable from "./components/HolidayTable";

function App() {
  const [forecast, setForecast] = useState([]);
  const [weather, setWeather] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const forecastData = await getForecast();
        const weatherData = await getWeather();
        const holidayData = await getHolidays();

        setForecast(forecastData.forecast);
        setWeather(weatherData);
        setHolidays(holidayData.holidays);
      } catch {
        setError("Unable to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-lg font-medium">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="rounded-lg bg-red-100 px-4 py-3 text-red-700">{error}</p>
      </div>
    );
  }

  const totalDemand = forecast.reduce((sum, item) => {
    return sum + item.forecastDemand;
  }, 0);

  const averageDemand = forecast.length > 0 ? totalDemand / forecast.length : 0;

  const peakDemand = forecast.reduce((max, item) => {
    return item.forecastDemand > max ? item.forecastDemand : max;
  }, 0);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Power Demand Forecasting Dashboard
          </h1>
          <p className="mt-1 text-slate-600">
            Next 24 hours electricity demand forecast for Dhanbad, Jharkhand
          </p>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Forecast Blocks</p>
            <p className="mt-2 text-2xl font-semibold">{forecast.length}</p>
          </div>

          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Average Demand</p>
            <p className="mt-2 text-2xl font-semibold">
              {averageDemand.toFixed(2)}
            </p>
          </div>

          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Peak Demand</p>
            <p className="mt-2 text-2xl font-semibold">
              {peakDemand.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <ForecastChart forecast={forecast} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <WeatherCard weather={weather} />
          <HolidayTable holidays={holidays} />
        </div>
      </div>
    </div>
  );
}

export default App;