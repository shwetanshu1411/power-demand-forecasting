# Intelligent Power Demand Forecasting System

## Project Overview

This project is an end-to-end Intelligent Power Demand Forecasting System developed as a proof-of-concept for Apex Power & Utilities (APU). The objective is to forecast electricity demand for Dhanbad, Jharkhand using historical utility consumption data, weather information, and localized holiday calendars.

The solution consists of:

* Machine Learning Forecasting Engine
* Node.js/Express Backend API
* React Dashboard Frontend
* Docker-based Deployment

The system predicts electricity demand for 144 ten-minute intervals (24-hour forecast horizon) and provides weather and holiday information to support operational decision-making.

---

## Problem Statement

Power utilities require accurate short-term demand forecasts to:

* Optimize power generation
* Improve grid stability
* Reduce operational costs
* Handle demand fluctuations caused by weather and holidays

This project addresses these challenges using machine learning and external contextual data sources.

---

## Technology Stack

### Machine Learning

* Python
* Pandas
* NumPy
* Scikit-Learn
* Joblib

### Backend

* Node.js
* Express.js
* CORS
* Axios

### Frontend

* React
* Vite
* Tailwind CSS
* Chart.js
* React ChartJS 2

### Deployment

* Docker

---

## Dataset Description

### Utility Consumption Data

The provided dataset contains:

* Timestamped power consumption records
* Multiple feeder-level power consumption values
* Weather-related attributes
* Historical demand information

### Weather Data

Weather information is sourced using the OpenWeatherMap API for:

* Temperature
* Humidity
* Wind Speed
* Cloud Cover

Location:

Dhanbad, Jharkhand, India

### Holiday Data

Localized holiday information for Dhanbad was collected and stored in:

data/holidays_dhanbad.csv

Holiday features are incorporated into the forecasting model to capture demand variations during special events and regional holidays.

---

## Data Cleaning & Preprocessing

The following preprocessing techniques were applied:

### Missing Value Handling

* Linear interpolation
* Backward fill (bfill)
* Forward fill (ffill)

### Invalid Value Handling

* Negative and zero power consumption values treated as missing
* Conversion of invalid entries to NaN

### Outlier Treatment

Interquartile Range (IQR) based clipping was used to detect and handle extreme outliers.

---

## Feature Engineering

The following features were engineered for forecasting:

### Time-Based Features

* Hour
* Minute
* Day of Week
* Month
* Day of Year
* Block Number

### Calendar Features

* Weekend Indicator
* Holiday Indicator

### Cyclic Features

* Sin(Block)
* Cos(Block)

### Lag Features

* Lag 1
* Lag 6
* Lag 144

### Rolling Statistics

* Rolling Mean (6 blocks)
* Rolling Mean (144 blocks)

### Weather Features

* Temperature
* Humidity
* Wind Speed

---

## Model Selection

### Algorithm Used

Random Forest Regressor

### Reason for Selection

Random Forest was selected because:

* Handles nonlinear relationships effectively
* Robust against noise and outliers
* Requires minimal feature scaling
* Performs well on tabular time-series feature sets
* Provides feature importance analysis

---

## Model Performance

Evaluation was performed using a time-based train-test split.

| Metric   | Value  |
| -------- | ------ |
| RMSE     | 929.81 |
| MAE      | 498.44 |
| R² Score | 0.9971 |

The model achieved strong predictive performance with a high coefficient of determination and low forecasting error.

---

## Forecast Horizon

The system forecasts:

* 144 blocks
* 10 minutes per block
* 24-hour forecast horizon

Calculation:

24 Hours × 6 Blocks Per Hour = 144 Blocks

---

## Backend API Endpoints

### Health Check

GET

```text
/api/health
```

### Demand Forecast

GET

```text
/api/forecast?periods=144
```

Returns:

* Forecast demand
* Timestamp
* Weather features
* Holiday indicator

### Weather Data

GET

```text
/api/weather
```

Returns:

* Temperature
* Humidity
* Wind Speed
* Cloud Cover
* Source Information

### Holiday Data

GET

```text
/api/holidays
```

Returns:

* Holiday name
* Date
* Holiday type

---

## Frontend Dashboard Features

The dashboard includes:

### Forecast Visualization

* Interactive demand forecasting chart
* 24-hour demand outlook

### Weather Monitoring

* Temperature
* Humidity
* Wind Speed
* Cloud Cover

### Holiday Information

* Localized holiday calendar
* Holiday classification

### KPI Summary Cards

* Forecast Blocks
* Average Demand
* Peak Demand

---

## Project Structure

```text
project/
│
├── frontend/
│   ├── src/
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── ml/
│   ├── artifacts/
│   ├── train_model.py
│   ├── forecast_service.py
│   └── requirements.txt
│
├── data/
│   ├── Utility_consumption.csv
│   └── holidays_dhanbad.csv
│
├── Dockerfile
├── .dockerignore
└── README.md
```

---

## Running Locally

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Model Training

```bash
cd ml
python train_model.py
```

---

## Docker Deployment

### Build Docker Image

```bash
docker build -t power-demand .
```

### Run Docker Container

```bash
docker run -p 5000:5000 power-demand
```

If port 5000 is already occupied:

```bash
docker run -p 5001:5000 power-demand
```

### Health Check

```text
http://localhost:5000/api/health
```

or

```text
http://localhost:5001/api/health
```

---

## Future Improvements

* Integration of weather forecast APIs directly into forecasting pipeline
* Advanced models such as XGBoost and LSTM
* Confidence intervals for forecasts
* Real-time streaming predictions
* Multi-feeder forecasting support
* Cloud deployment

---


