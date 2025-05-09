import { type NextRequest, NextResponse } from "next/server"

interface ApiStatus {
  name: string
  status: "operational" | "degraded" | "down"
  latency: number
  lastChecked: string
}

export async function GET(request: NextRequest) {
  try {
    // In a real implementation, this would check the status of various APIs
    // For now, we'll return mock data
    const apiStatuses: ApiStatus[] = [
      {
        name: "Groq API",
        status: "operational",
        latency: 120,
        lastChecked: new Date().toISOString(),
      },
      {
        name: "Serper API",
        status: "operational",
        latency: 150,
        lastChecked: new Date().toISOString(),
      },
      {
        name: "Supabase",
        status: "operational",
        latency: 80,
        lastChecked: new Date().toISOString(),
      },
      {
        name: "GitHub API",
        status: "operational",
        latency: 200,
        lastChecked: new Date().toISOString(),
      },
      {
        name: "OpenAI API",
        status: Math.random() > 0.7 ? "degraded" : "operational",
        latency: 350,
        lastChecked: new Date().toISOString(),
      },
      {
        name: "Slack API",
        status: "operational",
        latency: 110,
        lastChecked: new Date().toISOString(),
      },
    ]

    return NextResponse.json(apiStatuses)
  } catch (error) {
    console.error("Failed to fetch API statuses:", error)
    return NextResponse.json({ error: "Failed to fetch API statuses" }, { status: 500 })
  }
}
