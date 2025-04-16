"use client"

import { useRef, useEffect, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export default function RiskMap() {
    const mapContainer = useRef(null)
    const map = useRef(null)
    const [loaded, setLoaded] = useState(false)
    
    useEffect(() => {
        if (map.current) return

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
            center: [149.1300, -35.2809], // NSW approximate center
            zoom: 5
        })

        map.current.on('load', () => {
            setLoaded(true)
            
            // Add NSW suburbs GeoJSON source
            map.current.addSource('nsw-suburbs', {
                type: 'geojson',
                data: '/nsw_suburbs.json'
            })

            // Add suburb boundaries layer
            map.current.addLayer({
                id: 'suburb-boundaries',
                type: 'fill',
                source: 'nsw-suburbs',
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
                source: 'nsw-suburbs',
                paint: {
                    'line-color': 'rgba(0, 0, 0, 0.5)',
                    'line-width': 0.5
                }
            })

            // Add suburb name labels
            map.current.addLayer({
                id: 'suburb-labels',
                type: 'symbol',
                source: 'nsw-suburbs',
                layout: {
                    'text-field': ['get', 'nsw_loca_2'],
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
                const suburbName = feature.properties.nsw_loca_2 || "Unknown Suburb"
                
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
        })

        return () => {
            if (map.current) {
                map.current.remove()
                map.current = null
            }
        }
    }, [])

    return (
        <div className="md:col-span-2 bg-white rounded-lg shadow overflow-hidden h-[400px]">
            <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-lg">Climate Risk Map</h2>
            </div>
            <div 
                ref={mapContainer} 
                className="h-[calc(400px-57px)] bg-gray-100"
            />
        </div>
    )
} 