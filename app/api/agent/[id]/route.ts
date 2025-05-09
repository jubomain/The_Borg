import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { NextResponse } from "next/server"
import { availableAgents } from "@/data/agents"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { messages } = await req.json()
    const agentId = params.id

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

    // Create system prompt based on agent
    let systemPrompt = `You are ${selectedAgent.name}. ${selectedAgent.description}`

    // Add instructions if available
    if (selectedAgent.instructions && selectedAgent.instructions.length > 0) {
      systemPrompt += "\n\nInstructions:\n" + selectedAgent.instructions.map((i) => `- ${i}`).join("\n")
    }

    // Add tools if available
    if (selectedAgent.tools && selectedAgent.tools.length > 0) {
      systemPrompt +=
        "\n\nYou have access to the following tools:\n" +
        selectedAgent.tools.map((t) => `- ${t.name}: ${t.description}`).join("\n")
    }

    // Special handling for image generator agent
    if (agentId === "image-generator") {
      return handleImageGeneration(lastUserMessage.content)
    }

    // Generate response using Groq
    const result = await generateText({
      model: groq("llama3-70b-8192"),
      prompt: lastUserMessage.content,
      system: systemPrompt,
    })

    return NextResponse.json({ response: result.text })
  } catch (error) {
    console.error("Error in agent route:", error)
    return NextResponse.json({ error: "Failed to process your request" }, { status: 500 })
  }
}

async function handleImageGeneration(prompt: string) {
  try {
    // This is a placeholder for actual image generation
    // In a real implementation, you would call the Groq image generation API

    // Simulate image generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Return a placeholder response
    return NextResponse.json({
      response: `I've generated an image based on your prompt: "${prompt}"\n\n[Image URL: https://placeholder.com/generated-image.jpg]`,
    })
  } catch (error) {
    console.error("Error generating image:", error)
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 })
  }
}
