import React, { useState, useRef } from 'react';

export default function SuburbInfo({ suburb, selectedYear }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isCopied, setIsCopied] = useState(false); // State to track copy status
    const summaryRef = useRef(null); // Ref to manage the summary text

    const handleClimateProofClick = () => {
        // Open the link in a new tab
        const link = `https://genai-app-climateriskassessmentandm-1-17453834066-165002853703.us-central1.run.app/?key=40hpam4lni2a8k6c`;
        window.open(link, '_blank');

        // Generate the summary text
        const summary = `Climate proofing information for ${suburb.name}:\n` +
            `- ${suburb.risks["Total MVAR"]}% of properties will be unaffordable or impossible to insure in ${selectedYear}.\n` +
            (suburb.matchedRisk ? `- Highest risk: ${suburb.matchedRisk}.\n` : '') +
            `- Individual risks:\n` +
            Object.entries(suburb.risks)
                .filter(([riskType]) => riskType !== "Total MVAR")
                .map(([riskType, score]) => `  - ${riskType}: ${score}%`)
                .join('\n');

        if (summaryRef.current) {
            summaryRef.current.value = summary; // Set the summary text in the ref
        }
    };

    const copyToClipboard = async () => {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                // Use Clipboard API if available
                await navigator.clipboard.writeText(summaryRef.current.value);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000); // Reset message after 2 seconds
            } else {
                // Fallback for unsupported browsers
                if (summaryRef.current) {
                    const textArea = document.createElement("textarea");
                    textArea.value = summaryRef.current.value;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand("copy");
                    document.body.removeChild(textArea);
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000); // Reset message after 2 seconds
                } else {
                    throw new Error("Summary text is not available.");
                }
            }
        } catch (err) {
            console.error('Failed to copy text: ', err);
            setError("Failed to copy summary to clipboard. Please try again.");
        }
    };

    const clearSummary = () => {
        if (summaryRef.current) {
            summaryRef.current.value = ""; // Clear the summary text
        }
    };

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
                {Object.entries(suburb.risks)
                    .filter(([riskType]) => riskType !== "Total MVAR")
                    .map(([riskType, score]) => (
                    <div key={riskType}>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{riskType}</span>
                            <span className="text-sm font-medium text-gray-500">{score}%</span>
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
                {suburb.risks["Total MVAR"] !== undefined && (
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-extrabold">Total Risk</span>
                            <span className="text-sm font-bold">{suburb.risks["Total MVAR"]}%</span>
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
            <div className="p-4">
                <button
                    className="w-full bg-blue-100 text-blue-700 font-semibold py-2 px-4 rounded-lg hover:bg-blue-200"
                    onClick={handleClimateProofClick}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'How can I climate proof?'}
                </button>
                <div className="mt-4">
                    <textarea
                        ref={summaryRef}
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Summary will appear here..."
                    />
                    <div className="flex space-x-2 mt-2">
                        <button
                            className="bg-green-100 text-green-700 font-semibold py-1 px-3 rounded-lg hover:bg-green-200 text-sm"
                            onClick={copyToClipboard}
                        >
                            {isCopied ? 'Copied!' : 'Copy'}
                        </button>
                        <button
                            className="bg-gray-100 text-gray-700 font-semibold py-1 px-3 rounded-lg hover:bg-gray-200 text-sm"
                            onClick={clearSummary}
                        >
                            Clear
                        </button>
                    </div>
                </div>
                {error && (
                    <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                        <p className="text-sm">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
}