import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split


BASE_DIR = Path(__file__).resolve().parents[1]
DATA_PATH = BASE_DIR / "data" / "Utility_consumption.csv"
MODEL_DIR = BASE_DIR / "ml" / "artifacts"
MODEL_PATH = MODEL_DIR / "model.pkl"
METRICS_PATH = MODEL_DIR / "metrics.json"
HOLIDAY_PATH = BASE_DIR / "data" / "holidays_dhanbad.csv"


def load_data():
    df = pd.read_csv(DATA_PATH)

    df["Datetime"] = pd.to_datetime(df["Datetime"], dayfirst=True, errors="coerce")
    df = df.dropna(subset=["Datetime"])
    df = df.sort_values("Datetime")

    return df


def clean_data(df):
    power_columns = [
        "F1_132KV_PowerConsumption",
        "F2_132KV_PowerConsumption",
        "F3_132KV_PowerConsumption",
    ]

    for col in power_columns:
        df[col] = pd.to_numeric(df[col], errors="coerce")
        df.loc[df[col] <= 0, col] = np.nan
        df[col] = df[col].interpolate(method="linear")
        df[col] = df[col].bfill().ffill()

        q1 = df[col].quantile(0.25)
        q3 = df[col].quantile(0.75)
        iqr = q3 - q1

        lower_limit = max(0, q1 - 1.5 * iqr)
        upper_limit = q3 + 1.5 * iqr

        df[col] = df[col].clip(lower_limit, upper_limit)

    df["Temperature"] = pd.to_numeric(df["Temperature"], errors="coerce")
    df["Humidity"] = pd.to_numeric(df["Humidity"], errors="coerce")
    df["WindSpeed"] = pd.to_numeric(df["WindSpeed"], errors="coerce")

    df["Temperature"] = df["Temperature"].interpolate().bfill().ffill()
    df["Humidity"] = df["Humidity"].interpolate().bfill().ffill()
    df["WindSpeed"] = df["WindSpeed"].interpolate().bfill().ffill()

    df["TotalPowerConsumption"] = df[power_columns].sum(axis=1)

    return df


def create_features(df):
    df["hour"] = df["Datetime"].dt.hour
    df["minute"] = df["Datetime"].dt.minute
    df["day_of_week"] = df["Datetime"].dt.dayofweek
    df["month"] = df["Datetime"].dt.month
    df["day_of_year"] = df["Datetime"].dt.dayofyear

    df["block"] = df["hour"] * 6 + (df["minute"] // 10)
    df["is_weekend"] = df["day_of_week"].isin([5, 6]).astype(int)

    holidays = pd.read_csv(HOLIDAY_PATH)
    holidays["date"] = pd.to_datetime(holidays["date"], errors="coerce").dt.date
    holiday_dates = set(holidays["date"])

    df["date"] = df["Datetime"].dt.date
    df["is_holiday"] = df["date"].isin(holiday_dates).astype(int)


    df["sin_block"] = np.sin(2 * np.pi * df["block"] / 144)
    df["cos_block"] = np.cos(2 * np.pi * df["block"] / 144)

    df["lag_1"] = df["TotalPowerConsumption"].shift(1)
    df["lag_6"] = df["TotalPowerConsumption"].shift(6)
    df["lag_144"] = df["TotalPowerConsumption"].shift(144)

    df["rolling_6_mean"] = df["TotalPowerConsumption"].shift(1).rolling(6).mean()
    df["rolling_144_mean"] = df["TotalPowerConsumption"].shift(1).rolling(144).mean()

    df = df.dropna()

    return df


def train_model():
    df = load_data()
    df = clean_data(df)
    df = create_features(df)

    feature_columns = [
    "Temperature", "Humidity", "WindSpeed",
    "hour", "minute", "day_of_week", "month", "day_of_year",
    "block", "is_weekend", "is_holiday", "sin_block", "cos_block",
    "lag_1", "lag_6", "lag_144", "rolling_6_mean", "rolling_144_mean",
]

    X = df[feature_columns]
    y = df["TotalPowerConsumption"]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        shuffle=False,
    )

    model = RandomForestRegressor(
        n_estimators=100,
        random_state=42,
        n_jobs=-1,
    )

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    mse = mean_squared_error(y_test, predictions)
    rmse = mse ** 0.5
    mae = mean_absolute_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)

    MODEL_DIR.mkdir(parents=True, exist_ok=True)

    joblib.dump(
        {
            "model": model,
            "feature_columns": feature_columns,
            "last_rows": df.tail(200),
        },
        MODEL_PATH,
    )

    metrics = {
        "rmse": rmse,
        "mae": mae,
        "r2_score": r2,
        "training_rows": len(X_train),
        "testing_rows": len(X_test),
    }

    with open(METRICS_PATH, "w") as file:
        json.dump(metrics, file, indent=4)

    print("Model training completed successfully.")
    print("Model saved at:", MODEL_PATH)
    print("Metrics:")
    print(json.dumps(metrics, indent=4))


if __name__ == "__main__":
    train_model()