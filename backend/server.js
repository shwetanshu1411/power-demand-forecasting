const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = 5000;
const forecastRoutes = require("./routes/forecast");
const holidayRoutes = require("./routes/holidays");
const weatherRoutes = require("./routes/weather");

app.use(cors());
app.use(express.json());

app.use("/api/forecast", forecastRoutes);
app.use("/api/holidays", holidayRoutes);
app.use("/api/weather", weatherRoutes);

app.get("/", (req, res) => {
  res.send("Power Demand Forecasting API is running");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend is working",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});