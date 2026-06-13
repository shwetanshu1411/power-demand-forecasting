const express = require("express");
const { spawn } = require("child_process");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {
  const projectRoot = path.join(__dirname, "..", "..");
  const pythonFile = path.join(projectRoot, "ml", "forecast_service.py");

  const periods = req.query.periods || "144";

  const pythonProcess = spawn("python", [pythonFile, periods]);

  let result = "";
  let error = "";

  pythonProcess.stdout.on("data", (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    error += data.toString();
  });

  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({
        message: "Python forecast script failed",
        error: error,
      });
    }

    try {
      const forecastData = JSON.parse(result);
      res.json(forecastData);
    } catch (err) {
      res.status(500).json({
        message: "Could not parse Python output",
        error: err.message,
      });
    }
  });
});

module.exports = router;