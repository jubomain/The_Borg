"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Download, RefreshCw, FileText, TrendingUp, AlertTriangle } from "lucide-react"

interface SystemReport {
  id: string
  created_at: string
  performance_metrics: {
    cpu_usage: number
    memory_usage: number
    response_time: number
    throughput: number
  }
  bot_metrics: {
    total_bots: number
    active_bots: number
    bot_types: { [key: string]: number }
  }
  workflow_metrics: {
    total_workflows: number
    successful_executions: number
    failed_executions: number
    average_execution_time: number
  }
  improvement_suggestions: string[]
  evolution_metrics: {
    tasks_completed: number
    code_quality_improvement: number
    new_features_added: number
  }
}

export default function SystemReportComponent() {
  const [report, setReport] = useState<SystemReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    fetchLatestReport()
  }, [])

  const fetchLatestReport = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("system_reports")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (error) throw error

      setReport(data)
    } catch (error) {
      console.error("Error fetching system report:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateNewReport = async () => {
    setIsGenerating(true)
    try {
      // In a real implementation, this would generate a real report
      // For this demo, we'll simulate the report generation
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const newReport: SystemReport = {
        id: `report-${Date.now()}`,
        created_at: new Date().toISOString(),
        performance_metrics: {
          cpu_usage: Math.floor(Math.random() * 40) + 20, // 20-60%
          memory_usage: Math.floor(Math.random() * 30) + 40, // 40-70%
          response_time: Math.floor(Math.random() * 200) + 100, // 100-300ms
          throughput: Math.floor(Math.random() * 50) + 50, // 50-100 req/s
        },
        bot_metrics: {
          total_bots: Math.floor(Math.random() * 10) + 15, // 15-25
          active_bots: Math.floor(Math.random() * 5) + 10, // 10-15
          bot_types: {
            "Data Processing": Math.floor(Math.random() * 3) + 3,
            "Content Generation": Math.floor(Math.random() * 3) + 3,
            "Customer Support": Math.floor(Math.random() * 3) + 2,
            Research: Math.floor(Math.random() * 3) + 2,
            Monitoring: Math.floor(Math.random() * 3) + 1,
          },
        },
        workflow_metrics: {
          total_workflows: Math.floor(Math.random() * 20) + 30, // 30-50
          successful_executions: Math.floor(Math.random() * 500) + 1000, // 1000-1500
          failed_executions: Math.floor(Math.random() * 50) + 50, // 50-100
          average_execution_time: Math.floor(Math.random() * 1000) + 1000, // 1000-2000ms
        },
        improvement_suggestions: [
          "Implement caching for frequently accessed data to improve response times",
          "Add more error handling in workflow execution to reduce failure rate",
          "Consider scaling up resources during peak usage times",
          "Implement a more sophisticated load balancing strategy",
          "Add more specialized bots for data analysis tasks",
        ],
        evolution_metrics: {
          tasks_completed: Math.floor(Math.random() * 10) + 5, // 5-15
          code_quality_improvement: Math.floor(Math.random() * 10) + 5, // 5-15%
          new_features_added: Math.floor(Math.random() * 5) + 1, // 1-6
        },
      }

      // Save report to Supabase
      const { error } = await supabase.from("system_reports").insert([newReport])

      if (error) throw error

      setReport(newReport)
    } catch (error) {
      console.error("Error generating system report:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadReport = () => {
    if (!report) return

    const reportData = JSON.stringify(report, null, 2)
    const blob = new Blob([reportData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `system-report-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const performanceData = report
    ? [
        {
          name: "CPU Usage",
          value: report.performance_metrics.cpu_usage,
          fill: "#4ade80",
        },
        {
          name: "Memory Usage",
          value: report.performance_metrics.memory_usage,
          fill: "#60a5fa",
        },
        {
          name: "Response Time",
          value: report.performance_metrics.response_time / 10, // Scale down for visualization
          fill: "#f97316",
        },
        {
          name: "Throughput",
          value: report.performance_metrics.throughput,
          fill: "#a78bfa",
        },
      ]
    : []

  const botTypeData = report
    ? Object.entries(report.bot_metrics.bot_types).map(([name, value]) => ({
        name,
        value,
      }))
    : []

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          System Report
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={generateNewReport}
            disabled={isGenerating}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md flex items-center text-sm disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-1" />
                Generate Report
              </>
            )}
          </button>
          {report && (
            <button
              onClick={downloadReport}
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md flex items-center text-sm"
            >
              <Download className="w-4 h-4 mr-1" />
              Download
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-500" />
        </div>
      ) : report ? (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-md p-4">
            <h3 className="font-medium mb-3 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              Performance Metrics
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#333", border: "1px solid #555" }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Bar dataKey="value" fill="#8884d8">
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-md p-4">
              <h3 className="font-medium mb-3">Bot Metrics</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-900 p-3 rounded-md">
                  <div className="text-sm text-gray-400 mb-1">Total Bots</div>
                  <div className="text-2xl font-bold">{report.bot_metrics.total_bots}</div>
                </div>
                <div className="bg-gray-900 p-3 rounded-md">
                  <div className="text-sm text-gray-400 mb-1">Active Bots</div>
                  <div className="text-2xl font-bold">{report.bot_metrics.active_bots}</div>
                </div>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={botTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {botTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#333", border: "1px solid #555" }}
                      labelStyle={{ color: "#fff" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gray-800 rounded-md p-4">
              <h3 className="font-medium mb-3">Workflow Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900 p-3 rounded-md">
                  <div className="text-sm text-gray-400 mb-1">Total Workflows</div>
                  <div className="text-2xl font-bold">{report.workflow_metrics.total_workflows}</div>
                </div>
                <div className="bg-gray-900 p-3 rounded-md">
                  <div className="text-sm text-gray-400 mb-1">Avg. Execution Time</div>
                  <div className="text-2xl font-bold">{report.workflow_metrics.average_execution_time}ms</div>
                </div>
                <div className="bg-gray-900 p-3 rounded-md">
                  <div className="text-sm text-gray-400 mb-1">Successful Executions</div>
                  <div className="text-2xl font-bold text-green-500">
                    {report.workflow_metrics.successful_executions}
                  </div>
                </div>
                <div className="bg-gray-900 p-3 rounded-md">
                  <div className="text-sm text-gray-400 mb-1">Failed Executions</div>
                  <div className="text-2xl font-bold text-red-500">{report.workflow_metrics.failed_executions}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-md p-4">
            <h3 className="font-medium mb-3 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1 text-yellow-500" />
              Improvement Suggestions
            </h3>
            <ul className="space-y-2">
              {report.improvement_suggestions.map((suggestion, index) => (
                <li key={index} className="bg-gray-900 p-3 rounded-md text-sm">
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-800 rounded-md p-4">
            <h3 className="font-medium mb-3">Evolution Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-900 p-3 rounded-md">
                <div className="text-sm text-gray-400 mb-1">Tasks Completed</div>
                <div className="text-2xl font-bold">{report.evolution_metrics.tasks_completed}</div>
              </div>
              <div className="bg-gray-900 p-3 rounded-md">
                <div className="text-sm text-gray-400 mb-1">Code Quality Improvement</div>
                <div className="text-2xl font-bold text-green-500">
                  +{report.evolution_metrics.code_quality_improvement}%
                </div>
              </div>
              <div className="bg-gray-900 p-3 rounded-md">
                <div className="text-sm text-gray-400 mb-1">New Features Added</div>
                <div className="text-2xl font-bold">{report.evolution_metrics.new_features_added}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-md p-8 text-center">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Report Available</h3>
          <p className="text-gray-500 mb-4">Generate a new system report to view metrics and suggestions</p>
          <button
            onClick={generateNewReport}
            disabled={isGenerating}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md inline-flex items-center"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate Report
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
