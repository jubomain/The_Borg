"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react"
import Link from "next/link"

interface ApiStatus {
  name: string
  status: "operational" | "degraded" | "down"
  latency: number
  lastChecked: string
}

export default function ApiStatusPage() {
  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([])
  const [loading, setLoading] = useState(true)

  const fetchApiStatuses = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/api-status")
      const data = await response.json()
      setApiStatuses(data)
    } catch (error) {
      console.error("Error fetching API statuses:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApiStatuses()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "degraded":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case "down":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-100 text-green-800"
      case "degraded":
        return "bg-yellow-100 text-yellow-800"
      case "down":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-800 flex items-center">
        <Link href="/dashboard" className="mr-4">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold">API Status</h1>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">API Health Dashboard</h2>
            <p className="text-gray-500">Monitor the status of all integrated APIs</p>
          </div>
          <button
            onClick={fetchApiStatuses}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Status
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apiStatuses.map((api) => (
              <div key={api.name} className="bg-gray-800 rounded-lg p-4 shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">{api.name}</h3>
                  {getStatusIcon(api.status)}
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">Status</p>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(api.status)}`}
                    >
                      {api.status.charAt(0).toUpperCase() + api.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Latency</p>
                    <p className="text-sm font-medium">{api.latency} ms</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Last Checked</p>
                    <p className="text-sm font-medium">{new Date(api.lastChecked).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
