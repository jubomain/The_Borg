"use client"

import type React from "react"
import { useState } from "react"
import { Play, Plus, Clock, CheckCircle, AlertCircle } from "lucide-react"
import type { Task } from "./types"
import { addTask, processTask } from "./serviceAPI"

interface TaskManagerProps {
  isProcessing: boolean
  onProcessingChange: (processing: boolean) => void
}

const TaskManager: React.FC<TaskManagerProps> = ({ isProcessing, onProcessingChange }) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newPrompt, setNewPrompt] = useState("")
  const [newDescription, setNewDescription] = useState("")

  const handleAddTask = async () => {
    if (!newPrompt.trim()) return

    try {
      const newTask = await addTask(newPrompt, newDescription || "Task added from dashboard")
      setTasks((prevTasks) => [...prevTasks, newTask])
      setNewPrompt("")
      setNewDescription("")
    } catch (error) {
      console.error("Failed to add task:", error)
    }
  }

  const removeTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
  }

  const processTasks = async () => {
    if (tasks.length === 0 || isProcessing) return

    onProcessingChange(true)

    // Process tasks one by one
    const updatedTasks = [...tasks]

    for (let i = 0; i < updatedTasks.length; i++) {
      const task = updatedTasks[i]
      if (task.status === "pending") {
        // Update status to processing
        updatedTasks[i] = { ...task, status: "processing" }
        setTasks([...updatedTasks])

        try {
          const result = await processTask(task.id)

          updatedTasks[i] = {
            ...task,
            status: "completed",
            result,
          }

          setTasks([...updatedTasks])
        } catch (error) {
          updatedTasks[i] = {
            ...task,
            status: "failed",
            error: error instanceof Error ? error.message : "Unknown error",
          }
          setTasks([...updatedTasks])
        }
      }
    }

    onProcessingChange(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleAddTask()
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock size={16} className="text-gray-500" />
      case "processing":
        return (
          <svg
            className="animate-spin h-4 w-4 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )
      case "completed":
        return <CheckCircle size={16} className="text-green-500" />
      case "failed":
        return <AlertCircle size={16} className="text-red-500" />
      default:
        return <Clock size={16} />
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Task Manager</h2>
        <p className="text-sm text-gray-500">Add prompts to be sent to the target application</p>
      </div>

      <div className="border rounded-md p-4 bg-gray-50">
        <div className="space-y-3">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
              Prompt
            </label>
            <textarea
              id="prompt"
              rows={3}
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your prompt here..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                      focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                      bg-white border p-2"
            />
            <p className="mt-1 text-sm text-gray-500">Press Ctrl+Enter to add quickly</p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description (optional)
            </label>
            <input
              type="text"
              id="description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Brief description of this task"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                      focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                      bg-white border p-2"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAddTask}
              disabled={!newPrompt.trim()}
              className="inline-flex items-center rounded-md border border-transparent
                      bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm 
                      hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
                      focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={16} className="mr-2" />
              Add Task
            </button>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">Task Queue ({tasks.length})</h3>

          <button
            type="button"
            onClick={processTasks}
            disabled={tasks.length === 0 || isProcessing || !tasks.some((t) => t.status === "pending")}
            className="inline-flex items-center rounded-md border border-transparent
                    bg-green-600 py-1.5 px-3 text-sm font-medium text-white shadow-sm 
                    hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 
                    focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play size={14} className="mr-1.5" />
            {isProcessing ? "Processing..." : "Process All Tasks"}
          </button>
        </div>

        {tasks.length > 0 ? (
          <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
            {tasks.map((task) => (
              <li key={task.id} className="py-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center mb-1">
                      {getStatusIcon(task.status)}
                      <p
                        className={`ml-2 text-xs font-medium uppercase ${
                          task.status === "completed"
                            ? "text-green-700"
                            : task.status === "failed"
                              ? "text-red-700"
                              : task.status === "processing"
                                ? "text-blue-700"
                                : "text-gray-500"
                        }`}
                      >
                        {task.status}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">{task.prompt}</p>
                    {task.description && <p className="text-xs text-gray-500 truncate">{task.description}</p>}
                    {task.error && <p className="text-xs text-red-600 mt-1">{task.error}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTask(task.id)}
                    disabled={isProcessing}
                    className="text-gray-400 hover:text-red-600 focus:outline-none"
                  >
                    <span className="sr-only">Remove</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-md">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="mt-2 text-sm font-medium text-gray-900">No tasks added yet</p>
            <p className="mt-1 text-sm text-gray-500">Add a task to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskManager
