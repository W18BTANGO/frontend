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
 * @param {string} eventType - The event type to filter by.
 * @param {string} suburbName - The suburb name to filter by.
 * @returns {Promise<Array>} - A promise that resolves to the filtered data array.
 */
export const getDataByEventTypeAndSuburb = async (eventType, suburbName) => {
    console.log("Fetching data for event type:", eventType, "and suburb:", suburbName);
    const data = await fetchData();
    return data.filter(item => (
        item.event_type === eventType &&
        item.attributes.a.toLowerCase().includes(suburbName.toLowerCase())
    ));
};

