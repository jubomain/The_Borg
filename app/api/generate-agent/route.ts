import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // System prompt for agent generation with explicit JSON formatting instructions
    const systemPrompt = `
You are an AI agent designer. Your task is to create a detailed specification for an AI agent based on the user's description.

Output a valid JSON object with the following structure:
{
  "name": "Name of the agent",
  "description": "A detailed description of what the agent does",
  "instructions": [
    "Instruction 1 for the agent",
    "Instruction 2 for the agent",
    "..."
  ],
  "tools": [
    {
      "id": "tool-1",
      "name": "Tool Name",
      "description": "What this tool does"
    },
    ...
  ]
}

IMPORTANT: Ensure your response is a valid JSON object. Do not include any explanations, markdown formatting, or additional text outside the JSON object. The response should be parseable by JSON.parse().
`

    // Generate the agent specification
    const result = await generateText({
      model: groq("llama3-70b-8192"),
      prompt: prompt,
      system: systemPrompt,
      temperature: 0.2, // Lower temperature for more consistent JSON formatting
    })

    // Parse the JSON response
    try {
      // Clean and extract the JSON
      let jsonStr = result.text.trim()

      // Remove any markdown code block formatting
      const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
      if (jsonMatch && jsonMatch[1]) {
        jsonStr = jsonMatch[1].trim()
      }

      // Remove any leading/trailing non-JSON text
      if (jsonStr.indexOf("{") > 0) {
        jsonStr = jsonStr.substring(jsonStr.indexOf("{"))
      }

      // Find the last closing brace to remove any trailing text
      const lastBrace = jsonStr.lastIndexOf("}")
      if (lastBrace !== -1 && lastBrace < jsonStr.length - 1) {
        jsonStr = jsonStr.substring(0, lastBrace + 1)
      }

      // Fix common JSON syntax errors
      jsonStr = jsonStr
        .replace(/,\s*}/g, "}") // Remove trailing commas in objects
        .replace(/,\s*]/g, "]") // Remove trailing commas in arrays
        .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2":') // Ensure property names are properly quoted
        .replace(/:\s*'([^']*)'/g, ':"$1"') // Replace single quotes with double quotes for values

      // Parse the cleaned JSON
      const agentSpec = JSON.parse(jsonStr)

      return NextResponse.json(agentSpec)
    } catch (parseError) {
      console.error("Error parsing agent specification:", parseError)
      console.error("Raw response:", result.text)

      // Attempt to create a valid JSON response even if parsing fails
      return NextResponse.json(
        {
          name: "Generated Agent",
          description: "An agent generated from your description. The full specification could not be parsed.",
          instructions: ["Process user requests related to the specified domain"],
          tools: [],
          error: "Failed to parse agent specification",
          rawResponse: result.text,
        },
        { status: 200 },
      )
    }
  } catch (error) {
    console.error("Error generating agent:", error)
    return NextResponse.json({ error: "Failed to generate agent" }, { status: 500 })
  }
}
