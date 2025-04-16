"use client"

import MapComponent from "@/components/map-component"

export default function RiskMap() {
    return (
        <div className="md:col-span-2 bg-white rounded-lg shadow overflow-hidden h-[400px]">
            <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-lg">Climate Risk Map</h2>
            </div>
            <div className="h-[calc(400px-57px)] bg-gray-100">
                <MapComponent />
            </div>
        </div>
    )
} 