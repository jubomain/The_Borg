"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Trash2 } from "lucide-react"

interface ExecutionPanelProps {
  logs?: string[]
  onClose?: () => void
  onClear?: () => void
  workflowId?: string
}

function ExecutionPanel({ logs = [], onClose, onClear, workflowId }: ExecutionPanelProps) {
  const [filter, setFilter] = useState("all")

  // If logs are provided, use them, otherwise use demo logs
  const displayLogs =
    logs.length > 0
      ? logs
      : [
          "[10:15:30] Starting workflow execution...",
          "[10:15:31] Executing trigger node: Schedule Trigger",
          "[10:15:32] Executing agent node: Data Processor",
          "[10:15:33] Agent is processing data...",
          "[10:15:34] Data processed successfully",
          "[10:15:35] Executing condition node: Check Data",
          "[10:15:36] Condition evaluated to: true",
          "[10:15:37] Executing action node: Send Email",
          "[10:15:38] Email sent successfully",
          "[10:15:39] Workflow execution completed",
        ]

  const filteredLogs =
    filter === "all"
      ? displayLogs
      : displayLogs.filter((log) => {
          if (filter === "error") return log.toLowerCase().includes("error") || log.toLowerCase().includes("fail")
          if (filter === "info") return !log.toLowerCase().includes("error") && !log.toLowerCase().includes("fail")
          return true
        })

  return (
    <Card className="absolute bottom-4 right-4 w-96 max-h-[500px] shadow-lg">
      <CardContent className="p-0">
        <div className="flex border-b border-gray-800 px-4 py-2 space-x-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className="text-xs h-7"
          >
            All
          </Button>
          <Button
            variant={filter === "info" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("info")}
            className="text-xs h-7"
          >
            Info
          </Button>
          <Button
            variant={filter === "error" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("error")}
            className="text-xs h-7"
          >
            Errors
          </Button>
        </div>
        <div className="max-h-[350px] overflow-y-auto p-4 space-y-1 bg-gray-950">
          {filteredLogs.length === 0 ? (
            <div className="text-center text-gray-500 py-4">No logs to display</div>
          ) : (
            filteredLogs.map((log, index) => (
              <div
                key={index}
                className={`text-xs font-mono ${
                  log.toLowerCase().includes("error") || log.toLowerCase().includes("fail")
                    ? "text-red-400"
                    : log.toLowerCase().includes("success") || log.toLowerCase().includes("completed")
                      ? "text-green-400"
                      : "text-gray-300"
                }`}
              >
                {log}
              </div>
            ))
          )}
        </div>
        <div className="flex justify-between items-center p-4 border-t border-gray-800">
          <Button variant="ghost" size="sm" onClick={onClear} title="Clear logs">
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose} title="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Export the component as a default export
export default ExecutionPanel

// Also export as a named export for backward compatibility
export { ExecutionPanel }
