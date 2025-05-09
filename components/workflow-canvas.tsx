"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  MarkerType,
} from "reactflow"
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
import { Button } from "@/components/ui/button"
import { Plus, Save, Trash2, Play, Pause, Database, Download, Upload, Undo, Redo } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { supabase } from "@/lib/supabase-client"
import { NodePropertiesPanel } from "./node-properties-panel"
import { ExecutionPanel } from "./execution-panel"

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

// Initial nodes and edges
const initialNodes = [
  {
    id: "1",
    type: "trigger",
    position: { x: 250, y: 100 },
    data: { label: "Workflow Trigger", description: "Starts the workflow" },
  },
]

const initialEdges = []

interface WorkflowCanvasProps {
  workflowId?: string
  onSave?: (workflowData: any) => void
}

export default function WorkflowCanvas({ workflowId, onSave }: WorkflowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const reactFlowWrapper = useRef(null)
  const [reactFlowInstance, setReactFlowInstance] = useState(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionLogs, setExecutionLogs] = useState<string[]>([])
  const [workflowName, setWorkflowName] = useState("New Workflow")
  const [showExecutionPanel, setShowExecutionPanel] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [undoStack, setUndoStack] = useState<{ nodes: any[]; edges: any[] }[]>([])
  const [redoStack, setRedoStack] = useState<{ nodes: any[]; edges: any[] }[]>([])
  const [lastSavedState, setLastSavedState] = useState<{ nodes: any[]; edges: any[] } | null>(null)

  useEffect(() => {
    if (workflowId) {
      fetchWorkflow(workflowId)
    }
  }, [workflowId])

  const fetchWorkflow = async (id) => {
    try {
      const { data, error } = await supabase.from("workflows").select("*").eq("id", id).single()

      if (error) {
        throw error
      }

      if (data && data.nodes && data.edges) {
        setNodes(data.nodes)
        setEdges(data.edges)
      }
    } catch (error) {
      console.error("Error fetching workflow:", error)
    }
  }

  // Load workflow from Supabase if workflowId is provided
  useEffect(() => {
    const loadWorkflow = async () => {
      if (!workflowId) return

      try {
        addExecutionLog("Loading workflow...")
        const { data, error } = await supabase.from("workflows").select("*").eq("id", workflowId).single()

        if (error) throw error

        if (data) {
          setWorkflowName(data.name)
          setNodes(data.nodes || [])
          setEdges(data.edges || [])
          setLastSavedState({ nodes: data.nodes || [], edges: data.edges || [] })
          addExecutionLog("Workflow loaded successfully")
        }
      } catch (error) {
        console.error("Error loading workflow:", error)
        addExecutionLog(`Error loading workflow: ${error}`)
      }
    }

    loadWorkflow()
  }, [workflowId])

  // Save current state to undo stack when nodes or edges change
  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      // Don't add to undo stack if we're just loading the workflow
      if (lastSavedState === null) {
        setLastSavedState({ nodes, edges })
        return
      }

      // Only add to undo stack if something actually changed
      const lastState = undoStack[undoStack.length - 1] || lastSavedState
      const nodesChanged = JSON.stringify(nodes) !== JSON.stringify(lastState?.nodes || [])
      const edgesChanged = JSON.stringify(edges) !== JSON.stringify(lastState?.edges || [])

      if (nodesChanged || edgesChanged) {
        setUndoStack((stack) => [...stack, { nodes: [...nodes], edges: [...edges] }])
        // Clear redo stack when a new change is made
        setRedoStack([])
      }
    }
  }, [nodes, edges])

  const onConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        type: "custom",
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        animated: true,
      }
      setEdges((eds) => addEdge(newEdge, eds))
    },
    [setEdges],
  )

  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  // Update the onDrop function to handle new node types
  const onDrop = useCallback(
    (event) => {
      event.preventDefault()

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const type = event.dataTransfer.getData("application/reactflow")

      // Check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      const newNode = {
        id: `${Date.now()}`,
        type,
        position,
        data: { label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node` },
      }

      // Add specific data based on node type
      switch (type) {
        case "agent":
          newNode.data = {
            ...newNode.data,
            name: "New Agent",
            description: "Agent description",
            model: "gpt-4",
            temperature: 0.7,
          }
          break
        case "trigger":
          newNode.data = {
            ...newNode.data,
            name: "New Trigger",
            description: "Trigger description",
            triggerType: "schedule",
            schedule: "0 0 * * *",
          }
          break
        case "condition":
          newNode.data = {
            ...newNode.data,
            name: "New Condition",
            description: "Condition description",
            condition: "data.value > 10",
          }
          break
        case "action":
          newNode.data = {
            ...newNode.data,
            name: "New Action",
            description: "Action description",
            actionType: "http",
            endpoint: "https://api.example.com",
            method: "POST",
          }
          break
        case "data":
          newNode.data = {
            ...newNode.data,
            name: "New Data",
            description: "Data description",
            dataType: "json",
            schema: "{}",
          }
          break
        case "slack":
          newNode.data = {
            ...newNode.data,
            name: "Slack Integration",
            description: "Send messages to Slack",
            channel: "#general",
            message: "Hello from BORG!",
          }
          break
        case "github":
          newNode.data = {
            ...newNode.data,
            name: "GitHub Integration",
            description: "Interact with GitHub",
            repo: "owner/repo",
            action: "create_issue",
          }
          break
        case "api":
          newNode.data = {
            ...newNode.data,
            name: "API Integration",
            description: "Call external API",
            url: "https://api.example.com",
            method: "GET",
            headers: "{}",
          }
          break
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance, setNodes],
  )

  const onNodeClick = (event, node) => {
    setSelectedNode(node)
  }

  const onNodeDragStart = (event, node) => {
    setIsDragging(true)
  }

  const onNodeDragStop = (event, node) => {
    setIsDragging(false)
  }

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [setSelectedNode])

  const onSaveWorkflow = async () => {
    if (!workflowName.trim()) return

    setIsSaving(true)
    addExecutionLog("Saving workflow...")

    const workflowData = {
      id: workflowId || `workflow-${uuidv4()}`,
      name: workflowName,
      nodes,
      edges,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    try {
      // Save to Supabase
      const { error } = await supabase.from("workflows").upsert(workflowData)

      if (error) throw error

      // Update last saved state
      setLastSavedState({ nodes: [...nodes], edges: [...edges] })

      // Call the onSave callback if provided
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

    // Find trigger nodes to start execution
    const triggerNodes = nodes.filter((node) => node.type === "trigger")
    if (triggerNodes.length === 0) {
      addExecutionLog("No trigger nodes found. Add a trigger node to start the workflow.")
      setIsExecuting(false)
      return
    }

    // Start execution from each trigger node
    triggerNodes.forEach((triggerNode) => {
      executeNode(triggerNode)
    })
  }

  const executeNode = async (node: any) => {
    addExecutionLog(`Executing node: ${node.data.label}`)

    // Highlight the current node being executed
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === node.id) {
          return {
            ...n,
            style: { ...n.style, boxShadow: "0 0 10px 5px rgba(0, 255, 157, 0.75)" },
          }
        }
        return n
      }),
    )

    // Simulate node execution based on type
    await new Promise((resolve) => setTimeout(resolve, 1000))

    switch (node.type) {
      case "agent":
        addExecutionLog(`Agent "${node.data.name}" is processing...`)
        await simulateAgentExecution(node)
        break
      case "trigger":
        addExecutionLog(`Trigger "${node.data.triggerType}" activated`)
        break
      case "condition":
        addExecutionLog(`Evaluating condition: ${node.data.condition}`)
        await simulateConditionExecution(node)
        break
      case "action":
        addExecutionLog(`Performing action: ${node.data.actionType}`)
        await simulateActionExecution(node)
        break
      case "data":
        addExecutionLog(`Accessing data source: ${node.data.dataSource}`)
        await simulateDataExecution(node)
        break
    }

    // Reset node highlight
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === node.id) {
          return {
            ...n,
            style: { ...n.style, boxShadow: "none" },
          }
        }
        return n
      }),
    )

    // Find outgoing edges from this node
    const outgoingEdges = edges.filter((edge) => edge.source === node.id)

    // If this is a condition node, handle true/false paths
    if (node.type === "condition") {
      const conditionResult = Math.random() > 0.5 // Simulate condition result
      addExecutionLog(`Condition evaluated to: ${conditionResult}`)

      // Find the edge with the appropriate condition
      const nextEdge = edges.find(
        (edge) => edge.source === node.id && edge.sourceHandle === (conditionResult ? "true" : "false"),
      )

      if (nextEdge) {
        const nextNode = nodes.find((n) => n.id === nextEdge.target)
        if (nextNode) {
          // Highlight the edge being traversed
          setEdges((eds) =>
            eds.map((e) => {
              if (e.id === nextEdge.id) {
                return {
                  ...e,
                  animated: true,
                  style: { ...e.style, stroke: "#00FF9D", strokeWidth: 3 },
                }
              }
              return e
            }),
          )

          await new Promise((resolve) => setTimeout(resolve, 500))
          await executeNode(nextNode)

          // Reset edge highlight
          setEdges((eds) =>
            eds.map((e) => {
              if (e.id === nextEdge.id) {
                return {
                  ...e,
                  animated: false,
                  style: { ...e.style, stroke: "#00FF9D", strokeWidth: 1 },
                }
              }
              return e
            }),
          )
        }
      }
    } else {
      // For non-condition nodes, follow all outgoing edges
      for (const edge of outgoingEdges) {
        const nextNode = nodes.find((n) => n.id === edge.target)
        if (nextNode) {
          // Highlight the edge being traversed
          setEdges((eds) =>
            eds.map((e) => {
              if (e.id === edge.id) {
                return {
                  ...e,
                  animated: true,
                  style: { ...e.style, stroke: "#00FF9D", strokeWidth: 3 },
                }
              }
              return e
            }),
          )

          await new Promise((resolve) => setTimeout(resolve, 500))
          await executeNode(nextNode)

          // Reset edge highlight
          setEdges((eds) =>
            eds.map((e) => {
              if (e.id === edge.id) {
                return {
                  ...e,
                  animated: false,
                  style: { ...e.style, stroke: "#00FF9D", strokeWidth: 1 },
                }
              }
              return e
            }),
          )
        }
      }
    }

    // If no outgoing edges, this is an end node
    if (outgoingEdges.length === 0) {
      addExecutionLog(`Node "${node.data.label}" completed (end node)`)
    }
  }

  const simulateAgentExecution = async (node: any) => {
    addExecutionLog(`Agent "${node.data.name}" is thinking...`)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulate agent response
    const response = `I am the ${node.data.name} agent. I have processed your request and here is my response.`
    addExecutionLog(`Agent response: "${response}"`)

    // Store agent state in Supabase
    try {
      const { error } = await supabase.from("agent_states").upsert({
        agent_id: node.id,
        workflow_id: workflowId || "temp",
        state: { lastResponse: response, timestamp: new Date().toISOString() },
        updated_at: new Date().toISOString(),
      })

      if (error) throw error
      addExecutionLog(`Agent state saved to Supabase`)
    } catch (error) {
      console.error("Error saving agent state:", error)
      addExecutionLog(`Error saving agent state: ${error}`)
    }
  }

  const simulateConditionExecution = async (node: any) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const result = Math.random() > 0.5
    addExecutionLog(`Condition evaluated to: ${result}`)
    return result
  }

  const simulateActionExecution = async (node: any) => {
    addExecutionLog(`Performing ${node.data.actionType} action...`)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    switch (node.data.actionType) {
      case "email":
        addExecutionLog(`Email sent successfully to ${node.data.recipient || "recipient"}`)
        break
      case "webhook":
        addExecutionLog(`Webhook triggered successfully to ${node.data.url || "URL"}`)
        break
      case "database":
        addExecutionLog(`Database operation completed on ${node.data.table || "table"}`)
        break
      case "googleDrive":
        addExecutionLog(`File saved to Google Drive in ${node.data.folder || "folder"}`)
        break
      case "twitter":
        if (node.data.twitterAction === "post") {
          addExecutionLog(`Tweet posted successfully`)
        } else if (node.data.twitterAction === "search") {
          addExecutionLog(`Twitter search completed`)
        } else if (node.data.twitterAction === "monitor") {
          addExecutionLog(`Twitter monitoring started for ${node.data.hashtag || "hashtag"}`)
        } else {
          addExecutionLog(`Twitter action completed`)
        }
        break
      default:
        addExecutionLog(`Action ${node.data.actionType} completed`)
    }
  }

  const simulateDataExecution = async (node: any) => {
    addExecutionLog(`Querying ${node.data.dataSource}...`)
    await new Promise((resolve) => setTimeout(resolve, 1200))

    switch (node.data.dataSource) {
      case "supabase":
        addExecutionLog(`Data retrieved from Supabase table: ${node.data.table || "table"}`)
        break
      case "googleSheets":
        addExecutionLog(`Data retrieved from Google Sheets: ${node.data.sheetId || "sheet"}`)
        break
      case "airtable":
        addExecutionLog(`Data retrieved from Airtable: ${node.data.baseId || "base"}`)
        break
      case "csv":
        addExecutionLog(`Data retrieved from CSV file`)
        break
      default:
        addExecutionLog(`Data retrieved successfully`)
    }
  }

  const onStopExecution = () => {
    setIsExecuting(false)
    addExecutionLog("Workflow execution stopped")
  }

  const addExecutionLog = (message: string) => {
    setExecutionLogs((logs) => [...logs, `[${new Date().toLocaleTimeString()}] ${message}`])
  }

  const onNodeUpdate = (updatedNode: any) => {
    setNodes((nds) => nds.map((n) => (n.id === updatedNode.id ? updatedNode : n)))
    setSelectedNode(updatedNode)
  }

  const onDeleteNode = () => {
    if (!selectedNode) return

    // Delete the node
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id))

    // Delete any connected edges
    setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id))

    setSelectedNode(null)
  }

  const handleUndo = () => {
    if (undoStack.length === 0) return

    // Get the last state from the undo stack
    const lastState = undoStack[undoStack.length - 1]

    // Add current state to redo stack
    setRedoStack((stack) => [...stack, { nodes: [...nodes], edges: [...edges] }])

    // Remove the last state from the undo stack
    setUndoStack((stack) => stack.slice(0, -1))

    // Set the nodes and edges to the last state
    setNodes(lastState.nodes)
    setEdges(lastState.edges)
  }

  const handleRedo = () => {
    if (redoStack.length === 0) return

    // Get the last state from the redo stack
    const lastState = redoStack[redoStack.length - 1]

    // Add current state to undo stack
    setUndoStack((stack) => [...stack, { nodes: [...nodes], edges: [...edges] }])

    // Remove the last state from the redo stack
    setRedoStack((stack) => stack.slice(0, -1))

    // Set the nodes and edges to the last state
    setNodes(lastState.nodes)
    setEdges(lastState.edges)
  }

  const handleExportWorkflow = () => {
    const workflowData = {
      name: workflowName,
      nodes,
      edges,
    }

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

        if (workflowData.nodes && workflowData.edges) {
          setWorkflowName(workflowData.name || "Imported Workflow")
          setNodes(workflowData.nodes)
          setEdges(workflowData.edges)
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

  const onDelete = (type) => {
    const newNode = {
      id: `${Date.now()}`,
      type,
      position: { x: 100, y: 100 },
      data: { label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node` },
    }

    setNodes((nds) => nds.concat(newNode))
  }

  const handleCanvasSave = async () => {
    if (!workflowId) return

    try {
      const { error } = await supabase
        .from("workflows")
        .update({
          nodes,
          edges,
          updated_at: new Date().toISOString(),
        })
        .eq("id", workflowId)

      if (error) {
        throw error
      }

      alert("Workflow saved successfully!")
    } catch (error) {
      console.error("Error saving workflow:", error)
      alert("Error saving workflow")
    }
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
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md flex items-center text-sm disabled:opacity-50"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md flex items-center text-sm disabled:opacity-50"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
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
              onClick={onStopExecution}
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
            <div
              className="bg-blue-900 p-3 rounded-md cursor-move flex items-center"
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData("application/reactflow", "trigger")
              }}
            >
              <div className="w-6 h-6 bg-blue-700 rounded-md flex items-center justify-center mr-2">⏰</div>
              <span>Trigger</span>
            </div>
            <div
              className="bg-green-900 p-3 rounded-md cursor-move flex items-center"
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData("application/reactflow", "agent")
              }}
            >
              <div className="w-6 h-6 bg-green-700 rounded-md flex items-center justify-center mr-2">🤖</div>
              <span>Agent</span>
            </div>
            <div
              className="bg-yellow-900 p-3 rounded-md cursor-move flex items-center"
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData("application/reactflow", "condition")
              }}
            >
              <div className="w-6 h-6 bg-yellow-700 rounded-md flex items-center justify-center mr-2">⚙️</div>
              <span>Condition</span>
            </div>
            <div
              className="bg-purple-900 p-3 rounded-md cursor-move flex items-center"
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData("application/reactflow", "action")
              }}
            >
              <div className="w-6 h-6 bg-purple-700 rounded-md flex items-center justify-center mr-2">🔄</div>
              <span>Action</span>
            </div>
            <div
              className="bg-gray-800 p-3 rounded-md cursor-move flex items-center"
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData("application/reactflow", "data")
              }}
            >
              <div className="w-6 h-6 bg-gray-700 rounded-md flex items-center justify-center mr-2">💾</div>
              <span>Data</span>
            </div>

            <h4 className="text-sm font-medium text-gray-400 mt-4 mb-2">Integrations</h4>

            <div
              className="bg-indigo-900 p-3 rounded-md cursor-move flex items-center"
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData("application/reactflow", "slack")
              }}
            >
              <div className="w-6 h-6 bg-indigo-700 rounded-md flex items-center justify-center mr-2">💬</div>
              <span>Slack</span>
            </div>
            <div
              className="bg-gray-900 p-3 rounded-md cursor-move flex items-center"
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData("application/reactflow", "github")
              }}
            >
              <div className="w-6 h-6 bg-gray-700 rounded-md flex items-center justify-center mr-2">🐙</div>
              <span>GitHub</span>
            </div>
            <div
              className="bg-orange-900 p-3 rounded-md cursor-move flex items-center"
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData("application/reactflow", "api")
              }}
            >
              <div className="w-6 h-6 bg-orange-700 rounded-md flex items-center justify-center mr-2">🔌</div>
              <span>API</span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-3">Instructions</h3>
            <ol className="text-sm text-gray-400 list-decimal pl-5 space-y-2">
              <li>Drag node types onto the canvas</li>
              <li>Connect nodes by dragging from handles</li>
              <li>Click on nodes to edit properties</li>
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
                <span>Connections:</span>
                <span>{edges.length}</span>
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
          <div className="h-full" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={onNodeClick}
              onNodeDragStart={onNodeDragStart}
              onNodeDragStop={onNodeDragStop}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              fitView
              deleteKeyCode={["Backspace", "Delete"]}
            >
              <Controls />
              <MiniMap
                nodeColor={(node) => {
                  switch (node.type) {
                    case "agent":
                      return "#00FF9D"
                    case "trigger":
                      return "#3B82F6"
                    case "condition":
                      return "#EAB308"
                    case "action":
                      return "#A855F7"
                    case "data":
                      return "#6B7280"
                    default:
                      return "#ffffff"
                  }
                }}
                maskColor="rgba(0, 0, 0, 0.5)"
              />
              <Background variant="dots" gap={12} size={1} />

              <Panel position="top-right" className="flex space-x-2">
                <Button onClick={handleCanvasSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                {selectedNode && (
                  <button
                    onClick={onDeleteNode}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md"
                    title="Delete selected node"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </Panel>

              <Panel position="top-left" className="flex flex-col space-y-2">
                <div className="bg-gray-800 p-2 rounded-md">
                  <h3 className="text-sm font-medium mb-2">Add Nodes</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onDragStart={(event) => {
                        event.dataTransfer.setData("application/reactflow", "agent")
                      }}
                      draggable
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Agent
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onDragStart={(event) => {
                        event.dataTransfer.setData("application/reactflow", "trigger")
                      }}
                      draggable
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Trigger
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onDragStart={(event) => {
                        event.dataTransfer.setData("application/reactflow", "condition")
                      }}
                      draggable
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Condition
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onDragStart={(event) => {
                        event.dataTransfer.setData("application/reactflow", "action")
                      }}
                      draggable
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Action
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onDragStart={(event) => {
                        event.dataTransfer.setData("application/reactflow", "data")
                      }}
                      draggable
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Data
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onDragStart={(event) => {
                        event.dataTransfer.setData("application/reactflow", "slack")
                      }}
                      draggable
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Slack
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onDragStart={(event) => {
                        event.dataTransfer.setData("application/reactflow", "github")
                      }}
                      draggable
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      GitHub
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onDragStart={(event) => {
                        event.dataTransfer.setData("application/reactflow", "api")
                      }}
                      draggable
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      API
                    </Button>
                  </div>
                </div>
              </Panel>

              <Panel position="bottom-center" className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => onDelete("agent")}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Canvas
                </Button>
              </Panel>
            </ReactFlow>
          </div>

          {selectedNode && (
            <NodePropertiesPanel node={selectedNode} onUpdate={onNodeUpdate} onClose={() => setSelectedNode(null)} />
          )}

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
