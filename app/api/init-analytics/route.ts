import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-client"

export async function POST() {
  try {
    // Check if we have permission to initialize the database
    const allowDbInit = process.env.ALLOW_DB_INIT === "true"
    if (!allowDbInit) {
      return NextResponse.json({ error: "Database initialization is not allowed in this environment" }, { status: 403 })
    }

    // Sample data for analytics metrics
    const sampleMetrics = [
      {
        metric_name: "summary_metrics",
        metric_value: {
          total_agents: 127,
          agent_change: "+12%",
          active_workflows: 35,
          workflow_change: "+5%",
          messages_processed: 8942,
          message_change: "+18%",
          avg_response_time: 112,
          response_time_change: "+8ms",
        },
        metric_date: new Date().toISOString().split("T")[0],
      },
      {
        metric_name: "monthly_usage",
        metric_value: [
          { name: "Jan", agents: 40, workflows: 24, teams: 10 },
          { name: "Feb", agents: 30, workflows: 13, teams: 8 },
          { name: "Mar", agents: 20, workflows: 18, teams: 5 },
          { name: "Apr", agents: 27, workflows: 28, teams: 12 },
          { name: "May", agents: 18, workflows: 24, teams: 10 },
          { name: "Jun", agents: 23, workflows: 30, teams: 15 },
          { name: "Jul", agents: 34, workflows: 35, teams: 18 },
        ],
        metric_date: new Date().toISOString().split("T")[0],
      },
      {
        metric_name: "weekly_performance",
        metric_value: [
          { name: "Mon", responseTime: 120, errorRate: 2, successRate: 98 },
          { name: "Tue", responseTime: 132, errorRate: 3, successRate: 97 },
          { name: "Wed", responseTime: 101, errorRate: 1, successRate: 99 },
          { name: "Thu", responseTime: 134, errorRate: 4, successRate: 96 },
          { name: "Fri", responseTime: 90, errorRate: 2, successRate: 98 },
          { name: "Sat", responseTime: 85, errorRate: 1, successRate: 99 },
          { name: "Sun", responseTime: 88, errorRate: 0, successRate: 100 },
        ],
        metric_date: new Date().toISOString().split("T")[0],
      },
      {
        metric_name: "agent_type_distribution",
        metric_value: [
          { name: "LLM Agents", value: 45 },
          { name: "Data Agents", value: 25 },
          { name: "Web Agents", value: 15 },
          { name: "Custom Agents", value: 15 },
        ],
        metric_date: new Date().toISOString().split("T")[0],
      },
    ]

    // Sample workflows data
    const sampleWorkflows = [
      {
        id: "wf-1",
        name: "Customer Support Automation",
        description: "Automates customer support ticket classification and routing",
        status: "active",
        last_run: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        success_rate: 98,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "wf-2",
        name: "Data Processing Pipeline",
        description: "Processes incoming data, cleans it, and stores in database",
        status: "active",
        last_run: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        success_rate: 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "wf-3",
        name: "Content Generation",
        description: "Generates social media content based on trending topics",
        status: "paused",
        last_run: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        success_rate: 92,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "wf-4",
        name: "Email Summarization",
        description: "Summarizes incoming emails and prioritizes them",
        status: "active",
        last_run: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
        success_rate: 95,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "wf-5",
        name: "Market Analysis",
        description: "Analyzes market trends and generates reports",
        status: "draft",
        last_run: null,
        success_rate: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    // Insert analytics metrics
    const { error: metricsError } = await supabaseAdmin.from("analytics_metrics").insert(sampleMetrics)
    if (metricsError) throw metricsError

    // Insert workflows
    const { error: workflowsError } = await supabaseAdmin.from("workflows").insert(sampleWorkflows)
    if (workflowsError) throw workflowsError

    return NextResponse.json({ success: true, message: "Analytics data initialized successfully" })
  } catch (error: any) {
    console.error("Error initializing analytics data:", error)
    return NextResponse.json({ error: error.message || "Failed to initialize analytics data" }, { status: 500 })
  }
}
