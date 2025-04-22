"use client"

import { useState, useCallback, useEffect } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import TimelineSlider from "@/components/TimelineSlider"
import RiskMap from "@/components/RiskMap"
import SuburbInfo from "@/components/SuburbInfo"
import VulnerableSuburbs from "@/components/VulnerableSuburbs"

export default function Dashboard() {
    const [selectedYear, setSelectedYear] = useState(2025)
    const [emissionsScenario, setEmissionsScenario] = useState("High")
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [allSuburbs, setAllSuburbs] = useState([])
    const [selectedSuburb, setSelectedSuburb] = useState({
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
        matchedRisk: "Riverine Flooding" // Adding matched risk for Ballina
    })

    // Fake data for vulnerable suburbs with added risk information
    const vulnerableSuburbs = [
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
    ]

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

    // Handle suburb selection from map
    const handleSuburbSelect = useCallback((suburbName) => {
        // Find if the suburb exists in our vulnerable suburbs list
        const matchedSuburb = vulnerableSuburbs.find(s => s.suburb === suburbName);
        
        // Update the selected suburb with the new name, keeping existing risk data for now
        setSelectedSuburb(prev => ({
            ...prev,
            name: suburbName,
            // Always set a matchedRisk - either from the matched suburb or the highest risk for this suburb
            matchedRisk: matchedSuburb ? matchedSuburb.risk : 
                // Find the highest risk from the risk object
                Object.entries(prev.risks).reduce((highest, [name, value]) => 
                    value > (highest.value || 0) ? {name, value} : highest, {}).name || "Unknown"
        }));
    }, [vulnerableSuburbs]);

    // Handle search functionality
    useEffect(() => {
        if (searchQuery.trim().length > 1) {
            const lowerQuery = searchQuery.toLowerCase();
            
            // First, check vulnerable suburbs (they have risk data)
            let matches = vulnerableSuburbs
                .filter(s => s.suburb.toLowerCase().includes(lowerQuery));
            
            // If we don't have enough matches, add from all suburbs
            if (matches.length < 5 && allSuburbs.length > 0) {
                const additionalMatches = allSuburbs
                    .filter(s => s.name.toLowerCase().includes(lowerQuery))
                    // Exclude those already in matches
                    .filter(s => !matches.some(m => m.suburb === s.name))
                    // Convert to format expected by components
                    .map(s => ({ suburb: s.name }));
                
                matches = [...matches, ...additionalMatches].slice(0, 5);
            }
            
            setSearchResults(matches);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery, vulnerableSuburbs, allSuburbs]);

    // Handle suburb selection from search
    const handleSearchSelect = (suburb) => {
        handleSuburbSelect(suburb.suburb);
        setSearchQuery("");
        setSearchResults([]);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            
            <TimelineSlider selectedYear={selectedYear} setSelectedYear={setSelectedYear} />

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
                    <VulnerableSuburbs suburbs={vulnerableSuburbs} selectedYear={selectedYear} />
                </div>
            </main>
            
            <Footer />
        </div>
    )
}
