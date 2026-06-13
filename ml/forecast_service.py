import json
import sys
from pathlib import Path

import joblib
import numpy as np
import pandas as pd


BASE_DIR = Path(__file__).resolve().parents[1]
DATA_PATH = BASE_DIR / "data" / "Utility_consumption.csv"
MODEL_PATH = BASE_DIR / "ml" / "artifacts" / "model.pkl"
HOLIDAY_PATH = BASE_DIR / "data" / "holidays_dhanbad.csv"


def load_model():
    model_data = joblib.load(MODEL_PATH)
    return model_data["model"], model_data["feature_columns"], model_data["last_rows"]


def create_future_data(last_rows, periods=144):
    last_time = last_rows["Datetime"].max()

    future_times = pd.date_range(
        start=last_time + pd.Timedelta(minutes=10),
        periods=periods,
        freq="10min",
    )

    future_df = pd.DataFrame()
    future_df["Datetime"] = future_times

    future_df["Temperature"] = last_rows["Temperature"].tail(144).mean()
    future_df["Humidity"] = last_rows["Humidity"].tail(144).mean()
    future_df["WindSpeed"] = last_rows["WindSpeed"].tail(144).mean()

    future_df["hour"] = future_df["Datetime"].dt.hour
    future_df["minute"] = future_df["Datetime"].dt.minute
    future_df["day_of_week"] = future_df["Datetime"].dt.dayofweek
    future_df["month"] = future_df["Datetime"].dt.month
    future_df["day_of_year"] = future_df["Datetime"].dt.dayofyear

    future_df["block"] = future_df["hour"] * 6 + (future_df["minute"] // 10)
    future_df["is_weekend"] = future_df["day_of_week"].isin([5, 6]).astype(int)

    holidays = pd.read_csv(HOLIDAY_PATH)
    holidays["date"] = pd.to_datetime(holidays["date"], errors="coerce").dt.date
    holiday_dates = set(holidays["date"])

    future_df["date"] = future_df["Datetime"].dt.date
    future_df["is_holiday"] = future_df["date"].isin(holiday_dates).astype(int)

    future_df["sin_block"] = np.sin(2 * np.pi * future_df["block"] / 144)
    future_df["cos_block"] = np.cos(2 * np.pi * future_df["block"] / 144)

    last_values = last_rows["TotalPowerConsumption"].tolist()

    future_df["lag_1"] = last_values[-1]
    future_df["lag_6"] = last_values[-6]
    future_df["lag_144"] = last_values[-144]

    future_df["rolling_6_mean"] = pd.Series(last_values[-6:]).mean()
    future_df["rolling_144_mean"] = pd.Series(last_values[-144:]).mean()

    return future_df


def make_forecast(periods=144):
    model, feature_columns, last_rows = load_model()

    future_df = create_future_data(last_rows, periods)

    predictions = model.predict(future_df[feature_columns])

    result = []

    for i in range(len(future_df)):
        result.append(
            {
                "timestamp": future_df.iloc[i]["Datetime"].isoformat(),
                "block": int(future_df.iloc[i]["block"]),
                "forecastDemand": round(float(predictions[i]), 2),
                "temperature": round(float(future_df.iloc[i]["Temperature"]), 2),
                "humidity": round(float(future_df.iloc[i]["Humidity"]), 2),
                "windSpeed": round(float(future_df.iloc[i]["WindSpeed"]), 2),
                "isHoliday": bool(future_df.iloc[i]["is_holiday"]),
            }
        )

    return {
        "location": "Dhanbad, Jharkhand",
        "periodMinutes": 10,
        "periods": periods,
        "forecast": result,
    }


if __name__ == "__main__":
    periods = 144

    if len(sys.argv) > 1:
        periods = int(sys.argv[1])

    output = make_forecast(periods)
    print(json.dumps(output))