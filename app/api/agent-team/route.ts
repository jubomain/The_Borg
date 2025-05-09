import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { NextResponse } from "next/server"
import { availableAgents } from "@/data/agents"

export async function POST(req: Request) {
  try {
    const { messages, agents } = await req.json()

    // Get the last user message
    const lastUserMessage = messages.filter((m) => m.role === "user").pop()

    if (!lastUserMessage) {
      return NextResponse.json({ error: "No user message found" }, { status: 400 })
    }

    // If no specific agents are provided, use all available agents
    const teamAgents =
      agents && agents.length > 0
        ? agents.map((id) => availableAgents.find((a) => a.id === id)).filter(Boolean)
        : availableAgents

    // Create system prompt for agent team
    const agentDescriptions = teamAgents.map((agent) => `- ${agent.name}: ${agent.description}`).join("\n")

    const systemPrompt = `You are an Agent Team Coordinator with access to the following specialized agents:
${agentDescriptions}

For the user's request, you will:
1. Analyze which agents would be most helpful for addressing different aspects of the request
2. Explain which agent(s) you would assign to the task and why
3. Provide a comprehensive response that combines the expertise of the relevant agents
4. If the task requires multiple agents, explain how they would collaborate

Always maintain the perspective of a coordinator managing these agents, not the agents themselves.`

    // Generate response using Groq
    const result = await generateText({
      model: groq("llama3-70b-8192"),
      prompt: lastUserMessage.content,
      system: systemPrompt,
    })

    return NextResponse.json({ response: result.text })
  } catch (error) {
    console.error("Error in agent team route:", error)
    return NextResponse.json({ error: "Failed to process your request" }, { status: 500 })
  }
}
