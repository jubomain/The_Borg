"use client"

import { useState, useEffect } from "react"
import ReactFlow, { MiniMap, Controls, Background, MarkerType } from "reactflow"
import "reactflow/dist/style.css"
import { AgentNode } from "./nodes/agent-node"
import { TriggerNode } from "./nodes/trigger-node"
import { ConditionNode } from "./nodes/condition-node"
import { ActionNode } from "./nodes/action-node"
import { DataNode } from "./nodes/data-node"
import { SlackNode } from "./nodes/slack-node"
import { GithubNode } from "./nodes/github-node"
import { ApiNode } from "./nodes/api-node"
import { CustomEdge } from "./edges/custom-edge"
import { supabase } from "@/lib/supabase-client"
import type React from "react"

import { Save, Play, Pause, Database, Download, Upload } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import ExecutionPanel from "./execution-panel"

// Define node types
const nodeTypes = {
  agent: AgentNode,
  trigger: TriggerNode,
  condition: ConditionNode,
  action: ActionNode,
  data: DataNode,
  slack: SlackNode,
  github: GithubNode,
  api: ApiNode,
}

// Define edge types
const edgeTypes = {
  custom: CustomEdge,
}

interface WorkflowCanvasProps {
  workflowId?: string
  onSave?: (workflowData: any) => void
}

