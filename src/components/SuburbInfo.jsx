"use client"

export default function SuburbInfo({ suburb, selectedYear }) {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-lg">{suburb.name}</h2>
                <p className="text-sm text-gray-500">Climate risk assessment for {selectedYear}</p>
            </div>
            <div className="p-4 space-y-4">
                {Object.entries(suburb.risks).map(([riskType, score]) => (
                    <div key={riskType}>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{riskType}</span>
                            <span className="text-sm font-medium">{score}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className={`h-2 rounded-full ${
                                    score > 75 ? 'bg-red-500' : 
                                    score > 50 ? 'bg-orange-500' : 
                                    score > 25 ? 'bg-yellow-500' : 'bg-green-500'
                                }`} 
                                style={{ width: `${score}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
} 