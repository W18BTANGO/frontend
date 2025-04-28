/**
 * Interpolates risk values for a specific year based on known data points.
 * @param {Array} yearData - Array of objects containing year and attributes.
 * @param {number} targetYear - The year to interpolate for.
 * @returns {Object} - Interpolated risk values with 1 decimal place precision.
 */
export function interpolateRisks(yearData, targetYear) {
    const risks = Object.keys(yearData[0].attributes).filter(key => key !== "a" && key !== "bbox" && key !== "c");

    const interpolated = {};

    risks.forEach(risk => {
        // Find the two closest years for interpolation
        let lower = null;
        let upper = null;

        for (let i = 0; i < yearData.length; i++) {
            if (yearData[i].year <= targetYear) lower = yearData[i];
            if (yearData[i].year >= targetYear) {
                upper = yearData[i];
                break;
            }
        }

        // If the target year is outside the range, use the closest known value
        if (!lower) lower = upper;
        if (!upper) upper = lower;

        // Perform linear interpolation
        if (lower.year === upper.year) {
            interpolated[risk] = parseFloat((lower.attributes[risk] * 100).toFixed(1)); // Scale to percentage with 1 decimal
        } else {
            const slope = (upper.attributes[risk] - lower.attributes[risk]) / (upper.year - lower.year);
            const interpolatedValue = lower.attributes[risk] + slope * (targetYear - lower.year);
            interpolated[risk] = parseFloat((interpolatedValue * 100).toFixed(1)); // Scale to percentage with 1 decimal
        }
    });

    return interpolated;
}

const attributes =  [
    "Coastal Inundation",
    "Extreme Wind", 
    "Forest Fire",
    "Riverine Flooding",
    "Surface Water Flooding",
    "Tropical Cyclone Wind",
    "Total MVAR",
    "a",
    "bbox",
    "c"
]

/**
* Fetches predicted risk values for a specific year from our analytics API
* @param {Array} yearData - Array of objects containing year and attributes.
* @param {number} targetYear - The year to predict for.
* @returns {Promise<Object>} - A promise that resolves to the predicted risk values.
*/
export async function fetchPredictedRisks(yearData, targetYear) {
   try {
       // Prepare the request body
       const requestBody = {
           time_point: targetYear,
           value_attributes: attributes, // Assuming attributes are the same structure across yearData
           data: yearData,
       };
       console.log(requestBody)

       // Make the POST request to the prediction endpoint
       const response = await fetch("http://127.0.0.1:8000/predict-attributes-for-time", {
           method: "POST",
           headers: {
               "Content-Type": "application/json",
           },
           body: JSON.stringify(requestBody),
       });

       // Check if the response is successful
       if (!response.ok) {
           throw new Error(`Failed to fetch predicted risks: ${response.statusText}`);
       }

       // Parse and return the JSON response
       const predictedRisks = await response.json();
       return predictedRisks;
   } catch (error) {
       console.error("Error fetching predicted risks:", error);
       return {}; // Return an empty object as a fallback
   }
}