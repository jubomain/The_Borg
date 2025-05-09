"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Activity, AlertTriangle, CheckCircle, RefreshCw, Server, Database, Cpu, Network } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase-client"

type SystemStatus = {
  overall: "healthy" | "degraded" | "critical"
  components: {
    name: string
    status: "operational" | "degraded" | "offline"
    latency: number
    uptime: number
    lastChecked: Date
    issues: string[]
  }[]
  issues: {
    id: string
    component: string
    severity: "low" | "medium" | "high" | "critical"
    message: string
    timestamp: Date
    resolved: boolean
  }[]
  recommendations: string[]
}

export default function SystemHealthDashboard() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    fetchSystemStatus()
  }, [])

  const fetchSystemStatus = async () => {
    setIsLoading(true)

    try {
      // In a real implementation, this would fetch from an API
      // For now, we'll simulate with a timeout and mock data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if we have real data in Supabase
      const { data: realData, error } = await supabase
        .from("system_health")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (realData && !error) {
        setSystemStatus(realData.status_data)
      } else {
        // Use mock data if no real data exists
        setSystemStatus({
          overall: "degraded",
          components: [
            {
              name: "Database",
              status: "operational",
              latency: 45,
              uptime: 99.98,
              lastChecked: new Date(),
              issues: [],
            },
            {
              name: "API Server",
              status: "operational",
              latency: 120,
              uptime: 99.95,
              lastChecked: new Date(),
              issues: [],
            },
            {
              name: "Authentication Service",
              status: "operational",
              latency: 85,
              uptime: 99.99,
              lastChecked: new Date(),
              issues: [],
            },
            {
              name: "AI Processing Engine",
              status: "degraded",
              latency: 350,
              uptime: 98.75,
              lastChecked: new Date(),
              issues: ["High latency", "Occasional timeouts"],
            },
            {
              name: "GitHub Integration",
              status: "degraded",
              latency: 280,
              uptime: 97.5,
              lastChecked: new Date(),
              issues: ["Rate limiting issues"],
            },
            {
              name: "Workflow Execution Engine",
              status: "operational",
              latency: 150,
              uptime: 99.8,
              lastChecked: new Date(),
              issues: [],
            },
          ],
          issues: [
            {
              id: "issue-1",
              component: "AI Processing Engine",
              severity: "medium",
              message: "High latency in AI model inference, affecting response times",
              timestamp: new Date(Date.now() - 3600000), // 1 hour ago
              resolved: false,
            },
            {
              id: "issue-2",
              component: "GitHub Integration",
              severity: "medium",
              message: "GitHub API rate limiting causing occasional failures",
              timestamp: new Date(Date.now() - 7200000), // 2 hours ago
              resolved: false,
            },
            {
              id: "issue-3",
              component: "Database",
              severity: "low",
              message: "Slow queries on large workflow history tables",
              timestamp: new Date(Date.now() - 86400000), // 1 day ago
              resolved: true,
            },
          ],
          recommendations: [
            "Implement caching for GitHub API responses to reduce rate limit issues",
            "Optimize AI model inference by using a smaller model for initial responses",
            "Add database indexes to improve query performance on workflow history tables",
            "Implement a circuit breaker pattern for external API calls",
            "Set up automated scaling for the AI processing engine during peak usage",
          ],
        })
      }
    } catch (error) {
      console.error("Error fetching system status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshStatus = async () => {
    setIsRefreshing(true)
    await fetchSystemStatus()
    setIsRefreshing(false)
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center items-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-green-500" />
        </CardContent>
      </Card>
    )
  }

  if (!systemStatus) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">System Status Unavailable</h3>
            <p className="text-gray-400 mb-4">Unable to fetch system health information</p>
            <Button onClick={refreshStatus} className="bg-green-600 hover:bg-green-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-green-500" />
          <h2 className="text-xl font-semibold">System Health Dashboard</h2>
        </div>
        <Button onClick={refreshStatus} disabled={isRefreshing} variant="outline" size="sm">
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Overall System Status</h3>
            <div className="flex items-center space-x-2">
              {systemStatus.overall === "healthy" ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-500 font-medium">Healthy</span>
                </>
              ) : systemStatus.overall === "degraded" ? (
                <>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-yellow-500 font-medium">Degraded</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-500 font-medium">Critical</span>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemStatus.components.map((component, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {component.name === "Database" ? (
                        <Database className="w-4 h-4 mr-2 text-blue-400" />
                      ) : component.name === "API Server" ? (
                        <Server className="w-4 h-4 mr-2 text-purple-400" />
                      ) : component.name === "AI Processing Engine" ? (
                        <Cpu className="w-4 h-4 mr-2 text-green-400" />
                      ) : (
                        <Network className="w-4 h-4 mr-2 text-yellow-400" />
                      )}
                      <h4 className="font-medium">{component.name}</h4>
                    </div>
                    <div className="flex items-center">
                      {component.status === "operational" ? (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      ) : component.status === "degraded" ? (
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      ) : (
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                    <div>
                      <span className="block">Latency</span>
                      <span
                        className={`font-medium ${
                          component.latency < 100
                            ? "text-green-400"
                            : component.latency < 200
                              ? "text-yellow-400"
                              : "text-red-400"
                        }`}
                      >
                        {component.latency}ms
                      </span>
                    </div>
                    <div>
                      <span className="block">Uptime</span>
                      <span
                        className={`font-medium ${
                          component.uptime > 99.9
                            ? "text-green-400"
                            : component.uptime > 99
                              ? "text-yellow-400"
                              : "text-red-400"
                        }`}
                      >
                        {component.uptime}%
                      </span>
                    </div>
                  </div>

                  {component.issues.length > 0 && (
                    <div className="mt-2 text-xs">
                      <span className="text-yellow-500 font-medium">Issues:</span>
                      <ul className="list-disc pl-4 mt-1 text-gray-400">
                        {component.issues.map((issue, i) => (
                          <li key={i}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
              Active Issues
            </h3>

            <div className="space-y-4">
              {systemStatus.issues.filter((issue) => !issue.resolved).length === 0 ? (
                <div className="text-center py-6">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-gray-400">No active issues</p>
                </div>
              ) : (
                systemStatus.issues
                  .filter((issue) => !issue.resolved)
                  .map((issue) => (
                    <Card key={issue.id} className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{issue.component}</h4>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              issue.severity === "critical"
                                ? "bg-red-900 text-red-300"
                                : issue.severity === "high"
                                  ? "bg-orange-900 text-orange-300"
                                  : issue.severity === "medium"
                                    ? "bg-yellow-900 text-yellow-300"
                                    : "bg-blue-900 text-blue-300"
                            }`}
                          >
                            {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{issue.message}</p>
                        <div className="text-xs text-gray-500">Reported: {issue.timestamp.toLocaleString()}</div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Recommendations</h3>

            <ul className="space-y-2">
              {systemStatus.recommendations.map((recommendation, index) => (
                <li key={index} className="bg-gray-800 p-3 rounded-md text-sm text-gray-400">
                  {recommendation}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Non-Functional Components</h3>

          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-md">
              <h4 className="font-medium mb-2 text-yellow-500">GitHub Trending Repository Scraper</h4>
              <p className="text-sm text-gray-400 mb-2">
                The GitHub trending repository scraper is currently not fully functional. It should scrape trending
                repositories daily but is encountering rate limiting issues.
              </p>
              <div className="text-xs text-gray-500">
                Status: Partially functional (manual trigger works, scheduled scraping fails)
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-md">
              <h4 className="font-medium mb-2 text-yellow-500">AI Model Versioning System</h4>
              <p className="text-sm text-gray-400 mb-2">
                The AI model versioning system is not fully implemented. It should track model versions and performance
                metrics but currently only stores basic information.
              </p>
              <div className="text-xs text-gray-500">Status: Partially implemented (missing performance tracking)</div>
            </div>

            <div className="bg-gray-800 p-4 rounded-md">
              <h4 className="font-medium mb-2 text-red-500">Automated Code Generation Pipeline</h4>
              <p className="text-sm text-gray-400 mb-2">
                The automated code generation pipeline is not functional. It should generate code based on natural
                language descriptions but is currently not implemented.
              </p>
              <div className="text-xs text-gray-500">Status: Not implemented</div>
            </div>

            <div className="bg-gray-800 p-4 rounded-md">
              <h4 className="font-medium mb-2 text-red-500">Continuous Learning System</h4>
              <p className="text-sm text-gray-400 mb-2">
                The continuous learning system is not functional. It should improve AI models based on user feedback but
                is currently not implemented.
              </p>
              <div className="text-xs text-gray-500">Status: Not implemented</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
