import json
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
from suburbs import suburbs

# API config
url = "https://m42dj4mgj8.execute-api.ap-southeast-2.amazonaws.com/prod/livability_score"
headers = {
    "x-api-key": "8w5zMBWt4B1ETab1N3OBO1XurINGFuO01X483Kdc",
    "Content-Type": "application/json"
}
weights = {
    "crime": 1,
    "weather": 1,
    "publicTransportation": 1,
    "familyDemographics": 1
}

# Function to fetch livability score
def fetch_score(suburb):
    payload = {
        "address": suburb,
        "weights": weights
    }
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        response.raise_for_status()
        return suburb, response.json()
    except Exception as e:
        print(f"Error for {suburb}: {e}")
        return suburb, None

# Use ThreadPoolExecutor to run requests concurrently
results = {}
max_workers = min(10, len(suburbs))  # Tune this based on your needs

with ThreadPoolExecutor(max_workers=max_workers) as executor:
    future_to_suburb = {executor.submit(fetch_score, suburb): suburb for suburb in suburbs}
    for future in as_completed(future_to_suburb):
        suburb, result = future.result()
        if result is not None:
            results[suburb] = result
            print(f"✓ Saved: {suburb}")
        else:
            print(f"✗ Skipped: {suburb}")

# Save only successful responses
with open("suburb_liveability.json", "w") as f:
    json.dump(results, f, indent=2)

print("Completed. Successful results saved to suburb_liveability.json")