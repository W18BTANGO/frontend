"use client"

export default function SuburbInfo({ suburb, selectedYear }) {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-lg">{suburb.name}</h2>
                <p className="text-sm text-gray-500 mb-4">
                    <b>0%</b> of properties in <b>{suburb.name}</b> will be unaffordable or impossible to insure in <b>{selectedYear}</b>
                </p>
                {suburb.matchedRisk && (
                    <p className="text-sm text-red-700 mt-1">
                        <span className="font-semibold">Highest risk:</span> {suburb.matchedRisk}
                    </p>
                )}
            </div>
            <div className="p-4 space-y-4">
                {/* Total risk score */}
                <div>
                    <div className="flex justify-between mb-1">
                        <span className="text-sm font-bold">Total</span>
                        <span className="text-sm font-bold">{suburb.total || 
                            Math.round(Object.values(suburb.risks).reduce((sum, score) => sum + score, 0) / 
                            Object.values(suburb.risks).length)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                        <div 
                            className={`h-2.5 rounded-full ${
                                (suburb.total || Math.round(Object.values(suburb.risks).reduce((sum, score) => sum + score, 0) / 
                                Object.values(suburb.risks).length)) > 75 ? 'bg-red-500' : 
                                (suburb.total || Math.round(Object.values(suburb.risks).reduce((sum, score) => sum + score, 0) / 
                                Object.values(suburb.risks).length)) > 50 ? 'bg-orange-500' : 
                                (suburb.total || Math.round(Object.values(suburb.risks).reduce((sum, score) => sum + score, 0) / 
                                Object.values(suburb.risks).length)) > 25 ? 'bg-yellow-500' : 'bg-green-500'
                            }`} 
                            style={{ width: `${suburb.total || 
                                Math.round(Object.values(suburb.risks).reduce((sum, score) => sum + score, 0) / 
                                Object.values(suburb.risks).length)}%` }}
                        ></div>
                    </div>
                </div>
                
                {/* Individual risk factors */}
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