"use client"

export default function TimelineSlider({ selectedYear, setSelectedYear }) {
    const handleYearChange = (e) => {
        console.log("Year changed to:", e.target.value)
        setSelectedYear(parseInt(e.target.value))
    }

    return (
        <div className="px-6 py-4 bg-white shadow">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col space-y-2">
                    <div className="flex justify-between">
                        <span className="font-semibold">Climate Risk Timeline</span>
                        <span className="font-bold text-blue-600">{selectedYear}</span>
                    </div>
                    <input
                        type="range"
                        min="2025"
                        max="2100"
                        step="1"
                        value={selectedYear}
                        onChange={handleYearChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>2025</span>
                        <span>2100</span>
                    </div>
                </div>
            </div>
        </div>
    )
} 