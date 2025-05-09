import { type NextRequest, NextResponse } from "next/server"
import type { Task } from "@/components/browser-control/types"

export async function POST(request: NextRequest) {
  try {
    const { prompt, description } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // In a real implementation, this would add a task to the queue
    // For now, we'll simulate a successful task creation
    await new Promise((resolve) => setTimeout(resolve, 500))

    const task: Task = {
      id: Date.now().toString(),
      prompt,
      description: description || "Task added from API",
      status: "pending",
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error("Failed to add task:", error)
    return NextResponse.json({ error: "Failed to add task" }, { status: 500 })
  }
}
