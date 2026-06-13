const API_URL = "http://localhost:5000/api";

export async function getForecast() {
  const response = await fetch(`${API_URL}/forecast?periods=144`);

  if (!response.ok) {
    throw new Error("Failed to fetch forecast data");
  }

  return response.json();
}

export async function getWeather() {
  const response = await fetch(`${API_URL}/weather`);

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  return response.json();
}

export async function getHolidays() {
  const response = await fetch(`${API_URL}/holidays`);

  if (!response.ok) {
    throw new Error("Failed to fetch holiday data");
  }

  return response.json();
}