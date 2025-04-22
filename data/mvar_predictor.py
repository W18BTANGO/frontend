import json
from collections import defaultdict
from datetime import datetime
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import make_pipeline

# Load medium-emission event data
with open("top_100_suburbs.json", "r") as f:
    data = json.load(f)

# Prediction years
prediction_years = list(range(2025, 2151))

# Data structures
suburb_data = defaultdict(list)
population_lookup = {}
risk_factors_lookup = defaultdict(lambda: defaultdict(float))

# Parse historical data
for group_key, events in data.items():
    try:
        parts = group_key.split("_")
        scenario = parts[0]
        if scenario != "medium":
            continue

        year = int(parts[-1])
        for event in events:
            attr = event["attributes"]
            suburb = attr["a"]
            mvar = attr.get("Total MVAR")
            pop = int(attr.get("c", 0))

            if mvar is not None:
                suburb_data[suburb].append((year, mvar))
                population_lookup[suburb] = pop

                # Track max risk factor per suburb
                for k, v in attr.items():
                    if k not in {"Total MVAR", "a", "c"} and isinstance(v, (int, float)):
                        if v > risk_factors_lookup[suburb][k]:
                            risk_factors_lookup[suburb][k] = v
    except Exception:
        continue

# Store results by year
predictions_by_year = defaultdict(list)

for suburb, history in suburb_data.items():
    if len(history) < 2:
        continue

    years = np.array([y for y, _ in history]).reshape(-1, 1)
    mvars = np.array([m for _, m in history])

    model = make_pipeline(PolynomialFeatures(degree=2), LinearRegression())
    model.fit(years, mvars)

    future_years = np.array(prediction_years).reshape(-1, 1)
    predicted_mvars = np.clip(model.predict(future_years), 0, 1)

    population = population_lookup[suburb]
    risk_factors = risk_factors_lookup[suburb]
    if risk_factors:
        biggest_risk_type, biggest_risk_value = max(risk_factors.items(), key=lambda x: x[1])
        biggest_risk_value = round(biggest_risk_value, 4)
    else:
        biggest_risk_type = "Unknown"
        biggest_risk_value = None

    for year, mvar in zip(prediction_years, predicted_mvars):
        impact = mvar * population
        predictions_by_year[year].append({
            "suburb": suburb,
            "mvar": round(float(mvar), 4),
            "population": population,
            "impact": round(impact, 2),
            "biggest_risk": {
                "type": biggest_risk_type,
                "value": biggest_risk_value
            }
        })

# Keep top 100 suburbs by impact per year
output = {}
for year in prediction_years:
    sorted_suburbs = sorted(predictions_by_year[year], key=lambda x: x["impact"], reverse=True)
    output[str(year)] = sorted_suburbs[:100]

# Save to file
with open("mvar_predictions_100.json", "w") as f:
    json.dump(output, f, indent=2)

print("Saved top 100 suburbs by year with biggest risk to 'mvar_predictions_100.json'")