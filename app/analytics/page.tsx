"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Header from "@/components/navigation/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Users, MessageSquare, GitBranch, Clock, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase-client"

// Define types for our analytics data
interface MetricCard {
  title: string
  value: number | string
  change: string
  icon: React.ReactNode
  changeType: "positive" | "negative" | "neutral"
}

interface UsageData {
  name: string
  agents: number
  workflows: number
  teams: number
}

interface PerformanceData {
  name: string
  responseTime: number
  errorRate: number
  successRate: number
}

interface AgentTypeData {
  name: string
  value: number
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("usage")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State for analytics data
  const [metricCards, setMetricCards] = useState<MetricCard[]>([])
  const [usageData, setUsageData] = useState<UsageData[]>([])
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])
  const [agentTypeData, setAgentTypeData] = useState<AgentTypeData[]>([])

  useEffect(() => {
    async function fetchAnalyticsData() {
      try {
        setIsLoading(true)

        // Fetch metric cards data
        const { data: metricsData, error: metricsError } = await supabase
          .from("analytics_metrics")
          .select("*")
          .eq("metric_name", "summary_metrics")
          .order("created_at", { ascending: false })
          .limit(1)

        if (metricsError) throw metricsError

        // If we have metrics data, use it
        if (metricsData && metricsData.length > 0) {
          const metrics = metricsData[0].metric_value

          setMetricCards([
            {
              title: "Total Agents",
              value: metrics.total_agents || 0,
              change: metrics.agent_change || "+0%",
              icon: <Users className="w-6 h-6 text-blue-500" />,
              changeType: metrics.agent_change?.startsWith("+") ? "positive" : "negative",
            },
            {
              title: "Active Workflows",
              value: metrics.active_workflows || 0,
              change: metrics.workflow_change || "+0%",
              icon: <GitBranch className="w-6 h-6 text-purple-500" />,
              changeType: metrics.workflow_change?.startsWith("+") ? "positive" : "negative",
            },
            {
              title: "Messages Processed",
              value: metrics.messages_processed || 0,
              change: metrics.message_change || "+0%",
              icon: <MessageSquare className="w-6 h-6 text-green-500" />,
              changeType: metrics.message_change?.startsWith("+") ? "positive" : "negative",
            },
            {
              title: "Avg. Response Time",
              value: `${metrics.avg_response_time || 0}ms`,
              change: metrics.response_time_change || "+0ms",
              icon: <Clock className="w-6 h-6 text-yellow-500" />,
              changeType: metrics.response_time_change?.startsWith("-") ? "positive" : "negative",
            },
          ])
        } else {
          // Use fallback data if no metrics are available
          setMetricCards([
            {
              title: "Total Agents",
              value: 0,
              change: "+0%",
              icon: <Users className="w-6 h-6 text-blue-500" />,
              changeType: "neutral",
            },
            {
              title: "Active Workflows",
              value: 0,
              change: "+0%",
              icon: <GitBranch className="w-6 h-6 text-purple-500" />,
              changeType: "neutral",
            },
            {
              title: "Messages Processed",
              value: 0,
              change: "+0%",
              icon: <MessageSquare className="w-6 h-6 text-green-500" />,
              changeType: "neutral",
            },
            {
              title: "Avg. Response Time",
              value: "0ms",
              change: "+0ms",
              icon: <Clock className="w-6 h-6 text-yellow-500" />,
              changeType: "neutral",
            },
          ])
        }

        // Fetch usage data
        const { data: usageMetrics, error: usageError } = await supabase
          .from("analytics_metrics")
          .select("*")
          .eq("metric_name", "monthly_usage")
          .order("created_at", { ascending: false })
          .limit(1)

        if (usageError) throw usageError

        if (usageMetrics && usageMetrics.length > 0) {
          setUsageData(usageMetrics[0].metric_value || [])
        } else {
          // Fallback data
          setUsageData([
            { name: "Jan", agents: 0, workflows: 0, teams: 0 },
            { name: "Feb", agents: 0, workflows: 0, teams: 0 },
            { name: "Mar", agents: 0, workflows: 0, teams: 0 },
          ])
        }

        // Fetch performance data
        const { data: perfMetrics, error: perfError } = await supabase
          .from("analytics_metrics")
          .select("*")
          .eq("metric_name", "weekly_performance")
          .order("created_at", { ascending: false })
          .limit(1)

        if (perfError) throw perfError

        if (perfMetrics && perfMetrics.length > 0) {
          setPerformanceData(perfMetrics[0].metric_value || [])
        } else {
          // Fallback data
          setPerformanceData([
            { name: "Mon", responseTime: 0, errorRate: 0, successRate: 100 },
            { name: "Tue", responseTime: 0, errorRate: 0, successRate: 100 },
            { name: "Wed", responseTime: 0, errorRate: 0, successRate: 100 },
          ])
        }

        // Fetch agent type distribution
        const { data: agentTypes, error: agentTypeError } = await supabase
          .from("analytics_metrics")
          .select("*")
          .eq("metric_name", "agent_type_distribution")
          .order("created_at", { ascending: false })
          .limit(1)

        if (agentTypeError) throw agentTypeError

        if (agentTypes && agentTypes.length > 0) {
          setAgentTypeData(agentTypes[0].metric_value || [])
        } else {
          // Fallback data
          setAgentTypeData([
            { name: "LLM Agents", value: 0 },
            { name: "Data Agents", value: 0 },
            { name: "Web Agents", value: 0 },
            { name: "Custom Agents", value: 0 },
          ])
        }
      } catch (err) {
        console.error("Error fetching analytics data:", err)
        setError("Failed to load analytics data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  return (
    <div className="flex flex-col min-h-screen bg-[#121212]">
      <Header title="Analytics" />
      <main className="flex-1 p-6">
        {error && <div className="bg-red-900/30 border border-red-700 text-red-200 p-4 rounded-md mb-6">{error}</div>}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-6">
          {metricCards.map((card, index) => (
            <Card key={index} className="bg-[#1E1E1E] border-gray-800 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{card.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-full">{card.icon}</div>
                </div>
                <div
                  className={`mt-4 text-sm ${
                    card.changeType === "positive"
                      ? "text-green-500"
                      : card.changeType === "negative"
                        ? "text-red-500"
                        : "text-gray-400"
                  }`}
                >
                  {card.change} from last month
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-[#1E1E1E] border-gray-800">
            <TabsTrigger value="usage" className="data-[state=active]:bg-gray-800 text-white">
              Usage Analytics
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-gray-800 text-white">
              Performance Metrics
            </TabsTrigger>
            <TabsTrigger value="agents" className="data-[state=active]:bg-gray-800 text-white">
              Agent Distribution
            </TabsTrigger>
          </TabsList>

          <TabsContent value="usage" className="space-y-4">
            <Card className="bg-[#1E1E1E] border-gray-800 text-white">
              <CardHeader>
                <CardTitle>System Usage Over Time</CardTitle>
                <CardDescription className="text-gray-400">
                  Monthly usage of agents, workflows, and teams
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={usageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip contentStyle={{ backgroundColor: "#2a2a2a", borderColor: "#444", color: "white" }} />
                        <Legend />
                        <Bar dataKey="agents" fill="#0088FE" name="Agents" />
                        <Bar dataKey="workflows" fill="#00C49F" name="Workflows" />
                        <Bar dataKey="teams" fill="#FFBB28" name="Teams" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card className="bg-[#1E1E1E] border-gray-800 text-white">
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
                <CardDescription className="text-gray-400">
                  Response time and error rates over the past week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip contentStyle={{ backgroundColor: "#2a2a2a", borderColor: "#444", color: "white" }} />
                        <Legend />
                        <Line type="monotone" dataKey="responseTime" stroke="#0088FE" name="Response Time (ms)" />
                        <Line type="monotone" dataKey="errorRate" stroke="#FF8042" name="Error Rate (%)" />
                        <Line type="monotone" dataKey="successRate" stroke="#00C49F" name="Success Rate (%)" />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents" className="space-y-4">
            <Card className="bg-[#1E1E1E] border-gray-800 text-white">
              <CardHeader>
                <CardTitle>Agent Type Distribution</CardTitle>
                <CardDescription className="text-gray-400">Breakdown of agent types in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={agentTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {agentTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "#2a2a2a", borderColor: "#444", color: "white" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
