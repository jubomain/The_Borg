"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import { Code, GitBranch, GitCommit, GitPullRequest, RefreshCw } from "lucide-react"

interface EvolutionTask {
  id: string
  title: string
  description: string
  status: "pending" | "in_progress" | "completed" | "failed"
  priority: "low" | "medium" | "high"
  created_at: string
  completed_at?: string
  code_changes?: string
}

export default function EvolutionEngine() {
  const [tasks, setTasks] = useState<EvolutionTask[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExecuting, setIsExecuting] = useState(false)
  const [selectedTask, setSelectedTask] = useState<EvolutionTask | null>(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("evolution_tasks")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      setTasks(data || [])
    } catch (error) {
      console.error("Error fetching evolution tasks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const executeTask = async (taskId: string) => {
    setIsExecuting(true)
    try {
      // Update task status to in_progress
      await supabase.from("evolution_tasks").update({ status: "in_progress" }).eq("id", taskId)

      // Simulate task execution
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Update task status to completed
      const completedAt = new Date().toISOString()
      await supabase
        .from("evolution_tasks")
        .update({
          status: "completed",
          completed_at: completedAt,
          code_changes: "// Example code changes\nfunction improvedFunction() {\n  // New implementation\n}",
        })
        .eq("id", taskId)

      // Refresh tasks
      fetchTasks()
    } catch (error) {
      console.error("Error executing task:", error)
      // Update task status to failed
      await supabase.from("evolution_tasks").update({ status: "failed" }).eq("id", taskId)
    } finally {
      setIsExecuting(false)
    }
  }

  const handleTaskClick = (task: EvolutionTask) => {
    setSelectedTask(task)
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium flex items-center">
          <GitBranch className="w-5 h-5 mr-2" />
          Self-Evolution Engine
        </h2>
        <button
          onClick={fetchTasks}
          disabled={isLoading}
          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md flex items-center text-sm"
        >
          <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <h3 className="font-medium mb-3">Evolution Tasks</h3>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-gray-500" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="bg-gray-800 rounded-md p-4 text-center">
              <p className="text-gray-500">No evolution tasks found</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`bg-gray-800 rounded-md p-3 cursor-pointer hover:bg-gray-700 transition-colors ${
                    selectedTask?.id === task.id ? "border-2 border-green-500" : ""
                  }`}
                  onClick={() => handleTaskClick(task)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Created: {new Date(task.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 text-xs rounded-full ${
                        task.status === "completed"
                          ? "bg-green-900 text-green-300"
                          : task.status === "in_progress"
                            ? "bg-blue-900 text-blue-300"
                            : task.status === "failed"
                              ? "bg-red-900 text-red-300"
                              : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {task.status.replace("_", " ")}
                    </div>
                  </div>
                  <div
                    className={`mt-2 text-xs ${
                      task.priority === "high"
                        ? "text-red-400"
                        : task.priority === "medium"
                          ? "text-yellow-400"
                          : "text-blue-400"
                    }`}
                  >
                    Priority: {task.priority}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedTask ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">{selectedTask.title}</h3>
                {selectedTask.status === "pending" && (
                  <button
                    onClick={() => executeTask(selectedTask.id)}
                    disabled={isExecuting}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md flex items-center text-sm disabled:opacity-50"
                  >
                    {isExecuting ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                        Executing...
                      </>
                    ) : (
                      <>
                        <GitCommit className="w-4 h-4 mr-1" />
                        Execute Task
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="bg-gray-800 rounded-md p-4 mb-4">
                <h4 className="text-sm font-medium mb-2">Description</h4>
                <p className="text-sm text-gray-400">{selectedTask.description}</p>
              </div>

              {selectedTask.status === "completed" && selectedTask.code_changes && (
                <div className="bg-gray-800 rounded-md p-4">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <Code className="w-4 h-4 mr-1" />
                    Code Changes
                  </h4>
                  <pre className="text-xs bg-gray-900 p-3 rounded-md overflow-x-auto">
                    <code>{selectedTask.code_changes}</code>
                  </pre>
                </div>
              )}

              {selectedTask.status === "completed" && (
                <div className="mt-4 flex justify-end">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md flex items-center text-sm">
                    <GitPullRequest className="w-4 h-4 mr-1" />
                    Create Pull Request
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-md p-8 text-center h-full flex flex-col items-center justify-center">
              <GitBranch className="w-12 h-12 text-gray-600 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Task Selected</h3>
              <p className="text-gray-500">Select a task from the list to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
