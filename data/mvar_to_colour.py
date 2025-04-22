import json
from datetime import datetime

# Define MVAR to color mapping
def mvar_to_color(mvar):
    if mvar < 0.2:
        return "rgba(255, 255, 255, 0.5)"
    elif mvar < 0.4:
        return "rgba(255, 220, 220, 0.5)"
    elif mvar < 0.6:
        return "rgba(255, 170, 170, 0.5)"
    elif mvar < 0.8:
        return "rgba(255, 100, 100, 0.5)"
    else:
        return "rgba(180, 0, 0, 0.7)"

# Years we care about
target_years = {"2025", "2050", "2100"}

# Load structured data
with open("structured_data.json", "r") as f:
    records = json.load(f)

# Process events
result = {year: {} for year in target_years}

for record in records:
    try:
        if record.get("event_type") != "medium_emissions_impact":
            continue

        timestamp = record["time_object"]["timestamp"]
        year = datetime.fromisoformat(timestamp.replace("Z", "+00:00")).year
        if str(year) not in target_years:
            continue

        attr = record["attributes"]
        suburb = attr["a"]
        mvar = attr.get("Total MVAR", 0)
        color = mvar_to_color(float(mvar))

        result[str(year)][suburb] = color
    except Exception:
        continue

# Write to output
with open("map_colours.json", "w") as f:
    json.dump(result, f, indent=2)

print("Saved suburb MVAR colors by year to 'map_colours.json'")