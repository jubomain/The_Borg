import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { NextResponse } from "next/server"
import { availableAgents } from "@/data/agents"

export async function POST(req: Request) {
  try {
    const { messages, agent: agentId } = await req.json()

    // Find the selected agent
    const selectedAgent = availableAgents.find((a) => a.id === agentId)

    if (!selectedAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    // Get the last user message
    const lastUserMessage = messages.filter((m) => m.role === "user").pop()

    if (!lastUserMessage) {
      return NextResponse.json({ error: "No user message found" }, { status: 400 })
    }

    // Create system prompt based on agent type
    let systemPrompt = ""

    switch (selectedAgent.id) {
      case "web-search":
        systemPrompt =
          "You are a web search agent. You help users find information on the internet. Provide detailed search results with relevant information."
        break
      case "recipe-creator":
        systemPrompt =
          "You are a recipe creator agent. You recommend recipes based on ingredients, dietary restrictions, and preferences. Provide detailed instructions and ingredient lists."
        break
      case "finance":
        systemPrompt =
          "You are a finance agent. You analyze financial data and provide insights. You can help with budgeting, investment advice, and financial planning."
        break
      case "books-recommendation":
        systemPrompt =
          "You are a book recommendation agent. You suggest books based on user preferences, genres, and reading history. Provide detailed book descriptions and reasons for recommendations."
        break
      case "shopping":
        systemPrompt =
          "You are a shopping agent. You help users find products online, compare prices, and make purchase decisions. Provide detailed product information and recommendations."
        break
      case "weekend-planner":
        systemPrompt =
          "You are a weekend planner agent. You help users plan fun activities for their weekend based on their interests, location, and preferences. Provide detailed itineraries and suggestions."
        break
      case "agent-team":
        systemPrompt =
          "You are an agent team coordinator. You can delegate tasks to specialized agents and coordinate their responses. Explain which agent would handle each part of the request."
        break
      case "reasoning":
        systemPrompt =
          "You are a reasoning agent. You solve problems step-by-step, showing your work and explaining your thought process. Provide detailed reasoning for complex problems."
        break
      case "python":
        systemPrompt =
          "You are a Python coding agent. You can write and explain Python code. When asked to solve a problem, provide the code solution and explain how it works."
        break
      default:
        systemPrompt = "You are a helpful AI assistant."
    }

    // Generate response using Groq
    const result = await generateText({
      model: groq("llama3-70b-8192"),
      prompt: lastUserMessage.content,
      system: systemPrompt,
    })

    return NextResponse.json({ response: result.text })
  } catch (error) {
    console.error("Error in chat route:", error)
    return NextResponse.json({ error: "Failed to process your request" }, { status: 500 })
  }
}
