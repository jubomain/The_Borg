"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ClipboardCopy, Search, Filter } from "lucide-react"
import { getResults } from "./serviceAPI"

interface ResultItem {
  id: string
  prompt: string
  timestamp: string
  raw_response: string
  analysis: {
    sentiment: string
    key_points?: string[]
    next_actions?: string[]
  }
  task_id: string
}

const ResultsPanel: React.FC = () => {
  const [results, setResults] = useState<ResultItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedResult, setSelectedResult] = useState<ResultItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch results
    const fetchResults = async () => {
      try {
        setLoading(true)
        const apiResults = await getResults()

        // Transform API results to ResultItem format
        const formattedResults: ResultItem[] = apiResults.map((result, index) => ({
          id: `result-${index + 1}`,
          prompt: `Example prompt ${index + 1}`,
          timestamp: result.timestamp,
          raw_response: result.raw_response,
          analysis: result.analysis,
          task_id: `task-${index + 1}`,
        }))

        setResults(formattedResults)
      } catch (error) {
        console.error("Failed to fetch results:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const filteredResults = results.filter(
    (result) =>
      result.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.raw_response.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Copied to clipboard!")
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err)
      })
  }

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleString()
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Results</h2>
        <p className="text-sm text-gray-500">View and analyze responses from the target application</p>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search results..."
          value={searchTerm}
          onChange={handleSearch}
          className="pl-10 block w-full rounded-md border-gray-300 shadow-sm 
                    focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                    bg-white border p-2"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <svg
            className="animate-spin h-8 w-8 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : filteredResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-md overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <h3 className="text-sm font-medium text-gray-700">Result List</h3>
            </div>
            <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
              {filteredResults.map((result) => (
                <li
                  key={result.id}
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                    selectedResult?.id === result.id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => setSelectedResult(result)}
                >
                  <div className="flex flex-col">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">{formatDate(result.timestamp)}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          result.analysis.sentiment === "positive"
                            ? "bg-green-100 text-green-800"
                            : result.analysis.sentiment === "negative"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {result.analysis.sentiment}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mt-1 truncate">{result.prompt}</p>
                    <p className="text-xs text-gray-500 mt-1 truncate">{result.raw_response.substring(0, 60)}...</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="border rounded-md overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <h3 className="text-sm font-medium text-gray-700">Result Details</h3>
            </div>

            {selectedResult ? (
              <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase">Prompt</h4>
                  <div className="mt-1 bg-gray-50 p-3 rounded text-sm">{selectedResult.prompt}</div>
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-medium text-gray-500 uppercase">Response</h4>
                    <button
                      onClick={() => handleCopyToClipboard(selectedResult.raw_response)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ClipboardCopy size={14} />
                    </button>
                  </div>
                  <div className="mt-1 bg-gray-50 p-3 rounded text-sm">{selectedResult.raw_response}</div>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase">Analysis</h4>
                  <div className="mt-1 space-y-2">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 mr-2">Sentiment:</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          selectedResult.analysis.sentiment === "positive"
                            ? "bg-green-100 text-green-800"
                            : selectedResult.analysis.sentiment === "negative"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {selectedResult.analysis.sentiment}
                      </span>
                    </div>

                    {selectedResult.analysis.key_points && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Key Points:</p>
                        <ul className="mt-1 list-disc list-inside text-sm text-gray-600 pl-2">
                          {selectedResult.analysis.key_points.map((point, index) => (
                            <li key={index}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedResult.analysis.next_actions && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Suggested Actions:</p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {selectedResult.analysis.next_actions.map((action, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-xs"
                            >
                              {action}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 p-4 text-center">
                <Filter size={24} className="text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-900">No result selected</p>
                <p className="text-xs text-gray-500 mt-1">Click on a result from the list to view details</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-md">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          {searchTerm ? (
            <>
              <p className="mt-2 text-sm font-medium text-gray-900">No matching results found</p>
              <p className="mt-1 text-sm text-gray-500">Try a different search term</p>
            </>
          ) : (
            <>
              <p className="mt-2 text-sm font-medium text-gray-900">No results yet</p>
              <p className="mt-1 text-sm text-gray-500">Process some tasks to see results here</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default ResultsPanel
