"use client"

import type React from "react"
import { useState } from "react"
import { ChromeIcon as Browser, ArrowRight, Plus } from "lucide-react"
import BrowserSessionPanel from "./BrowserSessionPanel"
import TaskManager from "./TaskManager"
import ResultsPanel from "./ResultsPanel"

export interface BrowserControllerProps {
  onStatusChange?: (status: string) => void
}

const BrowserController: React.FC<BrowserControllerProps> = ({ onStatusChange }) => {
  const [activeTab, setActiveTab] = useState<"configure" | "tasks" | "results">("configure")
  const [isInitialized, setIsInitialized] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleStatusChange = (status: string) => {
    if (onStatusChange) {
      onStatusChange(status)
    }
  }

  const handleInitialize = (success: boolean) => {
    setIsInitialized(success)
    handleStatusChange(success ? "Browser initialized" : "Browser initialization failed")
    if (success) {
      setActiveTab("tasks")
    }
  }

  const handleProcessingChange = (processing: boolean) => {
    setIsProcessing(processing)
    handleStatusChange(processing ? "Processing tasks" : "Processing complete")
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "configure"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("configure")}
          >
            <div className="flex items-center space-x-2">
              <Browser size={16} />
              <span>Configure Browser</span>
            </div>
          </button>

          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "tasks" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
            } ${!isInitialized ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => isInitialized && setActiveTab("tasks")}
            disabled={!isInitialized}
          >
            <div className="flex items-center space-x-2">
              <Plus size={16} />
              <span>Manage Tasks</span>
            </div>
          </button>

          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "results" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
            } ${!isInitialized ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => isInitialized && setActiveTab("results")}
            disabled={!isInitialized}
          >
            <div className="flex items-center space-x-2">
              <ArrowRight size={16} />
              <span>View Results</span>
            </div>
          </button>
        </div>
      </div>

      <div className="p-4">
        {activeTab === "configure" && (
          <BrowserSessionPanel onInitialize={handleInitialize} isInitialized={isInitialized} />
        )}

        {activeTab === "tasks" && (
          <TaskManager isProcessing={isProcessing} onProcessingChange={handleProcessingChange} />
        )}

        {activeTab === "results" && <ResultsPanel />}
      </div>
    </div>
  )
}

export default BrowserController
