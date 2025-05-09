"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Play, Save, Download, Upload, SettingsIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { isDemoMode } from "@/lib/supabase-client"
import { WorkflowCanvasFallback } from "@/components/workflow-canvas-fallback"
import ExecutionPanel from "@/components/execution-panel"

export default function CommandCenterPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("workflows")
  const [workflows, setWorkflows] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedWorkflow, setSelectedWorkflow] = useState(null)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    fetchWorkflows()
  }, [])

  const fetchWorkflows = async () => {
    setIsLoading(true)
    try {
      // Create demo workflows for preview or when there's an error
      const demoWorkflows = [
        {
          id: "workflow-1",
          name: "Twitter to Email Notification",
          description: "Monitors Twitter for specific hashtags and sends email notifications",
          created_at: new Date().toISOString(),
        },
        {
          id: "workflow-2",
          name: "Content Curation Pipeline",
          description: "Automatically curates content and saves to Google Drive",
          created_at: new Date().toISOString(),
        },
        {
          id: "workflow-3",
          name: "Customer Support Bot",
          description: "Handles initial customer inquiries and routes to appropriate teams",
          created_at: new Date().toISOString(),
        },
      ]

      // If we're in demo mode, just use the demo workflows
      if (isDemoMode()) {
        console.log("Using demo workflows in command center")
        setWorkflows(demoWorkflows)
        return
      }

      // Otherwise try to fetch from Supabase
      const response = await fetch("/api/workflows")
      if (!response.ok) {
        throw new Error(`Failed to fetch workflows: ${response.statusText}`)
      }

      const data = await response.json()
      setWorkflows(data.workflows || [])
    } catch (error) {
      console.error("Error fetching workflows:", error)
      // Fallback to demo workflows on error
      setWorkflows([
        {
          id: "workflow-1",
          name: "Twitter to Email Notification",
          description: "Monitors Twitter for specific hashtags and sends email notifications",
          created_at: new Date().toISOString(),
        },
        {
          id: "workflow-2",
          name: "Content Curation Pipeline",
          description: "Automatically curates content and saves to Google Drive",
          created_at: new Date().toISOString(),
        },
        {
          id: "workflow-3",
          name: "Customer Support Bot",
          description: "Handles initial customer inquiries and routes to appropriate teams",
          created_at: new Date().toISOString(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const createNewWorkflow = () => {
    const newWorkflow = {
      id: `workflow-${Date.now()}`,
      name: "New Workflow",
      description: "A new workflow",
      created_at: new Date().toISOString(),
    }
    setWorkflows([newWorkflow, ...workflows])
    setSelectedWorkflow(newWorkflow)
    setActiveTab("editor")
  }

  const selectWorkflow = (workflow) => {
    setSelectedWorkflow(workflow)
    setActiveTab("editor")
  }

  const handleSaveWorkflow = (workflowData) => {
    setWorkflows((currentWorkflows) => {
      const index = currentWorkflows.findIndex((w) => w.id === workflowData.id)
      if (index >= 0) {
        // Update existing workflow
        const updatedWorkflows = [...currentWorkflows]
        updatedWorkflows[index] = {
          ...updatedWorkflows[index],
          name: workflowData.name,
          updated_at: workflowData.updated_at,
        }
        return updatedWorkflows
      } else {
        // Add new workflow
        return [workflowData, ...currentWorkflows]
      }
    })
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Command Center</h1>
        <div className="flex space-x-2">
          <Button onClick={createNewWorkflow} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
          <Button variant="outline" onClick={() => setShowSettings(!showSettings)}>
            <SettingsIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="editor" disabled={!selectedWorkflow}>
            Editor
          </TabsTrigger>
          <TabsTrigger value="execution" disabled={!selectedWorkflow}>
            Execution
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : workflows.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <h3 className="text-xl font-semibold mb-2">No Workflows Found</h3>
                <p className="text-gray-400 mb-4">Create your first workflow to get started</p>
                <Button onClick={createNewWorkflow} className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Workflow
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workflows.map((workflow) => (
                <Card
                  key={workflow.id}
                  className="cursor-pointer hover:border-green-500 transition-colors"
                  onClick={() => selectWorkflow(workflow)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">{workflow.name}</h3>
                    <p className="text-sm text-gray-400 mb-3">{workflow.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Created: {new Date(workflow.created_at).toLocaleDateString()}
                      </span>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="editor" className="space-y-4">
          {selectedWorkflow && (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{selectedWorkflow.name}</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Card className="h-[600px]">
                  <CardContent className="p-0 h-full">
                    <WorkflowCanvasFallback workflowId={selectedWorkflow.id} onSave={handleSaveWorkflow} />
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="execution" className="space-y-4">
          {selectedWorkflow && (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Execution: {selectedWorkflow.name}</h2>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Play className="w-4 h-4 mr-2" />
                  Run Workflow
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <Card className="h-[600px]">
                    <CardContent className="p-0 h-full">
                      <WorkflowCanvasFallback workflowId={selectedWorkflow.id} readOnly={true} />
                    </CardContent>
                  </Card>
                </div>
                <div className="lg:col-span-1">
                  <ExecutionPanel workflowId={selectedWorkflow.id} />
                </div>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