export default function WorkflowCanvas({ workflowId, onSave }: WorkflowCanvasProps) {
  const [workflowName, setWorkflowName] = useState("New Workflow")
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionLogs, setExecutionLogs] = useState<string[]>([])
  const [showExecutionPanel, setShowExecutionPanel] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [nodes, setNodes] = useState<any[]>([])
  const [edges, setEdges] = useState([])
  const [selectedNodeType, setSelectedNodeType] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load workflow if workflowId is provided
  useEffect(() => {
    if (workflowId) {
      fetchWorkflow(workflowId)
      // addExecutionLog("Loading workflow...")
      // Simulate loading workflow data
      // setTimeout(() => {
      //   setWorkflowName(workflowId === "workflow-1" ? "Twitter to Email Notification" : "Content Curation Pipeline")
      //   addExecutionLog("Workflow loaded successfully")
      // }, 1000)
    }
  }, [workflowId])

  const fetchWorkflow = async (id) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.from("workflows").select("*").eq("id", id).single()

      if (error) {
        throw error
      }

      if (data && data.nodes && data.edges) {
        setNodes(data.nodes)
        setEdges(
          data.edges.map((edge) => ({
            ...edge,
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
          })),
        )
      }
    } catch (error) {
      console.error("Error fetching workflow:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const onSaveWorkflow = async () => {
    if (!workflowName.trim()) return

    setIsSaving(true)
    addExecutionLog("Saving workflow...")

    // Simulate saving
    setTimeout(() => {
      const workflowData = {
        id: workflowId || `workflow-${uuidv4()}`,
        name: workflowName,
        nodes,
        edges,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      if (onSave) {
        onSave(workflowData)
      }

      addExecutionLog("Workflow saved successfully")
      setIsSaving(false)
    }, 1500)
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
      edges,
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
          if (workflowData.edges) {
            setEdges(workflowData.edges)
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
    }
    setNodes([...nodes, newNode])
    addExecutionLog(`Added ${type} node`)
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
          />
        </div>
        <div className="flex space-x-2">
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
        <div className="w-64 bg-gray-900 border-r border-gray-800 p-4">
          <h3 className="font-medium mb-3">Node Types</h3>
          <div className="space-y-2">
            <button className="w-full bg-blue-900 p-3 rounded-md flex items-center" onClick={() => addNode("trigger")}>
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
            <button className="w-full bg-purple-900 p-3 rounded-md flex items-center" onClick={() => addNode("action")}>
              <div className="w-6 h-6 bg-purple-700 rounded-md flex items-center justify-center mr-2">🔄</div>
              <span>Action</span>
            </button>
            <button className="w-full bg-gray-800 p-3 rounded-md flex items-center" onClick={() => addNode("data")}>
              <div className="w-6 h-6 bg-gray-700 rounded-md flex items-center justify-center mr-2">💾</div>
              <span>Data</span>
            </button>

            <h4 className="text-sm font-medium text-gray-400 mt-4 mb-2">Integrations</h4>

            <button className="w-full bg-indigo-900 p-3 rounded-md flex items-center" onClick={() => addNode("slack")}>
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

        <div className="flex-1 relative">
          <div className="h-full bg-gray-950 p-6">
            {nodes.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-xl font-medium mb-2">No nodes added yet</h3>
                  <p className="text-gray-500 mb-4">Click on node types in the sidebar to add them to your workflow</p>
                </div>
              </div>
            ) : (
              // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              //   {nodes.map((node) => (
              //     <div
              //       key={node.id}
              //       className={`p-4 rounded-lg border-2 ${
              //         node.type === "trigger"
              //           ? "bg-blue-900/30 border-blue-700"
              //           : node.type === "agent"
              //             ? "bg-green-900/30 border-green-700"
              //             : node.type === "condition"
              //               ? "bg-yellow-900/30 border-yellow-700"
              //               : node.type === "action"
              //                 ? "bg-purple-900/30 border-purple-700"
              //                 : node.type === "data"
              //                   ? "bg-gray-800/30 border-gray-700"
              //                   : node.type === "slack"
              //                     ? "bg-indigo-900/30 border-indigo-700"
              //                     : node.type === "github"
              //                       ? "bg-gray-900/30 border-gray-700"
              //                       : "bg-orange-900/30 border-orange-700"
              //       }`}
              //     >
              //       <div className="flex items-center mb-2">
              //         <div
              //           className={`w-6 h-6 rounded-md flex items-center justify-center mr-2 ${
              //             node.type === "trigger"
              //               ? "bg-blue-700"
              //               : node.type === "agent"
              //                 ? "bg-green-700"
              //                 : node.type === "condition"
              //                   ? "bg-yellow-700"
              //                   : node.type === "action"
              //                     ? "bg-purple-700"
              //                     : node.type === "data"
              //                       ? "bg-gray-700"
              //                       : node.type === "slack"
              //                         ? "bg-indigo-700"
              //                         : node.type === "github"
              //                           ? "bg-gray-700"
              //                           : "bg-orange-700"
              //           }`}
              //         >
              //           {node.type === "trigger"
              //             ? "⏰"
              //             : node.type === "agent"
              //               ? "🤖"
              //               : node.type === "condition"
              //                 ? "⚙️"
              //                 : node.type === "action"
              //                   ? "🔄"
              //                   : node.type === "data"
              //                     ? "💾"
              //                     : node.type === "slack"
              //                       ? "💬"
              //                       : node.type === "github"
              //                         ? "🐙"
              //                         : "🔌"}
              //         </div>
              //         <h4 className="font-medium">{node.name}</h4>
              //       </div>
              //       <div className="text-sm text-gray-400">
              //         {node.type.charAt(0).toUpperCase() + node.type.slice(1)} Node
              //       </div>
              //       <div className="mt-2 flex justify-end">
              //         <button
              //           className="text-xs text-gray-400 hover:text-white"
              //           onClick={() => {
              //             setNodes(nodes.filter((n) => n.id !== node.id))
              //             addExecutionLog(`Removed ${node.type} node`)
              //           }}
              //         >
              //           Remove
              //         </button>
              //       </div>
              //     </div>
              //   ))}
              // </div>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
                attributionPosition="bottom-right"
                nodesDraggable={true}
                nodesConnectable={true}
                elementsSelectable={true}
                zoomOnScroll={true}
                panOnScroll={true}
              >
                <Controls showInteractive={true} />
                <MiniMap />
                <Background variant="dots" gap={12} size={1} />
              </ReactFlow>
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
