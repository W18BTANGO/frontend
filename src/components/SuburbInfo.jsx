"use client"
import React from 'react';

export default function SuburbInfo({ suburb, selectedYear }) {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-lg">{suburb.name.toUpperCase()}</h2>
                <p className="text-sm text-gray-500 mb-4">
                    <b>{suburb.risks["Total MVAR"]}%</b> of properties in <b>{suburb.name.toUpperCase()}</b> will be unaffordable or impossible to insure in <b>{selectedYear}</b>
                </p>
                {suburb.matchedRisk && (
                    <p className="text-sm text-red-700 mt-1">
                        <span className="font-semibold">Highest risk:</span> {suburb.matchedRisk}
                    </p>
                )}
            </div>
            <div className="p-4 space-y-4">

                {/* Individual risk factors (excluding Total MVAR) */}
                {Object.entries(suburb.risks)
                    .filter(([riskType]) => riskType !== "Total MVAR")
                    .map(([riskType, score]) => (
                    <div key={riskType}>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">
                                {riskType}
                            </span>
                            <span className="text-sm font-medium text-gray-500">
                                {score}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full ${score > 75 ? 'bg-red-500' :
                                    score > 50 ? 'bg-orange-500' :
                                        score > 25 ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}
                                style={{ width: `${score}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
                
                {/* Total risk factor (separate) */}
                {suburb.risks["Total MVAR"] !== undefined && (
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-extrabold">
                                Total Risk
                            </span>
                            <span className="text-sm font-bold">
                                {suburb.risks["Total MVAR"]}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full ${suburb.risks["Total MVAR"] > 75 ? 'bg-red-500' :
                                    suburb.risks["Total MVAR"] > 50 ? 'bg-orange-500' :
                                        suburb.risks["Total MVAR"] > 25 ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}
                                style={{ width: `${suburb.risks["Total MVAR"]}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>
            <div className="pb-2"></div>
        </div>
    )
} 