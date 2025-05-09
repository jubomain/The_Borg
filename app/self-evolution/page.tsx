"use client"

import { useState } from "react"
import { Database, Settings, RefreshCw } from "lucide-react"
import DatabaseStatus from "@/components/database-status"
import DatabaseInitializer from "@/components/database-initializer"

export default function SelfEvolution() {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Self Evolution</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-medium mb-4">System Status</h2>
          <p className="text-gray-400 mb-6">
            The self-evolution system allows your agents to improve themselves over time by analyzing their performance
            and suggesting improvements.
          </p>

          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
              <div className="flex items-center">
                <RefreshCw className="w-5 h-5 mr-2" />
                <span>Evolution Engine</span>
              </div>
              <span className="px-2 py-1 bg-yellow-600 text-xs rounded">Standby</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
              <div className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                <span>Code Analyzer</span>
              </div>
              <span className="px-2 py-1 bg-green-600 text-xs rounded">Ready</span>
            </div>

            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md mt-4"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Configure Self-Evolution
            </button>
          </div>
        </div>

        <div>
          <DatabaseStatus />
          <DatabaseInitializer />
        </div>
      </div>

      {showSettings && (
        <div className="mt-6 bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-medium mb-4">Self-Evolution Settings</h2>
          <p className="text-gray-400 mb-6">
            Configure how your agents evolve over time. These settings control the frequency and scope of
            self-improvement.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Evolution Frequency</label>
              <select className="w-full bg-gray-800 rounded-md px-4 py-2 text-white">
                <option>After each conversation</option>
                <option>Daily</option>
                <option>Weekly</option>
                <option>Manual only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Improvement Scope</label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input type="checkbox" id="scope-knowledge" className="mr-2" checked />
                  <label htmlFor="scope-knowledge">Knowledge Base</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="scope-responses" className="mr-2" checked />
                  <label htmlFor="scope-responses">Response Quality</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="scope-code" className="mr-2" checked />
                  <label htmlFor="scope-code">Code Generation</label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Approval Process</label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input type="radio" id="approval-auto" name="approval" className="mr-2" />
                  <label htmlFor="approval-auto">Automatic</label>
                </div>
                <div className="flex items-center">
                  <input type="radio" id="approval-manual" name="approval" className="mr-2" checked />
                  <label htmlFor="approval-manual">Manual Approval</label>
                </div>
              </div>
            </div>

            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md mt-4">
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
