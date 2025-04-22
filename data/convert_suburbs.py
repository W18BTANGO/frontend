import json
from suburbs import suburbs

# Format suburbs as a list of objects
suburb_data = [{"name": suburb} for suburb in suburbs]

# Write to JSON file
with open('../public/suburbs.json', 'w') as f:
    json.dump(suburb_data, f)

print(f"Successfully converted {len(suburbs)} suburbs to JSON") 