import os
import json

# Path to the folder containing the JSON files
suburb_data_folder = '/Users/matthewodea/development/frontend/data/suburb_data'

# List to hold combined data
combined_data = []

# Iterate through each file in the folder
for filename in os.listdir(suburb_data_folder):
    if filename.endswith('.json'):
        file_path = os.path.join(suburb_data_folder, filename)
        with open(file_path, 'r') as file:
            data = json.load(file)
            combined_data.append(data)

# Path to save the combined JSON file
output_file = '/Users/matthewodea/development/frontend/data/combined_suburb_data.json'

# Write the combined data to a new JSON file
with open(output_file, 'w') as outfile:
    json.dump(combined_data, outfile, indent=4)

print(f"Combined JSON saved to {output_file}")