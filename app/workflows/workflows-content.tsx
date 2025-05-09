"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, Play, Pause, Edit, Trash2, Clock, Check, X, AlertTriangle, Loader2 } from "lucide-react"
import { isDemoMode, getMockData } from "@/lib/supabase-client"

// Define the Workflow type
interface Workflow {
  id: string
  name: string
  description: string
  status: "active" | "paused" | "draft"
  last_run: string | null
  success_rate: number
  created_at: string
  updated_at: string
}

export default function WorkflowsContent() {
  const [activeTab, setActiveTab] = useState("all")
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchWorkflows() {
      try {
        setLoading(true)

        // Check if we're in demo mode
        if (isDemoMode()) {
          console.log("Running in demo mode - using mock workflows data")
          // Use mock data in demo mode
          const mockWorkflows = getMockData("workflows") as Workflow[]
          setWorkflows(mockWorkflows)
          return
        }

        // In production mode, fetch from API
        const response = await fetch("/api/workflows")

        if (!response.ok) {
          throw new Error(`Failed to fetch workflows: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        setWorkflows(data.workflows || [])
      } catch (err) {
        console.error("Error fetching workflows:", err)
        setError("Failed to load workflows. Please try again later.")

        // Fallback to mock data if there's an error
        const mockWorkflows = getMockData("workflows") as Workflow[]
        setWorkflows(mockWorkflows)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkflows()
  }, [])

  const filteredWorkflows =
    activeTab === "all"
      ? workflows
      : workflows.filter((wf) =>
          activeTab === "active"
            ? wf.status === "active"
            : activeTab === "paused"
              ? wf.status === "paused"
              : wf.status === "draft",
        )

  async function toggleWorkflowStatus(id: string, currentStatus: string) {
    try {
      const newStatus = currentStatus === "active" ? "paused" : "active"

      if (isDemoMode()) {
        // In demo mode, just update the local state
        setWorkflows(workflows.map((wf) => (wf.id === id ? { ...wf, status: newStatus } : wf)))
        return
      }

      // In production mode, call the API
      const response = await fetch(`/api/workflows/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update workflow status: ${response.status} ${response.statusText}`)
      }

      // Update local state
      setWorkflows(workflows.map((wf) => (wf.id === id ? { ...wf, status: newStatus } : wf)))
    } catch (err) {
      console.error("Error updating workflow status:", err)
      setError("Failed to update workflow status. Please try again.")
    }
  }

  async function deleteWorkflow(id: string) {
    if (!confirm("Are you sure you want to delete this workflow?")) {
      return
    }

    try {
      if (isDemoMode()) {
        // In demo mode, just update the local state
        setWorkflows(workflows.filter((wf) => wf.id !== id))
        return
      }

      // In production mode, call the API
      const response = await fetch(`/api/workflows/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Failed to delete workflow: ${response.status} ${response.statusText}`)
      }

      // Update local state
      setWorkflows(workflows.filter((wf) => wf.id !== id))
    } catch (err) {
      console.error("Error deleting workflow:", err)
      setError("Failed to delete workflow. Please try again.")
    }
  }

  return (
    <main className="flex-1 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Workflow Management</h1>
        <Link href="/command-center">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Workflow
          </Button>
        </Link>
      </div>

      {error && <div className="bg-red-900/30 border border-red-700 text-red-200 p-4 rounded-md mb-6">{error}</div>}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-[#1E1E1E] border-gray-800">
          <TabsTrigger value="all" className="data-[state=active]:bg-gray-800 text-white">
            All Workflows
          </TabsTrigger>
          <TabsTrigger value="active" className="data-[state=active]:bg-gray-800 text-white">
            Active
          </TabsTrigger>
          <TabsTrigger value="paused" className="data-[state=active]:bg-gray-800 text-white">
            Paused
          </TabsTrigger>
          <TabsTrigger value="draft" className="data-[state=active]:bg-gray-800 text-white">
            Drafts
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : filteredWorkflows.length === 0 ? (
            <Card className="bg-[#1E1E1E] border-gray-800 text-white">
              <CardContent className="flex flex-col items-center justify-center p-6 h-40">
                <p className="text-gray-400 mb-4">No workflows found in this category</p>
                <Link href="/command-center">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Workflow
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            filteredWorkflows.map((workflow) => (
              <Card key={workflow.id} className="bg-[#1E1E1E] border-gray-800 text-white">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-6">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium">{workflow.name}</h3>
                        <div
                          className={`ml-3 px-2 py-1 text-xs rounded-full ${
                            workflow.status === "active"
                              ? "bg-green-900 text-green-300"
                              : workflow.status === "paused"
                                ? "bg-yellow-900 text-yellow-300"
                                : "bg-gray-800 text-gray-300"
                          }`}
                        >
                          {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                        </div>
                      </div>
                      <p className="text-gray-400 mt-1">{workflow.description}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Last run: {workflow.last_run || "Never"}</span>
                        {workflow.status !== "draft" && (
                          <div className="ml-4 flex items-center">
                            {workflow.success_rate > 95 ? (
                              <Check className="w-4 h-4 mr-1 text-green-500" />
                            ) : workflow.success_rate > 80 ? (
                              <AlertTriangle className="w-4 h-4 mr-1 text-yellow-500" />
                            ) : (
                              <X className="w-4 h-4 mr-1 text-red-500" />
                            )}
                            <span>Success rate: {workflow.success_rate}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4 md:mt-0">
                      <Link href={`/command-center?edit=${workflow.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-700 bg-gray-800 hover:bg-gray-700 text-white"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      {workflow.status === "active" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-700 bg-gray-800 hover:bg-gray-700 text-white"
                          onClick={() => toggleWorkflowStatus(workflow.id, workflow.status)}
                        >
                          <Pause className="w-4 h-4 mr-1" />
                          Pause
                        </Button>
                      ) : workflow.status === "paused" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-700 bg-gray-800 hover:bg-gray-700 text-white"
                          onClick={() => toggleWorkflowStatus(workflow.id, workflow.status)}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Resume
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-700 bg-gray-800 hover:bg-gray-700 text-white"
                          onClick={() => toggleWorkflowStatus(workflow.id, workflow.status)}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Activate
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-700 bg-gray-800 hover:bg-red-900 text-red-500 hover:text-red-400"
                        onClick={() => deleteWorkflow(workflow.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </main>
  )
}
