"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import { Code, RefreshCw, Check, AlertTriangle } from "lucide-react"

interface CodeAnalyzerProps {
  onAnalysisComplete?: (results: AnalysisResult) => void
}

interface AnalysisResult {
  codeQuality: number
  suggestions: string[]
  potentialImprovements: string[]
  timestamp: string
}

export default function CodeAnalyzer({ onAnalysisComplete }: CodeAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [lastAnalysis, setLastAnalysis] = useState<AnalysisResult | null>(null)
  const [codeStats, setCodeStats] = useState({
    totalFiles: 0,
    totalLines: 0,
    componentCount: 0,
    apiEndpoints: 0,
  })

  useEffect(() => {
    fetchLastAnalysis()
    fetchCodeStats()
  }, [])

  const fetchLastAnalysis = async () => {
    try {
      const { data, error } = await supabase
        .from("code_analysis")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (error) throw error

      if (data) {
        setLastAnalysis(data)
      }
    } catch (error) {
      console.error("Error fetching last analysis:", error)
    }
  }

  const fetchCodeStats = async () => {
    try {
      const { data, error } = await supabase.from("code_stats").select("*").single()

      if (error) throw error

      if (data) {
        setCodeStats(data)
      }
    } catch (error) {
      console.error("Error fetching code stats:", error)
    }
  }

  const runCodeAnalysis = async () => {
    setIsAnalyzing(true)

    try {
      // In a real implementation, this would analyze the actual codebase
      // For this demo, we'll simulate the analysis
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const analysisResult: AnalysisResult = {
        codeQuality: Math.floor(Math.random() * 30) + 70, // 70-100
        suggestions: [
          "Implement more error handling in API routes",
          "Add unit tests for core components",
          "Optimize database queries in workflow execution",
          "Consider implementing a caching layer for frequently accessed data",
        ],
        potentialImprovements: [
          "Refactor workflow execution engine for better performance",
          "Add support for more external integrations",
          "Implement a more robust logging system",
          "Create a versioning system for workflows",
        ],
        timestamp: new Date().toISOString(),
      }

      // Save analysis to Supabase
      const { error } = await supabase.from("code_analysis").insert([analysisResult])

      if (error) throw error

      setLastAnalysis(analysisResult)

      if (onAnalysisComplete) {
        onAnalysisComplete(analysisResult)
      }
    } catch (error) {
      console.error("Error running code analysis:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium flex items-center">
          <Code className="w-5 h-5 mr-2" />
          Code Analyzer
        </h2>
        <button
          onClick={runCodeAnalysis}
          disabled={isAnalyzing}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md flex items-center text-sm disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-1" />
              Analyze Codebase
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800 p-3 rounded-md">
          <div className="text-sm text-gray-400 mb-1">Total Files</div>
          <div className="text-2xl font-bold">{codeStats.totalFiles}</div>
        </div>
        <div className="bg-gray-800 p-3 rounded-md">
          <div className="text-sm text-gray-400 mb-1">Total Lines</div>
          <div className="text-2xl font-bold">{codeStats.totalLines}</div>
        </div>
        <div className="bg-gray-800 p-3 rounded-md">
          <div className="text-sm text-gray-400 mb-1">Components</div>
          <div className="text-2xl font-bold">{codeStats.componentCount}</div>
        </div>
        <div className="bg-gray-800 p-3 rounded-md">
          <div className="text-sm text-gray-400 mb-1">API Endpoints</div>
          <div className="text-2xl font-bold">{codeStats.apiEndpoints}</div>
        </div>
      </div>

      {lastAnalysis && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Last Analysis</h3>
            <div className="text-xs text-gray-500">{new Date(lastAnalysis.timestamp).toLocaleString()}</div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <div className="text-sm">Code Quality Score</div>
              <div className="text-sm font-medium">{lastAnalysis.codeQuality}/100</div>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  lastAnalysis.codeQuality >= 90
                    ? "bg-green-500"
                    : lastAnalysis.codeQuality >= 70
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${lastAnalysis.codeQuality}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-1" />
                Suggestions
              </h4>
              <ul className="text-sm text-gray-400 space-y-1 list-disc pl-5">
                {lastAnalysis.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <AlertTriangle className="w-4 h-4 text-yellow-500 mr-1" />
                Potential Improvements
              </h4>
              <ul className="text-sm text-gray-400 space-y-1 list-disc pl-5">
                {lastAnalysis.potentialImprovements.map((improvement, index) => (
                  <li key={index}>{improvement}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
