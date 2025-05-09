import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { NextResponse } from "next/server"
import { availableWorkflows } from "@/data/workflows"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { messages } = await req.json()
    const workflowId = params.id

    // Find the selected workflow
    const selectedWorkflow = availableWorkflows.find((w) => w.id === workflowId)

    if (!selectedWorkflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 })
    }

    // Get the last user message
    const lastUserMessage = messages.filter((m) => m.role === "user").pop()

    if (!lastUserMessage) {
      return NextResponse.json({ error: "No user message found" }, { status: 400 })
    }

    // Execute the workflow
    const result = await executeWorkflow(selectedWorkflow, lastUserMessage.content)

    return NextResponse.json({ response: result })
  } catch (error) {
    console.error("Error in workflow route:", error)
    return NextResponse.json({ error: "Failed to process your request" }, { status: 500 })
  }
}

async function executeWorkflow(workflow, userInput) {
  // This is a simplified workflow execution
  // In a real implementation, you would execute each step in sequence

  let result = ""

  // For the blog post generator workflow
  if (workflow.id === "blog-post-generator") {
    // Step 1: Search for articles
    const searchPrompt = `You are a web search agent. Search for information about: ${userInput}`
    const searchResult = await generateText({
      model: groq("llama3-70b-8192"),
      prompt: userInput,
      system: searchPrompt,
    })

    // Step 2: Write the blog post
    const writePrompt = `You are a blog post writer. Write a blog post about ${userInput} based on the following search results:\n\n${searchResult.text}`
    const blogResult = await generateText({
      model: groq("llama3-70b-8192"),
      prompt: userInput,
      system: writePrompt,
    })

    result = blogResult.text
  }

  // For the recipe with image workflow
  else if (workflow.id === "recipe-with-image") {
    // Step 1: Create recipe
    const recipePrompt = `You are a recipe creator. Create a detailed recipe for: ${userInput}`
    const recipeResult = await generateText({
      model: groq("llama3-70b-8192"),
      prompt: userInput,
      system: recipePrompt,
    })

    // Step 2: Generate image description (placeholder for actual image generation)
    result = `${recipeResult.text}\n\n[Image of the recipe would be generated here]`
  }

  return result
}
