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
 * Fetches and filters data by both event type and attribute "a" loosely matching a specific suburb name.
 * @param {string} emissionsScenario - The emissions scenario/event type to filter by.
 * @param {string} suburbName - The suburb name to filter by.
 * @returns {Promise<Array>} - A promise that resolves to the filtered data array.
 */
export const getDataByEventTypeAndSuburb = async (emissionsScenario, suburbName) => {
    console.log("Fetching data for emissions scenario:", emissionsScenario, "and suburb:", suburbName);
    
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
    
    // Create a regex pattern that matches either:
    // 1. The exact suburb name (case insensitive)
    // 2. The suburb name followed by parentheses that contain a state abbreviation (with any other text)
    const stateAbbreviations = ['NSW', 'Vic\\.', 'Qld', 'SA', 'WA', 'NT', 'Tas\\.'];
    const statePattern = `(${stateAbbreviations.join('|')})`;
    const exactSuburbPattern = `^${suburbName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`;
    
    // Updated pattern that allows any text before the state abbreviation in parentheses
    const suburbWithStatePattern = `^${suburbName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\(.*${statePattern}.*\\)$`;
    
    const suburbRegex = new RegExp(`${exactSuburbPattern}|${suburbWithStatePattern}`, 'i');
    
    console.log("Using regex for suburb matching:", suburbRegex);
    
    const filteredResults = data.filter(item => {
        const matchesEventType = item.event_type === eventType;
        
        // Use regex to match suburb name exactly or with state
        const matchesSuburb = suburbRegex.test(item.attributes.a);
        
        return matchesEventType && matchesSuburb;
    });
    
    console.log(`Found ${filteredResults.length} items matching event type ${eventType} and suburb ${suburbName}`);
    return filteredResults;
};

