"use client"

import { useState, useCallback, useEffect } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import TimelineSlider from "@/components/TimelineSlider"
import RiskMap from "@/components/RiskMap"
import SuburbInfo from "@/components/SuburbInfo"
import VulnerableSuburbs from "@/components/VulnerableSuburbs"
import { initialSuburb } from '@/lib/initialValues'
import { getDataByEventTypeAndSuburb } from '@/lib/preprocessing';
import { interpolateRisks } from '@/lib/analytics';



export default function Dashboard() {
    const [selectedYear, setSelectedYear] = useState(2025)
    const [emissionsScenario, setEmissionsScenario] = useState("medium_emissions_impact")
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [allSuburbs, setAllSuburbs] = useState([])
    const [selectedSuburb, setSelectedSuburb] = useState(initialSuburb)

    // Add effect to log when selectedYear changes
    useEffect(() => {
        console.log("Dashboard - selectedYear changed to:", selectedYear);
    }, [selectedYear]);

    // Custom year setter to ensure the value is properly updated and logged
    const handleYearChange = useCallback((year) => {
        console.log("Setting new year:", year);
        setSelectedYear(year);
    }, []);

    // Load all suburbs data
    useEffect(() => {
        fetch('/suburbs.json')
            .then(response => response.json())
            .then(data => {
                setAllSuburbs(data);
            })
            .catch(error => {
                console.error('Error loading suburbs data:', error);
            });
    }, []);

    const handleSuburbSelect = useCallback(async (suburbName) => {
        const suburbToUse = typeof suburbName === 'string' ? suburbName : selectedSuburb.name;
        console.log('Current emissions scenario:', emissionsScenario);
        const filteredData = await getDataByEventTypeAndSuburb(emissionsScenario, suburbToUse);
        console.log('Filtered Data:', filteredData);
        console.log('Suburb Name:', suburbToUse);

        if (filteredData.length > 0) {
            // Parse the selected year
            const targetYear = selectedYear;

            // Extract the years and their corresponding data
            const yearData = filteredData.map(item => ({
                year: new Date(item.time_object.timestamp).getUTCFullYear(),
                attributes: item.attributes,
            }));

            // Sort the data by year (just in case it's not sorted)
            yearData.sort((a, b) => a.year - b.year);

            // Interpolate the risks for the target year
            const interpolatedRisks = interpolateRisks(yearData, targetYear);
            console.log('Interpolated Risks:', interpolatedRisks);
            
            // Find the highest risk, excluding "Total MVAR"
            const matchedRisk = Object.entries(interpolatedRisks)
                .filter(([name]) => name !== "Total MVAR") // Exclude Total MVAR
                .reduce((highest, [name, value]) =>
                    value > (highest.value || 0) ? { name, value } : highest, {}).name || "Unknown";

            // Update the selected suburb state
            setSelectedSuburb({
                name: suburbToUse,
                risks: interpolatedRisks,
                matchedRisk: matchedRisk,
                MVAR: interpolatedRisks["Total MVAR"],
                c: interpolatedRisks.c,
            });
        } else {
            console.log('No data found for the selected suburb.');
        }
    }, [selectedYear, emissionsScenario, selectedSuburb.name]);

    useEffect(() => {
        if (selectedSuburb.name) {
            handleSuburbSelect(selectedSuburb.name);
        }
    }, [selectedYear, emissionsScenario, handleSuburbSelect]);

    // Handle search functionality
    useEffect(() => {
        if (searchQuery.trim().length > 1 && allSuburbs.length > 0) {
            const lowerQuery = searchQuery.toLowerCase();
            
            // Search directly in all suburbs without prioritizing vulnerable suburbs
            const matches = allSuburbs
                .filter(s => s.name.toLowerCase().includes(lowerQuery))
                .slice(0, 5)
                .map(s => ({ suburb: s.name }));
                
            setSearchResults(matches);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery, allSuburbs]);

    // Handle suburb selection from search
    const handleSearchSelect = (suburb) => {
        handleSuburbSelect(suburb.suburb);
        setSearchQuery("");
        setSearchResults([]);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />

            <TimelineSlider 
                selectedYear={selectedYear} 
                setSelectedYear={handleYearChange} 
            />

            <main className="flex-1 p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Top Section: Map and Suburb Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:min-h-[580px]">
                        <div className="md:col-span-2 h-full">
                            <RiskMap
                                onSuburbSelect={handleSuburbSelect}
                                emissionsScenario={emissionsScenario}
                                setEmissionsScenario={setEmissionsScenario}
                            />
                        </div>
                        <div className="flex flex-col space-y-4">
                            {/* Search feature */}
                            <div className="bg-white rounded-lg shadow p-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search for a suburb..."
                                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />

                                    {searchResults.length > 0 && (
                                        <div className="absolute left-0 right-0 bg-white border border-gray-300 rounded-md mt-1 shadow-lg z-10">
                                            {searchResults.map((result, index) => (
                                                <div
                                                    key={`${result.suburb}-${index}`}
                                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleSearchSelect(result)}
                                                >
                                                    {result.suburb}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Suburb Info */}
                            <SuburbInfo suburb={selectedSuburb} selectedYear={selectedYear} />
                        </div>
                    </div>

                    {/* Bottom Section: Vulnerable Suburbs Rankings */}
                    <VulnerableSuburbs selectedYear={selectedYear} />
                </div>
            </main>

            <Footer />
        </div>
    )
}
