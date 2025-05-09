"use client"

import { useState, useEffect } from "react"
import { Database, CheckCircle, XCircle, RefreshCw, AlertTriangle, Code } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DatabaseStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "partial" | "error">("loading")
  const [tables, setTables] = useState<string[]>([])
  const [message, setMessage] = useState<string>("")
  const [isChecking, setIsChecking] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [sqlToRun, setSqlToRun] = useState<string>("")
  const [showSql, setShowSql] = useState(false)

  const checkDatabaseStatus = async () => {
    setIsChecking(true)
    setStatus("loading")
    setSqlToRun("")

    try {
      const response = await fetch("/api/database-status")
      const data = await response.json()

      if (response.ok && data.connected) {
        if (data.tables.length === 0) {
          setStatus("partial")
          setMessage(data.note || "Connected but no tables found")
        } else {
          setStatus("connected")
          setMessage(data.note || "")
        }
        setTables(data.tables || [])
      } else {
        setStatus("error")
        setMessage(data.error || "Unknown error")
      }
    } catch (error) {
      console.error("Error checking database status:", error)
      setStatus("error")
      setMessage("Failed to connect to the database. Please check your Supabase credentials.")
    } finally {
      setIsChecking(false)
    }
  }

  const initializeDatabase = async () => {
    setIsInitializing(true)
    setSqlToRun("")

    try {
      // First try to create the SQL function
      const createFunctionResponse = await fetch("/api/create-sql-function", {
        method: "POST",
      })

      if (!createFunctionResponse.ok) {
        const data = await createFunctionResponse.json()
        setMessage(data.error || "Failed to create SQL function")
        setIsInitializing(false)
        return
      }

      // Then initialize the database
      const response = await fetch("/api/init-database", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Re-check status after initialization
        await checkDatabaseStatus()
      } else {
        setMessage(data.message || "Failed to initialize database")
        if (data.sqlToRunManually) {
          setSqlToRun(data.sqlToRunManually)
        }
      }
    } catch (error) {
      console.error("Error initializing database:", error)
      setMessage("Failed to initialize database. Please check your Supabase credentials.")
    } finally {
      setIsInitializing(false)
    }
  }

  useEffect(() => {
    checkDatabaseStatus()
  }, [])

  return (
    <div className="bg-gray-900 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium flex items-center">
          <Database className="w-5 h-5 mr-2" />
          Database Status
        </h2>
        <button
          onClick={checkDatabaseStatus}
          disabled={isChecking}
          className="p-2 bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isChecking ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="mb-4 flex items-center">
        <div className="mr-2">
          {status === "loading" && <RefreshCw className="w-5 h-5 text-yellow-500 animate-spin" />}
          {status === "connected" && <CheckCircle className="w-5 h-5 text-green-500" />}
          {status === "partial" && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
          {status === "error" && <XCircle className="w-5 h-5 text-red-500" />}
        </div>
        <div>
          {status === "loading" && <span>Checking database connection...</span>}
          {status === "connected" && <span className="text-green-500">Connected to Supabase</span>}
          {status === "partial" && <span className="text-yellow-500">Connected to Supabase</span>}
          {status === "error" && <span className="text-red-500">Failed to connect to database</span>}
        </div>
      </div>

      {message && <div className="mb-4 text-sm bg-gray-800 p-3 rounded-md">{message}</div>}

      {status === "connected" && tables.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Available Tables:</h3>
          <div className="grid grid-cols-2 gap-2">
            {tables.map((table) => (
              <div key={table} className="bg-gray-800 px-3 py-1 rounded text-sm">
                {table}
              </div>
            ))}
          </div>
        </div>
      )}

      {(status === "error" || status === "partial" || tables.length === 0) && (
        <div className="mt-4">
          <Button
            onClick={initializeDatabase}
            disabled={isInitializing}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isInitializing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Initializing...
              </>
            ) : (
              <>Initialize Database</>
            )}
          </Button>
          <p className="text-xs text-gray-400 mt-2">This will create all required tables in your Supabase database.</p>
        </div>
      )}

      {sqlToRun && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-yellow-400">Manual SQL Required</h3>
            <button
              onClick={() => setShowSql(!showSql)}
              className="text-xs flex items-center text-gray-400 hover:text-white"
            >
              <Code className="w-3 h-3 mr-1" />
              {showSql ? "Hide SQL" : "Show SQL"}
            </button>
          </div>

          {showSql && (
            <div className="bg-gray-800 p-3 rounded-md text-xs overflow-auto max-h-60">
              <pre className="whitespace-pre-wrap">{sqlToRun}</pre>
            </div>
          )}

          <p className="text-xs text-gray-400 mt-2">
            Some SQL statements couldn't be executed automatically. Please run them manually in the Supabase SQL Editor.
          </p>
        </div>
      )}
    </div>
  )
}
