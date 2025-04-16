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


import os
import boto3
from botocore.exceptions import ClientError
import json
import logging
from botocore.config import Config

# Configure logging
logging.basicConfig(level=logging.INFO)

# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb', region_name='ap-southeast-2',
                          config=Config(retries={'max_attempts': 10, 'mode': 'standard'}))

# Initialize the table
table_name = 'suburb_data'
table = dynamodb.Table(table_name)

# Function to write data to DynamoDB
def write_to_dynamodb(directory):
    for filename in os.listdir(directory):
        if filename.endswith(".json"):
            file_path = os.path.join(directory, filename)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    # Prepare the item for DynamoDB
                    item = {
                        'suburb': filename.replace('.json', ''),  # Use filename (without extension) as the key
                        'bbox': data.get('bbox', []),  # Bounding box coordinates
                        'population': data.get('c', None),  # Population (key 'c')
                        'risk_data': {  # Group risk-related fields
                            '2025': {
                                'Coastal Inundation': data.get('26_2025_Coastal Inundation', 0),
                                'Extreme Wind': data.get('26_2025_Extreme Wind', 0),
                                'Forest Fire': data.get('26_2025_Forest Fire', 0),
                                'Riverine Flooding': data.get('26_2025_Riverine Flooding', 0),
                                'Surface Water Flooding': data.get('26_2025_Surface Water Flooding', 0),
                                'Tropical Cyclone Wind': data.get('26_2025_Tropical Cyclone Wind', 0),
                                'Total MVAR': data.get('26_2025_Total MVAR', 0),
                            },
                            '2050': {
                                'Coastal Inundation': data.get('26_2050_Coastal Inundation', 0),
                                'Extreme Wind': data.get('26_2050_Extreme Wind', 0),
                                'Forest Fire': data.get('26_2050_Forest Fire', 0),
                                'Riverine Flooding': data.get('26_2050_Riverine Flooding', 0),
                                'Surface Water Flooding': data.get('26_2050_Surface Water Flooding', 0),
                                'Tropical Cyclone Wind': data.get('26_2050_Tropical Cyclone Wind', 0),
                                'Total MVAR': data.get('26_2050_Total MVAR', 0),
                            },
                            '2100': {
                                'Coastal Inundation': data.get('26_2100_Coastal Inundation', 0),
                                'Extreme Wind': data.get('26_2100_Extreme Wind', 0),
                                'Forest Fire': data.get('26_2100_Forest Fire', 0),
                                'Riverine Flooding': data.get('26_2100_Riverine Flooding', 0),
                                'Surface Water Flooding': data.get('26_2100_Surface Water Flooding', 0),
                                'Tropical Cyclone Wind': data.get('26_2100_Tropical Cyclone Wind', 0),
                                'Total MVAR': data.get('26_2100_Total MVAR', 0),
                            },
                        },
                        'climate_scenarios': {  # Group climate scenario data
                            'RCP4.5': {
                                '2025': data.get('45_2025_Total MVAR', 0),
                                '2050': data.get('45_2050_Total MVAR', 0),
                                '2100': data.get('45_2100_Total MVAR', 0),
                            },
                            'RCP8.5': {
                                '2025': data.get('85_2025_Total MVAR', 0),
                                '2050': data.get('85_2050_Total MVAR', 0),
                                '2100': data.get('85_2100_Total MVAR', 0),
                            },
                        }
                    }
                    table.put_item(Item=item)
                    logging.info(f"Successfully wrote data for {item['suburb']} to DynamoDB.")
            except ClientError as e:
                logging.error(f"Failed to write data for {filename}: {e.response['Error']['Message']}")
            except Exception as e:
                logging.error(f"An error occurred while processing {filename}: {str(e)}")

# Directory containing JSON files
json_directory = "suburb_data"
# Write all JSON files in the directory to DynamoDB
write_to_dynamodb(json_directory)