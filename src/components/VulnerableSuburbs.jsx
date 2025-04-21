"use client"

export default function VulnerableSuburbs({ suburbs, selectedYear }) {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-lg">The suburbs most vulnerable to climate risk</h2>
                <p className="text-sm text-gray-500">In NSW, 718,465 (15.6%) properties are at High Risk in {selectedYear}</p>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Suburb
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                No. properties at High Risk
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                % of suburb
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Largest Risk
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {suburbs.map((suburb, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {suburb.suburb}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <div className="h-2 bg-gray-500 mr-2" style={{ width: `${Math.min(suburb.properties / 100, 150)}px` }}></div>
                                        {suburb.properties.toLocaleString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {suburb.percentage}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`px-2 py-1 rounded text-white ${
                                        suburb.risk === "Riverine Flooding" ? "bg-blue-600" : 
                                        suburb.risk === "Forest Fire" ? "bg-red-700" : 
                                        suburb.risk === "Surface Flooding" ? "bg-purple-600" : "bg-yellow-600"
                                    }`}>
                                        {suburb.risk}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
} 