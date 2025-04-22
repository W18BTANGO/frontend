export const initialSuburb = {
    name: "BALLINA",
    risks: {
        "Coastal Inundation": 22.8,
        "Extreme Wind": 0,
        "Forest Fire": 0,
        "Riverine Flooding": 98.9,
        "Surface Water Flooding": 5.4,
        "Tropical Cyclone Wind": 0
    },
    total: 99.0,
    matchedRisk: "Riverine Flooding",
    MVAR: 99.0,
    c: 301
}

// Fake data for vulnerable suburbs with added risk information - memoize to prevent rerenders
export const initialVulnerableSuburbs = [
    { suburb: "BALLINA", properties: 8824, percentage: 99, risk: "Riverine Flooding" },
    { suburb: "TWEED HEADS SOUTH", properties: 5280, percentage: 82.5, risk: "Riverine Flooding" },
    { suburb: "TWEED HEADS", properties: 3602, percentage: 46.2, risk: "Riverine Flooding" },
    { suburb: "YAMBA", properties: 3377, percentage: 58.7, risk: "Riverine Flooding" },
    { suburb: "TWEED HEADS WEST", properties: 2585, percentage: 71.5, risk: "Riverine Flooding" },
    { suburb: "WYOMING", properties: 2334, percentage: 42.9, risk: "Forest Fire" },
    { suburb: "PARRAMATTA", properties: 2322, percentage: 10.2, risk: "Surface Flooding" },
    { suburb: "LISMORE", properties: 2053, percentage: 57.7, risk: "Riverine Flooding" },
    { suburb: "LIVERPOOL", properties: 1990, percentage: 10.4, risk: "Riverine Flooding" },
    { suburb: "WEST BALLINA", properties: 1953, percentage: 93.6, risk: "Riverine Flooding" }
];