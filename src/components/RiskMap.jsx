"use client"

import { useRef, useEffect, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export default function RiskMap({ onSuburbSelect }) {
    const mapContainer = useRef(null)
    const map = useRef(null)
    const [loaded, setLoaded] = useState(false)
    const [selectedState, setSelectedState] = useState('nsw')
    
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
            map.current.getSource('suburbs').setData(stateData[state].file)
        }
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
                ]
            },
            center: stateData[selectedState].center,
            zoom: stateData[selectedState].zoom
        })

        map.current.on('load', () => {
            // Add suburbs GeoJSON source
            map.current.addSource('suburbs', {
                type: 'geojson',
                data: stateData[selectedState].file
            })

            // Add suburb boundaries layer
            map.current.addLayer({
                id: 'suburb-boundaries',
                type: 'fill',
                source: 'suburbs',
                paint: {
                    'fill-color': [
                        'case',
                        ['==', ['get', 'nsw_loca_5'], 'G'],
                        'rgba(173, 216, 230, 0.4)', // Light blue for normal suburbs
                        ['==', ['get', 'properties.risk'], 'Riverine Flooding'],
                        'rgba(0, 0, 255, 0.4)', // Blue for flood risk
                        ['==', ['get', 'properties.risk'], 'Forest Fire'],
                        'rgba(255, 0, 0, 0.4)', // Red for fire risk
                        ['==', ['get', 'properties.risk'], 'Surface Flooding'],
                        'rgba(128, 0, 128, 0.4)', // Purple for surface flood risk
                        'rgba(200, 200, 200, 0.3)' // Default gray
                    ],
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
            map.current.addLayer({
                id: 'suburb-labels',
                type: 'symbol',
                source: 'suburbs',
                layout: {
                    'text-field': textFieldExpression,
                    'text-size': 12,
                    'text-font': ['Open Sans Regular'],
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
            })

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
    }, [selectedState])

    return (
        <div className="md:col-span-2 bg-white rounded-lg shadow overflow-hidden h-[400px]">
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
            <div 
                ref={mapContainer} 
                className="h-[calc(400px-57px)] bg-gray-100"
            />
        </div>
    )
} 