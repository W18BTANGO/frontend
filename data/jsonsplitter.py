import json

def convert_to_event_structure(data):
    scenarios = {
        "26": "low_emissions_impact",
        "45": "medium_emissions_impact",
        "85": "high_emissions_impact"
    }

    years = ["2025", "2050", "2100"]
    hazards = [
        "Coastal Inundation",
        "Extreme Wind",
        "Forest Fire",
        "Riverine Flooding",
        "Surface Water Flooding",
        "Tropical Cyclone Wind",
        "Total MVAR"
    ]

    events = []

    for item in data:
        for scen_key, event_type in scenarios.items():
            for year in years:
                timestamp = f"{year}-01-01T12:00:00Z"
                prefix = f"{scen_key}_{year}_"
                attributes = {
                    "a": item.get("a"),
                    "bbox": item.get("bbox"),
                }
                if "c" in item:
                    attributes["c"] = item["c"]

                # Add hazards without prefixes in the output keys
                for hazard in hazards:
                    full_key = f"{prefix}{hazard}"
                    if full_key in item:
                        attributes[hazard] = item[full_key]  # <-- use unprefixed key

                event = {
                    "time_object": {
                        "timestamp": timestamp,
                        "duration": "00:00:00",
                        "time-zone": "UTC"
                    },
                    "event_type": event_type,
                    "attributes": attributes
                }

                events.append(event)

    return events


# Example usage:
if __name__ == "__main__":
    # Replace this with loading from a file if necessary
    with open("combined_suburb_data.json", "r") as f:
        input_data = json.load(f)

    structured_events = convert_to_event_structure(input_data)

    # Output result to a file or print
    with open("structured_data.json", "w") as out_f:
        json.dump(structured_events, out_f, indent=4)

    print(f"Converted {len(input_data)} input entries into {len(structured_events)} events.")