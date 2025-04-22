export const initialSuburb = {
    name: "Ballina",
    risks: {
        "Coastal Inundation": 72,
        "Extreme Wind": 45,
        "Forest Fire": 38,
        "Riverine Flooding": 89,
        "Surface Water Flooding": 65,
        "Tropical Cyclone Wind": 51
    },
    total: 68, // Adding a total risk score
    matchedRisk: "Riverine Flooding", // Adding matched risk for Ballina
    MVAR: 0.1196,
    c: 301
}

// Fake data for vulnerable suburbs with added risk information - memoize to prevent rerenders
export const initialVulnerableSuburbs = [
    { suburb: "Ballina", properties: 8824, percentage: 99, risk: "Riverine Flooding" },
    { suburb: "Tweed Heads South", properties: 5280, percentage: 82.5, risk: "Riverine Flooding" },
    { suburb: "Tweed Heads", properties: 3602, percentage: 46.2, risk: "Riverine Flooding" },
    { suburb: "Yamba", properties: 3377, percentage: 58.7, risk: "Riverine Flooding" },
    { suburb: "Tweed Heads West", properties: 2585, percentage: 71.5, risk: "Riverine Flooding" },
    { suburb: "Wyoming", properties: 2334, percentage: 42.9, risk: "Forest Fire" },
    { suburb: "Parramatta", properties: 2322, percentage: 10.2, risk: "Surface Flooding" },
    { suburb: "Lismore", properties: 2053, percentage: 57.7, risk: "Riverine Flooding" },
    { suburb: "Liverpool", properties: 1990, percentage: 10.4, risk: "Riverine Flooding" },
    { suburb: "West Ballina", properties: 1953, percentage: 93.6, risk: "Riverine Flooding" }
];