"use client"

import { useState } from "react"
import Map, { Marker, Popup, NavigationControl } from "react-map-gl/mapbox"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import "mapbox-gl/dist/mapbox-gl.css"

// You'll need to add your Mapbox token as an environment variable
// NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token

export default function MapComponent({ onLocationSelect }) {
    const [viewState, setViewState] = useState({
        longitude: -122.4,
        latitude: 37.8,
        zoom: 11,
    })

    const [popupInfo, setPopupInfo] = useState(null)

    // Sample locations data - in a real app, this would come from an API
    const locations = [
        {
            name: "Golden Gate Bridge",
            description: "Iconic suspension bridge in San Francisco",
            coordinates: [-122.4783, 37.8199],
        },
        {
            name: "Alcatraz Island",
            description: "Historic federal prison on an island",
            coordinates: [-122.423, 37.8267],
        },
        {
            name: "Fisherman's Wharf",
            description: "Popular tourist attraction with seafood restaurants",
            coordinates: [-122.4169, 37.808],
        },
    ]

    return (
        <div className="w-full h-[calc(100vh-8rem)]">
            <Map
                {...viewState}
                onMove={(evt) => setViewState(evt.viewState)}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""}
            >
                <NavigationControl position="top-right" />

                {locations.map((location, index) => (
                    <Marker
                        key={index}
                        longitude={location.coordinates[0]}
                        latitude={location.coordinates[1]}
                        anchor="bottom"
                        onClick={(e) => {
                            // Prevent the map from being clicked
                            e.originalEvent.stopPropagation()
                            setPopupInfo({
                                longitude: location.coordinates[0],
                                latitude: location.coordinates[1],
                                name: location.name,
                                description: location.description,
                            })
                        }}
                    >
                        <MapPin className="h-6 w-6 text-red-500" />
                    </Marker>
                ))}

                {popupInfo && (
                    <Popup
                        longitude={popupInfo.longitude}
                        latitude={popupInfo.latitude}
                        anchor="bottom"
                        onClose={() => setPopupInfo(null)}
                        closeOnClick={false}
                    >
                        <div className="p-2 max-w-[200px]">
                            <h3 className="font-bold">{popupInfo.name}</h3>
                            <p className="text-sm">{popupInfo.description}</p>
                            <Button
                                size="sm"
                                className="mt-2 w-full"
                                onClick={() => {
                                    onLocationSelect({
                                        name: popupInfo.name,
                                        description: popupInfo.description,
                                        coordinates: [popupInfo.longitude, popupInfo.latitude],
                                    })
                                    setPopupInfo(null)
                                }}
                            >
                                View Details
                            </Button>
                        </div>
                    </Popup>
                )}
            </Map>
        </div>
    )
}
