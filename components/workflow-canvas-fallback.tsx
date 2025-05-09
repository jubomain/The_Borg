"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Save, Play, Pause, Database, Download, Upload, Trash2 } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { supabase, isDemoMode } from "@/lib/supabase-client"
import ExecutionPanel from "./execution-panel"

interface WorkflowCanvasFallbackProps {
  workflowId?: string
  onSave?: (workflowData: any) => void
  readOnly?: boolean
}

export function WorkflowCanvasFallback({ workflowId, onSave, readOnly = false }: WorkflowCanvasFallbackProps) {
  const [workflowName, setWorkflowName] = useState("New Workflow")
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionLogs, setExecutionLogs] = useState<string[]>([])
  const [showExecutionPanel, setShowExecutionPanel] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [nodes, setNodes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load workflow if workflowId is provided
  useEffect(() => {
    if (workflowId) {
      fetchWorkflow(workflowId)
    }
  }, [workflowId])

  const fetchWorkflow = async (id: string) => {
    setIsLoading(true)
    try {
      if (isDemoMode()) {
        // In demo mode, use mock data
        console.log("Demo mode: Using mock workflow data")
        // Simulate a delay for loading
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Set mock data
        setWorkflowName("Demo Workflow")
        setNodes([
          {
            id: "trigger-1",
            type: "trigger",
            name: "Schedule Trigger",
            description: "Runs every day at 9 AM",
            position: { x: 100, y: 100 },
          },
          {
            id: "agent-1",
            type: "agent",
            name: "Data Processor",
            description: "Processes incoming data",
            position: { x: 400, y: 100 },
          },
          {
            id: "condition-1",
            type: "condition",
            name: "Check Data",
            description: "Checks if data meets criteria",
            position: { x: 700, y: 100 },
          },
          {
            id: "action-1",
            type: "action",
            name: "Send Email",
            description: "Sends notification email",
            position: { x: 1000, y: 100 },
          },
        ])
      } else {
        // In normal mode, fetch from Supabase
        // Use a safer approach that doesn't rely on .single()
        const { data, error } = await supabase.from("workflows").select("*").eq("id", id)

        if (error) {
          throw error
        }

        if (data && data.length > 0) {
          const workflow = data[0]
          setWorkflowName(workflow.name || "Untitled Workflow")
          setNodes(workflow.nodes || [])
        } else {
          console.warn("Workflow not found, using default data")
          // Use default nodes if workflow not found
          setWorkflowName("New Workflow")
          setNodes([
            {
              id: "trigger-1",
              type: "trigger",
              name: "New Trigger",
              description: "Start your workflow here",
              position: { x: 100, y: 100 },
            },
          ])
        }
      }
    } catch (error) {
      console.error("Error fetching workflow:", error)
      // Create some demo nodes for preview
      setNodes([
        {
          id: "trigger-1",
          type: "trigger",
          name: "Schedule Trigger",
          description: "Runs every day at 9 AM",
          position: { x: 100, y: 100 },
        },
        {
          id: "agent-1",
          type: "agent",
          name: "Data Processor",
          description: "Processes incoming data",
          position: { x: 400, y: 100 },
        },
        {
          id: "condition-1",
          type: "condition",
          name: "Check Data",
          description: "Checks if data meets criteria",
          position: { x: 700, y: 100 },
        },
        {
          id: "action-1",
          type: "action",
          name: "Send Email",
          description: "Sends notification email",
          position: { x: 1000, y: 100 },
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const onSaveWorkflow = async () => {
    if (!workflowName.trim()) return

    setIsSaving(true)
    addExecutionLog("Saving workflow...")

    const workflowData = {
      id: workflowId || `workflow-${uuidv4()}`,
      name: workflowName,
      nodes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    try {
      if (isDemoMode()) {
        // In demo mode, simulate saving
        await new Promise((resolve) => setTimeout(resolve, 800))
        addExecutionLog("Workflow saved successfully (Demo Mode)")
      } else {
        // In normal mode, save to Supabase
        if (!workflowId) {
          // Create new workflow
          const { error } = await supabase.from("workflows").insert([workflowData])
          if (error) throw error
        } else {
          // Update existing workflow
          const { error } = await supabase
            .from("workflows")
            .update({
              name: workflowName,
              nodes,
              updated_at: new Date().toISOString(),
            })
            .eq("id", workflowId)
          if (error) throw error
        }
      }

      if (onSave) {
        onSave(workflowData)
      }

      addExecutionLog("Workflow saved successfully")
    } catch (error) {
      console.error("Error saving workflow:", error)
      addExecutionLog(`Error saving workflow: ${error}`)
    } finally {
      setIsSaving(false)
    }
  }

  const onExecuteWorkflow = () => {
    setIsExecuting(true)
    setShowExecutionPanel(true)
    setExecutionLogs([])
    addExecutionLog("Starting workflow execution...")

    // Simulate workflow execution
    setTimeout(() => {
      addExecutionLog("Executing trigger node: Scheduled Trigger")
      setTimeout(() => {
        addExecutionLog("Executing agent node: Data Processor")
        setTimeout(() => {
          addExecutionLog("Executing condition node: Check Data")
          setTimeout(() => {
            addExecutionLog("Condition evaluated to: true")
            setTimeout(() => {
              addExecutionLog("Executing action node: Send Email")
              setTimeout(() => {
                addExecutionLog("Email sent successfully")
                addExecutionLog("Workflow execution completed")
                setIsExecuting(false)
              }, 1000)
            }, 800)
          }, 800)
        }, 1000)
      }, 1000)
    }, 1000)
  }

  const addExecutionLog = (message: string) => {
    setExecutionLogs((logs) => [...logs, `[${new Date().toLocaleTimeString()}] ${message}`])
  }

  const handleExportWorkflow = () => {
    const workflowData = {
      name: workflowName,
      nodes,
    }

    // Create a download link for the workflow data
    const blob = new Blob([JSON.stringify(workflowData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${workflowName.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    addExecutionLog("Workflow exported successfully")
  }

  const handleImportWorkflow = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const workflowData = JSON.parse(content)

        if (workflowData.name) {
          setWorkflowName(workflowData.name)
          if (workflowData.nodes) {
            setNodes(workflowData.nodes)
          }
          addExecutionLog("Workflow imported successfully")
        } else {
          addExecutionLog("Error: Invalid workflow file format")
        }
      } catch (error) {
        console.error("Error importing workflow:", error)
        addExecutionLog(`Error importing workflow: ${error}`)
      }
    }
    reader.readAsText(file)

    // Reset the input value so the same file can be imported again
    event.target.value = ""
  }

  const clearExecutionLogs = () => {
    setExecutionLogs([])
  }

  const addNode = (type: string) => {
    const newNode = {
      id: `${type}-${uuidv4()}`,
      type,
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      description: `Description for ${type}`,
      position: { x: Math.random() * 500, y: Math.random() * 300 },
    }
    setNodes([...nodes, newNode])
    addExecutionLog(`Added ${type} node`)
  }

  const removeNode = (id: string) => {
    setNodes(nodes.filter((node) => node.id !== id))
    addExecutionLog(`Removed node`)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="bg-transparent border-b border-gray-700 px-2 py-1 text-xl font-bold focus:outline-none focus:border-green-500"
            placeholder="Workflow Name"
            readOnly={readOnly}
          />
        </div>
        <div className="flex space-x-2">
          {!readOnly && (
            <>
              <button
                onClick={handleExportWorkflow}
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md flex items-center text-sm"
                title="Export Workflow"
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </button>
              <label className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md flex items-center text-sm cursor-pointer">
                <Upload className="w-4 h-4 mr-1" />
                Import
                <input type="file" accept=".json" className="hidden" onChange={handleImportWorkflow} />
              </label>
              <button
                onClick={onSaveWorkflow}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md flex items-center text-sm"
              >
                <Save className="w-4 h-4 mr-1" />
                Save
              </button>
            </>
          )}
          {isExecuting ? (
            <button
              onClick={() => setIsExecuting(false)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md flex items-center text-sm"
            >
              <Pause className="w-4 h-4 mr-1" />
              Stop
            </button>
          ) : (
            <button
              onClick={onExecuteWorkflow}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md flex items-center text-sm"
            >
              <Play className="w-4 h-4 mr-1" />
              Execute
            </button>
          )}
          <button
            onClick={() => setShowExecutionPanel(!showExecutionPanel)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md flex items-center text-sm"
          >
            <Database className="w-4 h-4 mr-1" />
            Logs
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {!readOnly && (
          <div className="w-64 bg-gray-900 border-r border-gray-800 p-4">
            <h3 className="font-medium mb-3">Node Types</h3>
            <div className="space-y-2">
              <button
                className="w-full bg-blue-900 p-3 rounded-md flex items-center"
                onClick={() => addNode("trigger")}
              >
                <div className="w-6 h-6 bg-blue-700 rounded-md flex items-center justify-center mr-2">⏰</div>
                <span>Trigger</span>
              </button>
              <button className="w-full bg-green-900 p-3 rounded-md flex items-center" onClick={() => addNode("agent")}>
                <div className="w-6 h-6 bg-green-700 rounded-md flex items-center justify-center mr-2">🤖</div>
                <span>Agent</span>
              </button>
              <button
                className="w-full bg-yellow-900 p-3 rounded-md flex items-center"
                onClick={() => addNode("condition")}
              >
                <div className="w-6 h-6 bg-yellow-700 rounded-md flex items-center justify-center mr-2">⚙️</div>
                <span>Condition</span>
              </button>
              <button
                className="w-full bg-purple-900 p-3 rounded-md flex items-center"
                onClick={() => addNode("action")}
              >
                <div className="w-6 h-6 bg-purple-700 rounded-md flex items-center justify-center mr-2">🔄</div>
                <span>Action</span>
              </button>
              <button className="w-full bg-gray-800 p-3 rounded-md flex items-center" onClick={() => addNode("data")}>
                <div className="w-6 h-6 bg-gray-700 rounded-md flex items-center justify-center mr-2">💾</div>
                <span>Data</span>
              </button>

              <h4 className="text-sm font-medium text-gray-400 mt-4 mb-2">Integrations</h4>

              <button
                className="w-full bg-indigo-900 p-3 rounded-md flex items-center"
                onClick={() => addNode("slack")}
              >
                <div className="w-6 h-6 bg-indigo-700 rounded-md flex items-center justify-center mr-2">💬</div>
                <span>Slack</span>
              </button>
              <button className="w-full bg-gray-900 p-3 rounded-md flex items-center" onClick={() => addNode("github")}>
                <div className="w-6 h-6 bg-gray-700 rounded-md flex items-center justify-center mr-2">🐙</div>
                <span>GitHub</span>
              </button>
              <button className="w-full bg-orange-900 p-3 rounded-md flex items-center" onClick={() => addNode("api")}>
                <div className="w-6 h-6 bg-orange-700 rounded-md flex items-center justify-center mr-2">🔌</div>
                <span>API</span>
              </button>
            </div>

            <div className="mt-6">
              <h3 className="font-medium mb-3">Instructions</h3>
              <ol className="text-sm text-gray-400 list-decimal pl-5 space-y-2">
                <li>Click on node types to add them to the workflow</li>
                <li>Configure nodes in the properties panel</li>
                <li>Save your workflow when ready</li>
                <li>Execute to test the workflow</li>
              </ol>
            </div>

            <div className="mt-6 p-3 bg-gray-800 rounded-md">
              <h3 className="font-medium mb-2 text-sm">Workflow Stats</h3>
              <div className="text-xs text-gray-400 space-y-1">
                <div className="flex justify-between">
                  <span>Nodes:</span>
                  <span>{nodes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Trigger Nodes:</span>
                  <span>{nodes.filter((n) => n.type === "trigger").length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Agent Nodes:</span>
                  <span>{nodes.filter((n) => n.type === "agent").length}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 relative">
          <div className="h-full bg-gray-950 p-6">
            {nodes.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-xl font-medium mb-2">No nodes added yet</h3>
                  <p className="text-gray-500 mb-4">
                    {readOnly
                      ? "This workflow doesn't have any nodes"
                      : "Click on node types in the sidebar to add them to your workflow"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nodes.map((node) => (
                  <Card
                    key={node.id}
                    className={`overflow-hidden ${
                      node.type === "trigger"
                        ? "border-blue-700"
                        : node.type === "agent"
                          ? "border-green-700"
                          : node.type === "condition"
                            ? "border-yellow-700"
                            : node.type === "action"
                              ? "border-purple-700"
                              : node.type === "data"
                                ? "border-gray-700"
                                : node.type === "slack"
                                  ? "border-indigo-700"
                                  : node.type === "github"
                                    ? "border-gray-700"
                                    : "border-orange-700"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div
                            className={`w-6 h-6 rounded-md flex items-center justify-center mr-2 ${
                              node.type === "trigger"
                                ? "bg-blue-700"
                                : node.type === "agent"
                                  ? "bg-green-700"
                                  : node.type === "condition"
                                    ? "bg-yellow-700"
                                    : node.type === "action"
                                      ? "bg-purple-700"
                                      : node.type === "data"
                                        ? "bg-gray-700"
                                        : node.type === "slack"
                                          ? "bg-indigo-700"
                                          : node.type === "github"
                                            ? "bg-gray-700"
                                            : "bg-orange-700"
                            }`}
                          >
                            {node.type === "trigger"
                              ? "⏰"
                              : node.type === "agent"
                                ? "🤖"
                                : node.type === "condition"
                                  ? "⚙️"
                                  : node.type === "action"
                                    ? "🔄"
                                    : node.type === "data"
                                      ? "💾"
                                      : node.type === "slack"
                                        ? "💬"
                                        : node.type === "github"
                                          ? "🐙"
                                          : "🔌"}
                          </div>
                          <h4 className="font-medium">{node.name}</h4>
                        </div>
                        {!readOnly && (
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeNode(node.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{node.description}</p>
                      <div className="text-xs text-gray-500">
                        {node.type.charAt(0).toUpperCase() + node.type.slice(1)} Node
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {showExecutionPanel && (
            <ExecutionPanel
              logs={executionLogs}
              onClose={() => setShowExecutionPanel(false)}
              onClear={clearExecutionLogs}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default WorkflowCanvasFallback
