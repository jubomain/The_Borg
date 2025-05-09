"use client"

import { useState } from "react"
import { Database, RefreshCw, Check, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function DatabaseInitializer() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const initializeDatabase = async () => {
    setIsInitializing(true)
    setStatus("idle")
    setMessage("")

    try {
      const response = await fetch("/api/init-database", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      // Check if response is OK before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Server error:", errorText)
        throw new Error(`Server responded with ${response.status}: ${errorText.substring(0, 100)}...`)
      }

      // Safely parse JSON with error handling
      let data
      try {
        const text = await response.text()
        data = text ? JSON.parse(text) : {}
      } catch (parseError) {
        console.error("JSON parse error:", parseError)
        throw new Error(
          `Failed to parse response: ${parseError instanceof Error ? parseError.message : String(parseError)}`,
        )
      }

      setStatus("success")
      setMessage(data.message || "Database initialized successfully!")
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "An unexpected error occurred")
      console.error("Error initializing database:", error)
    } finally {
      setIsInitializing(false)
    }
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="w-5 h-5 mr-2" />
          Database Initialization
        </CardTitle>
        <CardDescription className="text-gray-400">
          Initialize the database schema for the Borg system. This will create all necessary tables and indexes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Button
            onClick={initializeDatabase}
            disabled={isInitializing}
            className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
          >
            {isInitializing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Initializing...
              </>
            ) : (
              <>
                <Database className="w-4 h-4 mr-2" />
                Initialize Database
              </>
            )}
          </Button>

          {status === "success" && (
            <div className="flex items-center text-green-500">
              <Check className="w-5 h-5 mr-2" />
              {message}
            </div>
          )}

          {status === "error" && (
            <div className="flex items-center text-red-500">
              <AlertTriangle className="w-5 h-5 mr-2" />
              {message}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-sm text-gray-400">
        Note: This operation is safe to run multiple times. It will only create tables that don't already exist.
      </CardFooter>
    </Card>
  )
}
