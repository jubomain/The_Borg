"use client"

import { useState } from "react"
import { Play, Pause, RotateCcw, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface AutopilotProps {
  initialGoal?: string
}

export default function Autopilot({ initialGoal = "" }: AutopilotProps) {
  const [goal, setGoal] = useState<string>(initialGoal)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [logs, setLogs] = useState<Array<{ message: string; type: "info" | "success" | "error" }>>([])
  const [progress, setProgress] = useState<number>(0)
  const [currentTask, setCurrentTask] = useState<string>("")

  const startAutopilot = () => {
    if (!goal.trim()) return

    setIsRunning(true)
    setLogs([{ message: "Autopilot started", type: "info" }])
    setProgress(0)

    // Simulate autopilot tasks
    simulateAutopilot()
  }

  const stopAutopilot = () => {
    setIsRunning(false)
    setLogs((prev) => [...prev, { message: "Autopilot paused", type: "info" }])
  }

  const resetAutopilot = () => {
    setIsRunning(false)
    setLogs([])
    setProgress(0)
    setCurrentTask("")
  }

  const simulateAutopilot = () => {
    const tasks = [
      "Analyzing goal",
      "Planning approach",
      "Searching for information",
      "Processing data",
      "Generating solution",
      "Refining output",
      "Finalizing results",
    ]

    let taskIndex = 0

    const interval = setInterval(() => {
      if (taskIndex < tasks.length) {
        const task = tasks[taskIndex]
        setCurrentTask(task)
        setLogs((prev) => [...prev, { message: `Task: ${task}`, type: "info" }])
        setProgress(Math.round(((taskIndex + 1) / tasks.length) * 100))
        taskIndex++
      } else {
        clearInterval(interval)
        setIsRunning(false)
        setLogs((prev) => [...prev, { message: "Autopilot completed successfully", type: "success" }])
        setProgress(100)
      }
    }, 2000)

    return () => clearInterval(interval)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-800 flex items-center">
        <Link href="/dashboard" className="mr-4">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold">Autopilot Mode</h1>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">Goal or Task Description</label>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Describe what you want the AI to accomplish autonomously..."
              className="w-full bg-gray-800 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={4}
              disabled={isRunning}
            />
          </div>

          <div className="flex space-x-4 mb-8">
            <button
              onClick={startAutopilot}
              disabled={isRunning || !goal.trim()}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Autopilot
            </button>

            <button
              onClick={stopAutopilot}
              disabled={!isRunning}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </button>

            <button
              onClick={resetAutopilot}
              disabled={logs.length === 0}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </button>
          </div>

          {progress > 0 && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Progress: {progress}%</span>
                {currentTask && <span>Current: {currentTask}</span>}
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2.5">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          {logs.length > 0 && (
            <div className="border border-gray-800 rounded-md overflow-hidden">
              <div className="bg-gray-800 px-4 py-2 font-medium">Activity Log</div>
              <div className="p-4 max-h-96 overflow-y-auto">
                {logs.map((log, index) => (
                  <div key={index} className="flex items-start mb-2">
                    {log.type === "error" && <AlertCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5" />}
                    {log.type === "success" && <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />}
                    {log.type === "info" && <div className="w-4 h-4 rounded-full bg-blue-500 mr-2 mt-0.5" />}
                    <div
                      className={`text-sm ${log.type === "error" ? "text-red-400" : log.type === "success" ? "text-green-400" : "text-gray-300"}`}
                    >
                      {log.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
