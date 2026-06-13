// function WeatherCard({ weather }) {
//   if (!weather) {
//     return null;
//   }

//   return (
//     <div className="rounded-lg border bg-white p-4 shadow-sm">
//       <h2 className="mb-4 text-lg font-semibold">Weather Data</h2>

//       <div className="grid grid-cols-2 gap-3">
//         <div className="rounded-md bg-slate-50 p-3">
//           <p className="text-sm text-slate-500">Temperature</p>
//           <p className="text-xl font-semibold">{weather.temperature}°C</p>
//         </div>

//         <div className="rounded-md bg-slate-50 p-3">
//           <p className="text-sm text-slate-500">Humidity</p>
//           <p className="text-xl font-semibold">{weather.humidity}%</p>
//         </div>

//         <div className="rounded-md bg-slate-50 p-3">
//           <p className="text-sm text-slate-500">Wind Speed</p>
//           <p className="text-xl font-semibold">{weather.windSpeed}</p>
//         </div>

//         <div className="rounded-md bg-slate-50 p-3">
//           <p className="text-sm text-slate-500">Cloud Cover</p>
//           <p className="text-xl font-semibold">{weather.cloudCover}%</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default WeatherCard;


function WeatherCard({ weather }) {
  if (!weather) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">Weather Data</h2>

      <p className="mt-1 text-sm text-slate-500">
        Location: {weather.location}
      </p>

      <p className="text-sm text-slate-500">
        Source: {weather.source}
      </p>

      {weather.lastUpdated && (
        <p className="mb-4 text-sm text-slate-500">
          Updated: {new Date(weather.lastUpdated).toLocaleString()}
        </p>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-md bg-slate-50 p-3">
          <p className="text-sm text-slate-500">Temperature</p>
          <p className="text-xl font-semibold">
            {weather.temperature}°C
          </p>
        </div>

        <div className="rounded-md bg-slate-50 p-3">
          <p className="text-sm text-slate-500">Humidity</p>
          <p className="text-xl font-semibold">
            {weather.humidity}%
          </p>
        </div>

        <div className="rounded-md bg-slate-50 p-3">
          <p className="text-sm text-slate-500">Wind Speed</p>
          <p className="text-xl font-semibold">
            {weather.windSpeed} m/s
          </p>
        </div>

        <div className="rounded-md bg-slate-50 p-3">
          <p className="text-sm text-slate-500">Cloud Cover</p>
          <p className="text-xl font-semibold">
            {weather.cloudCover}%
          </p>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;