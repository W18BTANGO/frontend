"use client"

import { useState } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import MapComponent from "@/components/map-component"
import SidePopup from "./side-popup"

export default function Dashboard() {
    const [isSidePopupOpen, setIsSidePopupOpen] = useState(false)
    const [selectedLocation, setSelectedLocation] = useState(null)

    const toggleSidePopup = () => {
        setIsSidePopupOpen(!isSidePopupOpen)
    }

    const handleLocationSelect = (location) => {
        setSelectedLocation(location)
        setIsSidePopupOpen(true)
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header toggleSidePopup={toggleSidePopup} />
            <main className="flex-1 flex relative">
                <MapComponent onLocationSelect={handleLocationSelect} />
                <SidePopup isOpen={isSidePopupOpen} onClose={() => setIsSidePopupOpen(false)} location={selectedLocation} />
            </main>
            <Footer />
        </div>
    )
}
