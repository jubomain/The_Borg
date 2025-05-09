import { type NextRequest, NextResponse } from "next/server"
import type { TaskResult } from "@/components/browser-control/types"

export async function GET(request: NextRequest) {
  try {
    // In a real implementation, this would fetch results from a database
    // For now, we'll simulate fetching results
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const results: TaskResult[] = [
      {
        raw_response: "This is a previously processed result for task 1.",
        analysis: {
          sentiment: "positive",
          key_points: ["Result 1 Key point 1", "Result 1 Key point 2"],
          next_actions: ["result1_action_1", "result1_action_2"],
        },
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        raw_response: "This is a previously processed result for task 2.",
        analysis: {
          sentiment: "negative",
          key_points: ["Result 2 Key point 1", "Result 2 Key point 2"],
          next_actions: ["result2_action_1", "result2_action_2"],
        },
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
    ]

    return NextResponse.json(results)
  } catch (error) {
    console.error("Failed to fetch results:", error)
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 })
  }
}
