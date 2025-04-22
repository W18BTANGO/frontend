import json
from collections import defaultdict
from datetime import datetime
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import make_pipeline

# Load event data from JSON file
with open("top_100_suburbs.json", "r") as f:
    data = json.load(f)

# Target prediction years
prediction_years = list(range(2025, 2151))

# Map suburb name to (year, Total MVAR)
suburb_mvar_history = defaultdict(list)

for group_key, events in data.items():
    try:
        year = int(group_key.split("_")[-1])  # Extract year from key
        for event in events:
            suburb = event["attributes"]["a"]
            mvar = event["attributes"].get("Total MVAR")
            if mvar is not None:
                suburb_mvar_history[suburb].append((year, mvar))
    except Exception:
        continue

# Predict MVAR using polynomial regression
predictions = {}

for suburb, history in suburb_mvar_history.items():
    if len(history) < 2:
        continue  # Need at least 2 data points to fit a curve

    # Prepare training data
    years = np.array([year for year, _ in history]).reshape(-1, 1)
    values = np.array([mvar for _, mvar in history])
    
    # Create and fit a polynomial model (degree 2)
    poly_model = make_pipeline(PolynomialFeatures(degree=2), LinearRegression())
    poly_model.fit(years, values)
    
    # Predict future values and clip to [0, 1]
    future_years = np.array(prediction_years).reshape(-1, 1)
    predicted_mvars = np.clip(poly_model.predict(future_years), 0, 1)
    
    # Store rounded predictions
    predictions[suburb] = {
        str(year): round(float(mvar), 4)
        for year, mvar in zip(prediction_years, predicted_mvars)
    }

# Write predictions to file
with open("mvar_predictions_100.json", "w") as f:
    json.dump(predictions, f, indent=2)

print("Polynomial MVAR predictions saved to 'mvar_predictions_100.json'")
