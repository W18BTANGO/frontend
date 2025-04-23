"use client"

import { useRef, useEffect, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

/**
 * Fetches all color data from the map_colours.json file.
 * @returns {Promise<Object>} - A promise that resolves to the colors data object.
 */
const fetchMapColors = async () => {
    try {
        const response = await fetch('/map_colours.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch map colors: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching map colors:", error);
        return {}; // Return an empty object as a fallback
    }
};

export default function RiskMap({ onSuburbSelect, emissionsScenario, setEmissionsScenario }) {
    const mapContainer = useRef(null)
    const map = useRef(null)
    const [loaded, setLoaded] = useState(false)
    const [selectedState, setSelectedState] = useState('nsw')
    const [mapColors, setMapColors] = useState(null)

    // Function to escape regex special characters
    const escapeRegExp = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Function to get color for a suburb
    const getSuburbColor = (suburbName) => {
        if (!mapColors) {
            console.log("Map colors not loaded yet");
            return "rgba(255, 255, 255, 0.5)"; // Default white if data not loaded
        }
        
        // Direct match first (fastest)
        if (mapColors[suburbName]) {
            return mapColors[suburbName];
        }
        
        // Exact matching using regex
        // Escape any special regex characters in the suburb name
        const escapedSuburbName = escapeRegExp(suburbName);
        
        // Create regex patterns 
        // First try exact match
        const exactMatchRegex = new RegExp(`^${escapedSuburbName}$`, 'i');
        
        // Also try with state designation variations
        const stateAbbreviations = ['NSW', 'Vic\\.', 'Qld', 'SA', 'WA', 'NT', 'Tas\\.', 'ACT'];
        const statePatterns = stateAbbreviations.map(abbr => 
            new RegExp(`^${escapedSuburbName}\\s*\\(.*${abbr}.*\\)$`, 'i')
        );
        
        // Clean the suburb name (remove state designations) for simpler matching
        const cleanSuburbName = suburbName
            .replace(/\s*\([^)]+\)\s*$/, '')  // Remove parenthetical state
            .replace(/,\s*[A-Z]{2,3}$/, '');  // Remove comma-separated state code
            
        const cleanEscapedName = escapeRegExp(cleanSuburbName);
        const cleanExactRegex = new RegExp(`^${cleanEscapedName}$`, 'i');
        
        // Try to find a match using the regex patterns
        for (const key in mapColors) {
            // Try exact match first
            if (exactMatchRegex.test(key)) {
                return mapColors[key];
            }
            
            // Try with state patterns
            for (const stateRegex of statePatterns) {
                if (stateRegex.test(key)) {
                    return mapColors[key];
                }
            }
            
            // Try with cleaned name
            if (cleanExactRegex.test(key)) {
                return mapColors[key];
            }
        }
        
        // If still no match, try case-insensitive direct comparison
        for (const key in mapColors) {
            if (key.toLowerCase() === suburbName.toLowerCase()) {
                return mapColors[key];
            }
            
            if (key.toLowerCase() === cleanSuburbName.toLowerCase()) {
                return mapColors[key];
            }
        }
        
        // Last resort: try a partial match approach
        const partialRegex = new RegExp(cleanEscapedName, 'i');
        for (const key in mapColors) {
            if (partialRegex.test(key)) {
                return mapColors[key];
            }
        }
        
        // Log missing suburbs for debugging
        console.log(`No color found for suburb: "${suburbName}"`);
        return "rgba(255, 255, 255, 0.5)"; // Default white
    }

    // Load map colors data 
    useEffect(() => {
        let isMounted = true;
        
        const loadMapColors = async () => {
            try {
                console.log("Fetching map colors...");
                const colors = await fetchMapColors();
                
                if (!isMounted) return;
                
                // Log some information about the data for debugging
                const count = Object.keys(colors).length;
                console.log(`Loaded colors for ${count} suburbs`);
                
                // Sample some entries
                const sampleKeys = Object.keys(colors).slice(0, 5);
                console.log("Sample entries:", sampleKeys.map(key => ({
                    suburb: key,
                    color: colors[key]
                })));
                
                setMapColors(colors);
                
                // Force update colors if map is already loaded
                if (map.current && map.current.getSource('suburbs')) {
                    try {
                        const response = await fetch(stateData[selectedState].file);
                        if (!response.ok) {
                            throw new Error(`Failed to fetch suburbs: ${response.statusText}`);
                        }
                        const geoData = await response.json();
                        updateSuburbColors(geoData, colors);
                    } catch (error) {
                        console.error("Error updating colors after load:", error);
                    }
                }
            } catch (error) {
                console.error("Error in loadMapColors:", error);
            }
        };
        
        loadMapColors();
        
        return () => {
            isMounted = false;
        };
    }, []);

    const stateData = {
        nsw: {
            name: 'New South Wales',
            file: '/nsw_suburbs.json',
            center: [149.1300, -35.2809],
            zoom: 5,
            possibleNameFields: ['nsw_loca_2', 'name', 'NAME', 'suburb']
        },
        vic: {
            name: 'Victoria',
            file: '/victoria_suburbs.json',
            center: [145.0000, -37.0000],
            zoom: 5.5,
            possibleNameFields: ['vic_loca_2', 'name', 'NAME', 'suburb']
        },
        qld: {
            name: 'Queensland',
            file: '/queensland_suburbs.json',
            center: [144.0000, -22.0000],
            zoom: 4.5,
            possibleNameFields: ['qld_loca_2', 'name', 'NAME', 'suburb']
        },
        wa: {
            name: 'Western Australia',
            file: '/wa_suburbs.json',
            center: [122.0000, -25.0000],
            zoom: 4,
            possibleNameFields: ['SSC_NAME', 'SSCNAME', 'LOCALITY', 'AREA_NAME', 'SUBURB_NAME', 'LOC_NAME', 'LOCALITY_NAME']
        },
        sa: {
            name: 'South Australia',
            file: '/sa_suburbs.json',
            center: [135.0000, -30.0000],
            zoom: 4.5,
            possibleNameFields: ['SSC_NAME', 'SSCNAME', 'LOCALITY', 'AREA_NAME', 'SUBURB_NAME', 'LOC_NAME', 'LOCALITY_NAME']
        },
        tas: {
            name: 'Tasmania',
            file: '/tasmania_suburbs.json',
            center: [146.8000, -42.0000],
            zoom: 6,
            possibleNameFields: ['tas_loca_2', 'name', 'NAME', 'suburb']
        },
        nt: {
            name: 'Northern Territory',
            file: '/nt_suburbs.json',
            center: [133.0000, -20.0000],
            zoom: 4.5,
            possibleNameFields: ['SSC_NAME', 'SSCNAME', 'LOCALITY', 'AREA_NAME', 'SUBURB_NAME', 'LOC_NAME', 'LOCALITY_NAME']
        }
    }

    // Helper function to get suburb name from feature properties
    const getSuburbName = (feature) => {
        if (!feature || !feature.properties) return "Unknown Suburb";

        const props = feature.properties;

        // Special handling for states with numeric IDs as names
        const isWA_NT_SA = ['wa', 'nt', 'sa'].includes(selectedState);

        // Try properties with names that seem like actual suburb names for problematic states
        if (isWA_NT_SA) {
            // Try all specified fields first
            const possibleFields = stateData[selectedState].possibleNameFields;
            for (const field of possibleFields) {
                if (props[field] && typeof props[field] === 'string') {
                    return props[field];
                }
            }

            // Search for fields that contain proper locality names (not ID patterns)
            for (const key in props) {
                // Skip null/undefined values or non-string values
                if (!props[key] || typeof props[key] !== 'string') continue;

                // Skip values that look like IDs (state code + numbers)
                const idPattern = /^[A-Z]{1,3}\d+$/;
                if (idPattern.test(props[key])) continue;

                // Skip short codes and other suspicious values
                if (props[key].length < 3 || props[key].length > 40) continue;

                // Skip values with too many numbers or special characters
                const hasToManyNonLetters = /[^a-zA-Z\s].*[^a-zA-Z\s].*[^a-zA-Z\s]/.test(props[key]);
                if (hasToManyNonLetters) continue;

                // This might be a proper name
                return props[key];
            }

            // For WA specifically - if the feature has geometry, use centroid coordinates
            if (selectedState === 'wa' && feature.geometry) {
                try {
                    // This is simplistic - proper centroid calculation would be better
                    if (feature.geometry.type === 'Polygon' && feature.geometry.coordinates && feature.geometry.coordinates.length > 0) {
                        // Return general area for WA
                        return "Western Australia Area";
                    }
                } catch (e) {
                    console.error("Error processing geometry:", e);
                }
            }

            // Return state name with ID if nothing else works
            return `${stateData[selectedState].name} Area`;
        }

        // Normal processing for other states
        // Try the possible fields for this state
        const possibleFields = stateData[selectedState].possibleNameFields;
        for (const field of possibleFields) {
            if (props[field]) {
                return props[field];
            }
        }

        // If not found, search through all properties for likely name fields
        const nameRegex = /(?:name|suburb|locality|label|title|loc)/i;
        for (const key in props) {
            // Skip null/undefined values or non-string values
            if (!props[key] || typeof props[key] !== 'string') continue;

            // If property key contains name-like words
            if (nameRegex.test(key)) {
                return props[key];
            }
        }

        // If still not found, return first string property that's not too long
        for (const key in props) {
            if (typeof props[key] === 'string' && props[key].length < 50) {
                return props[key];
            }
        }

        return "Unknown Suburb";
    }

    const changeState = (state) => {
        if (!map.current || !loaded) return

        setSelectedState(state)

        // Fly to the selected state
        map.current.flyTo({
            center: stateData[state].center,
            zoom: stateData[state].zoom,
            duration: 1500,
            essential: true
        })

        // Update the source data
        if (map.current.getSource('suburbs')) {
            // Use fetch to load the file instead of direct reference
            fetch(stateData[state].file)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch suburbs: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (map.current && map.current.getSource('suburbs')) {
                        map.current.getSource('suburbs').setData(data);
                        
                        // Update suburb colors based on the data
                        if (mapColors) {
                            updateSuburbColors(data, mapColors);
                        }
                    }
                })
                .catch(err => {
                    console.error('Error loading suburb data:', err);
                });
        }
    }

    // Function to update suburb colors
    const updateSuburbColors = (geojsonData, colors = mapColors) => {
        if (!map.current) {
            console.log("Map not initialized yet");
            return;
        }
        
        if (!colors) {
            console.log("Map colors not loaded yet, can't update colors");
            return;
        }

        console.log("Updating suburb colors");

        // Count how many suburbs we're coloring
        let coloredCount = 0;
        let totalCount = 0;
        let distinctColors = new Set();
        
        const featuresWithColors = geojsonData.features.map(feature => {
            totalCount++;
            const suburbName = getSuburbName(feature);
            const color = getSuburbColor(suburbName);
            
            distinctColors.add(color);
            if (color !== "rgba(255, 255, 255, 0.5)") {
                coloredCount++;
            }
            
            return {
                ...feature,
                properties: {
                    ...feature.properties,
                    suburbColor: color,
                    suburbName: suburbName // Store the name for debugging
                }
            };
        });
        
        console.log(`Colored ${coloredCount} out of ${totalCount} suburbs`);
        console.log(`Using ${distinctColors.size} distinct colors`);
        
        // Log some sample features for debugging
        if (featuresWithColors.length > 0) {
            console.log("First 3 suburbs:");
            for (let i = 0; i < Math.min(3, featuresWithColors.length); i++) {
                const feature = featuresWithColors[i];
                console.log(`${feature.properties.suburbName}: ${feature.properties.suburbColor}`);
            }
        }
        
        geojsonData.features = featuresWithColors;
        
        if (!map.current.getSource('suburbs')) {
            console.error("Source 'suburbs' not found on map");
            return;
        }
        
        map.current.getSource('suburbs').setData(geojsonData);
    }

    useEffect(() => {
        if (map.current) {
            map.current.remove()
            map.current = null
        }

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: {
                version: 8,
                sources: {
                    osm: {
                        type: 'raster',
                        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                        tileSize: 256,
                        attribution: '© OpenStreetMap Contributors'
                    }
                },
                layers: [
                    {
                        id: 'osm-tiles',
                        type: 'raster',
                        source: 'osm',
                        minzoom: 0,
                        maxzoom: 19
                    }
                ],
                glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf'
            },
            center: stateData[selectedState].center,
            zoom: stateData[selectedState].zoom
        })

        map.current.on('load', () => {
            // Add suburbs GeoJSON source
            map.current.addSource('suburbs', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: []
                }
            })

            // Load the actual data
            fetch(stateData[selectedState].file)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch suburbs: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (map.current && map.current.getSource('suburbs')) {
                        map.current.getSource('suburbs').setData(data);
                        
                        // If mapColors is loaded, update the colors
                        if (mapColors) {
                            updateSuburbColors(data);
                        }
                    }
                })
                .catch(err => {
                    console.error('Error loading suburb data:', err);
                });

            // Add suburb boundaries layer with coloring from map_colours.json
            map.current.addLayer({
                id: 'suburb-boundaries',
                type: 'fill',
                source: 'suburbs',
                paint: {
                    'fill-color': ['get', 'suburbColor'],
                    'fill-outline-color': 'rgba(0, 0, 0, 0.2)'
                }
            })

            // Add suburb outline layer
            map.current.addLayer({
                id: 'suburb-outline',
                type: 'line',
                source: 'suburbs',
                paint: {
                    'line-color': 'rgba(0, 0, 0, 0.5)',
                    'line-width': 0.5
                }
            })

            // For debugging: fetch and log first feature properties when data loads
            map.current.once('sourcedata', () => {
                if (map.current.isSourceLoaded('suburbs')) {
                    const features = map.current.querySourceFeatures('suburbs');
                    if (features && features.length > 0) {
                        console.log(`First feature for ${selectedState}:`, features[0].properties);
                    }
                }
            });

            // Special handling for label fields based on state
            const textFieldExpression = ['wa', 'nt', 'sa'].includes(selectedState)
                ? '' // Don't display labels for problematic states
                : ['get', stateData[selectedState].possibleNameFields[0]];

            // Add suburb name labels with dynamic property lookup
            try {
                map.current.addLayer({
                    id: 'suburb-labels',
                    type: 'symbol',
                    source: 'suburbs',
                    layout: {
                        'text-field': textFieldExpression,
                        'text-size': 12,
                        'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
                        'text-allow-overlap': false,
                        'text-ignore-placement': false,
                        'text-optional': true,
                        'text-max-width': 8
                    },
                    paint: {
                        'text-color': 'rgba(0, 0, 0, 0.8)',
                        'text-halo-color': 'rgba(255, 255, 255, 0.8)',
                        'text-halo-width': 1
                    },
                    minzoom: 9
                });
            } catch (error) {
                console.warn('Unable to add text labels:', error.message);
                // Continue map initialization even if text labels fail
            }

            // Add click interaction
            map.current.on('click', 'suburb-boundaries', (e) => {
                if (!e.features || !e.features.length) return

                const feature = e.features[0]
                const suburbName = getSuburbName(feature)
                
                // Notify parent component about selected suburb
                if (onSuburbSelect) {
                    onSuburbSelect(suburbName)
                }

                new maplibregl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML(`<h3>${suburbName}</h3>`)
                    .addTo(map.current)
            })

            // Change cursor when hovering over suburbs
            map.current.on('mouseenter', 'suburb-boundaries', () => {
                map.current.getCanvas().style.cursor = 'pointer'
            })

            map.current.on('mouseleave', 'suburb-boundaries', () => {
                map.current.getCanvas().style.cursor = ''
            })

            setLoaded(true)
        })

        return () => {
            if (map.current) {
                map.current.remove()
                map.current = null
            }
        }
    }, [selectedState, mapColors])

    // Update emissions scenario effect - don't remove this, but keep it empty
    // This will ensure the emissions scenario is properly passed to the parent
    useEffect(() => {
        console.log(`Emissions scenario changed to: ${emissionsScenario}`);
        // We're not changing colors based on emissions scenario anymore,
        // but we're keeping this effect for future functionality
    }, [emissionsScenario]);

    return (
        <div className="md:col-span-2 bg-white rounded-lg shadow overflow-hidden h-full">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-semibold text-lg">Climate Risk Map</h2>
                <div className="flex space-x-2">
                    <select
                        value={selectedState}
                        onChange={(e) => changeState(e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                        {Object.entries(stateData).map(([key, state]) => (
                            <option key={key} value={key}>{state.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Emissions scenario selector */}
            <div className="absolute ml-4 mt-4 bg-white bg-opacity-90 rounded-lg shadow z-10 p-3">
                <div className="flex flex-col">
                    <h3 className="text-gray-700 text-xs font-medium mb-1">Emissions scenario</h3>
                    <div className="inline-flex rounded-md border border-gray-300 overflow-hidden">
                        <button
                            className={`px-3 py-1 text-xs ${emissionsScenario === 'low_emissions_impact' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'}`}
                            onClick={() => setEmissionsScenario('low_emissions_impact')}
                        >
                            Low
                        </button>
                        <button
                            className={`px-3 py-1 text-xs border-l border-r border-gray-300 ${emissionsScenario === 'medium_emissions_impact' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'}`}
                            onClick={() => setEmissionsScenario('medium_emissions_impact')}
                        >
                            Medium
                        </button>
                        <button
                            className={`px-3 py-1 text-xs ${emissionsScenario === 'high_emissions_impact' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'}`}
                            onClick={() => setEmissionsScenario('high_emissions_impact')}
                        >
                            High
                        </button>
                    </div>
                </div>
            </div>

            <div
                ref={mapContainer}
                className="h-[calc(100%-57px)] bg-gray-100"
            />
        </div>
    )
} 