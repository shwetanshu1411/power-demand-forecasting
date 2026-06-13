function WeatherCard({ weather }) {
  if (!weather) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Weather Data</h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-md bg-slate-50 p-3">
          <p className="text-sm text-slate-500">Temperature</p>
          <p className="text-xl font-semibold">{weather.temperature}°C</p>
        </div>

        <div className="rounded-md bg-slate-50 p-3">
          <p className="text-sm text-slate-500">Humidity</p>
          <p className="text-xl font-semibold">{weather.humidity}%</p>
        </div>

        <div className="rounded-md bg-slate-50 p-3">
          <p className="text-sm text-slate-500">Wind Speed</p>
          <p className="text-xl font-semibold">{weather.windSpeed}</p>
        </div>

        <div className="rounded-md bg-slate-50 p-3">
          <p className="text-sm text-slate-500">Cloud Cover</p>
          <p className="text-xl font-semibold">{weather.cloudCover}%</p>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;