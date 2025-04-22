import json
from collections import defaultdict
from datetime import datetime

# Load data
with open("structured_data.json", "r") as f:
    events = json.load(f)

# Define the event types and years of interest
event_types = ["low_emissions_impact", "medium_emissions_impact", "high_emissions_impact"]
target_years = [2025, 2050, 2100]

# Group events by (event_type, year)
grouped = defaultdict(list)
for event in events:
    try:
        event_type = event["event_type"]
        timestamp = event["time_object"]["timestamp"]
        year = datetime.fromisoformat(timestamp.replace("Z", "+00:00")).year
        if event_type in event_types and year in target_years:
            grouped[(event_type, year)].append(event)
    except (KeyError, ValueError):
        continue

# Collect top 100 full events by "impact_score" (MVAR * c)
results = {}

for event_type in event_types:
    for year in target_years:
        key = (event_type, year)
        group_name = f"{event_type}_{year}"

        events_group = grouped.get(key, [])
        # Filter valid events with required attributes
        valid_events = [
            e for e in events_group
            if "attributes" in e and
               "a" in e["attributes"] and
               "Total MVAR" in e["attributes"] and
               "c" in e["attributes"]
        ]

        # Sort by impact score: Total MVAR * population (c)
        sorted_group = sorted(
            valid_events,
            key=lambda e: float(e["attributes"]["Total MVAR"]) * int(e["attributes"]["c"]),
            reverse=True
        )

        top_events = sorted_group[:100]
        results[group_name] = top_events

# Save to file
with open("top_100_suburbs.json", "w") as out_file:
    json.dump(results, out_file, indent=2)

print("Top 100 events by impact score saved to 'top_100_suburbs.json'")