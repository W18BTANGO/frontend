/**
 * Fetches all data from the structured_data.json file.
 * @returns {Promise<Array>} - A promise that resolves to the data array.
 */
export const fetchData = async () => {
    try {
        const response = await fetch('/structured_data.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
        return []; // Return an empty array as a fallback
    }
};

/**
 * Fetches and filters data by event type, suburb name, and state.
 * @param {string} emissionsScenario - The emissions scenario/event type to filter by.
 * @param {string} suburbName - The suburb name to filter by.
 * @param {string} state - The full state name to filter by (e.g., 'New South Wales', 'Victoria').
 * @returns {Promise<Array>} - A promise that resolves to the filtered data array.
 */
export const getDataByEventTypeAndSuburb = async (emissionsScenario, suburbName, state) => {
    console.log("Fetching data for emissions scenario:", emissionsScenario, "suburb:", suburbName, "state:", state);
    
    // Map UI emissions scenario values to actual event types in the data if needed
    let eventType = emissionsScenario;
    
    // Standardize emissions scenario names (in case the data uses different naming conventions)
    if (emissionsScenario === "low_emissions_impact") {
        eventType = "low_emissions_impact";
    } else if (emissionsScenario === "medium_emissions_impact") {
        eventType = "medium_emissions_impact";
    } else if (emissionsScenario === "high_emissions_impact") {
        eventType = "high_emissions_impact";
    }
    
    console.log("Using event type for filtering:", eventType);
    
    const data = await fetchData();
    
    // Map full state names to abbreviations
    const stateMap = {
        "New South Wales": "NSW",
        "Victoria": "Vic.",
        "Queensland": "Qld",
        "South Australia": "SA",
        "Western Australia": "WA",
        "Northern Territory": "NT",
        "Tasmania": "Tas.",
        "Australian Capital Territory": "ACT"
    };
    
    // Get the correct state abbreviation
    const stateAbbreviation = stateMap[state];
    console.log("Mapped state to abbreviation:", state, "->", stateAbbreviation);
    
    // Keep the list of all state abbreviations for reference
    const stateAbbreviations = ['NSW', 'Vic\\.', 'Qld', 'SA', 'WA', 'NT', 'Tas\\.', 'ACT'];
    
    // Escape any special regex characters in the suburb name
    const escapedSuburbName = suburbName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Create a regex pattern that matches the suburb with the specific state
    const suburbStatePattern = stateAbbreviation
        ? `^${escapedSuburbName}\\s*\\(.*${stateAbbreviation}.*\\)$`
        : `^${escapedSuburbName}$`;
    
    const suburbRegex = new RegExp(suburbStatePattern, 'i');
    
    console.log("Using regex for suburb matching:", suburbRegex);
    
    const filteredResults = data.filter(item => {
        const matchesEventType = item.event_type === eventType;
        const matchesSuburb = suburbRegex.test(item.attributes.a);
        
        return matchesEventType && matchesSuburb;
    });
    
    console.log(`Found ${filteredResults.length} items matching event type ${eventType}, suburb ${suburbName}, and state ${state}`);
    return filteredResults;
};

