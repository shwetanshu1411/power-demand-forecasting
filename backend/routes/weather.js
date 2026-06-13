const express = require("express");
const axios = require("axios");

const router = express.Router();

const API_KEY = process.env.OPENWEATHER_API_KEY;

router.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=Dhanbad,IN&units=metric&appid=${API_KEY}`
    );

    const data = response.data;

    res.json({
      location: "Dhanbad, Jharkhand",
      source: "OpenWeatherMap API",
      temperature: data.main.temp,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      cloudCover: data.clouds.all,
    });
  } catch (error) {
  console.error(error.response?.data || error.message);

  res.status(500).json({
    message: "Unable to fetch weather data",
    error: error.response?.data || error.message,
  });
}
});

module.exports = router;