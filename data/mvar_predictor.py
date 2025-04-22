import json
from collections import defaultdict
from datetime import datetime
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import make_pipeline

# Load event data
with open("top_100_suburbs.json", "r") as f:
    data = json.load(f)

# Define years to predict for
prediction_years = list(range(2025, 2151))

# Store historical MVARs per (suburb, scenario)
suburb_data = defaultdict(lambda: defaultdict(list))
population_lookup = defaultdict(dict)

# Parse historical data
for group_key, events in data.items():
    try:
        parts = group_key.split("_")
        scenario = parts[0]  # low, medium, high
        year = int(parts[-1])
        for event in events:
            attr = event["attributes"]
            suburb = attr["a"]
            mvar = attr.get("Total MVAR")
            pop = int(attr.get("c", 0))
            if mvar is not None:
                suburb_data[suburb][scenario].append((year, mvar))
                population_lookup[suburb][scenario] = pop
    except Exception:
        continue

# Predict MVARs using polynomial regression
final_predictions = {}

for suburb, scenario_histories in suburb_data.items():
    final_predictions[suburb] = {}
    for scenario, history in scenario_histories.items():
        if len(history) < 2:
            continue  # not enough data to fit curve

        # Extract years and MVAR values
        years = np.array([year for year, _ in history]).reshape(-1, 1)
        values = np.array([mvar for _, mvar in history])

        # Fit a polynomial model (degree 2)
        model = make_pipeline(PolynomialFeatures(degree=2), LinearRegression())
        model.fit(years, values)

        # Predict MVARs for all future years
        future_years = np.array(prediction_years).reshape(-1, 1)
        predictions = np.clip(model.predict(future_years), 0, 1)

        final_predictions[suburb][scenario] = {
            "population": population_lookup[suburb][scenario],
            "predictions": {
                str(year): round(float(pred), 4)
                for year, pred in zip(prediction_years, predictions)
            }
        }

# Write to output file
with open("mvar_predictions_100.json", "w") as f:
    json.dump(final_predictions, f, indent=2)

print("MVAR predictions saved to 'mvar_predictions_100.json'")