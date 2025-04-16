import os
import requests
import urllib.parse

from suburbs import suburbs

# Directory to save the data
output_dir = "suburb_data"
os.makedirs(output_dir, exist_ok=True)

# Base URL pattern
base_url = "https://www.abc.net.au/dat/news/interactives" \
    "/dsi-data/2025-insurance-risk/sal-lookups-v2/{}.json"

# Loop through each suburb
"""
for suburb in suburbs:
    encoded_suburb = urllib.parse.quote(suburb)
    url = base_url.format(encoded_suburb)
    try:
        response = requests.get(url)
        response.raise_for_status()
        filename = os.path.join(output_dir, f"{suburb.replace('/', '-')}.json")
        with open(filename, "w", encoding="utf-8") as f:
            f.write(response.text)
        print(f"Saved: {filename}")
    except requests.HTTPError as e:
        print(f"Failed to fetch data for {suburb}: {e}")
"""

# Count the number of files in the output directory
file_count = len([name for name in os.listdir(output_dir) if os.path.isfile(os.path.join(output_dir, name))])
print(f"Number of files in '{output_dir}': {file_count}")
# Count the number of entries in the suburbs list
suburb_count = len(suburbs)
print(f"Number of entries in 'suburbs': {suburb_count}")