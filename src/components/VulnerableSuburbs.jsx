"use client"

import { useState, useEffect } from "react"

export default function VulnerableSuburbs({ selectedYear }) {
    const [suburbs, setSuburbs] = useState([]);
    const [totalProperties, setTotalProperties] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [allData, setAllData] = useState(null);

    // Fetch the entire dataset once
    useEffect(() => {
        console.log("Fetching entire dataset");
        setIsLoading(true);
        
        fetch('/mvar_predictions_100.json')
            .then(response => response.json())
            .then(data => {
                console.log("Dataset loaded, years available:", Object.keys(data));
                setAllData(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error loading vulnerable suburbs data:', error);
                setIsLoading(false);
            });
    }, []); // Only run on initial mount

    // Update the display when either the dataset or selectedYear changes
    useEffect(() => {
        console.log("Updating display for year:", selectedYear);
        
        if (!allData) {
            console.log("No data available yet");
            return;
        }
        
        const yearStr = selectedYear.toString();
        const yearData = allData[yearStr] || [];
        console.log(`Found ${yearData.length} suburbs for year ${yearStr}`);
        
        setSuburbs(yearData);
        
        // Calculate total properties at risk
        const totalPropertiesAtRisk = yearData.reduce((sum, suburb) => sum + suburb.impact, 0);
        setTotalProperties(Math.round(totalPropertiesAtRisk));
        
    }, [allData, selectedYear]);

    if (isLoading) {
        return <div className="bg-white rounded-lg shadow p-4">Loading vulnerable suburbs data...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-lg">The suburbs most vulnerable to climate risk</h2>
                <p className="text-sm text-gray-500">In Australia, {totalProperties.toLocaleString()} properties are at High Risk in {selectedYear}</p>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Suburb
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                No. properties at High Risk
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                % of suburb
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Largest Risk
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {suburbs.map((suburb, index) => (
                            <tr key={`${suburb.suburb}-${index}`} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {suburb.suburb}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <div className="h-2 bg-gray-500 mr-2" style={{ width: `${Math.min(suburb.impact / 100, 150)}px` }}></div>
                                        {Math.round(suburb.impact).toLocaleString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {(suburb.mvar * 100).toFixed(1)}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`px-2 py-1 rounded text-white ${
                                        suburb.biggest_risk.type === "Riverine Flooding" ? "bg-blue-600" : 
                                        suburb.biggest_risk.type === "Forest Fire" ? "bg-red-700" : 
                                        suburb.biggest_risk.type === "Surface Water Flooding" ? "bg-purple-600" : 
                                        suburb.biggest_risk.type === "Coastal Inundation" ? "bg-yellow-600" : "bg-gray-600"
                                    }`}>
                                        {suburb.biggest_risk.type}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
} 