"use client"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"

export default function WorkflowsFallback() {
  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white p-6">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold">Workflows</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-[#1E1E1E] border border-gray-800 rounded-lg p-8 max-w-md w-full text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Unable to load workflows</h2>
          <p className="text-gray-400 mb-6">
            There was an issue loading the workflows page. This might be due to missing dependencies or configuration.
          </p>
          <div className="space-y-4">
            <Link
              href="/dashboard"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
            >
              Return to Dashboard
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="block w-full bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-md"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
