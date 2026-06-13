const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {
  const projectRoot = path.join(__dirname, "..", "..");
  const filePath = path.join(projectRoot, "data", "holidays_dhanbad.csv");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({
        message: "Could not read holidays file",
      });
    }

    const lines = data.trim().split("\n");
    const holidays = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");

      holidays.push({
        date: values[0],
        name: values[1],
        type: values[2],
      });
    }

    res.json({
      location: "Dhanbad, Jharkhand",
      holidays: holidays,
    });
  });
});

module.exports = router;